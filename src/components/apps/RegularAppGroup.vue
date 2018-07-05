<template>
  <div class="row mt-2">
    <div class="col-12">
      <h5 ><i class="fa-2x" :class="[appItem.img]"></i>{{ appItem.name }}</h5>
      <div class="w-75 border-bottom border-primary"></div>
      <div class="row mt-2 text-primary">
        <regular-app v-for="(value, index) in appItem.children" :app="value" :key="index"/>
      </div>
    </div>
  </div>
</template>

<script>
import RegularApp from '@/components/apps/RegularApp.vue'

export default {
  name: 'RegularAppGroup',
  props: ['appItem'],
  components: {
    RegularApp
  }
}
</script>
