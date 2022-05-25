<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
const title = 'Welcome To Leisure Time ^_^'
let canvas1, ctx, W, H, mp;
if(screen.width>=988) mp = 150;
else mp = 75;
let deactivationTimerHandler,
reactivationTimerHandler,
animationHandler,
particles = [],
angle = 0,
particleAngle = 0,
confettiActive = !0,
animationComplete = !0,
particleColors = {
  colorOptions: ["DodgerBlue","OliveDrab","Gold","pink","SlateBlue","lightblue","Violet","PaleGreen","SteelBlue","SandyBrown","Chocolate","Crimson"],
  colorIndex: 0,
  colorIncrementer: 0,
  colorThreshold: 10,
  getColor: function(){
    return this.colorIncrementer >= 10 &&
    (
      this.colorIncrementer = 0,
      this.colorIndex++,
      this.colorIndex >= this.colorOptions.length &&
      (this.colorIndex = 0)
    ),
    this.colorIncrementer++,
    this.colorOptions[this.colorIndex]
  }
};
window.requestAnimFrame = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(t) {
  return window.setTimeout(t, 1e3/60);
};

function randomRange(begin, end, delta){
  return Math.floor(Math.random() * (end - begin) + delta);
}
function confettiParticle(color){
  this.x = Math.random() * W;
  this.y = Math.random() * H - H;
  // this.y = Math.random() * H;
  this.r = randomRange(10, 30, 10);
  this.d = Math.random() * mp + 10;
  this.color = color;
  // this.deltaR = Math.floor(10*Math.random()) - 10;
  this.deltaR = randomRange(0, 10, -10);
  this.particleAngleInc = .07 * Math.random() + .05;
  this.particleAngle = 0;
  this.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = this.r / 2;
    ctx.strokeStyle = this.color;
    ctx.moveTo(this.x + this.deltaR + this.r/4, this.y);
    ctx.lineTo(this.x + this.deltaR, this.y + this.deltaR + this.r/4);
    ctx.stroke();
  }
}

function clearTimers(){
  clearTimeout(reactivationTimerHandler);
  clearTimeout(animationHandler);
}
function deactivateConfetti(){
  confettiActive = !1;
  clearTimers();
}
function stopConfetti(){
  animationComplete = !0;
  null != ctx && ctx.clearRect(0,0,W,H);
}
function restartConfetti(){
  clearTimers();
  stopConfetti();
  reactivationTimerHandler = setTimeout(function(){
    confettiActive = !0;
    animationComplete = !1;
    initializeConfetti()
  }, 100);
}

function start () {
  restartConfetti();
}

function stop () {
  deactivateConfetti();
}

function repositionParticle(t, positionX, positonY, deltaR){
  t.x = positionX;
  t.y = positonY;
  t.deltaR = deltaR;
}

function checkForReposition(t, i) {
  (t.x > W+20 || t.x < -20 || t.y > H) && confettiActive &&
  (i % 5 > 0 || i % 2 == 0 ?
  repositionParticle(t, Math.random()*W, -10, randomRange(0, 10, -10)) :
  Math.sin(angle) > 0 ?
  repositionParticle(t, -5, Math.random()*H, randomRange(0, 10, -10)) :
  repositionParticle(t, W+5, Math.random()*H, randomRange(0, 10, -10)))
}
function stepParticle(t, i) {
  t.particleAngle += t.particleAngleInc;
  t.y += (Math.cos(angle + t.d) + 3 + t.r/2)/2;
  t.x += Math.sin(angle);
  t.deltaR = 15*Math.sin(t.particleAngle - i/3)
}

function updatePartical(){
  let i = 0;
  angle += .01;
  particleAngle += .1;
  for(let n = 0; n < mp; n++){
    let t = particles[n];
    if(animationComplete) return;
    if(!confettiActive && t.y < -15) {
      t.y = H + 100;
    } else {
      if(t.y <= H) {
        i++
      }
      stepParticle(t, n);
      // console.log('i', i)
      checkForReposition(t, n);
    }
  }
  // console.log('outer i', i, particles.length)
  0===i && stopConfetti()
}

function drawPartical(){
  ctx.clearRect(0, 0, W, H);
  for(let i = 0; i < mp; i++) {
    particles[i].draw();
  };
  updatePartical();
}

function startConfetti() {
  (function t() {
    animationComplete ? null :
    (animationHandler = requestAnimFrame(t), drawPartical())
  })();
}

function setGlobals(){
  canvas1 = document.getElementById("canvas");
  ctx = canvas1.getContext("2d");
  W = window.innerWidth;
  H = window.innerHeight;
  canvas1.width = W;
  canvas1.height = H;
}
function initializeConfetti(){
  particles = [];
  animationComplete = !1;
  for(let t = 0; t < mp; t++) {
    const color = particleColors.getColor();
    particles.push(new confettiParticle(color));
  }
  startConfetti();
}
function canvasResize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas1.width = W;
  canvas1.height = H;
}
onMounted(() => {
  setGlobals();
  initializeConfetti();
  window.addEventListener('resize', canvasResize)
})
onUnmounted(() => {
  console.log('onUnmounted')
  window.removeEventListener('resize', canvasResize)
})
</script>
<template>
  <div class="home-wrapper">
    <canvas id="canvas" width="1168" height="936"></canvas>
    <div class="button-group">
      <button @click="start">Start</button>
      <button @click="stop">Stop</button>
    </div>
    <p>{{ title }}</p>
  </div>
</template>
<style lang="less" scoped>
.home-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  p {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    color: #75c82b;
    font-size: 2.5rem;
    white-space: nowrap;
  }
}
#canvas {
  display: block;
  position: relative;
  z-index: 1;
  pointer-events: none;
  position: fixed;
  top: 0;
  // background: #222;
}
.button-group {
  position: fixed;
  padding: 12px;
  button {
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 4px;
    padding: 4px 12px;
    margin-right: 10px;
    color: #fff;
    &:first-child {
      background: #75c82b;
    }
    &:last-child {
      background: #FF3333;
    }
  }
}
</style>