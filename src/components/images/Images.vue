<template>
  <div>
    <img class="card-img-bottom" v-for="(image, key, index) in images" :key="index" :alt="image.name" :src="image.url" />
  </div>
</template>

<script>
export default {
  name: 'Images',
  props: {
    images: {
      type: Object | Array,
      required: true
    }
  }
}
</script>
