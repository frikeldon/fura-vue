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
    label: { type: String, default: '' },
    /**
     * Posición de la etiqueta con respecto al Spinner.
     * @values top, right, bottom, left
     */
    labelPosition: {
      type: String,
      default: 'bottom',
      validator: value => !value || ['top', 'right', 'bottom', 'left'].includes(value)
    }
  },
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tamaño.
     * @param size Tamaño (xSmall, small, medium, large).
     * @return Nombre de la clase CSS que corresponde al tamaño.
     */
    getSizeClass (size) {
      return ['xSmall', 'small', 'medium', 'large'].includes(size)
        ? `fura-${size}`
        : null
    },
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada posición de la etiqueta.
     * @param position Posición (top, right, bottom, left).
     * @return Nombre de la clase CSS que corresponde a la posición.
     */
    getLabelPositionClass (position) {
      return ['top', 'right', 'bottom', 'left'].includes(position)
        ? `fura-${position}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-spinner"
    :class="[getSizeClass(size), getLabelPositionClass(labelPosition)]"
  >
    <div class="fura-circle" />
    <div
      v-if="label"
      class="fura-label"
      v-text="label"
    />
  </div>
</template>

<style lang="less" scoped src="./spinner.less"></style>
