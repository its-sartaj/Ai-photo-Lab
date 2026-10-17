# AI Photo Lab - Free Online Photo Tools & Bilingual Tutorials

A modern, fast, and **100% private in-browser photo & video editing suite** built with React 19, Vite, and Tailwind CSS. All processing is performed entirely client-side using HTML5 Canvas, WebAssembly, and MediaPipe Vision—ensuring your personal photos and sensitive documents never leave your browser or get uploaded to any external server.

---

## 🚀 Key Features

- 🗜️ **Smart Photo Compressor**
  - Compress JPG, PNG, and WebP images to exact target file sizes (e.g., under 20KB, 50KB, 100KB).
  - Perfect for online government exams, job application portals, and visa submissions.
- 📐 **Image Resizer**
  - Resize dimensions in pixels (px), centimeters (cm), millimeters (mm), or inches (in).
  - Constrain aspect ratio toggle and DPI configuration for crisp prints.
- 🔄 **Format Converter**
  - Rapid multi-format conversion between JPG, PNG, WebP, SVG, BMP, and ICO.
  - Batch download options.
- ✂️ **Image Cropper**
  - Freeform and standard aspect ratio cropping (1:1, 4:5, 16:9, A4, etc.).
  - Smooth interactive touch and mouse drag controls.
- 🧑‍💼 **Passport Photo Maker**
  - International passport photo presets (India 3.5×4.5 cm, US 2×2 in, UK/Schengen 35×45 mm).
  - One-click white, blue, or light gray solid studio backgrounds.
  - Multi-photo printable grid sheets (4×6 in, 5×7 in, A4) for instant printing.
- 🪄 **AI Cutout / Background Remover**
  - Client-side AI foreground segmentation using MediaPipe Vision.
  - Remove backgrounds instantly without server latency or data leakage.
- 🎬 **Video Compressor**
  - In-browser video compression with resolution and bitrate presets.
- 🌐 **Bilingual Hindi & English Guides**
  - Step-by-step tutorials and instructions available in both Hindi (हिंदी) and English for effortless photo preparation.
- 🛡️ **100% Client-Side Privacy**
  - Zero server uploads. Everything runs locally inside your web browser.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Motion
- **AI / Vision:** MediaPipe Vision WebAssembly (Client-side)

---

## 💻 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/its-sartaj/Ai-photo-Lab.git
   cd Ai-photo-Lab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:3000` in your browser.

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the built application locally:

```bash
npm run preview
```

---

## 🌐 Deployment

### Deploy to GitHub Pages (Automated)

This repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Go to your repository on GitHub: `https://github.com/its-sartaj/Ai-photo-Lab`
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The site will automatically build and publish to `https://its-sartaj.github.io/Ai-photo-Lab/` upon each push to `main`.

### Deploy to Vercel

1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

### Deploy to Netlify

1. Connect your repository on [Netlify](https://www.netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

---

## 🔒 Privacy & Security

We believe your photos and sensitive documents are private. AI Photo Lab is designed to process 100% of your images and videos locally on your own device using modern browser APIs (HTML5 Canvas, File API, WebAssembly). No user images are ever sent to, stored on, or processed by any external server.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

Developed by **[its-sartaj](https://github.com/its-sartaj)**.
