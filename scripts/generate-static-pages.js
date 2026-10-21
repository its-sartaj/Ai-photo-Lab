import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

let baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// 1. Inline critical CSS to eliminate render-blocking stylesheet
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    const cssFileName = cssFiles[0];
    const cssContent = fs.readFileSync(path.join(assetsDir, cssFileName), 'utf-8');
    baseHtml = baseHtml.replace(
      /<link rel="stylesheet" crossorigin href="\/assets\/index-[^"]+\.css">/i,
      `<style>\n${cssContent}\n</style>`
    );
    console.log(`Inlined ${cssFileName} directly into HTML to eliminate render-blocking CSS!`);
  }

  // 2. Add modulepreload for the entry JavaScript chunk
  const jsFiles = fs.readdirSync(assetsDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));
  if (jsFiles.length > 0) {
    const jsChunk = `/assets/${jsFiles[0]}`;
    if (!baseHtml.includes(`rel="modulepreload" href="${jsChunk}"`)) {
      baseHtml = baseHtml.replace(
        '</head>',
        `  <link rel="modulepreload" href="${jsChunk}" />\n  </head>`
      );
    }
  }

  // Update dist/index.html with the optimized base HTML
  fs.writeFileSync(indexHtmlPath, baseHtml, 'utf-8');
}

