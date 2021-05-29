<script>
export default {
  name: 'FuraSpinner',
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
  },
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tamaño.
     * @param align Tamaño (xSmall, small, medium, large).
     * @return Nombre de la clase CSS que corresponde al tamaño.
     */
    getSizeClass (size) {
      return ['xSmall', 'small', 'medium', 'large'].includes(size)
        ? `fura-${size}`
        : null
    }
  }
}
</script>

<template>
  <div :class="getSizeClass(size)">
    <div class="fura-circle" />
    <div
      v-if="label"
      class="fura-label"
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
