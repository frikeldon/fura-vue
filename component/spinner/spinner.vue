<script>
export default {
  props: {
    /**
     * El tamaño con el que se dibuja Spinner.
     * @values large, medium, small, xSmall
     */
    size: {
      type: String,
      default: 'medium',
      validator: value => !value || ['xSmall', 'small', 'medium', 'large'].includes(value)
    },
    /** El texto a mostrar debajo de Spinner. */
    label: { type: String, default: '' }
  }
}
</script>

<template>
  <div :class="size">
    <div class="circle" />
    <div
      v-if="label"
      class="label"
      v-text="label"
    />
  </div>
</template>

<style lang="less" scoped src="./spinner.less"></style>

<docs>
<fura-spinner
  size="large"
  label="Loading..."
/>
</docs>

<docs>
<fura-spinner size="xSmall" />
</docs>

<docs>
<fura-spinner size="small" />
</docs>

<docs>
<fura-spinner size="medium" />
</docs>

<docs>
<fura-spinner size="large" />
</docs>
