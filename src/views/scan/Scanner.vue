<template>
  <div class="scanner">
    <transition name="scanner"
      v-on:after-enter="afterEnter"
      v-on:after-leave="afterLeave">
      <p v-if="show"><span>上次扫描：{{ lastScanner }}</span></p>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Scanner',
  props: {
    lastScanner: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.show = true
  },
  methods: {
    afterEnter: function (el) {
      this.show = false
    },
    afterLeave: function (el) {
      this.show = true
    }
  }
}
</script>

<style scoped>
  .scanner{
    z-index: 101;
    position: fixed;
    top: 10px;
    right: 20%;
    width: 60%;
    height: 40px;
    background-color: rgba(0,0,0,0);
    text-align: center;
    vertical-align: middle;
  }
  .scanner p{
    margin: 0px;
    font-weight: bold;
  }
  .scanner p span{
    color: #00cc00;
    font-size: 40px;
  }
  .scanner-enter-active {
    animation: scanner-in 3s;
  }
  .scanner-leave-active {
    animation: scanner-in 3s reverse;
  }
  @keyframes scanner-in {
    from {
      transform: scale(.5, .5);
    }
    to {
      transform: scale(1.5, 1.5);
    }
  }
</style>
