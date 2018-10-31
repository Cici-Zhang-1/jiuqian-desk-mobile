<template>
  <div class="form-group col-md-2">
    <label>板材</label>
    <input class="form-control" name="board" type="text" v-model="dv" list="yBoard" placeholder="选择板材颜色" v-on:input="$emit('input', $event.target.value)" @focusout="$emit('focusout-board', $event.target.value)" @input="disposeBoard($event.target.value)"/>
    <datalist id="yBoard" v-if="boardData && boardData.num">
      <option v-for="(value, key, index) in boardData.content" :value="value.v" :key="index" v-if="value.show">{{ value.label || value.name || value.v }}</option>
    </datalist>
  </div>
</template>

<script>
export default {
  name: 'Board',
  props: {
    board: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      boardUrl: '/product/board/read',
      show: false
    }
  },
  computed: {
    dv: {
      get () {
        return this.board
      },
      set (value) {}
    },
    boardData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.boardUrl })
      }
    }
  },
  created () {
    this.loadBoardData()
  },
  methods: {
    loadBoardData () {
      if ((typeof this.boardData === 'undefined' || JSON.stringify(this.boardData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.boardUrl,
          configs: {},
          target: this.boardUrl
        })
      }
    },
    disposeBoard (input) {
      let i = 0
      let max = 10
      if (input && input.length > 0) {
        this.boardData.content.map(__ => {
          if (__.v.search(input) >= 0 && i++ < max) {
            __.show = true
          } else {
            __.show = false
          }
          return __
        })
      } else {
        this.boardData.content.map(__ => {
          __.show = false
          return __
        })
      }
    }
  }
}
</script>
