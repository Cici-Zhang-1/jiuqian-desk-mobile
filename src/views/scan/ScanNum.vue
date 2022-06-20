<template>
  <div class="scanned-nums">
    <p><span>{{ unCheck }}</span><span>{{ packNum }}</span></p>
    <p><span>{{ checking }}</span><span>{{ num }}</span></p>
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
    },
    checking: {
      type: Number
    },
    packNum: {
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
    width: 25%;
    height: 200px;
    background-color: rgba(0,0,0,0);
    text-align: center;
    vertical-align: middle;
  }
  .scanned-nums p{
    margin: 0;
    font-weight: bold;
    line-height: 0.9;
  }

  .scanned-nums p:first-child{
    font-size: 50px;
  }
  .scanned-nums p:first-child span{
    display: inline-block;
    text-align: center;
    width: 50%;
  }
  .scanned-nums p:first-child span:first-child{
    color: blueviolet;

  }
  .scanned-nums p:first-child span:last-child{
    color: green;
  }
  .scanned-nums p:last-child span:first-child{
    color: red;
    font-size: 200px;
  }

  .scanned-nums p:last-child span:last-child{
    color: blue;
    font-size: 50px;
  }

  .scanned-nums .abnormity, .scanned-info .abnormity{
    color: fuchsia;
  }
</style>
