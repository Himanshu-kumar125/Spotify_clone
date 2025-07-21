// Global variables
let isPlaying = false;
let currentProgress = 30;
let currentVolume = 70;

// DOM(Document object model) elements
const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const progressHandle = document.getElementById('progressHandle');
const progressContainer = document.querySelector('.progress-container');
const volumeProgress = document.getElementById('volumeProgress');
const volumeHandle = document.getElementById('volumeHandle');
const volumeBar = document.querySelector('.volume-bar');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializePlayer();
    addEventListeners();
});

function initializePlayer() {
    // Set initial progress and volume
    updateProgressBar(currentProgress);
    updateVolumeBar(currentVolume);
}

function addEventListeners() {
    // Play/Pause button
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Progress bar interactions
    progressContainer.addEventListener('click', handleProgressClick);
    progressContainer.addEventListener('mousedown', startProgressDrag);
    
    // Volume bar interactions
    volumeBar.addEventListener('click', handleVolumeClick);
    volumeBar.addEventListener('mousedown', startVolumeDrag);
    
    // Card play buttons
    const playButtons = document.querySelectorAll('.play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', handleCardPlay);
    });
    
    // Navigation menu items
    const navItems = document.querySelectorAll('.nav-menu li');
    navItems.forEach(item => {
        item.addEventListener('click', handleNavClick);
    });
    
    // Playlist items
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => {
        item.addEventListener('click', handlePlaylistClick);
    });
    
    // Like button
    const likeBtn = document.querySelector('.like-btn');
    likeBtn.addEventListener('click', toggleLike);
    
    // Control buttons
    const controlBtns = document.querySelectorAll('.control-btn:not(.play-pause-btn)');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', handleControlClick);
    });
}

function togglePlayPause() {
    isPlaying = !isPlaying;
    const icon = playPauseBtn.querySelector('i');
    
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        startProgressAnimation();
    } else {
        icon.className = 'fas fa-play';
        stopProgressAnimation();
    }
}

let progressInterval;

function startProgressAnimation() {
    progressInterval = setInterval(() => {
        if (currentProgress < 100) {
            currentProgress += 0.5;
            updateProgressBar(currentProgress);
            updateTimeDisplay();
        } else {
            // Song ended, go to next track
            currentProgress = 0;
            togglePlayPause();
        }
    }, 500);
}

function stopProgressAnimation() {
    clearInterval(progressInterval);
}

function updateProgressBar(percentage) {
    progress.style.width = percentage + '%';
    progressHandle.style.right = -(6 + (percentage * (progressContainer.offsetWidth - 12) / 100)) + 'px';
}

function updateVolumeBar(percentage) {
    volumeProgress.style.width = percentage + '%';
    volumeHandle.style.right = -(6 + (percentage * (volumeBar.offsetWidth - 12) / 100)) + 'px';
}

function updateTimeDisplay() {
    const currentTime = Math.floor((currentProgress / 100) * 225); // 3:45 = 225 seconds
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.querySelector('.time-current').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function handleProgressClick(e) {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    currentProgress = Math.max(0, Math.min(100, percentage));
    updateProgressBar(currentProgress);
    updateTimeDisplay();
}

function handleVolumeClick(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    currentVolume = Math.max(0, Math.min(100, percentage));
    updateVolumeBar(currentVolume);
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volumeIcon = document.querySelector('.volume-control .control-btn i');
    if (currentVolume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (currentVolume < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function startProgressDrag(e) {
    e.preventDefault();
    const handleDrag = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const percentage = (dragX / rect.width) * 100;
        currentProgress = Math.max(0, Math.min(100, percentage));
        updateProgressBar(currentProgress);
        updateTimeDisplay();
    };
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

function startVolumeDrag(e) {
    e.preventDefault();
    const handleDrag = (e) => {
        const rect = volumeBar.getBoundingClientRect();
        const dragX = e.clientX - rect.left;
        const percentage = (dragX / rect.width) * 100;
        currentVolume = Math.max(0, Math.min(100, percentage));
        updateVolumeBar(currentVolume);
        updateVolumeIcon();
    };
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

function handleCardPlay(e) {
    e.stopPropagation();
    const card = e.target.closest('.card');
    const title = card.querySelector('h3').textContent;
    
    // Update current song info
    document.querySelector('.song-title').textContent = title;
    document.querySelector('.song-artist').textContent = 'Various Artists';
    
    // Start playing
    if (!isPlaying) {
        togglePlayPause();
    }
    
    // Reset progress
    currentProgress = 0;
    updateProgressBar(currentProgress);
    updateTimeDisplay();
}

function handleNavClick(e) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item
    e.currentTarget.classList.add('active');
}

function handlePlaylistClick(e) {
    const playlistName = e.target.textContent;
    console.log(`Clicked on playlist: ${playlistName}`);
    // Here you would typically load the playlist content
}

function toggleLike() {
    const likeIcon = document.querySelector('.like-btn i');
    if (likeIcon.classList.contains('far')) {
        likeIcon.className = 'fas fa-heart';
        likeIcon.style.color = '#1db954';
    } else {
        likeIcon.className = 'far fa-heart';
        likeIcon.style.color = '#b3b3b3';
    }
}

function handleControlClick(e) {
    const button = e.currentTarget;
    const icon = button.querySelector('i');
    
    // Add visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
    
    // Handle different control actions
    if (icon.classList.contains('fa-random')) {
        console.log('Shuffle toggled');
        icon.style.color = icon.style.color === 'rgb(29, 185, 84)' ? '#b3b3b3' : '#1db954';
    } else if (icon.classList.contains('fa-redo')) {
        console.log('Repeat toggled');
        icon.style.color = icon.style.color === 'rgb(29, 185, 84)' ? '#b3b3b3' : '#1db954';
    } else if (icon.classList.contains('fa-step-backward')) {
        console.log('Previous track');
        // Reset current song
        currentProgress = 0;
        updateProgressBar(currentProgress);
        updateTimeDisplay();
    } else if (icon.classList.contains('fa-step-forward')) {
        console.log('Next track');
        // Simulate next track
        const songs = ['Blinding Lights', 'Watermelon Sugar', 'Levitating', 'Good 4 U', 'Stay'];
        const artists = ['The Weeknd', 'Harry Styles', 'Dua Lipa', 'Olivia Rodrigo', 'The Kid LAROI'];
        const randomIndex = Math.floor(Math.random() * songs.length);
        
        document.querySelector('.song-title').textContent = songs[randomIndex];
        document.querySelector('.song-artist').textContent = artists[randomIndex];
        
        currentProgress = 0;
        updateProgressBar(currentProgress);
        updateTimeDisplay();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        togglePlayPause();
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', function() {
    updateProgressBar(currentProgress);
    updateVolumeBar(currentVolume);
});

// Simulate loading states
window.addEventListener('load', function() {
    // Add loading animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
