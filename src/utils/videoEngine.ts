/**
 * AI Photo Lab - Real Client-Side Video Compression Engine
 * 100% in-browser Canvas + MediaStream + MediaRecorder pipeline.
 * Zero server uploads.
 */

import { VideoMetadata, ProcessedVideoResult } from '../types';

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0 || seconds === Infinity) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Inspect video file metadata directly in browser
 */
export function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute('src');
      video.load();
    };

    video.onloadedmetadata = () => {
      let dur = video.duration;
      // Handle WebM Infinity duration bug in Chromium
      if (dur === Infinity) {
        video.currentTime = 1e101;
        video.ontimeupdate = () => {
          video.ontimeupdate = null;
          dur = video.duration;
          finish();
        };
        return;
      }
      finish();

      function finish() {
        const metadata: VideoMetadata = {
          filename: file.name,
          sizeBytes: file.size,
          durationSeconds: !dur || isNaN(dur) || dur === Infinity ? 0 : dur,
          width: video.videoWidth || 0,
          height: video.videoHeight || 0,
          format: file.type || 'video/mp4',
        };
        cleanup();
        resolve(metadata);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to load video metadata. The format may not be supported by your browser.'));
    };

    video.src = objectUrl;
  });
}

/**
 * Determine best supported recording MIME type in current browser
 */
