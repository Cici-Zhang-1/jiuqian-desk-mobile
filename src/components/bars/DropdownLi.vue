<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i :class="[app.img]"></i>{{ app.label || app.name }}</a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
      <a class="dropdown-item" v-for="(child, key, index) in app.children" :href="'#' + child.url" :data-index="child.displayorder" :key="index"><i :class="[child.img]"></i>{{ child.label || child.name }}</a>
    </div>
  </li>
</template>

<script>
export default {
  name: 'dropdown-li',
  props: {
    app: {
      required: true
    }
  }
}
</script>
