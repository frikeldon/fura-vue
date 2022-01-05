<script>
export default {
  name: 'FuraOverlay',
  props: {
    /** Indica si Overlay se dibuja oscuro. */
    dark: { type: Boolean, default: false },
    /** Indica si Overlay tiene position fixed en vez de absolute. */
    fixed: { type: Boolean, default: false }
  }
}
</script>

<template>
  <div
    class="fura-overlay"
    :class="{
      'fura-dark': dark,
      'fura-fixed': fixed
    }"
  >
    <!-- @slot El contenido de Overlay. -->
    <slot />
  </div>
</template>

<style lang="less" scoped src="./overlay.less"></style>
