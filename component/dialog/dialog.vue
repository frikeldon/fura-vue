<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraDialog',
  components: { FuraIcon },
  props: {
    /**
     * El tipo de diálogo a mostrar.
     * @values normal, largeHeader, close
     */
    type: {
      type: String,
      default: 'normal',
      validator: value => !value || ['normal', 'largeHeader', 'close'].includes(value)
    },
    /** El texto a mostrar en el título del diálogo. */
    header: { type: String, default: '' },
    /** El texto a mostrar en el cuerpo del diálogo. */
    text: { type: String, default: '' }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de cerrar. */
    'click'
  ],
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tipo de dialogo.
     * @param type Tipo de dialogo (normal, largeHeader, close).
     * @return Nombre de la clase CSS que corresponde al tipo de dialogo.
     */
    getTypeClass (type) {
      return ['normal', 'largeHeader', 'close'].includes(type)
        ? `fura-${type}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-dialog"
    :class="getTypeClass(type)"
  >
    <div class="fura-header">
      <div
        class="fura-title"
        v-text="header"
      />
      <div
        v-if="type === 'close'"
        class="fura-topButton"
      >
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
    <div class="fura-inner">
      <div class="fura-content">
        <p
          v-if="text"
          class="fura-subText"
          v-text="text"
        />
        <!-- @slot Cuerpo del diálogo. -->
        <slot />
      </div>
      <!-- @slot Pie del diálogo. -->
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="less" scoped src="./dialog.less"></style>
