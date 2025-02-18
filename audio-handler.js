// Add this code at the beginning of your script section
class AudioHandler {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioElement = new Audio();
        this.source = null;
        this.analyser = null;
        this.bufferSize = 2048;
        
        // Add audio buffer
        this.audioBuffer = new ArrayBuffer(this.bufferSize);
        
        this.setup();
    }

    setup() {
        // Create analyser node
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        // Create source node
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        
        // Create gain node for volume control
        this.gainNode = this.audioContext.createGain();
        
        // Connect nodes
        this.source.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        // Error handling
        this.audioElement.addEventListener('error', (e) => {
            console.error('Audio Error:', e);
            this.handleAudioError();
        });

        // Add stall handling
        this.audioElement.addEventListener('stalled', () => {
            this.handleStall();
        });
    }

    handleAudioError() {
        // Retry playback
        const currentTime = this.audioElement.currentTime;
        this.audioElement.load();
        this.audioElement.currentTime = currentTime;
        this.audioElement.play().catch(console.error);
    }

    handleStall() {
        // Handle stalled playback
        setTimeout(() => {
            this.audioElement.load();
            this.audioElement.play().catch(console.error);
        }, 1000);
    }

    play(url) {
        this.audioElement.src = url;
        this.audioElement.load();
        return this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }

    getFrequencyData() {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }
}
