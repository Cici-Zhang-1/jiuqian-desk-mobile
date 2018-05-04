<template>
  <li class="list-group-item">
    <slot name="listItem" :listItem="list"></slot>
  </li>
</template>

<script>
export default {
  name: 'List',
  props: ['list']
}
</script>
