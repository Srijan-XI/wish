// Typing text effect for greeting
function typeGreeting(text, element) {
  let i = 0;
  element.textContent = '';
  function type() {
    if (i < text.length) {
      element.textContent += text[i++];
      setTimeout(type, 60);
    }
  }
  type();
}

window.addEventListener('DOMContentLoaded', () => {
  typeGreeting('Happy Birthday!', document.getElementById('greeting'));
  launchBalloons();
});

document.getElementById('wishBtn').addEventListener('click', () => {
  const name = document.getElementById('nameInput').value.trim();
  let wish = 'May all your wishes come true!';
  if (name) wish = `Happy Birthday, ${name}! 🎉 May your dreams come true!`;
  typeGreeting(wish, document.getElementById('greeting'));
  document.getElementById('popSound').play();
  if (window.confettiRunning !== true) {
    window.confettiRunning = true;
    fireConfetti();
    setTimeout(() => window.confettiRunning = false, 2500);
  }
});

document.getElementById('darkModeToggle').onclick = function() {
  document.body.classList.toggle('dark');
  this.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
};

// Balloons
function randomColor() {
  const colors = ['#ff6f61','#ffd600','#4fd1c5','#81e6d9','#f687b3', '#90cdf4'];
  return colors[Math.floor(Math.random()*colors.length)];
}
function launchBalloons() {
  const container = document.querySelector('.balloons');
  for(let i=0;i<10;i++){
    const bal = document.createElement('div');
    bal.style.position = 'absolute';
    bal.style.left = Math.random()*90 + '%';
    bal.style.bottom = '-60px';
    bal.style.width = '36px'; bal.style.height = '48px';
    bal.style.background = randomColor();
    bal.style.borderRadius = '36px 36px 36px 36px / 48px 48px 36px 36px';
    bal.style.boxShadow = '0 6px 16px #0002';
    bal.style.opacity = 0.85;
    bal.style.transition = 'transform 4s linear, opacity 1s';
    bal.style.zIndex = 0;
    container.appendChild(bal);
    setTimeout(() => {
      bal.style.transform = `translateY(-80vh) scale(${1 + Math.random()*0.4}) rotate(${Math.random()*48-24}deg)`;
      bal.style.opacity = 0;
      setTimeout(()=>container.removeChild(bal), 4000);
    }, 220*i);
  }
}

// Confetti
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

let confettiPieces = [];
function fireConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 160; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width, y: 0,
      r: Math.random() * 7 + 4,
      d: Math.random() * 100 + 30,
      color: `hsl(${Math.random()*360},100%,60%)`,
      tilt: Math.random() * 20 - 10,
      tiltAngleIncremental: Math.random()*0.07+.03,
      tiltAngle: 0,
      velocity: Math.random()*4 + 2
    });
  }
  animateConfetti();
}
function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let allFalling = false;
  confettiPieces.forEach((p, idx) => {
    ctx.beginPath();
    ctx.lineWidth = p.r;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r/3, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
    ctx.stroke();

    p.y += p.velocity;
    p.x += Math.sin(p.d) * 1.3;
    p.tiltAngle += p.tiltAngleIncremental;
    p.tilt = Math.sin(p.tiltAngle - (idx % 3)) * 16;

    if(p.y > canvas.height){
      allFalling = true;
    }
  });
  if (!allFalling) requestAnimationFrame(animateConfetti);
}
