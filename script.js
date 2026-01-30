/* Vanilla JS to handle interactions and floating hearts */
const gift = document.getElementById('gift');
const card = document.getElementById('card');
const heartsContainer = document.getElementById('hearts');
// slideshow elements (3 images inside .card-top-embellish)
const slideElements = Array.from(document.querySelectorAll('.card-top-embellish .slide'));
let slideIndex = 0;
let slideTimer = null;
// query close button when DOM ready; guard in case of timing
let closeCard = document.getElementById('closeCard');
if (!closeCard) {
  // fallback: try to find later
  document.addEventListener('DOMContentLoaded', () => {
    closeCard = document.getElementById('closeCard');
    if (closeCard) closeCard.addEventListener('click', hideCard);
  });
} else {
  closeCard.addEventListener('click', hideCard);
}

function showCard() {
  // hide gift visually (but keep in DOM for accessibility)
  gift.style.transition = 'opacity .26s ease, transform .26s ease';
  gift.style.opacity = '0';
  gift.style.transform = 'scale(.96) translateY(6px)';
  setTimeout(() => { gift.classList.add('hidden') }, 300);

  // show card with gentle animation
  card.classList.remove('hidden');
  requestAnimationFrame(()=> card.classList.add('show', 'fade-slide-up'));

  // start heart emitter and slideshow
  startHearts();
  startSlideshow();
}

function hideCard() {
  // fade out card
  card.classList.remove('show');
  card.addEventListener('transitionend', onCardHidden, {once:true});
  stopHearts();
  stopSlideshow();
}

function onCardHidden() {
  card.classList.add('hidden');
  // restore gift
  gift.classList.remove('hidden');
  requestAnimationFrame(()=> {
    gift.style.opacity = '1';
    gift.style.transform = 'translateY(0) scale(1)';
  });
}

gift.addEventListener('click', showCard);
gift.addEventListener('keydown', (e) => { if(e.key==='Enter' || e.key===' ') showCard(); });
closeCard.addEventListener('click', hideCard);

/* Heart emitter: creates floating hearts that gently rise and fade */
let heartTimer = null;
let running = false;

function createHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  // randomized path & size & color
  const size = 14 + Math.round(Math.random() * 20);
  h.style.width = `${size}px`;
  h.style.height = `${size}px`;
  const startX = 12 + Math.random() * (window.innerWidth * 0.8);
  h.style.left = `${startX}px`;
  const hue = 330 + Math.round(Math.random() * 30);
  const color = `hsl(${hue} 85% 60%)`;
  // heart svg
  h.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 21s-7-4.35-9.35-7.05C-1.05 10.65 3.26 6 7 8.5 8.8 9.8 9.5 12 12 13.5c2.5-1.5 3.2-3.7 5-5.0 3.74-2.5 8.05 2.15 4.35 5.95C19 16.65 12 21 12 21z" fill="${color}" opacity="0.95"/>
  </svg>`;
  heartsContainer.appendChild(h);

  // animate via JS for varied trajectories
  const travel = 420 + Math.random() * 260;
  const duration = 4200 + Math.random() * 2200;
  const rotate = (Math.random() - 0.5) * 60;
  h.animate([
    { transform: `translateY(0) rotate(0deg)`, opacity: 0, offset: 0 },
    { transform: `translateY(-${travel * 0.5}px) rotate(${rotate}deg)`, opacity: 0.9, offset: 0.2 },
    { transform: `translateY(-${travel}px) rotate(${rotate * 2}deg)`, opacity: 0 }
  ], {
    duration,
    easing: 'cubic-bezier(.2,.7,.2,1)',
    iterations: 1,
    fill: 'forwards'
  });

  // cleanup
  setTimeout(() => {
    h.remove();
  }, duration + 60);
}

function startHearts() {
  if (running) return;
  running = true;
  // emit a heart every 420-900ms
  heartTimer = setInterval(createHeart, 420 + Math.random() * 480);
  // generate a few immediately
  for(let i=0;i<6;i++){
    setTimeout(createHeart, i*160);
  }
}

function stopHearts() {
  running = false;
  if (heartTimer) clearInterval(heartTimer);
  heartTimer = null;
}

/* Slideshow control: cycle through .slide elements while card is open */
function showSlide(idx){
  slideElements.forEach((el,i)=>{
    el.classList.toggle('visible', i===idx);
  });
}
function startSlideshow(){
  if(!slideElements || slideElements.length===0) return;
  // ensure first visible
  slideIndex = 0;
  showSlide(slideIndex);
  // advance every 2000-3200ms
  slideTimer = setInterval(()=>{
    slideIndex = (slideIndex + 1) % slideElements.length;
    showSlide(slideIndex);
  }, 2400 + Math.random()*800);
}
function stopSlideshow(){
  if(slideTimer) clearInterval(slideTimer);
  slideTimer = null;
}

/* Accessibility: allow keyboard open via Enter/Space on the gift (button already) and closing via Escape */
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape' && !card.classList.contains('hidden')) hideCard();
});