const themeToggle = document.getElementById('themeToggle');
const video = document.getElementById('customPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const speedBtn = document.getElementById('speedBtn');
const pipBtn = document.getElementById('pipBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeControl = document.getElementById('volumeControl');
const timeDisplay = document.getElementById('timeDisplay');
const progressBar = document.getElementById('progressBar');
const customFullscreenBtn = document.getElementById('customFullscreenBtn');

// Load the saved theme preference from local storage
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : '');
});

// Play/pause functionality
playPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Update time display and progress bar
video.addEventListener('timeupdate', () => {
    const currentTime = formatTime(video.currentTime);
    const duration = formatTime(video.duration);
    timeDisplay.textContent = `${currentTime} / ${duration}`;
    progressBar.value = (video.currentTime / video.duration) * 100;
});

// Seek video when progress bar changes
progressBar.addEventListener('input', () => {
    video.currentTime = (progressBar.value / 100) * video.duration;
});

// Playback speed control
let speed = 1;
speedBtn.addEventListener('click', () => {
    speed = speed === 2 ? 0.5 : speed + 0.5; // Cycle between 0.5x, 1x, 1.5x, 2x
    video.playbackRate = speed;
    speedBtn.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${speed}x`;
});

// Picture-in-Picture (PiP) functionality
pipBtn.addEventListener('click', async () => {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (video.requestPictureInPicture) {
        await video.requestPictureInPicture();
    }
});

// Volume control
volumeControl.addEventListener('input', () => {
    video.volume = volumeControl.value;
    video.muted = video.volume === 0; // Automatically mute if volume is set to 0
    updateMuteButton();
});

// Mute/unmute functionality
muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    volumeControl.value = video.muted ? 0 : video.volume;
    updateMuteButton();
});

// Update mute button icon based on mute and volume state
function updateMuteButton() {
    if (video.muted || video.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (video.volume > 0.5) {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    }
}

// Initialize the volume slider on page load
volumeControl.value = video.volume;
updateMuteButton();

// Format time in MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
}

// Custom fullscreen functionality
customFullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) { /* Firefox */
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) { /* IE/Edge */
            video.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
    }
});

// Listen for fullscreen change events
document.addEventListener('fullscreenchange', updateFullscreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullscreenIcon); // For Webkit browsers
document.addEventListener('mozfullscreenchange', updateFullscreenIcon); // For Firefox
document.addEventListener('MSFullscreenChange', updateFullscreenIcon); // For IE/Edge

function updateFullscreenIcon() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        customFullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>'; // Change icon to compress
        video.classList.add('fullscreen'); // Apply fullscreen styling
        removeDownloadOption(); // Hide download option
    } else {
        customFullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'; // Change icon back to expand
        video.classList.remove('fullscreen'); // Remove fullscreen styling
    }
}

function removeDownloadOption() {
    const downloadElements = document.querySelectorAll('.download-option');
    console.log('Removing download options:', downloadElements); // Log elements being affected
    downloadElements.forEach(element => {
        element.style.display = 'none';
    });
}
