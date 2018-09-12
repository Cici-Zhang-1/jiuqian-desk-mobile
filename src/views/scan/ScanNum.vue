<template>
  <div class="scanned-nums">
    <p><span>{{ unCheck }}</span><span>{{ num }}</span></p>
  </div>
</template>

<script>
export default {
  name: 'ScanNum',
  props: {
    num: {
      type: Number
    },
    unCheck: {
      type: Number
    }
  }
}
</script>

<style scoped>
  .scanned-nums{
    z-index: 101;
    position: fixed;
    top: 160px;
    right: 40%;
    width: 20%;
    height: 200px;
    background-color: rgba(0,0,0,0);
    text-align: center;
    vertical-align: middle;
  }
  .scanned-nums p{
    margin: 0px;
    font-weight: bold;
  }

  .scanned-nums p span:first-child{
    color: red;
    font-size: 200px;
  }

  .scanned-nums p span:last-child{
    color: blue;
    font-size: 50px;
  }

  .scanned-nums .abnormity, .scanned-info .abnormity{
    color: fuchsia;
  }
</style>
