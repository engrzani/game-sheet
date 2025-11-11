# Tabletop Game Sheet

A digital character sheet for tabletop RPGs with dice rolling, stat tracking, and theme customization.

## Features

- 🎲 **Dice Rolling System** - Roll dice for skills, attacks, and other actions
- 📊 **Stat Management** - Track health, defense, speed, timing, and action points
- 🎨 **Light/Dark Themes** - Toggle between light and dark modes with golden accents
- 💾 **Auto-Save** - Character data automatically saved to browser storage
- 📄 **PDF Export** - Export character sheet as PDF
- 🖱️ **Drag & Drop** - Interactive compendium system (if implemented)
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Styled Components** - CSS-in-JS styling with theme support
- **React DnD** - Drag and drop functionality
- **jsPDF** - PDF export functionality

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/engrzani/game-sheet.git
cd game-sheet
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Vercel will automatically detect the Vite configuration and deploy

## Usage

1. **Character Setup** - Enter player name, character name, and species in the header
2. **Stats Management** - Use +/- buttons to adjust various stats
3. **Dice Rolling** - Click roll buttons to roll dice for different actions
4. **Theme Toggle** - Click the theme toggle button (☀️/🌙) to switch between light and dark modes
5. **Export** - Use the "Export PDF" button to save your character sheet

## Project Structure

```
src/
├── components/          # React components
│   ├── Health.jsx      # Health management
│   ├── Skills.jsx      # Skills and dice rolling
│   ├── ThemeToggle.jsx # Theme switching
│   └── ...
├── constants/          # Theme definitions
├── context/            # React context (theme provider)
├── hooks/              # Custom hooks
└── assets/             # Images and static files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
