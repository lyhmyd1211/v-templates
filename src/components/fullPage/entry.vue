<template>
  <div class="fp-content" :class="className" ref="fp-con">
    <slot></slot>
    <div @click="fClick" class="fp-btn" :class="btnClassName" :title="isOpenIcon?'全屏':'退出全屏'">
      <slot name="btn">
        <img
          :src="require(isOpenIcon?'../../assets/fullpage/full.png':'../../assets/fullpage/close.png')"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import { fullScreen } from '@/utils'
export default {
  props: {
    className: {
      type: String,
      default() {
        return ''
      }
    },
    btnClassName: {
      type: String,
      default() {
        return ''
      }
    },

  },
  data() {
    return {
      isOpenIcon: true
    }
  },
  methods: {
    fClick() {
      this.isOpenIcon = !this.isOpenIcon
      fullScreen(this.$refs['fp-con'])
    }
  }
}
</script>

<style lang="scss" scoped>
.fp-btn {
  z-index: 3000;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 30px;
}
</style>