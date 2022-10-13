<script>
export default {
  name: 'FuraModal',
  props: {
    /** Indica si el dialogo se muestra en panalla. */
    open: { type: Boolean, default: false }
  },
  watch: {
    open (value) {
      if (value) this.$refs.dialog.showModal()
      else this.$refs.dialog.close()
    }
  },
  mounted () {
    if (this.open) this.$refs.dialog.showModal()
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    class="fura-dialog"
  >
    <slot />
  </dialog>
</template>

<style lang="less" scoped src="./modal.less"></style>
