// Test Configuration
module.exports = {
    // Server configuration
    SERVER_PORT: 8000,
    SERVER_URL: 'http://localhost:8000',

    // Test timeouts
    TIMEOUT: {
        ELEMENT: 5000,      // Wait for element to appear
        ANIMATION: 1000,    // Wait for animation to complete
        PAGE_LOAD: 10000,   // Wait for page to load
        API: 2000          // Wait for API response
    },

    // Test selectors
    SELECTORS: {
        VIDEO_GRID: '[data-testid="video-grid"]',
        VIDEO_ITEM: '.video-item',
        VIDEO_MODAL: '#video-modal',
        LOADING_SPINNER: '[data-testid="loading-spinner"]',
        ERROR_MESSAGE: '[data-testid="error-message"]',
        CONTROLS: {
            CLOSE: '[data-testid="close-modal"]',
            PLAY_PAUSE: '[data-testid="play-pause"]',
            MUTE: '[data-testid="mute"]',
            FULL_SCREEN: '[data-testid="full-screen"]',
            SEEK_BAR: '#seek-bar',
            VOLUME_BAR: '#volume-bar'
        }
    },

    // Test video file
    TEST_VIDEO: {
        name: 'test.mp4',
        content: 'test video content'
    }
};
