const puppeteer = require('puppeteer');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');

describe('UI Tests', () => {
    let browser;
    let page;
    const videosDir = path.join(__dirname, '..', 'videos');
    const TEST_URL = 'http://localhost:8000';

    before(async () => {
        // Create videos directory if it doesn't exist
        if (!fs.existsSync(videosDir)) {
            fs.mkdirSync(videosDir);
        }

        // Create a test video file
        const testVideoPath = path.join(videosDir, 'test.mp4');
        if (!fs.existsSync(testVideoPath)) {
            fs.writeFileSync(testVideoPath, 'test video content');
        }

        // Launch browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
    });

    after(async () => {
        // Clean up test video
        const testVideoPath = path.join(videosDir, 'test.mp4');
        if (fs.existsSync(testVideoPath)) {
            fs.unlinkSync(testVideoPath);
        }
        
        await browser.close();
    });

    describe('Homepage', () => {
        it('should load with all essential elements', async () => {
            await page.goto(TEST_URL);

            // Check header
            const header = await page.$('header');
            expect(await header.evaluate(el => el.classList.contains('fixed'))).to.be.true;

            // Check Netflix logo
            const logo = await page.$eval('.text-\\[\\#E50914\\]', el => el.textContent);
            expect(logo).to.equal('NETFLIX');

            // Check video grid
            const videoGrid = await page.$('[data-testid="video-grid"]');
            expect(videoGrid).to.not.be.null;
        });

        it('should show loading spinner during video fetch', async () => {
            await page.goto(TEST_URL);
            
            const spinner = await page.$('[data-testid="loading-spinner"]');
            const spinnerDisplay = await spinner.evaluate(el => window.getComputedStyle(el).display);
            expect(['block', 'flex']).to.include(spinnerDisplay);
        });
    });

    describe('Video Grid', () => {
        it('should display video items when videos exist', async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');
            
            const videoItems = await page.$$('.video-item');
            expect(videoItems.length).to.be.greaterThan(0);
        });

        it('should show video overlay on hover', async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');

            const firstVideo = await page.$('.video-item');
            await firstVideo.hover();

            const overlay = await firstVideo.$('.overlay');
            const opacity = await overlay.evaluate(el => window.getComputedStyle(el).opacity);
            expect(parseFloat(opacity)).to.be.greaterThan(0);
        });
    });

    describe('Video Modal', () => {
        it('should open modal when video is clicked', async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');

            await page.click('.video-item');
            
            const modal = await page.$('#video-modal');
            const display = await modal.evaluate(el => window.getComputedStyle(el).display);
            expect(display).to.equal('block');
        });

        it('should close modal when close button is clicked', async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');

            await page.click('.video-item');
            await page.waitForSelector('#video-modal[style*="display: block"]');
            
            await page.click('#close-modal');
            
            const modal = await page.$('#video-modal');
            const display = await modal.evaluate(el => window.getComputedStyle(el).display);
            expect(display).to.equal('none');
        });
    });

    describe('Video Controls', () => {
        beforeEach(async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');
            await page.click('.video-item');
            await page.waitForSelector('#video-modal[style*="display: block"]');
        });

        it('should toggle play/pause when button is clicked', async () => {
            const playPauseButton = await page.$('#play-pause');
            
            // Initial state should be playing
            let icon = await playPauseButton.$('i');
            let iconClasses = await icon.evaluate(el => Array.from(el.classList));
            expect(iconClasses).to.include('fa-pause');

            // Click to pause
            await playPauseButton.click();
            icon = await playPauseButton.$('i');
            iconClasses = await icon.evaluate(el => Array.from(el.classList));
            expect(iconClasses).to.include('fa-play');
        });

        it('should toggle mute when mute button is clicked', async () => {
            const muteButton = await page.$('#mute');
            
            // Click to mute
            await muteButton.click();
            let icon = await muteButton.$('i');
            let iconClasses = await icon.evaluate(el => Array.from(el.classList));
            expect(iconClasses).to.include('fa-volume-mute');

            // Click to unmute
            await muteButton.click();
            icon = await muteButton.$('i');
            iconClasses = await icon.evaluate(el => Array.from(el.classList));
            expect(iconClasses).to.include('fa-volume-up');
        });
    });

    describe('Keyboard Controls', () => {
        beforeEach(async () => {
            await page.goto(TEST_URL);
            await page.waitForSelector('.video-item');
            await page.click('.video-item');
            await page.waitForSelector('#video-modal[style*="display: block"]');
        });

        it('should toggle play/pause with space key', async () => {
            await page.keyboard.press('Space');
            
            const playPauseButton = await page.$('#play-pause');
            const icon = await playPauseButton.$('i');
            const iconClasses = await icon.evaluate(el => Array.from(el.classList));
            expect(iconClasses).to.include('fa-play');
        });

        it('should close modal with escape key', async () => {
            await page.keyboard.press('Escape');
            
            const modal = await page.$('#video-modal');
            const display = await modal.evaluate(el => window.getComputedStyle(el).display);
            expect(display).to.equal('none');
        });
    });
});
