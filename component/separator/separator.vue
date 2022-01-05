<script>
export default {
  name: 'FuraSeparator',
  props: {
    alignContent: {
      type: String,
      default: null,
      validator: alignContent => alignContent === null || ['start', 'center', 'end'].includes(alignContent)
    },
    /** Indica si el separador se dibuja verticalmente. */
    vertical: { type: Boolean, default: false }
  },
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada alineamiento.
     * @param align Alineamiento (start, center, end).
     * @return Nombre de la clase CSS que corresponde al alineamiento.
     */
    getAlignClass (align) {
      return ['start', 'center', 'end'].includes(align)
        ? `fura-${align}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-separator"
    :class="[
      getAlignClass(alignContent),
      vertical ? 'fura-vertical' : 'fura-horizontal'
    ]"
  >
    <div class="fura-content">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped src="./separator.less"></style>
