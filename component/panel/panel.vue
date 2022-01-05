<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraPanel',
  components: { FuraIcon },
  props: {
    /**
     * El tipo de panel a mostrar.
     * @values custom, extraSmall, small, medium, large, extraLarge, fluid
     */
    type: {
      type: String,
      default: 'custom',
      validator: value => ['custom', 'extraSmall', 'small', 'medium', 'large', 'extraLarge', 'fluid'].includes(value)
    },
    /** Indica si el panel debe mostrarse en el lado izquierdo. */
    left: { type: Boolean, default: false },
    /** El texto a mostrar en la cabecera del panel. */
    headerText: { type: String, default: '' },
    /** Indica si el panel debe ocular el botón de cerrar. */
    withoutCloseButton: { type: Boolean, default: false }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de cerrar. */
    'click'
  ],
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tipo de panel.
     * @param type Tipo de panel (custom, extraSmall, small, medium, large, extraLarge, fluid).
     * @return Nombre de la clase CSS que corresponde al tipo de panel.
     */
    getTypeClass (type) {
      return ['custom', 'extraSmall', 'small', 'medium', 'large', 'extraLarge', 'fluid'].includes(type)
        ? `fura-${type}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-panel"
    :class="[getTypeClass(type), { 'fura-left': left }]"
  >
    <div
      v-if="!withoutCloseButton"
      class="fura-commands"
    >
      <div class="fura-navigation">
        <div class="fura-header">
          <div v-text="headerText" />
        </div>
        <button
          type="button"
          @click.stop="$emit('click')"
        >
          <FuraIcon
            class="fura-icon"
            name="Cancel"
          />
        </button>
      </div>
    </div>
    <div class="fura-contentInner">
      <div
        v-if="withoutCloseButton"
        class="fura-header"
      >
        <div v-text="headerText" />
      </div>
      <div class="fura-scrollableContent">
        <div class="fura-content">
          <!-- @slot Cuerpo del panel. -->
          <slot />
        </div>
      </div>
      <div class="fura-footer">
        <div class="fura-footerInner">
          <!-- @slot Pie del panel. -->
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./panel.less"></style>
