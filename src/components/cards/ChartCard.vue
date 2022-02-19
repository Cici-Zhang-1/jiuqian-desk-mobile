<template>
  <div class="col-md-12 mb-2">
    <div class="card">
      <div class="card-header" @click="fetchData()">{{ home.label }}</div>
      <div class="card-body">
        <i class="fa fa-spinner fa-spin fa-5x" v-if="loading"></i>
        <div class="j-dashboard" :id="id" v-else></div>
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
  name: 'ChartCard',
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
      chartsData: [],
      loading: false
    }
  },
  computed: {
    id () {
      return nameToId('chart') + uuid()
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
      this.loading = true
      let postReturn = await service.post(url)
      if (postReturn.code === 0) {
        this.chartsData = postReturn.contents.list
      } else {
        this.chartsData = []
      }
      this.loading = false
    },
    setOption () {
      let series = []
      let seriesO = {}
      if ((this.chartsData instanceof Array && this.chartsData.length !== 0) || JSON.stringify(this.chartsData) !== '{}') {
        for (let i in this.chartsData) { // xAxis
          if ($.inArray(i, this.xAxis) < 0) {
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
              if ($.inArray(k, this.legend) < 0) {
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
.j-dashboard {
  min-height: 600px;
  height: auto;
}
</style>
