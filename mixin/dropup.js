export default {
  data () {
    return {
      dropup: false
    }
  },
  watch: {
    open (open) {
      if (open) {
        const combo = this.$refs.base
        const { top, bottom } = combo.getViewportMargins()
        this.dropup = bottom < 253 && top > bottom
      }
    }
  }
}
