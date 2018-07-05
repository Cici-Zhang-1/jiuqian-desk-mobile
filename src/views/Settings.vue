<template>
  <div class="container-fluid">
    <main>
      <div class="row">
        <div class="col">
          <setting-bar />
        </div>
      </div>
      <div class="row">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script type="module">
import SettingBar from '@/components/bars/SettingBar'

export default {
  name: 'Settings',
  components: {
    SettingBar
  }
}
</script>
