<script>
export default {
  name: 'FuraLabel',
  props: {
    /** Representa Label como requerido. */
    required: { type: Boolean, default: false },
    /** Representa Label como deshabilitado. */
    disabled: { type: Boolean, default: false }
  }
}
</script>

<template>
  <label
    :class="{
      'fura-required': required,
      'fura-disabled': disabled
    }"
  >
    <!-- @slot Contenido de Label. -->
    <slot />
  </label>
</template>

<style lang="less" scoped src="./label.less"></style>

<docs>
<fura-label v-text="'I\'m a Label'" />
</docs>

<docs>
<fura-label
  required
  v-text="'I\'m a required Label'"
/>
</docs>

<docs>
<fura-label
  disabled
  v-text="'I\'m a disabled Label'"
/>
</docs>

<docs>
<fura-label
  required
  disabled
  v-text="'I\'m a required and disabled Label'"
/>
</docs>
