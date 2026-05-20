class DigitalWave {
  constructor(element) {
    this.element = element;
    this.text = element.dataset.text;
    this.chars = [];
    this.time = 0;
    this.init();
  }

  init() {
    // Create character elements
    this.element.innerHTML = this.text.split('').map(char => 
      char === ' ' ? ' ' : `<span class="char">${char}</span>`
    ).join('');

    this.chars = Array.from(this.element.querySelectorAll('.char'));
    this.animate();
  }

  animate() {
    this.time += 0.05;

    this.chars.forEach((char, index) => {
      // Calculate wave position
      const wave = Math.sin(this.time + index * 0.5) * 20;
      const blur = Math.abs(wave) / 8;
      
      // Apply transformations
      char.style.transform = `translateY(${wave}px)`;
      char.style.filter = `blur(${blur}px)`;
      char.style.opacity = 1 - Math.abs(wave) / 40;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize effect
const waveText = document.querySelector('.wave-text');
new DigitalWave(waveText);

// Optional: Mouse interaction
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  waveText.style.transform = `rotateY(${x * 40 - 20}deg)`;
});