<template>
  <div class="col-md-12 mb-2">
    <div class="card">
      <div class="card-header" @click="fetchData()">{{ home.label }}</div>
      <div class="card-body p-0">
        <div class="j-dashboard" :id="id"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import service from '@/axios'
import $ from 'jquery'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/axis')
require('echarts/lib/component/title')

export default {
  name: 'HistogramCard',
  props: {
    home: {
      type: Object
    },
    update: {
      type: Boolean
    }
  },
  data () {
    return {
      card: {},
      xAxis: [],
      legend: [],
      histogramData: [],
      loading: false,
      echartsIns: null
    }
  },
  computed: {
    id () {
      return nameToId('histogram') + uuid()
    }
  },
  mounted () {
    this.echartsIns = echarts.init(document.getElementById(this.id))
    this.setOption()
  },
  created () {
    this.card = this.home.cards[0]
    this.fetchData()
  },
  watch: {
    update: {
      handler: function (to, from) {
        this.fetchData()
      }
    }
  },
  methods: {
    async fetchData (url = '') {
      url = url === '' ? this.card.url : url
      let postReturn = await service.post(url)
      if (postReturn.code === 0) {
        this.histogramData = postReturn.contents
      } else {
        this.histogramData = []
      }
      this.setOption()
    },
    setOption () {
      let series = []
      let seriesO = {}
      if (this.histogramData.p > 0) {
        for (let i in this.histogramData.content) { // xAxis
          if ($.inArray(i, this.xAxis) < 0) {
            this.xAxis.push(i)
          }
          for (let j in this.histogramData.content[i]) {
            if (seriesO[j] === undefined) {
              seriesO[j] = {
                name: j,
                type: 'bar',
                stack: i,
                data: {}
              }
            }
            if ($.inArray(j, this.legend) < 0) {
              this.legend.push(j)
            }
            seriesO[j].data[i] = this.histogramData.content[i][j]
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
                interval: 0
              },
              data: this.xAxis
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: this.histogramData.y_axis,
              splitNumber: 3
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
.j-dashboard {
  min-height: 200px;
  height: auto;
}
</style>
