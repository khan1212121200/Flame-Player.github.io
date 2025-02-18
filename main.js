// Replace your existing audio and visualizer setup with this:
const audioHandler = new AudioHandler();
const fireVisualizer = new FireVisualizer(document.getElementById('visualizer'));

function animate() {
    if (!isVisualizerRunning) return;
    requestAnimationFrame(animate);
    
    const frequencyData = audioHandler.getFrequencyData();
    fireVisualizer.draw(frequencyData);
    
    // Update Music Player text size based on frequency
    const avgFreq = Array.from(frequencyData).reduce((a, b) => a + b) / frequencyData.length;
    const scale = 1 + (avgFreq / 512); // Smoother scaling
    document.querySelector('.player-name').style.transform = `scale(${scale})`;
}

// Update your playSong function
async function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    currentSongIndex = index;
    const song = songs[index];

    try {
        // Resume audio context if suspended
        if (audioHandler.audioContext.state === 'suspended') {
            await audioHandler.audioContext.resume();
        }

        // Check cache for the song
        const cache = await caches.open('music-cache');
        const response = await cache.match(`/music/${song.name}`);
        
        if (response) {
            const blob = await response.blob();
            await audioHandler.play(URL.createObjectURL(blob));
        } else {
            await audioHandler.play(song.url);
        }

        isVisualizerRunning = true;
        animate();
        updatePlaylistUI();
        
        // Update MediaSession metadata
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.name,
                artist: 'Music Player'
            });
        }
    } catch (error) {
        console.error('Error playing song:', error);
    }
}

// Update renderPlaylist to remove individual play/pause buttons
function renderPlaylist() {
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.name;
        li.addEventListener('click', () => playSong(index));
        
        // Highlight current song
        if (index === currentSongIndex) {
            li.style.backgroundColor = '#1e90ff';
        }
        
        playlist.appendChild(li);
    });
}