const pages = [
  {
    slug: 'compress',
    title: 'Photo Compressor 20KB 50KB Online - Free Image Size Reducer | AI Photo Lab',
    description: 'Compress JPG, PNG & WebP images to exact 20KB, 50KB or 100KB for SSC, UPSC, IBPS & Govt exam online forms. 100% private in-browser compression with zero server upload.',
    keywords: 'photo compressor 20kb, image compressor 50kb, photo compress in kb, ssc photo resize, photo ka size 50kb kaise kare, reduce image size in kb, upsc photo compress, 20kb photo converter, ssc cgl photo compressor, ibps photo resize',
    h1: 'Online Photo Compressor to 20KB, 50KB & 100KB',
    h2: 'Compress Images for Government Exam Forms (SSC, UPSC, IBPS, Railways)',
    intro: 'Free client-side photo compressor that reduces JPG, PNG, and WebP image sizes to exact targets like 20 KB, 50 KB, or 100 KB. All processing happens 100% in your browser for absolute data privacy and instant download speeds.',
    faq: [
      {
        q: 'How do I compress a photo to exactly 20KB or 50KB?',
        a: 'Upload your JPG, PNG, or WebP photo into AI Photo Lab Compressor, pick the 20KB or 50KB preset button (or set a custom target), and download your compressed photo instantly.'
      },
      {
        q: 'Will my compressed photo lose clarity or text sharpness?',
        a: 'No. AI Photo Lab uses adaptive multi-pass quantization that preserves facial features and printed text while optimizing file size.'
      },
      {
        q: 'Is it safe to compress private ID proofs and signatures here?',
        a: 'Yes, 100%. Photos and signatures are processed entirely in your web browser using HTML5 Canvas. No file is ever transmitted to any remote server.'
      },
      {
        q: 'What are the photo dimensions and file size limits for SSC forms?',
        a: 'SSC (CGL, CHSL, MTS, GD) requires a photo size between 20 KB and 50 KB with dimensions of 3.5 cm × 4.5 cm (about 100 × 120 pixels). Signatures must be between 10 KB and 20 KB.'
      }
    ],
    examTable: true
  },
  {
    slug: 'passport-photo',
    title: 'Passport Size Photo Maker Online (3.5 x 4.5 cm) - Free 35x45mm Photo Tool | AI Photo Lab',
    description: 'Create official 3.5 x 4.5 cm (35x45 mm) Indian passport size photos & 2x2 inch visa photos for free. Add white or blue studio background and download 4x6 printable grid sheets.',
    keywords: 'passport size photo maker, 3.5 x 4.5 cm photo maker, 35x45 mm photo online, passport photo maker free, ssc passport photo, online passport size photo maker with white background, create passport size photo online free, 2x2 inch photo online, passport photo 4x6 sheet',
    h1: 'Free Online Passport Size Photo Maker (3.5 × 4.5 cm)',
    h2: 'Create Indian Passport, Visa & Govt Exam Photos with Studio Backgrounds',
    intro: 'Make standard 3.5 x 4.5 cm Indian passport size photos, 2x2 inch US visa photos, and 35x45 mm Schengen photos online in seconds. Replace backgrounds with studio white, blue, or grey, and generate full 4x6 inch printable grid sheets for home printing.',
    faq: [
      {
        q: 'What is the standard Indian passport photo size in mm and cm?',
        a: 'The standard Indian passport photo size is 35 mm × 45 mm (3.5 cm × 4.5 cm). The face should cover 70% to 80% of the photograph.'
      },
      {
        q: 'What background color is required for Indian passport and govt exams?',
        a: 'A plain white or light off-white background is required for Indian passport applications and most government exams (SSC, UPSC, NEET).'
      },
      {
        q: 'Can I print multiple passport photos on a 4x6 sheet?',
        a: 'Yes. AI Photo Lab automatically arranges 6 to 8 passport photos on a standard 4x6 inch photo sheet ready for color printing at any local photo studio.'
      },
      {
        q: 'How to make a passport size photo on a mobile phone?',
        a: 'Take a clear portrait photo in front of any wall, open AI Photo Lab on your phone browser, select 3.5x4.5 cm preset, and download your ready photo.'
      }
    ],
    examTable: true
  },
  {
    slug: 'resize',
    title: 'Photo & Signature Resizer Online in CM, MM & Pixels | AI Photo Lab',
    description: 'Resize photo and signature dimensions in cm, mm, inches, and px with aspect ratio lock. Perfect for SSC, UPSC, NEET, and bank exam uploads.',
    keywords: 'photo resizer in cm, signature resizer 10 to 20 kb, image resizer online, resize photo to 3.5 x 4.5 cm, ssc signature resize, upsc signature resizer, crop signature 140x60, photo dimension changer',
    h1: 'Online Photo & Signature Resizer (CM, MM, Pixels, Inches)',
    h2: 'Resize Dimensions for SSC, UPSC, IBPS & Job Application Portals',
    intro: 'Easily adjust the physical dimensions and pixel dimensions of photographs and signatures. Support for aspect ratio locking, centimeter/millimeter conversion at 200/300 DPI, and precise KB size compression in one smooth step.',
    faq: [
      {
        q: 'How do I resize a signature to 140x60 pixels for bank exams?',
        a: 'Open the Resizer tool, upload your signature photo, unlock aspect ratio if necessary, enter Width: 140 px and Height: 60 px, and download the resized file.'
      },
      {
        q: 'How to convert photo dimensions from centimeters to pixels?',
        a: 'At 300 DPI (standard print resolution), 3.5 cm = 413 pixels and 4.5 cm = 531 pixels. Our tool automatically calculates exact pixel dimensions when you enter cm or mm.'
      },
      {
        q: 'Can I lock the aspect ratio to prevent photo distortion?',
        a: 'Yes. The aspect ratio lock toggle is enabled by default to prevent images from stretching or flattening.'
      }
    ],
    examTable: true
  },
  {
    slug: 'cutout',
    title: 'AI Background Remover Online Free - 100% Private HD Cutout | AI Photo Lab',
    description: 'Remove background from photos automatically in 1 click using on-device AI. 100% private, zero server uploads, high resolution PNG download.',
    keywords: 'remove bg online free, background remover free hd, ai background remover, remove background from photo, transparent background maker, cutout photo online, background eraser online',
    h1: 'Free AI Background Remover (100% On-Device & Private)',
    h2: 'Instant Transparent Cutouts for Portraits, Signatures & Products',
    intro: 'Remove photo backgrounds automatically in 1 click using client-side machine learning. No image is ever uploaded to a server, keeping your personal portraits and documents completely confidential.',
    faq: [
      {
        q: 'How does AI Photo Lab remove backgrounds without server uploads?',
        a: 'We run lightweight neural network models directly inside your web browser via WebAssembly, performing edge detection and hair segmentation entirely on your device.'
      },
      {
        q: 'Can I replace the background with a solid color?',
        a: 'Yes, after removing the background you can choose solid white, blue, red, or transparent PNG format.'
      }
    ],
    examTable: false
  },
  {
    slug: 'convert',
    title: 'Free Image Converter - WebP to JPG, PNG to JPG, SVG Converter | AI Photo Lab',
    description: 'Convert WebP, PNG, JPG, SVG, BMP, and ICO images online in seconds. 100% free and client-side private conversion.',
    keywords: 'webp to jpg converter, convert webp to png, image converter online free, png to jpg converter, svg to png converter, batch image converter',
    h1: 'Free Online Image Format Converter (WebP, JPG, PNG, SVG)',
    h2: 'Convert Modern WebP Images to Standard JPG or PNG Instantly',
    intro: 'Government exam portals and legacy portals often reject modern WebP images. Use our converter to turn any WebP or PNG into standard high-compatibility JPG in less than a second.',
    faq: [
      {
        q: 'Why do government portals reject WebP files?',
        a: 'Most government portals were built to accept only standard JPG/JPEG or PNG files. Our converter transforms WebP files into valid JPEGs acceptable on all portals.'
      },
      {
        q: 'Does format conversion reduce image quality?',
        a: 'No. AI Photo Lab converts raw pixel data with 95%+ JPEG quality retaining full fidelity.'
      }
    ],
    examTable: false
  },
  {
    slug: 'crop',
    title: 'Online Photo Cropper - Free Image Crop Tool (1:1, 4:5, 16:9) | AI Photo Lab',
    description: 'Crop images to square (1:1), portrait (4:5), landscape (16:9), or custom dimensions online for free. High precision crop with instant preview.',
    keywords: 'crop photo online, image cropper free, photo crop tool, crop image to 1:1, crop photo for instagram, crop signature online',
    h1: 'Free Online Photo & Signature Cropper',
    h2: 'Precision Cropping with Preset Ratios (1:1, 4:5, 16:9, Custom)',
    intro: 'Crop unwanted margins from photographed documents, signatures, and portraits. Intuitive drag-and-drop bounding box with zoom and pan controls.',
    faq: [
      {
        q: 'How to crop only the signature part from a full paper photo?',
        a: 'Upload the photo of your paper, drag the crop box around the handwritten signature, and click Download Cropped Image.'
      }
    ],
    examTable: false
  },
  {
    slug: 'video-compress',
    title: 'Free Online Video Compressor for WhatsApp (Under 16MB) & Email | AI Photo Lab',
    description: 'Compress MP4 & WebM videos directly in your browser without quality loss. Reduce video size under 16MB for WhatsApp and 25MB for Gmail.',
    keywords: 'video compressor online, compress video for whatsapp, reduce video size under 16mb, video compressor under 25mb, compress mp4 video free, video mb reducer',
    h1: 'Online Video Compressor for WhatsApp (Under 16MB) & Email',
    h2: 'Reduce MP4 Video Size In-Browser Without Server Uploads',
    intro: 'Compress heavy smartphone videos to under 16 MB for WhatsApp sharing and under 25 MB for Gmail attachments. Fast, secure, and runs directly inside your web browser.',
    faq: [
      {
        q: 'What is the maximum video size limit for WhatsApp?',
        a: 'WhatsApp has a strict 16 MB file size limit for video sharing. Our tool has a one-click "Under 16MB (WhatsApp)" preset.'
      },
      {
        q: 'What is the video attachment limit for Gmail and Outlook?',
        a: 'Gmail and Outlook allow a maximum attachment size of 25 MB. Our "Under 25MB (Email)" preset automatically calculates the right bitrate.'
      }
    ],
    examTable: false
  },
  {
    slug: 'about',
    title: 'About Us - AI Photo Lab | Fast, Private & 100% In-Browser Photo Tools',
    description: 'Learn about AI Photo Lab mission: empowering millions of Indian students, job aspirants and professionals with 100% free, private, client-side photo utilities.',
    keywords: 'about ai photo lab, free photo tools mission, client side photo editor, sarkari exam photo tools',
    h1: 'About AI Photo Lab',
    h2: 'Our Mission: Fast, Free & 100% Private Photo Utilities for Everyone',
    intro: 'AI Photo Lab was built to solve a major problem faced by millions of Indian students and applicants: preparing correctly sized photos, signatures, and documents for government exams without expensive photo studio visits or privacy risks.',
    faq: [],
    examTable: false
  },
  {
    slug: 'contact',
    title: 'Contact Us - AI Photo Lab Helpdesk & Support',
    description: 'Get in touch with the AI Photo Lab team. Submit tool feedback, report issues, or ask questions about photo specifications.',
    keywords: 'contact ai photo lab, support, photo tools help, feedback',
    h1: 'Contact AI Photo Lab',
    h2: 'We are here to help with your photo processing needs',
    intro: 'Have a question about document specifications or need help compressing an image for a specific exam portal? Contact our team anytime.',
    faq: [],
    examTable: false
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy - 100% Client-Side Processing Guarantee | AI Photo Lab',
    description: 'Our strict privacy guarantee: Your photos and videos are never uploaded, stored, or viewed by our servers. 100% browser-based processing.',
    keywords: 'privacy policy, client side privacy, gdpr compliant photo tools, secure photo compressor',
    h1: 'Privacy Policy',
    h2: '100% Client-Side Privacy: Your Photos Never Leave Your Device',
    intro: 'At AI Photo Lab, privacy is our core architectural foundation. We do not operate storage servers for your photos; all resizing, compression, and background removals execute locally in your browser memory.',
    faq: [],
    examTable: false
  },
  {
    slug: 'terms',
    title: 'Terms of Service - AI Photo Lab Free Online Utility',
    description: 'Read the terms of service governing the use of AI Photo Lab online photo editing tools and utilities.',
    keywords: 'terms of service, user agreement, acceptable use policy',
    h1: 'Terms of Service',
    h2: 'Terms and Conditions of Use',
    intro: 'By accessing AI Photo Lab, you agree to these fair use terms and conditions for our free browser-based photo and video utilities.',
    faq: [],
    examTable: false
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer - AI Photo Lab Independent Utility Notice',
    description: 'AI Photo Lab is an independent utility website not affiliated with SSC, UPSC, NTA, or any government agency.',
    keywords: 'disclaimer, independent utility, government exam notice',
    h1: 'Disclaimer',
    h2: 'Independent Educational & Productivity Utility Notice',
    intro: 'AI Photo Lab is an independent utility created to assist applicants with photo formatting. We are not affiliated with, endorsed by, or connected to any government recruitment board (SSC, UPSC, NTA, IBPS, etc.).',
    faq: [],
    examTable: false
  },
  {
    slug: 'tutorials',
    title: 'Photo & Document Guides for Govt Exams (SSC, UPSC, IBPS) | AI Photo Lab',
    description: 'Complete step-by-step guides on how to resize, compress, and format photos and signatures for SSC CGL, UPSC, NEET, JEE, and bank exams.',
    keywords: 'photo guides, ssc photo resize tutorial, upsc photo size guide, signature resize guide in hindi',
    h1: 'Photo & Document Preparation Guides',
    h2: 'Official Specifications & Step-by-Step Tutorials for Govt Job Forms',
    intro: 'Browse comprehensive guides with official exam dimensions, maximum KB limits, accepted aspect ratios, and background color rules.',
    faq: [],
    examTable: true
  }
];

