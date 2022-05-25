<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  iconClass: string,
  className?: string,
  color?: string,
  iconSize?: (string | number)
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  color: 'red',
  iconSize: 14
})

const iconName = computed(() => `#icon-${props.iconClass}`)
const svgClass = computed(() => {
  if (props.className) {
    return 'svg-icon ' + props.className
  } else {
    return 'svg-icon'
  }
})
</script>

<template>
  <svg
    :class="['svg-class', svgClass]"
    :style="{
      width: iconSize + 'px',
      height: iconSize + 'px'
    }"
    aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<style lang="less" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-class {
  vertical-align: middle;
  margin-right: 5px;
}
</style>
