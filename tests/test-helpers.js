const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const config = require('./test-config');

/**
 * Test Helper Functions
 */
const helpers = {
    /**
     * Create a test video file
     * @returns {string} Path to the created test video
     */
    createTestVideo() {
        const videoPath = path.join(__dirname, '..', 'videos', config.TEST_VIDEO.name);
        if (!fs.existsSync(path.dirname(videoPath))) {
            fs.mkdirSync(path.dirname(videoPath), { recursive: true });
        }
        fs.writeFileSync(videoPath, config.TEST_VIDEO.content);
        return videoPath;
    },

    /**
     * Remove test video file
     */
    removeTestVideo() {
        const videoPath = path.join(__dirname, '..', 'videos', config.TEST_VIDEO.name);
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }
    },

    /**
     * Wait for an element to be visible
     * @param {Page} page Puppeteer page object
     * @param {string} selector Element selector
     * @param {number} timeout Timeout in milliseconds
     */
    async waitForVisible(page, selector, timeout = config.TIMEOUT.ELEMENT) {
        await page.waitForSelector(selector, {
            visible: true,
            timeout
        });
    },

    /**
     * Wait for animation to complete
     * @param {number} duration Duration in milliseconds
     */
    async waitForAnimation(duration = config.TIMEOUT.ANIMATION) {
        return new Promise(resolve => setTimeout(resolve, duration));
    },

    /**
     * Assert element visibility
     * @param {Page} page Puppeteer page object
     * @param {string} selector Element selector
     * @param {boolean} shouldBeVisible Whether element should be visible
     */
    async assertVisibility(page, selector, shouldBeVisible = true) {
        const isVisible = await page.evaluate((sel) => {
            const element = document.querySelector(sel);
            if (!element) return false;
            const style = window.getComputedStyle(element);
            return style && style.display !== 'none' && style.visibility !== 'hidden';
        }, selector);
        expect(isVisible).to.equal(shouldBeVisible);
    },

    /**
     * Get computed style property of an element
     * @param {Page} page Puppeteer page object
     * @param {string} selector Element selector
     * @param {string} property CSS property name
     * @returns {Promise<string>} Property value
     */
    async getComputedStyle(page, selector, property) {
        return page.evaluate((sel, prop) => {
            const element = document.querySelector(sel);
            if (!element) return null;
            return window.getComputedStyle(element)[prop];
        }, selector, property);
    },

    /**
     * Check if element has a class
     * @param {Page} page Puppeteer page object
     * @param {string} selector Element selector
     * @param {string} className Class name to check
     * @returns {Promise<boolean>} Whether element has the class
     */
    async hasClass(page, selector, className) {
        return page.evaluate((sel, cls) => {
            const element = document.querySelector(sel);
            return element ? element.classList.contains(cls) : false;
        }, selector, className);
    },

    /**
     * Get element text content
     * @param {Page} page Puppeteer page object
     * @param {string} selector Element selector
     * @returns {Promise<string>} Element text content
     */
    async getText(page, selector) {
        return page.evaluate((sel) => {
            const element = document.querySelector(sel);
            return element ? element.textContent : null;
        }, selector);
    }
};

module.exports = helpers;
