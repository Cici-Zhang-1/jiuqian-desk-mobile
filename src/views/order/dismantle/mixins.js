import $ from 'jquery'
import { M_ONE, M_TWO, MIN_AREA, MIN_M_AREA, MIN_K_AREA } from '@/assets/js/constants'
import { cloneData } from '@/assets/js/custom'
let dismantleMixins = {
  methods: {
    computeArea (e, Type = '') {
      let Data = this.activeOrderProduct['order_product_board_plate'][$(e.target).parents('tr').eq(0).find('input[name="index"]').val()]
      let Area = Math.ceil(Data['width'] * Data['length'] / M_ONE) / M_TWO
      if (Type === 'M') {
        if (Area < MIN_M_AREA) {
          Area = MIN_M_AREA
        }
      } else if (Type === 'K') {
        if (Area < MIN_K_AREA) {
          Area = MIN_K_AREA
        }
      } else {
        if (Area < MIN_AREA) {
          Area = MIN_AREA
        }
      }
      Data['area'] = Area
    },
    copy (Target) { // 复制一行内容
      let self = this
      $('#' + Target + ' tbody tr input[name="copy"]').off('change.copy').on('change.copy', function (i, v) {
        let copy = $(this).val()
        if (copy > 0) {
          let Index = $(this).parents('tr').eq(0).find('input[name="index"]').val()
          let Data = self.activeOrderProduct['order_product_board_plate'][Index]
          if (Data === undefined) {
            Data = self.demoData
          }
          let C = {}
          for (let I = 0; I < copy; I++) {
            C = cloneData(Data)
            if (C.qrcode !== null && C.qrcode !== undefined) {
              C.qrcode = ''
              C.bd_file = ''
            }
            self.activeOrderProduct['order_product_board_plate'].splice(Index, 0, C)
          }
          self.maxNum = self.activeOrderProduct['order_product_board_plate'].length + 1
          $(this).val(0)
        }
      })
    },
    addLine (Target) { // 新建一行
      let self = this
      $('#' + Target + ' tbody tr:last').off('click.addLine').on('click.addLine', function (i, v) {
        self.activeOrderProduct['order_product_board_plate'].push(cloneData(self.demoData))
        self.maxNum = self.activeOrderProduct['order_product_board_plate'].length + 1
        $(this).find('input:focus').blur()
      })
    },
    newLine () {
      this.activeOrderProduct['order_product_board_plate'].push(cloneData(this.demoData))
      this.maxNum = this.activeOrderProduct['order_product_board_plate'].length + 1
    },
    removeLine (e) {
      this.activeOrderProduct['order_product_board_plate'].splice($(e).data('index'), 1)
    },
    highlightTr (Target) { // 高亮选中一行
      $('#' + Target).find('tbody tr').each(function (i, v) {
        $(this).off('click.highlight').on('click.highlight', function (e) {
          $(this).addClass('table-success').siblings().removeClass('table-success')
        })
      })
    },
    handleDirection (Target) {
      let TableRowInputNums = $('#' + Target + ' tbody tr:last').find('input:not(:hidden), select').length
      let $TableAllInputs = $('#' + Target + ' tbody').find('input:not(:hidden), select')
      let TableAllInputNums = $TableAllInputs.length
      $TableAllInputs.each(function (i, v) {
        $(this).off('keydown.dir').on('keydown.dir', function (e) {
          let Key = e.keyCode
          let N
          switch (Key) {
            case 37: // 左
              N = i - 1
              if (N >= 0) {
                $TableAllInputs.get(N).focus()
              }
              break
            case 38: // 上
              N = i - TableRowInputNums
              if (N >= 0) {
                $TableAllInputs.get(N).focus()
              }
              break
            case 39: // 右
              N = i + 1
              if (N < TableAllInputNums) {
                $TableAllInputs.get(N).focus()
              }
              break
            case 40: // 下
              N = i + TableRowInputNums
              if (N < TableAllInputNums) {
                $TableAllInputs.get(N).focus()
              }
              break
          }
        })
      })
    }
  }
}

export { dismantleMixins }
