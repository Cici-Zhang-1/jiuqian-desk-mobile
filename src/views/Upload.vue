<template>
  <div class="row mt-3 j-page" id="upload">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          上传
        </div>
        <div class="card-body p-0 card-body-h">
          <div id="cfupdate" style="margin: auto;"></div>
          <div id="show" style="margin-top: 20px; width: 500px; text-align: left;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from '@/axios/env'
export default {
  name: 'Upload',
  mounted () {
    /* eslint-disable */
    var c = new CFUpdate()
    c.style(challsFlashStyle())
    c.update(challsFlashUpdate())
    c.language(challsFlashLanguage())
    c.setEventComplete(challsFlashOnComplete, this)
    c.setEventCompleteData(challsFlashOnCompleteData, this)
    c.setEventError(challsFlashOnError, this)
    c.setAlert(challsFlashAlert, this)
    c.setEventStatistics(challsFlashOnStatistics, this)
    c.setEventSelectFile(challsFlashOnSelectFile, this)
    c.setDeleteAllFiles(challsFlashDeleteAllFiles, this)
    c.setEventStart(challsFlashOnStart, this)
    c.start(document.getElementById('cfupdate'), '100%', 300)
    function challsFlashOnComplete (a) {
      var name = a.fileName
      var size = a.fileSize
      var time = a.updateTime
      var type = a.fileType
      document.getElementById('show').innerHTML = name + ' --- ' + size + '字节 ----文件类型：' + type + '--- 用时 ' + (time / 1000) + '秒<br><br>' + document.getElementById('show').innerHTML
    }

    function challsFlashOnCompleteData (a) {
      a = JSON.parse(a)
      document.getElementById('show').innerHTML = '<font color="#ff0000">服务器端反馈信息：</font><br />' + a.message + '<br />' + document.getElementById('show').innerHTML
    }

    function challsFlashOnStart (a) {
      var name = a.fileName
      document.getElementById('show').innerHTML = name + '开始上传！<br />' + document.getElementById('show').innerHTML
      return true
    }

    function challsFlashOnStatistics (a) {
    }

    function challsFlashAlert (a) {
      document.getElementById('show').innerHTML = '<font color="#ff0000">组件提示：</font>' + a + '<br />' + document.getElementById('show').innerHTML
    }

    function challsFlashOnSelectFile (a) {
      document.getElementById('show').innerHTML += '<font color="#ff0000">文件选择完成：</font>等待上传文件' + a + '个！<br />'
    }

    function challsFlashDeleteAllFiles () {
      return confirm('你确定要清空列表吗?')
    }

    function challsFlashOnError (a) {
      var err = a.textErr
      var name = a.fileName
      document.getElementById('show').innerHTML = '<font color="#ff0000">' + name + ' - ' + err + '</font><br />' + document.getElementById('show').innerHTML
    }

    function challsFlashUpdate () {
      var a = {}
      a.title = '上传BD/PIC文件'
      a.FormName = 'uploadForm'
      a.url = baseUrl + '/order/upload/add'
      a.parameter = 'post'
      a.typefile = '*.bmp;*.gif;*.png;*.jpg;*.jpeg;*.bd;*.xls;*.xlsx;*.saw;'
      a.UpSize = 0
      a.fileNum = 0
      a.size = 2
      a.FormID = []
      a.autoClose = 1
      a.CompleteClose = true
      a.repeatFile = true
      a.MD5File = 1
      a.loadFileOrder = true
      a.mixFileNum = 0
      a.ListShowType = 1
      a.TitleSwitch = true
      a.ForceFileNum = 0
      a.autoUpload = false
      a.adjustOrder = true
      a.deleteAllShow = true
      a.countData = true
      a.isShowUploadButton = true
      a.isRotation = true
      a.isErrorStop = true
      return a
    }

    function challsFlashStyle () {
      var a = {}
      a.backgroundColor = ['#f6f6f6', '#f3f8fd', '#89BCF7']
      a.backgroundLineColor = '#5576b8'
      a.backgroundFontColor = '#066AD1'
      a.backgroundInsideColor = '#FFFFFF'
      a.backgroundInsideLineColor = ['#e5edf5', '#34629e']
      a.Top_backgroundColor = ['#e0eaf4', '#387BB2']
      a.Top_fontColor = '#245891'
      a.button_overColor = ['#FBDAB5', '#f3840d']
      a.button_overLineColor = '#e77702'
      a.button_overFontColor = '#ffffff'
      a.button_outColor = ['#ffffff', '#dde8fe']
      a.button_outLineColor = '#91bdef'
      a.button_outFontColor = '#245891'
      a.List_scrollBarColor = 0x000000
      a.List_scrollBarGlowColor = 0x34629e
      a.List_backgroundColor = '#EAF0F8'
      a.List_fontColor = '#333333'
      a.List_errFontColor = '#ff0000'
      a.List_LineColor = '#B3CDF1'
      a.List_cancelOverFontColor = '#ff0000'
      a.List_cancelOutFontColor = '#D76500'
      a.List_progressBarLineColor = '#B3CDF1'
      a.List_progressBarBackgroundColor = '#D8E6F7'
      a.List_progressBarColor = ['#FFCC00', '#FFFF00']
      a.Err_backgroundColor = '#C0D3EB'
      a.Err_fontColor = '#245891'
      a.Err_shadowColor = '#000000'
      return a
    }

    function challsFlashLanguage () {
      var a = {
        ButtonTxt_1: '停 止',
        ButtonTxt_2: '选择文件',
        ButtonTxt_3: '上 传',
        ButtonTxt_4: '清空',
        Font: '宋体',
        FontSize: 12,
        Alert_1: '初始化错误：\n\n没有找到 JAVASCRITP 函数 \n函数名为 challs_flash_update()',
        Alert_2: '初始化错误：\n\n函数 challs_flash_update() 返回类型必须是 "Object" 类型',
        Alert_3: '初始化错误：\n\n没有设置上传路径地址',
        Alert_4: '添加上传文件失败，\n\n不可以在添加更多的上传文件!',
        Alert_5: '添加上传文件失败，\n\n等待上传文件列表只能有$[1]$个，\n请先上传部分文件!',
        Alert_6: '提示信息：\n\n请再选择$[1]$个上传文件！',
        Alert_7: '提示信息：\n\n请至少再选择$[1]$个上传文件！',
        Alert_8: '请选择上传文件！',
        Alert_9: '上传错误：\n\n$[1]$',
        Txt_5: '等待上传',
        Txt_6: '等待上传：$[1]$个  已上传：$[2]$个',
        Txt_7: '字节',
        Txt_8: '总量限制（$[1]$MB）,上传失败',
        Txt_9: '文件超过$[1]$MB,上传失败',
        Txt_10: '秒',
        Txt_11: '保存数据中...',
        Txt_12: '上传完毕',
        Txt_13: '文件加载错误',
        Txt_14: '扫描文件...',
        Txt_15: '验证文件...',
        Txt_16: '取消',
        Txt_17: '无图',
        Txt_18: '加载中',
        Txt_20: '关闭',
        Txt_21: '确定',
        Txt_22: '上传文件',
        Err_1: '上传地址URL无效',
        Err_2: '服务器报错：$[1]$',
        Err_3: '上传失败,$[1]$',
        Err_4: '服务器提交效验错误',
        Err_5: '效验数据无效错误'
      }
      return a
    }
  }
}
</script>

<style scoped>

</style>
