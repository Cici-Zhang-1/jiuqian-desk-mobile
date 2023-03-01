<template>
  <div class="modal fade" id="qualificationModal" tabindex="-1" role="dialog" aria-labelledby="QualificationModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body text-center">
          <p class="enhance">{{ msg }}</p>
          <p class="enhance" v-if="sec > 0">{{ sec }}s</p>
          <audio id="qualificationWrongAudio" preload="auto" loop="loop">
            <source :src="audioLink('wrong')" type="audio/mpeg" />
          </audio>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="qualificationModalClose" data-dismiss="modal" @click="$emit('hidden-modal', $event.target)">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { baseUrl } from '@/axios/env'

export default {
  name: 'ScanBoardModal',
  props: {
    nonExist: {
      type: Boolean
    },
    number: {
      type: Number
    },
    qrcode: {
      type: String
    },
    scanning: {
      type: Object | Array
    }
  },
  data () {
    return {
      msg: '',
      sec: 0,
      timer: null,
      sure: false,
      audio: null
    }
  },
  mounted () {
    let self = this
    $('#qualificationModal').on('hidden.bs.modal', function (e) {
      self.clearTimer(self)
      self.pauseAudio(self)
    })
  },
  watch: {
    nonExist: {
      handler: function (to, from) {
        this.sure = false
        this.msg = this.qrcode + '不是该订单内部件'
        $('#qualificationModal').modal({backdrop: 'static', keyword: false}).modal('show')
        this.audio = document.getElementById('qualificationWrongAudio')
        this.playAudio()
      }
    }
  },
  methods: {
    autoClose () {
      let self = this
      this.sec = 5
      this.timer = setInterval(() => {
        self.sec--
      }, 1000)
      setTimeout(function () {
        self.clearTimer(self)
        $('#qualificationModalSure').focus()
      }, 5000)
    },
    clearTimer (self) {
      self.sec = 0
      clearInterval(self.timer)
      self.timer = null
    },
    audioLink (type) {
      return baseUrl + '/style/audio/' + type + '.mp3'
    },
    playAudio () {
      this.audio.currentTime = 0
      this.audio.play()
    },
    pauseAudio (self) {
      self.audio.currentTime = 0
      self.audio.pause()
    }
  }
}
</script>

<style scoped>
 .enhance {
   font-size: larger;
   font-weight: bolder;
 }
</style>