export function getSupportedVideoMimeType(withAudio: boolean = true): { mimeType: string; extension: string } {
  const withAudioCandidates = [
    { mime: 'video/mp4;codecs=avc1,mp4a.40.2', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mime: 'video/webm;codecs=h264,opus', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
  ];

  const videoOnlyCandidates = [
    { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
  ];

  const candidates = withAudio ? withAudioCandidates : videoOnlyCandidates;

  if (typeof window !== 'undefined' && 'MediaRecorder' in window) {
    for (const c of candidates) {
      if (MediaRecorder.isTypeSupported(c.mime)) {
        return { mimeType: c.mime, extension: c.ext };
      }
    }
  }

  return { mimeType: 'video/webm', extension: 'webm' };
}

export interface VideoCompressionOptions {
  preset: 'high' | 'balanced' | 'small';
  targetResolution: 'original' | '720p' | '480p' | '360p';
  includeAudio: boolean;
  onProgress?: (percent: number, statusText: string) => void;
  abortSignal?: AbortSignal;
}

/**
 * Perform real, client-side video compression using Canvas + MediaRecorder
 */
export function compressVideo(
  file: File,
  options: VideoCompressionOptions
): Promise<ProcessedVideoResult> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    let mediaRecorder: MediaRecorder | null = null;
    let animFrameId: number | null = null;
    let checkInterval: any = null;
    const recordedChunks: Blob[] = [];
    let audioContext: AudioContext | null = null;

    const cleanup = () => {
      if (animFrameId !== null) cancelAnimationFrame(animFrameId);
      if (checkInterval !== null) clearInterval(checkInterval);
      if (audioContext) {
        try {
          audioContext.close();
        } catch {}
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(objectUrl);
    };

    if (options.abortSignal) {
      options.abortSignal.addEventListener('abort', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
          try {
            mediaRecorder.stop();
          } catch {}
        }
        cleanup();
        reject(new Error('Video compression was cancelled.'));
      });
    }

    video.onloadedmetadata = async () => {
      try {
        const origWidth = video.videoWidth || 1280;
        const origHeight = video.videoHeight || 720;
        let duration = video.duration || 1;
        if (duration === Infinity || isNaN(duration)) {
          duration = 10; // Fallback estimate
        }

        // Calculate target dimensions
        let targetW = origWidth;
        let targetH = origHeight;

        if (options.targetResolution === '720p') {
          if (targetH > 720 || targetW > 1280) {
            const ratio = origWidth / origHeight;
            if (ratio >= 1) {
              targetH = 720;
              targetW = Math.round(720 * ratio);
            } else {
              targetW = 720;
              targetH = Math.round(720 / ratio);
            }
          }
        } else if (options.targetResolution === '480p') {
          if (targetH > 480 || targetW > 854) {
            const ratio = origWidth / origHeight;
            if (ratio >= 1) {
              targetH = 480;
              targetW = Math.round(480 * ratio);
            } else {
              targetW = 480;
              targetH = Math.round(480 / ratio);
            }
          }
        } else if (options.targetResolution === '360p') {
          if (targetH > 360 || targetW > 640) {
            const ratio = origWidth / origHeight;
            if (ratio >= 1) {
              targetH = 360;
              targetW = Math.round(360 * ratio);
            } else {
              targetW = 360;
              targetH = Math.round(360 / ratio);
            }
          }
        }

        // Canvas dimensions must be even numbers for video codecs
        targetW = Math.max(2, Math.floor(targetW / 2) * 2);
        targetH = Math.max(2, Math.floor(targetH / 2) * 2);

        // Bitrate calculation based on preset
        let videoBitrate = 1200000; // default 1.2 Mbps
        if (options.preset === 'high') {
          videoBitrate = 2500000; // 2.5 Mbps
        } else if (options.preset === 'small') {
          videoBitrate = 550000; // 550 kbps
        }

        // Scale down bitrate for smaller resolutions
        if (options.targetResolution === '480p') {
          videoBitrate = Math.min(videoBitrate, 900000);
        } else if (options.targetResolution === '360p') {
          videoBitrate = Math.min(videoBitrate, 500000);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) throw new Error('Could not initialize Canvas 2D context.');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Capture canvas video stream
        const fps = 30;
        const canvasStream = canvas.captureStream ? canvas.captureStream(fps) : (canvas as any).mozCaptureStream(fps);
        if (!canvasStream) throw new Error('Canvas captureStream is not supported by this browser.');

        const combinedStream = new MediaStream();
        // Add video track
        canvasStream.getVideoTracks().forEach((track: MediaStreamTrack) => combinedStream.addTrack(track));

        // Add audio track if requested and available
        let hasAudioTrack = false;
        if (options.includeAudio) {
          try {
            // Attempt native captureStream audio extraction
            let audioTracks: MediaStreamTrack[] = [];
            if ((video as any).captureStream) {
              audioTracks = (video as any).captureStream().getAudioTracks();
            } else if ((video as any).mozCaptureStream) {
              audioTracks = (video as any).mozCaptureStream().getAudioTracks();
            }

            if (audioTracks.length > 0) {
              audioTracks.forEach((t) => combinedStream.addTrack(t));
              hasAudioTrack = true;
            } else {
              // Web Audio fallback
              const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioCtx) {
                audioContext = new AudioCtx();
                const source = audioContext.createMediaElementSource(video);
                const destination = audioContext.createMediaStreamDestination();
                source.connect(destination);
                // Do NOT connect destination to audioContext.destination to avoid echoing aloud during compression!
                const tracks = destination.stream.getAudioTracks();
                if (tracks.length > 0) {
                  tracks.forEach((t) => combinedStream.addTrack(t));
                  hasAudioTrack = true;
                }
              }
            }
          } catch (audioErr) {
            console.warn('Audio extraction bypassed:', audioErr);
          }
        }

        // Get matching mime type based on audio presence
        const { mimeType, extension } = getSupportedVideoMimeType(hasAudioTrack);

        // Initialize MediaRecorder with target bitrate
        const recorderOptions: MediaRecorderOptions = {
          mimeType,
          videoBitsPerSecond: videoBitrate,
          audioBitsPerSecond: hasAudioTrack ? 96000 : undefined,
        };

        try {
          mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);
        } catch {
          // Fallback without bitrate constraint if browser complains
          try {
            mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
          } catch {
            mediaRecorder = new MediaRecorder(combinedStream);
          }
        }

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          cleanup();

          const finalBlob = new Blob(recordedChunks, { type: mimeType.split(';')[0] });
          const objectUrlOut = URL.createObjectURL(finalBlob);

          const origSize = file.size;
          const newSize = finalBlob.size;
          const reductionPercent = origSize > 0
            ? Math.round(((origSize - newSize) / origSize) * 100)
            : 0;

          const isLargerThanOriginal = newSize >= origSize;

          resolve({
            blob: finalBlob,
            objectUrl: objectUrlOut,
            sizeBytes: newSize,
            width: targetW,
            height: targetH,
            durationSeconds: duration,
            format: mimeType.split(';')[0],
            extension,
            reductionPercent: Math.max(0, reductionPercent),
            isLargerThanOriginal,
          });
        };

        // Start recording
        mediaRecorder.start(200);
        options.onProgress?.(1, 'Encoding frames...');

        let finished = false;
        const finishRecording = () => {
          if (finished) return;
          finished = true;
          options.onProgress?.(100, 'Finalizing video stream...');
          if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try {
              mediaRecorder.stop();
            } catch {}
          }
        };

        // Frame rendering loop
        const drawFrame = () => {
          if (finished) return;
          if (video.paused || video.ended) {
            if (video.ended) {
              finishRecording();
              return;
            }
          }

          ctx.drawImage(video, 0, 0, targetW, targetH);

          const current = video.currentTime;
          const percent = Math.min(99, Math.max(2, Math.round((current / duration) * 100)));
          options.onProgress?.(percent, `Processing frame at ${formatDuration(current)} / ${formatDuration(duration)} (${percent}%)`);

          if (current >= duration - 0.05) {
            finishRecording();
            return;
          }

          animFrameId = requestAnimationFrame(drawFrame);
        };

        video.onended = finishRecording;

        // Play video to push frames through canvas and recorder
        video.currentTime = 0;
        try {
          await video.play();
        } catch {
          // If unmuted playback is blocked, mute and retry
          video.muted = true;
          await video.play();
        }

        drawFrame();
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    video.onerror = () => {
      cleanup();
      reject(new Error('Failed to decode or play video for compression.'));
    };
  });
}

