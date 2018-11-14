let pubMixins = {
  created () {
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
  },
  updated () {
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
  }
}

export { pubMixins }
