const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// Serve static files
app.use(express.static(path.join(__dirname)));

// Create videos directory if it doesn't exist
const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir);
}

// API endpoint to get list of videos
app.get('/api/videos', (req, res) => {
    try {
        const files = fs.readdirSync(videosDir);
        const videos = files
            .filter(file => ['.mp4', '.webm', '.mkv'].includes(path.extname(file).toLowerCase()))
            .map(file => ({
                filename: file,
                url: `/videos/${file}`
            }));
        res.json(videos);
    } catch (error) {
        console.error('Error reading videos directory:', error);
        res.status(500).json({ error: 'Failed to read videos directory' });
    }
});

// Only start the server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing
module.exports = app;
