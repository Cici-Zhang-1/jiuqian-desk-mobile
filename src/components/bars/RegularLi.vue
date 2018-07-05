<template>
  <li class="nav-item">
    <a class="nav-link" :href="'#' + app.url" :data-index="app.displayorder"><i :class="[app.img]"></i>{{ app.label || app.name }} </a>
  </li>
</template>

<script>
export default {
  name: 'regular-li',
  props: {
    app: {
      required: true
    }
  }
}
</script>
