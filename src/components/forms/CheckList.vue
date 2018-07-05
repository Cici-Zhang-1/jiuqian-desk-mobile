<template>
  <div class="form-check">
    <input class="form-check-input" type="checkbox" v-model="checkList.checked" :name="checkListName" :id="checkId">
    <label class="form-check-label" :for="checkId">
      {{ checkList.label }}
    </label>
  </div>
</template>

<script>

export default {
  name: 'CheckList',
  props: ['checkList', 'checkListName', 'checkListId'],
  data () {
    return {checkId: this.checkListName + this.checkListId}
  }
}
</script>
