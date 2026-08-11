// Shape Visuals Client Page Logic

// 1. Geometric Canvas Background Effect
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const mouse = {
  x: null,
  y: null,
  radius: 150
};

// Set canvas dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Track Mouse Movement
window.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Blueprint
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    // Check boundary collisions
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Move particle
    this.x += this.directionX;
    this.y += this.directionY;

    // Draw particle
    this.draw();
  }
}

// Generate Particles
function initParticles() {
  particlesArray = [];
  const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    const directionX = (Math.random() - 0.5) * 0.4;
    const directionY = (Math.random() - 0.5) * 0.4;
    
    // Violet / Cyan color mix
    const color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.25)' : 'rgba(6, 182, 212, 0.2)';

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

// Connect Particles with lines to form geometry ("Shapes")
function connectParticles() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        opacityValue = 1 - distance / 100;
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacityValue * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }

    // Connect to mouse
    if (mouse.x && mouse.y) {
      const dxMouse = particlesArray[a].x - mouse.x;
      const dyMouse = particlesArray[a].y - mouse.y;
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      if (distanceMouse < mouse.radius) {
        opacityValue = 1 - distanceMouse / mouse.radius;
        ctx.strokeStyle = `rgba(236, 72, 153, ${opacityValue * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connectParticles();
  requestAnimationFrame(animate);
}

initParticles();
animate();

// Re-init particles on resize
window.addEventListener('resize', () => {
  initParticles();
});


// 2. FAQ Accordion Click Handler
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    
    // Toggle active class
    const isActive = item.classList.contains('active');
    
    // Close other FAQ items
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      otherItem.classList.remove('active');
      otherItem.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// 3. Content Copy & Image Download Protection
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

document.addEventListener('copy', (e) => {
  e.preventDefault();
});

document.addEventListener('cut', (e) => {
  e.preventDefault();
});

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', (e) => {
  // Disable Ctrl+C, Ctrl+A, Ctrl+U, Ctrl+S
  if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'a' || e.key === 'A' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
    e.preventDefault();
  }
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'i' || e.key === 'j'))) {
    e.preventDefault();
  }
});
