<template>
  <div :id="id" :style="chartStyle"></div>
</template>

<script>
import echarts from 'echarts';
export default {
  data() {
    return {
      myCharts: ''
    }
  },
  props: {
    id: {
      type: String,
      default: 'sss'
    },
    chartStyle: {
      type: Object,
      default: function() {
        return {
          width: '300px',
          height: '300px'
        }
      }
    },
    option: {
      type: Object,
      default: function() {
        return {}
      }
    },
    notMerge: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  },
  mounted() {
    this.myCharts = echarts.init(document.getElementById(this.id))
    this.myCharts.clear()
    this.myCharts.setOption(this.option, this.notMerge)
    this.$emit('getChartInstance', this.myCharts)
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.myCharts.resize()
      }, 100)
    })
  },
  watch: {
    option: {
      handler(val) {
        if (val) {
          this.myCharts.clear()
          this.myCharts.setOption(val, this.notMerge)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>