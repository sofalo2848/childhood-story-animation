// dom elements
const homePage = document.getElementById('home-page');
const experiencePage = document.getElementById('experience-page');
const channelModal = document.getElementById('channel-modal');
const tvScreen = document.getElementById('tv-screen');
const homeImage = document.getElementById('home-image');

// audio contorls
const playPauseBtn = document.getElementById('playPauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const fastForwardBtn = document.getElementById('fastForwardBtn');
const restartBtn = document.getElementById('restartBtn');
const timeline = document.getElementById('timeline');

// initialize audio
let audioElement = null;
let isPlaying = false;

// homeimage
const homeImagePath = 'media/homepage.png';

// initialize home image
window.addEventListener('DOMContentLoaded', () => {
    // Set home image
    homeImage.style.backgroundImage = `url(${homeImagePath})`;
});

// start experience
function startExperience() {
    homePage.classList.add('hidden');
    experiencePage.classList.remove('hidden');
    
    // initialize audio
    if (!audioElement) {
        audioElement = new Audio('media/story-audio.mp3');
        audioElement.addEventListener('timeupdate', updateTimeline);
        audioElement.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayPauseButton();
        });
    }
    
    // show tv static initially
    tvScreen.classList.add('tv-static');
    tvScreen.style.backgroundImage = `url(media/background.gif)`;
    
    // start the story
    playAudio();
}

// audio control functions
function playAudio() {
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
    playPauseBtn.innerHTML = isPlaying ? 
        '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>' :
        '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>';
}

function updateTimeline() {
    const percentage = (audioElement.currentTime / audioElement.duration) * 100;
    timeline.value = percentage;
    
    // check if we're at the channel selection point
    if (audioElement.currentTime >= 30 && !channelModal.classList.contains('shown')) {
        showChannelSelection();
    }
}

function seekAudio() {
    const time = (timeline.value * audioElement.duration) / 100;
    audioElement.currentTime = time;
}

function rewindAudio() {
    audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
}

function fastForwardAudio() {
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
}

function restartAudio() {
    audioElement.currentTime = 0;
    if (!isPlaying) {
        playAudio();
    }
}

// Channel selection
function showChannelSelection() {
    audioElement.pause();
    isPlaying = false;
    updatePlayPauseButton();
    channelModal.classList.remove('hidden');
    channelModal.classList.add('shown');
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
        
        // resume sound
        playAudio();
    }, 1000);
}

playPauseBtn.addEventListener('click', playAudio);
rewindBtn.addEventListener('click', rewindAudio);
fastForwardBtn.addEventListener('click', fastForwardAudio);
restartBtn.addEventListener('click', restartAudio);
timeline.addEventListener('input', seekAudio); 