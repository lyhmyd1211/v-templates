<template>
  <div
    :style="{width:baseWidth+'px',height:baseHeight+'px',transform: `scale(${baseWidth/1920})`}"
    class="v-ad-container"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    baseWidth: {
      type: Number,
      default() {
        return 1920
      }
    },
    baseHeight: {
      type: Number,
      default() {
        return 1080
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    selfAdaption() {
      var _this = this
      setTimeout(function () {
        window.onresize = function () {
          _this.baseWidth = document.body.offsetWidth
          _this.baseHeight = (document.body.offsetWidth * 1080) / 1920
        }
      }, 100)
    }
  },
  mounted() {
    this.selfAdaption()
  },
}
</script>

<style lang="scss" scoped>
.v-ad-container {
  transform-origin: left top;
  position: relative;
  transform: translate3d(0, 0, 0);
}
</style>