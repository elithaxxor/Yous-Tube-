# Testing Documentation

This directory contains automated tests for the Netflix Clone Remote Video Player application.

## Test Structure

- `server.test.js`: Backend API and server functionality tests
- `ui.test.js`: Frontend UI and interaction tests
- `test-config.js`: Shared test configuration and constants
- `test-helpers.js`: Common test utilities and helper functions

## Running Tests

To run all tests:
```bash
npm test
```

## Test Coverage

### Server Tests (`server.test.js`)
- API endpoint `/api/videos`
  - Returns correct JSON response when videos exist
  - Returns empty array when no videos exist
  - Handles server errors appropriately
- Static file serving
  - Serves HTML, CSS, and JavaScript files correctly

### UI Tests (`ui.test.js`)
- Homepage
  - Loads with all essential elements
  - Shows loading spinner during video fetch
  - Displays video grid correctly
- Video Grid
  - Shows video items when videos exist
  - Shows overlay on hover
  - Displays video titles correctly
- Video Modal
  - Opens when video is clicked
  - Closes when close button is clicked
  - Closes when Escape key is pressed
- Video Controls
  - Play/Pause button toggles video playback
  - Mute button toggles audio
  - Volume slider adjusts volume level
  - Seek bar navigates through video
  - Fullscreen button toggles fullscreen mode
- Keyboard Controls
  - Space/K: Play/Pause
  - M: Mute/Unmute
  - F: Fullscreen
  - Escape: Close modal

## Test Helpers

The `test-helpers.js` file provides utility functions for:
- Creating and cleaning up test video files
- Waiting for elements to be visible
- Waiting for animations to complete
- Asserting element visibility
- Getting computed styles
- Checking element classes
- Getting element text content

## Configuration

The `test-config.js` file contains:
- Server configuration (port, URL)
- Test timeouts
- Element selectors
- Test video details

## Adding New Tests

When adding new tests:
1. Use the appropriate test file based on what you're testing
2. Follow the existing test patterns
3. Use helper functions from `test-helpers.js`
4. Update this README if adding new test categories
