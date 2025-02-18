// Add this code for the fire visualizer
class FireVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.setup();
    }

    setup() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height,
                size: Math.random() * 3 + 2,
                speedY: Math.random() * 2 + 1
            });
        }
    }

    draw(frequencyData) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate average frequency
        const avgFreq = frequencyData.reduce((a, b) => a + b) / frequencyData.length;
        const intensity = avgFreq / 255; // Normalize to 0-1

        this.particles.forEach((particle, i) => {
            // Update particle position
            particle.y -= particle.speedY * (1 + intensity);
            
            // Reset particle when it goes off screen
            if (particle.y < 0) {
                particle.y = this.canvas.height;
                particle.x = Math.random() * this.canvas.width;
            }

            // Create gradient for fire effect
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * (1 + intensity * 2)
            );

            // Color based on frequency intensity
            const alpha = Math.min(1, intensity + 0.2);
            gradient.addColorStop(0, `rgba(255, ${200 + intensity * 55}, 0, ${alpha})`);
            gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * (1 + intensity), 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}