function generateExamTableHtml() {
  return `
    <section style="margin: 32px 0; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px;">
      <h3 style="font-size:18px; font-weight:700; color:#0f172a; margin-top:0;">Official Photo & Signature Specifications for Major Exams</h3>
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
          <thead>
            <tr style="border-bottom:2px solid #cbd5e1; color:#334155;">
              <th style="padding:10px 8px;">Exam / Authority</th>
              <th style="padding:10px 8px;">Photo Dimensions</th>
              <th style="padding:10px 8px;">Photo File Size</th>
              <th style="padding:10px 8px;">Signature Dimensions</th>
              <th style="padding:10px 8px;">Signature File Size</th>
            </tr>
          </thead>
          <tbody style="color:#475569;">
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:10px 8px; font-weight:600; color:#0f172a;">SSC (CGL, CHSL, GD, MTS)</td>
              <td style="padding:10px 8px;">3.5 × 4.5 cm (100×120 px)</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">20 KB to 50 KB</td>
              <td style="padding:10px 8px;">4.0 × 2.0 cm (140×60 px)</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">10 KB to 20 KB</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:10px 8px; font-weight:600; color:#0f172a;">UPSC (CSE, NDA, CDS)</td>
              <td style="padding:10px 8px;">350×350 to 1000×1000 px</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">20 KB to 300 KB</td>
              <td style="padding:10px 8px;">350×350 to 1000×1000 px</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">20 KB to 300 KB</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:10px 8px; font-weight:600; color:#0f172a;">IBPS / SBI Bank PO & Clerk</td>
              <td style="padding:10px 8px;">4.5 × 3.5 cm (200×230 px)</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">20 KB to 50 KB</td>
              <td style="padding:10px 8px;">140 × 60 px</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">10 KB to 20 KB</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:10px 8px; font-weight:600; color:#0f172a;">NTA NEET / JEE Main</td>
              <td style="padding:10px 8px;">Passport: 10–200 KB, Postcard: 10–200 KB</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">10 KB to 200 KB</td>
              <td style="padding:10px 8px;">White background, black ink</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">4 KB to 30 KB</td>
            </tr>
            <tr>
              <td style="padding:10px 8px; font-weight:600; color:#0f172a;">Railway RRB (NTPC, Group D)</td>
              <td style="padding:10px 8px;">35 × 45 mm (Plain white background)</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">20 KB to 50 KB</td>
              <td style="padding:10px 8px;">Running handwriting, no capitals</td>
              <td style="padding:10px 8px; color:#16a34a; font-weight:600;">10 KB to 40 KB</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function generateFaqHtml(faqList) {
  if (!faqList || faqList.length === 0) return '';
  const items = faqList.map(item => `
    <div style="margin-bottom:16px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
      <h4 style="margin:0 0 8px 0; font-size:15px; font-weight:700; color:#0f172a;">${item.q}</h4>
      <p style="margin:0; font-size:14px; color:#475569; line-height:1.5;">${item.a}</p>
    </div>
  `).join('');
  return `
    <section style="margin: 32px 0;">
      <h3 style="font-size:20px; font-weight:700; color:#0f172a; margin-bottom:16px;">Frequently Asked Questions (FAQ)</h3>
      ${items}
    </section>
  `;
}

function generateSchemaJson(page) {
  const schemaList = [
    {
      "@type": "WebSite",
      "@id": "https://www.aiphotolab.publicvm.com/#website",
      "url": "https://www.aiphotolab.publicvm.com/",
      "name": "AI Photo Lab",
      "description": "Free online photo tools for photo compression, passport size photo maker, image resizer, background remover and format converter.",
      "inLanguage": ["en", "hi"]
    },
    {
      "@type": "WebApplication",
      "@id": `https://www.aiphotolab.publicvm.com/${page.slug}/#webapp`,
      "name": page.title,
      "url": `https://www.aiphotolab.publicvm.com/${page.slug}/`,
      "applicationCategory": "MultimediaApplication, DesignApplication",
      "operatingSystem": "All modern browsers",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": `https://www.aiphotolab.publicvm.com/${page.slug}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.aiphotolab.publicvm.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": page.h1,
          "item": `https://www.aiphotolab.publicvm.com/${page.slug}/`
        }
      ]
    }
  ];

  if (page.faq && page.faq.length > 0) {
    schemaList.push({
      "@type": "FAQPage",
      "@id": `https://www.aiphotolab.publicvm.com/${page.slug}/#faq`,
      "mainEntity": page.faq.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": schemaList }, null, 2);
}

console.log('Generating static pre-rendered pages for search engines...');

let generatedCount = 0;

for (const p of pages) {
  const pageDir = path.join(distDir, p.slug);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const pageCanonical = `https://www.aiphotolab.publicvm.com/${p.slug}/`;

  let pageHtml = baseHtml;

  // Replace Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${p.title}</title>`);
  pageHtml = pageHtml.replace(/<meta name="title" content=".*?" \/>/i, `<meta name="title" content="${p.title}" />`);

  // Replace Description
  pageHtml = pageHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${p.description}" />`);

  // Replace Keywords
  pageHtml = pageHtml.replace(/<meta name="keywords" content=".*?" \/>/i, `<meta name="keywords" content="${p.keywords}" />`);

  // Replace Canonical
  pageHtml = pageHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${pageCanonical}" />`);

  // Replace OpenGraph & Twitter
  pageHtml = pageHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${p.title}" />`);
  pageHtml = pageHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${p.description}" />`);
  pageHtml = pageHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${pageCanonical}" />`);
  pageHtml = pageHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${p.title}" />`);
  pageHtml = pageHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${p.description}" />`);
  pageHtml = pageHtml.replace(/<meta name="twitter:url" content=".*?" \/>/i, `<meta name="twitter:url" content="${pageCanonical}" />`);

  // Replace JSON-LD Schema
  const schemaJson = generateSchemaJson(p);
  pageHtml = pageHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">\n${schemaJson}\n    </script>`);

  // Replace crawler shell in <div id="root">
  const examHtml = p.examTable ? generateExamTableHtml() : '';
  const faqHtml = generateFaqHtml(p.faq);

  const rootContent = `
    <div id="root">
      <header style="background:#ffffff; border-bottom:1px solid #ede9fe; padding:16px 24px; display:flex; justify-content:space-between; align-items:center; font-family:system-ui, -apple-system, sans-serif;">
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
            <img src="/logo.svg" alt="AI Photo Lab" width="36" height="36" style="border-radius:8px;" />
            <span style="font-size:20px; font-weight:800; color:#6d28d9; letter-spacing:-0.5px;">AI Photo Lab</span>
          </a>
        </div>
        <nav style="display:flex; gap:16px; font-size:13px; font-weight:600;">
          <a href="/compress/" style="color:#4b5563; text-decoration:none;">Compressor (20KB/50KB)</a>
          <a href="/passport-photo/" style="color:#4b5563; text-decoration:none;">Passport Photo (3.5x4.5cm)</a>
          <a href="/resize/" style="color:#4b5563; text-decoration:none;">Resizer</a>
          <a href="/cutout/" style="color:#4b5563; text-decoration:none;">BG Remover</a>
          <a href="/tutorials/" style="color:#4b5563; text-decoration:none;">Guides</a>
        </nav>
      </header>
      <main style="max-width:1100px; margin:40px auto; padding:0 20px; font-family:system-ui, -apple-system, sans-serif; line-height:1.6;">
        <h1 style="font-size:32px; font-weight:800; color:#0f172a; text-align:center; margin-bottom:12px; letter-spacing:-0.5px;">
          ${p.h1}
        </h1>
        <h2 style="font-size:18px; font-weight:600; color:#6d28d9; text-align:center; margin-bottom:20px;">
          ${p.h2}
        </h2>
        <p style="font-size:16px; color:#475569; text-align:center; max-width:850px; margin:0 auto 32px auto;">
          ${p.intro}
        </p>

        <div style="background:#f1f5f9; border-radius:12px; padding:32px 20px; text-align:center; margin-bottom:32px;">
          <p style="font-size:16px; font-weight:600; color:#334155; margin-bottom:16px;">
            ⚡ Loading interactive tool directly in your browser...
          </p>
          <a href="/?tool=${p.slug}" style="display:inline-block; background:#7c3aed; color:#ffffff; font-weight:700; padding:12px 28px; border-radius:8px; text-decoration:none; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
            Launch ${p.h1} →
          </a>
        </div>

        ${examHtml}
        ${faqHtml}

        <div style="border-top:1px solid #e2e8f0; padding-top:24px; font-size:12px; color:#64748b; text-align:center; margin-top:40px;">
          <p>
            <a href="/about/" style="color:#64748b; margin:0 8px;">About Us</a> •
            <a href="/contact/" style="color:#64748b; margin:0 8px;">Contact</a> •
            <a href="/privacy/" style="color:#64748b; margin:0 8px;">Privacy Policy</a> •
            <a href="/terms/" style="color:#64748b; margin:0 8px;">Terms of Service</a> •
            <a href="/disclaimer/" style="color:#64748b; margin:0 8px;">Disclaimer</a>
          </p>
          <p>© AI Photo Lab. Fast • Private • Free Forever • 100% In-Browser Processing</p>
        </div>
      </main>
    </div>
  `;

  pageHtml = pageHtml.replace(/<div id="root">[\s\S]*?<\/div>\s*<script/i, `${rootContent}\n    <script`);

  fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf-8');
  generatedCount++;
}

console.log(`Successfully generated ${generatedCount} static crawlable SEO pages in dist/!`);
