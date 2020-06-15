<template>
  <full-page>
    <v-container class="container">
      <div class="left">
        <div class="box box-1">
          <echarts id="box-1-chart" :chartStyle="chartStyle" :option="option"></echarts>
        </div>
        <div class="box box-2">
          <echarts id="box-2-chart" :chartStyle="chartStyle" :option="option"></echarts>
        </div>
      </div>
      <div class="right">
        <div class="box box-3">
          <echarts id="box-3-chart" :chartStyle="chartStyle" :option="option"></echarts>
        </div>
        <div class="box box-4">
          <echarts id="box-4-chart" :chartStyle="chartStyle" :option="option"></echarts>
        </div>
      </div>
    </v-container>
  </full-page>
</template>

<script>
// import 
export default {
  data() {
    return {
      chartStyle: {
        width: '100%',
        height: '100%'
      },
      option: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #eee;
}
.left {
  float: left;
  height: 100%;
}
.right {
  float: right;
  height: 100%;
}
.box {
  width: 300px;
  height: 50%;
}
</style>