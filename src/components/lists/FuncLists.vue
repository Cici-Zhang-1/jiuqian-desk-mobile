<template>
  <div class="row my-3">
    <div class="col-12">
      <ul class="list-group">
        <li is="list" v-for="(value, key, index) in funcList" :list="value" :key="index" class="list-group-item">
          <router-link slot="listItem" slot-scope="props" :to="props.listItem.url">
            <div class="d-flex flex-row">
              <div class="p-1"><i :class="[value.img]"></i>{{ props.listItem.name }}</div>
              <div class="p-1 ml-auto"><i class="fa fa-angle-right"></i></div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import List from './List.vue'

export default {
  name: 'FuncLists',
  props: ['funcList'],
  components: {
    List
  }
}
</script>
