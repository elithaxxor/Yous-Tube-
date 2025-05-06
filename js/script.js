// DOM Elements
const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('video-modal');
const videoPlayer = document.getElementById('video-player');
const closeModal = document.getElementById('close-modal');
const playPauseButton = document.getElementById('play-pause');
const seekBar = document.getElementById('seek-bar');
const muteButton = document.getElementById('mute');
const volumeBar = document.getElementById('volume-bar');
const fullScreenButton = document.getElementById('full-screen');

// Video State
let isPlaying = false;
let isMuted = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.classList.remove('hidden');
    
    loadVideos().finally(() => {
        loadingSpinner.classList.add('hidden');
    });
    setupVideoControls();
});

// Load initial videos
async function loadVideos() {
    try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const videos = await response.json();
        renderVideos(videos);
    } catch (error) {
        console.error('Error loading videos:', error);
        showError('Failed to load videos. Please try again later.');
        throw error; // Re-throw to trigger finally block
    }
}

// Render video grid
function renderVideos(videos) {
    if (videos.length === 0) {
        videoGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-400">No videos available. Drop some videos in the videos folder to get started.</p>
            </div>
        `;
        return;
    }

    videoGrid.innerHTML = videos.map(video => `
        <div class="video-item" data-video="${video.url}">
            <img src="https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                 alt="${video.filename}">
            <div class="overlay">
                <i class="fas fa-play play-icon"></i>
            </div>
            <div class="video-title">${video.filename}</div>
        </div>
    `).join('');

    // Add click listeners to video items
    document.querySelectorAll('.video-item').forEach(item => {
        item.addEventListener('click', () => {
            const videoUrl = item.dataset.video;
            openVideoModal(videoUrl);
        });
    });
}

// Video modal and player controls
function openVideoModal(videoUrl) {
    videoPlayer.src = videoUrl;
    videoModal.classList.add('active');
    videoModal.style.display = 'block';
    videoPlayer.play().catch(error => {
        console.error('Error playing video:', error);
        showError('Failed to play video. Please try again.');
    });
    isPlaying = true;
    updatePlayPauseIcon();
}

function setupVideoControls() {
    // Play/Pause
    playPauseButton.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('click', togglePlayPause);

    // Seek bar
    videoPlayer.addEventListener('loadedmetadata', () => {
        seekBar.max = videoPlayer.duration;
    });
    
    videoPlayer.addEventListener('timeupdate', () => {
        seekBar.value = videoPlayer.currentTime;
    });

    seekBar.addEventListener('change', () => {
        videoPlayer.currentTime = seekBar.value;
    });

    // Volume
    muteButton.addEventListener('click', toggleMute);
    volumeBar.addEventListener('input', (e) => {
        videoPlayer.volume = e.target.value;
        updateVolumeIcon();
    });

    // Full screen
    fullScreenButton.addEventListener('click', toggleFullScreen);

    // Close modal
    closeModal.addEventListener('click', () => {
        videoPlayer.pause();
        videoModal.style.display = 'none';
        videoModal.classList.remove('active');
        isPlaying = false;
        updatePlayPauseIcon();
    });
}

// Video control functions
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        isPlaying = true;
    } else {
        videoPlayer.pause();
        isPlaying = false;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    playPauseButton.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    isMuted = videoPlayer.muted;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volume = videoPlayer.volume;
    let iconClass = 'fa-volume-up';
    
    if (isMuted || volume === 0) {
        iconClass = 'fa-volume-mute';
    } else if (volume < 0.5) {
        iconClass = 'fa-volume-down';
    }
    
    muteButton.innerHTML = `<i class="fas ${iconClass}"></i>`;
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Utility functions
function showError(message) {
    // Remove any existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('data-testid', 'error-message');
    errorDiv.textContent = message;
    videoGrid.insertAdjacentElement('beforebegin', errorDiv);
    
    // Remove after timeout
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (videoModal.style.display === 'block') {
        switch(e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'f':
                e.preventDefault();
                toggleFullScreen();
                break;
            case 'm':
                e.preventDefault();
                toggleMute();
                break;
            case 'escape':
                if (videoModal.style.display === 'block') {
                    closeModal.click();
                }
                break;
        }
    }
});
