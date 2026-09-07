# Marye Agegn - Personal Portfolio & Research Website

A production-ready foundation for a professional biomedical engineering and research portfolio.

## Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: JavaScript (ES Modules)
- **Styling**: Vanilla CSS (Modular, responsive, custom variables)
- **Package Manager**: npm

## Project Structure

```text
Personal website/
├── public/
│   ├── favicon/                # Site favicon assets
│   └── assets/
│       ├── images/             # Static public images
│       ├── documents/          # Downloadable documents (CV, preprints)
│       └── icons/              # Static public icons
├── src/
│   ├── components/             # Reusable UI components
│   ├── sections/               # Page sections (Home, About, Research, etc.)
│   ├── pages/                  # Page-level route views (if needed)
│   ├── data/                   # Structured content and site metadata
│   ├── assets/                 # Bundled source assets
│   ├── styles/                 # Global styles and CSS design tokens
│   ├── utils/                  # Helper utilities
│   ├── App.jsx                 # Main application layout
│   └── main.jsx                # Application entry point
├── .gitignore
├── index.html                  # HTML entry point with SEO & Open Graph baseline
├── package.json
├── README.md
└── vite.config.js              # Vite configuration (relative base for portability)
```

## Available Scripts

- **Start Local Development Server**:
  ```bash
  npm run dev
  ```
- **Create Production Build**:
  ```bash
  npm run build
  ```
- **Preview Production Build Locally**:
  ```bash
  npm run preview
  ```

## Deployment

### GitHub Pages (`maryeagegn.github.io`)
- The project is configured with a relative base path (`base: './'`) in `vite.config.js`.
- For GitHub Pages, the production build artifacts generated in `dist/` can be deployed directly to the root of the `maryeagegn.github.io` repository via GitHub Actions or manual branch deployment.

### Vercel Compatibility
- As a standard Vite + React project, this repository can be imported directly into Vercel without code modifications.
- Default Vercel build settings (`Build Command: npm run build`, `Output Directory: dist`) work out of the box.
