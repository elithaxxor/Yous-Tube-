# Netflix Clone - Remote Video Player

A modern, Netflix-inspired video player application that allows you to stream your local videos through a beautiful web interface.

## Features

- 🎥 Stream local videos through a web browser
- 🎨 Netflix-inspired modern UI with Tailwind CSS
- 🎮 Full video playback controls
- ⌨️ Keyboard shortcuts for better control
- 📱 Responsive design for all devices
- 🚀 Fast Express.js backend
- ✨ Smooth animations and transitions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/netflix-clone-remote.git
cd netflix-clone-remote
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

### Adding Videos

1. Create a `videos` folder in the project root (if it doesn't exist)
2. Drop your video files into the `videos` folder
3. Supported formats: .mp4, .webm, .mkv
4. Refresh the page to see your videos

## Keyboard Shortcuts

- `Space` or `K`: Play/Pause
- `F`: Toggle Fullscreen
- `M`: Toggle Mute
- `Esc`: Close video player

## Testing

Run the test suite:
```bash
npm test
```

### Test Coverage

- API endpoint tests
- UI interaction tests
- Responsive design tests
- Error handling tests

## Development

### Project Structure

```
netflix-clone-remote/
├── css/
│   └── style.css          # Custom styles
├── js/
│   └── script.js          # Client-side JavaScript
├── tests/
│   ├── server.test.js     # Backend tests
│   └── ui.test.js         # Frontend tests
├── videos/                 # Video storage directory
├── index.html             # Main HTML file
├── server.js              # Express server
├── package.json           # Project configuration
└── README.md             # Documentation
```

### Technologies Used

- Frontend:
  - HTML5
  - CSS3 with Tailwind CSS
  - JavaScript (ES6+)
  - Font Awesome Icons
  - Google Fonts

- Backend:
  - Node.js
  - Express.js

- Testing:
  - Mocha
  - Chai
  - Supertest
  - Puppeteer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Netflix for UI/UX inspiration
- Font Awesome for icons
- Google Fonts for typography
- Tailwind CSS for utility-first styling
