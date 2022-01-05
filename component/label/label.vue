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
