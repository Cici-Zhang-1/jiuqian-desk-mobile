<template>
  <div class="scanned-info">
    <ul>
      <li :class="{'abnormity': previous.abnormity === '1'}">
        <ul>
          <li >{{ previous.qrcode }}</li>
          <li >{{ previous.remark }}</li>
        </ul>
      </li>
      <li :class="{'abnormity': current.abnormity === '1'}">
        <ul>
          <li >{{ current.qrcode }}</li>
          <li >{{ current.remark }}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ScanInfo',
  props: {
    scanning: {
      type: Object | Array
    }
  },
  data () {
    return {
      previous: {
      },
      current: {
      }
    }
  },
  created () {
    this.current = this.scanning
  },
  watch: {
    scanning: {
      handler: function (to, from) {
        this.previous = this.current
        this.current = to
      }
    }
  }
}
</script>

<style scoped>
  .scanned-info{
    z-index: 101;
    position: fixed;
    top: 400px;
    right: 20%;
    width: 60%;
    height: 300px;
    background-color: rgba(0,0,0,0);
    text-align: center;
    vertical-align: middle;
  }

  .scanned-info > ul{
    list-style:none;
    margin: 0px;
    padding: 0px;
  }

  .scanned-info > ul > li{
    float: left;
    width: 50%;
    margin: 0px;
    padding: 0px;
    color: red;
    font-size: 50px;
  }

  .scanned-info > ul >li:first-child{
    border-right: 5px dotted blue
  }

  .scanned-info > ul > li > ul{
    list-style:none;
    margin: 0px;
    padding: 0px;
  }

  .scanned-info > ul > li > ul > li{
    font-weight: bold;
    word-wrap: break-word;
  }

  .scanned-nums .abnormity, .scanned-info .abnormity{
    color: fuchsia;
  }
</style>
