<template>
  <nav aria-label="Page navigation">
    <ul class="pagination pagination-lg justify-content-center m-0">
      <li class="page-item" :class="{disabled: previous}">
        <router-link class="page-link" :to="previousRouter" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
          <span class="sr-only">Previous</span>
        </router-link>
      </li>
      <li class="page-item active"><a class="page-link" href="javascript:void(0);">{{ page }}/{{ maxPage }}共{{ num }}条<span class="sr-only">(current)</span></a></li>
      <li class="page-item" :class="{disabled: next}">
        <router-link class="page-link" :to="nextRouter" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    },
    num: {
      type: Number,
      default: 0
    },
    pagesize: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      path: this.$router.currentRoute.path
    }
  },
  computed: {
    previous () {
      return this.page === 1
    },
    next () {
      return this.page === this.maxPage
    },
    previousRouter () {
      return this.path + '?page=' + (this.page - 1)
      // return this.path + '?page=' + (this.page - 1) + '&num=' + this.num + '&pn=' + this.maxPage + '&pagesize=' + this.pagesize
    },
    nextRouter () {
      return this.path + '?page=' + (this.page + 1)
      // return this.path + '?page=' + (this.page + 1) + '&num=' + this.num + '&pn=' + this.maxPage + '&pagesize=' + this.pagesize
    }
  }
}
</script>
