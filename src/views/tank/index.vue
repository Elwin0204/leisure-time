<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GameState, BulletType } from './core/const.ts';
import { Keyboard } from './core/keyboard.ts';
import { GamePlay } from './core/play.ts';

document.ready = function (callback) {
  // 兼容FF， Google
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false);
      callback();
    }, false)
  } else if (document.attachEvent) {
    // 兼容IE
    document.attachEvent('onreadystatechange', function () {
      document.detachEvent('onreadystatechange', arguments.callee);
      callback();
    });
  } else if (document.lastChild == document.body) {
    callback();
  }
}

let timerId = null;

onMounted(() => {
  // document.ready(function () {
  //   game.initScreen();
  //   game.initGlobalVariable();
  //   setInterval(game.gameLoop, 20);
  //   console.log('onmounted')
  // });
  GamePlay.initScreen();
  GamePlay.initGlobalVariable();
  timerId = setInterval(GamePlay.gameLoop, 20);
  console.log('onmounted')
  document.addEventListener('keydown', GamePlay.handleKeydown);
  document.addEventListener('keyup', GamePlay.handleKeyup);
})

onUnmounted(() => {
  clearInterval(timerId);
  document.removeEventListener('keydown', GamePlay.handleKeydown);
  document.removeEventListener('keyup', GamePlay.handleKeyup);
})

</script>
<template>
  <div class="container">
    <section class="tips">
      <p class="tip" style="fontSize: 20px;"><svg-icon icon-class="tips" icon-size="24"></svg-icon>操作說明：</p>
      <p class="tip"><svg-icon icon-class="shooting" icon-size="16"></svg-icon>射擊：enter鍵；上一關：p鍵；下一關：n鍵</p>
      <p class="tip"><svg-icon icon-class="player1" icon-size="16"></svg-icon>玩家1：wasd鍵控制方向；</p>
      <p class="tip"><svg-icon icon-class="player2" icon-size="16"></svg-icon>玩家2：方向鍵；</p>
    </section>
    <section class="main">
      <div id="JS_CanvasGroup">
        <canvas id="JS_WallCanvas"></canvas>
        <canvas id="JS_TankCanvas"></canvas>
        <canvas id="JS_GrassCanvas"></canvas>
        <canvas id="JS_OverCanvas"></canvas>
        <canvas id="JS_StageCanvas"></canvas>
      </div>
    </section>
  </div>
</template>
<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  // background: yellow;
  .tips {
    width: 512px;
    margin: 0 auto;
    padding-top: 100px;
    color: #666666;
    .tip:first-child {
      margin-bottom: 12px;
    }
    .tip {
      line-height: 1.5;
    }
  }
  .main {
    margin-top: 30px;
  }
}
#JS_CanvasGroup {
  position: relative;
  margin: 0 auto;
  canvas {
    position: absolute;
  }
}
</style>