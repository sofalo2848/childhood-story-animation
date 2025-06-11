// dom elements
const homePage = document.getElementById('home-page');
const experiencePage = document.getElementById('experience-page');
const channelModal = document.getElementById('channel-modal');
const tvScreen = document.getElementById('tv-screen');
const homeImage = document.getElementById('home-image');

// audio controls
const playPauseBtn = document.getElementById('playPauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const fastForwardBtn = document.getElementById('fastForwardBtn');
const restartBtn = document.getElementById('restartBtn');
const timeline = document.getElementById('timeline');

// initialize audio and state
let audioElement = null;
let isPlaying = false;
let currentScene = 'a1';

// Story sequence timing (in seconds)
const STORY_SEQUENCE = {
    a1: { start: 0, end: 20 },    // Waking up
    a2: { start: 20, end: 40 },   // Bathroom routine
    a3: { start: 40, end: 60 },   // Leaving room
    b1: { start: 60, end: 80 },   // Breakfast
    choice: { start: 80, end: 90 }, // Channel selection
    channel: { start: 90 }        // Watching chosen channel
};

// Background variations for homepage
const backgroundVariations = [
    'bg-variation-1.png',
    'bg-variation-2.png',
    'bg-variation-3.png',
    'bg-variation-4.png'
];

// initialize
window.addEventListener('DOMContentLoaded', () => {
    // Initialize homepage if home image exists
    if (homeImage) {
        homeImage.style.backgroundImage = `url(media/homepage.png)`;
    }

    // Initialize experience page if TV screen exists
    if (tvScreen) {
        initializeExperience();
    }
});

// Initialize the experience
function initializeExperience() {
    // initialize audio
    if (!audioElement) {
        audioElement = new Audio('media/story-audio.mp3');
        audioElement.addEventListener('timeupdate', updateStoryProgress);
        audioElement.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
    
    // show initial scene
    updateScene('a1');
    
    // Add event listeners for controls
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', playAudio);
        rewindBtn.addEventListener('click', rewindAudio);
        fastForwardBtn.addEventListener('click', fastForwardAudio);
        restartBtn.addEventListener('click', restartAudio);
        timeline.addEventListener('input', seekAudio);
    }
}

// update the scene based on current time
function updateStoryProgress() {
    if (!audioElement) return;
    
    const currentTime = audioElement.currentTime;
    
    // Update timeline
    const percentage = (currentTime / audioElement.duration) * 100;
    timeline.value = percentage;
    
    // Determine current scene
    if (currentTime >= STORY_SEQUENCE.channel.start) {
        // Scene already set by channel selection
        return;
    } else if (currentTime >= STORY_SEQUENCE.choice.start && !channelModal.classList.contains('shown')) {
        showChannelSelection();
    } else if (currentTime >= STORY_SEQUENCE.b1.start) {
        updateScene('b1');
    } else if (currentTime >= STORY_SEQUENCE.a3.start) {
        updateScene('a3');
    } else if (currentTime >= STORY_SEQUENCE.a2.start) {
        updateScene('a2');
    } else {
        updateScene('a1');
    }
}

function updateScene(sceneName) {
    if (currentScene === sceneName) return;
    
    currentScene = sceneName;
    const sceneImages = {
        'a1': 'a1.png',
        'a2': 'a2.png',
        'a3': 'a3.png',
        'b1': 'b1.png',
        'choice': 'choice.png'
    };

    if (sceneImages[sceneName]) {
        tvScreen.style.backgroundImage = `url(media/${sceneImages[sceneName]})`;
    }
}

// audio controls
function playAudio() {
    if (!audioElement) return;
    
    if (audioElement.paused) {
        audioElement.play();
        isPlaying = true;
    } else {
        audioElement.pause();
        isPlaying = false;
    }
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const playIcon = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>';
    const pauseIcon = '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>';
    
    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    playPauseBtn.classList.toggle('active', isPlaying);
}

function seekAudio() {
    if (!audioElement) return;
    
    const time = (timeline.value * audioElement.duration) / 100;
    audioElement.currentTime = time;
}

function rewindAudio() {
    if (!audioElement) return;
    
    // rewind 10 seconds
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
    
    // visual feedback
    rewindBtn.classList.add('text-purple-500');
    setTimeout(() => rewindBtn.classList.remove('text-purple-500'), 200);
}

function fastForwardAudio() {
    if (!audioElement) return;
    
    // forward 10 seconds
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
    
    // visual feedback
    fastForwardBtn.classList.add('text-purple-500');
    setTimeout(() => fastForwardBtn.classList.remove('text-purple-500'), 200);
}

function restartAudio() {
    if (!audioElement) return;
    
    audioElement.currentTime = 0;
    if (!isPlaying) {
        playAudio();
    }
    
    // visual feedback
    restartBtn.classList.add('text-purple-500');
    setTimeout(() => restartBtn.classList.remove('text-purple-500'), 200);
}

// channel selection
function showChannelSelection() {
    // show the choice image
    updateScene('choice');
    
    // pause the audio
    audioElement.pause();
    isPlaying = false;
    updatePlayPauseButton();
    
    // show channel modal after a brief delay
    setTimeout(() => {
        channelModal.classList.remove('hidden');
        channelModal.classList.add('shown');
    }, 2000);
}

function selectChannel(channel) {
    // add zoom effect to TV screen
    tvScreen.classList.add('zoom-effect');
    
    // hide channel modal
    channelModal.classList.add('hidden');
    
    // after zoom animation, show channel content
    setTimeout(() => {
        tvScreen.classList.remove('zoom-effect');
        const bgImage = channel === 'cartoon-network' ? 'CN.gif' : 'nickelodeon.gif';
        tvScreen.style.backgroundImage = `url(media/${bgImage})`;
        currentScene = 'channel';
        
        // resume audio
        playAudio();
    }, 1000);
} 