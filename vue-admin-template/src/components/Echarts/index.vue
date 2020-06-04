<template>
  <div :id="id" :style="chartStyle" />
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    id: {
      type: String,
      default: 'sss'
    },
    chartStyle: {
      type: Object,
      default() {
        return {
          width: '300px',
          height: '300px'
        }
      }
    },
    option: {
      type: Object,
      default() {
        return {}
      }
    },
    resize: {
      type: Boolean,
      default: true
    },
    notMerge: {
      type: Boolean,
      default: false
    },
    lazyUpdate: {
      type: Boolean,
      default: false
    },
    silent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myCharts: ''
    }
  },
  watch: {
    option: {
      handler(val) {
        if (val) {
          this.myCharts.setOption(val, this.notMerge, this.lazyUpdate, this.silent)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.myCharts = echarts.init(document.getElementById(this.id))
    this.myCharts.setOption(this.option, this.notMerge, this.lazyUpdate, this.silent)
    if (this.resize) {
      window.addEventListener('resize', () => {
        this.myCharts.resize()
      })
    }

    this.$emit('getChartInstance', this.myCharts)
  }
}
</script>

<style lang="scss" scoped>
</style>