/**
 * Generate a synthetic 3-second HD test video in-memory
 * Allows users to test the Video Compressor immediately without uploading a personal file.
 */
export async function generateSampleVideo(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;

  const fps = 30;
  const stream = canvas.captureStream ? canvas.captureStream(fps) : (canvas as any).mozCaptureStream(fps);

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  let audioContext: AudioContext | null = null;
  if (AudioCtx) {
    try {
      audioContext = new AudioCtx();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      gain.gain.value = 0.05;
      osc.connect(gain);
      const dest = audioContext.createMediaStreamDestination();
      gain.connect(dest);
      dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      osc.start();
    } catch {}
  }

  const { mimeType, extension } = getSupportedVideoMimeType(true);
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 4000000 });
  } catch {
    recorder = new MediaRecorder(stream);
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve) => {
    recorder.onstop = () => {
      if (audioContext) {
        try {
          audioContext.close();
        } catch {}
      }
      const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
      const file = new File([blob], `sample-hd-video.${extension}`, { type: blob.type });
      resolve(file);
    };

    recorder.start(100);

    let frame = 0;
    const totalFrames = 90; // 3 seconds at 30fps
    const interval = setInterval(() => {
      frame++;
      const t = frame / fps;

      // Dynamic animated gradient background
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(0.5, '#9333ea');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // Bouncing circle
      const x = 640 + Math.sin(t * 3) * 350;
      const y = 360 + Math.cos(t * 4) * 160;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(x, y, 70, 0, Math.PI * 2);
      ctx.fill();

      // Card overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.roundRect ? ctx.roundRect(240, 180, 800, 360, 24) : ctx.fillRect(240, 180, 800, 360);
      ctx.fill();

      // Text elements
      ctx.fillStyle = '#4c1d95';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AI Photo Lab - Video Compressor', 640, 270);

      ctx.fillStyle = '#4b5563';
      ctx.font = '24px sans-serif';
      ctx.fillText('High-Definition 720p Test Stream', 640, 330);

      ctx.fillStyle = '#7c3aed';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(`Frame ${frame} / ${totalFrames} • ${t.toFixed(1)}s`, 640, 420);

      if (frame >= totalFrames) {
        clearInterval(interval);
        try {
          recorder.stop();
        } catch {}
      }
    }, 1000 / fps);
  });
}
