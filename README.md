# MapToPoster JS

MapToPoster JS is a premium, client-side web application designed to generate high-quality, gallery-ready map posters. It allows users to search for any location in the world and transform it into a beautiful piece of art with customizable themes and formats.

## 🚀 Features

- **Global Location Search**: Powered by Nominatim (OpenStreetMap) to find any city or landmark.
- **Artistic Themes**: Choose from curated styles:
  - **Minimal White**: Clean and modern for a contemporary look.
  - **Midnight Dark**: Sleek and professional with high-contrast tones.
  - **Vintage Sepia**: Classic, old-world aesthetic with warm paper tones.
  - **Deep Ocean**: Calm and scientific oceanic blue.
- **Custom Resolutions**: Presets for A4, Instagram Square, and Stories, plus custom pixel scaling for ultra-high resolution prints.
- **Premium UI**: Modern glassmorphism interface with **Outfit** and **Playfair Display** typography.
- **High-Fidelity Export**: Capture posters as high-resolution PNG files directly from your browser.
- **Pure Client-Side**: No backend required. Your map selections and data stay on your machine.

## 🛠️ Tech Stack

- **Core**: Vanilla JavaScript (ES Modules)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapping**: [Leaflet](https://leafletjs.com/)
- **Export**: [html2canvas](https://html2canvas.hertzen.com/)
- **Typography**: Google Fonts (Outfit, Playfair Display)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository or download the source code.
2.  Navigate to the project directory:
    ```bash
    cd map-to-poster
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create an optimized production build in the `dist/` directory:

```bash
npm run build
```

## 📜 How it Works

1.  **State Management**: A reactive state store in `src/core/state.js` handles data flow between the map and UI components.
2.  **Map Logic**: Leaflet initializes the map and updates tile layers based on the selected theme.
3.  **UI Interaction**: The form controls update the central state, which in turn triggers a responsive preview scaling to fit your screen.
4.  **Exporting**: When clicking "Generate Export", the application uses `html2canvas` to render the poster container into a high-quality image file.

## 📄 License

This project is open-source and available under the MIT License.
