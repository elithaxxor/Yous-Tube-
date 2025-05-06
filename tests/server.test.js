const request = require('supertest');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const app = require('../server');

describe('Server API Tests', () => {
    const videosDir = path.join(__dirname, '..', 'videos');
    
    // Ensure videos directory exists before tests
    before(() => {
        if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir);
        }
    });

    describe('GET /api/videos', () => {
        it('should return an empty array when no videos exist', async () => {
            // Temporarily move any existing videos
            const files = fs.readdirSync(videosDir);
            const tempDir = path.join(__dirname, 'temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }
            
            files.forEach(file => {
                if (['.mp4', '.webm', '.mkv'].includes(path.extname(file).toLowerCase())) {
                    fs.renameSync(
                        path.join(videosDir, file),
                        path.join(tempDir, file)
                    );
                }
            });

            const response = await request(app)
                .get('/api/videos')
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(0);

            // Move videos back
            const tempFiles = fs.readdirSync(tempDir);
            tempFiles.forEach(file => {
                fs.renameSync(
                    path.join(tempDir, file),
                    path.join(videosDir, file)
                );
            });
            fs.rmdirSync(tempDir);
        });

        it('should return an array of video objects when videos exist', async () => {
            // Create a test video file
            const testVideoPath = path.join(videosDir, 'test.mp4');
            if (!fs.existsSync(testVideoPath)) {
                fs.writeFileSync(testVideoPath, 'test video content');
            }

            const response = await request(app)
                .get('/api/videos')
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).to.be.an('array');
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0]).to.have.property('filename');
            expect(response.body[0]).to.have.property('url');

            // Clean up test video
            fs.unlinkSync(testVideoPath);
        });

        it('should handle server errors gracefully', async () => {
            // Temporarily rename videos directory to simulate error
            const tempDirName = 'videos_temp';
            fs.renameSync(videosDir, path.join(__dirname, '..', tempDirName));

            const response = await request(app)
                .get('/api/videos')
                .expect(500)
                .expect('Content-Type', /json/);

            expect(response.body).to.have.property('error');
            expect(response.body.error).to.equal('Failed to read videos directory');

            // Restore videos directory
            fs.renameSync(
                path.join(__dirname, '..', tempDirName),
                videosDir
            );
        });
    });

    describe('Static File Serving', () => {
        it('should serve static files', async () => {
            await request(app)
                .get('/')
                .expect(200)
                .expect('Content-Type', /html/);
        });

        it('should serve CSS files', async () => {
            await request(app)
                .get('/css/style.css')
                .expect(200)
                .expect('Content-Type', /css/);
        });

        it('should serve JavaScript files', async () => {
            await request(app)
                .get('/js/script.js')
                .expect(200)
                .expect('Content-Type', /javascript/);
        });
    });
});
