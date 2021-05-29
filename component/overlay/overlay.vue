<script>
export default {
  name: 'FuraOverlay',
  props: {
    /** Indica si Overlay se dibuja oscuro. */
    dark: { type: Boolean, default: false },
    /** Indica si Overlay tiene position fixed en vez de absolute */
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
    <!-- @slot El contenido de Overlay -->
    <slot />
  </div>
</template>

<style lang="less" scoped src="./overlay.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        visibleLight: false,
        visibleDark: false
      }
    }
  }
</script>
<template>
  <div style="position: relative; height: 100%;">
    <div>
      <fura-button
        text="Show light overlay"
        @click="visibleLight = true"
      />
    </div>
    <div>
      <fura-button
        text="Show dark overlay"
        @click="visibleDark = true"
      />
    </div>
    <fura-overlay v-if="visibleLight">
      <fura-button
        text="Dismiss"
        @click="visibleLight = false"
      />
    </fura-overlay>
    <fura-overlay v-if="visibleDark" dark>
      <fura-button
        text="Dismiss"
        @click="visibleDark = false"
      />
    </fura-overlay>
  </div>
</template>
</docs>
