<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string;
  description?: string;
  pay?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  pay: '200￥'
})

</script>

<template>
  <div class="card">
    <div class="left">
      <p>
        <i>￥</i>
        <span>100</span>
      </p>
      <p>限时8折</p>
    </div>
    <div class="right">
      <svg-icon icon-class="game" icon-size="32"></svg-icon>{{ title }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  border-radius: 8px;
  height: 80px;
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all .3s ease-in-out;
  &:hover {
    transform: translateX(12px);
  }
  .left {
    display: flex;
    flex-direction: column;
    flex: 1 1 100px;
    height: 100%;
    border-radius: 8px;
    background: radial-gradient(circle at 0% 0%, #f26927 0px 100%) 0% 0%/50% 70%,
    radial-gradient(circle at 0% 100%, #ffcca8 0px 100%) 0% 100%/50% 30%,
    radial-gradient(circle at 100% 0%, transparent 0px 8px, #f26927 8px 100%) 100% 0%/50% 70%,
    radial-gradient(circle at 100% 100%, transparent 0px 8px, #ffcca8 8px 100%) 100% 100%/50% 30%;
    background-repeat: no-repeat;
    // background-size: 50% 50%;
    p {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    p:first-child {
      flex: 3 3 auto;
      color: #fff;
      font-size: 1.5rem;
    }
    p:last-child {
      flex: 1 1 auto;
      color: #a63a08;
      font-size: .8rem;
    }
  }
  .right {
    display: flex;
    flex: 2 2 200px;
    height: 100%;
    border-radius: 8px;
    background: radial-gradient(circle at 100% 0%, #fff 0px 100%) 100% 0%,
    radial-gradient(circle at 100% 100%, #fff 0px 100%) 100% 100%,
    radial-gradient(circle at 0% 0%, transparent 0px 8px, #fff 8px 100%) 0% 0%,
    radial-gradient(circle at 0% 100%, transparent 0px 8px, #fff 8px 100%) 0% 100%;
    background-repeat: no-repeat;
    background-size: 50% 50%;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    color: #666;
  }
}
</style>
