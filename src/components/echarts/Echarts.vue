<template>
  <div>
    <div class="j-echarts" :id="id"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
// const echarts = () => import('echarts/lib/echarts')
// const bar = () => import('echarts/lib/chart/bar')
// const line = () => import('echarts/lib/chart/line')
// const toolbox = () => import('echarts/lib/component/toolbox')
// const tooltip = () => import('echarts/lib/component/tooltip')
// const legend = () => import('echarts/lib/component/legend')
// const axis = () => import('echarts/lib/component/axis')
// const title = () => import('echarts/lib/component/title')
// import * as echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/chart/line'
// import 'echarts/lib/component/toolbox'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/axis'
// import 'echarts/lib/component/title'
// let echarts = require('echarts/lib/echarts')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/line')
// require('echarts/lib/component/toolbox')
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/legend')
// require('echarts/lib/component/axis')
// require('echarts/lib/component/title')

export default {
  name: 'Echarts',
  props: {
    'yAxis': {
      type: String
    },
    'chartsData': {
      type: Object | Array,
      required: true
    },
    'id': {
      type: String,
      required: true
    }
  },
  data () {
    return {
      'xAxis': [],
      'legend': [],
      echartsIns: null
    }
  },
  mounted () {
    this.echartsIns = echarts.init(document.getElementById(this.id))
    this.setOption()
  },
  methods: {
    setOption () {
      let series = []
      let seriesO = {}
      if ((this.chartsData instanceof Array && this.chartsData.length !== 0) || JSON.stringify(this.chartsData) !== '{}') {
        for (let i in this.chartsData) { // xAxis
          // if ($.inArray(i, this.xAxis) < 0) {
          if (!this.xAxis.includes(i)) {
            this.xAxis.push(i)
          }
          for (let j in this.chartsData[i]) {
            for (let k in this.chartsData[i][j]) { // k == legend
              if (seriesO[k] === undefined) {
                seriesO[k] = {
                  name: k,
                  type: 'bar',
                  stack: j,
                  label: {
                    show: true,
                    formatter (p) {
                      return p.value >= 1 ? p.seriesName + ': ' + p.value : ''
                    }
                  },
                  data: {}
                }
              }
              // if ($.inArray(k, this.legend) < 0) {
              if (!this.legend.includes(k)) {
                this.legend.push(k)
              }
              seriesO[k].data[i] = this.chartsData[i][j][k]
            }
          }
        }
        let Tmp = []
        for (let j in seriesO) {
          Tmp = []
          for (let k in this.xAxis) {
            if (seriesO[j].data[this.xAxis[k]] === undefined) {
              Tmp.push(0)
            } else {
              Tmp.push(seriesO[j].data[this.xAxis[k]])
            }
          }
          seriesO[j].data = Tmp
          series.push(seriesO[j])
        }
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          legend: {
            data: this.legend,
            top: 0
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                rotate: 45
              },
              data: this.xAxis
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: this.yAxis
            }
          ],
          series: series
        }
        this.echartsIns.setOption(option)
      }
    }
  }
}
</script>

<style scoped>
  .j-echarts {
    margin-top: 50px;
    min-height: 600px;
    height: auto;
  }
</style>
