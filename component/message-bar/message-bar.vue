<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraMessageBar',
  components: { FuraIcon },
  props: {
    /**
     * El tipo de barra de mensaje a mostrar.
     * @values info, error, blocked, severeWarning, success, warning
     */
    type: {
      type: String,
      default: 'info',
      validator: type => !type || ['info', 'error', 'blocked', 'severeWarning', 'success', 'warning'].includes(type)
    },
    /** El icono a mostrar en la barra de mensaje en vez del icono por defecto. */
    icon: { type: String, default: null },
    /** Indica si la barra de mensajes tiene un botón para descartar. */
    dismiss: { type: Boolean, default: false },
    /** El icono a mostrar en el botón para descartar en vez del icono por defecto. */
    dismissIcon: { type: String, default: null },
    /** Indica si la barra de mensaje debe mostrar una sola línea. */
    singleline: { type: Boolean, default: false },
    /**
     * Indica si el texto de la barra de mensajes está truncado.
     * Si es verdadero, se renderizará un botón para alternar entre
     * una vista de una sola línea y una vista de varias líneas.
     * Este accesorio es para barras de mensajes de una sola línea
     * sin botones solo en un escenario de espacio limitado.
     */
    truncated: { type: Boolean, default: false }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de descartar. */
    'dismiss'
  ],
  data () {
    return {
      extended: false
    }
  },
  computed: {
    typeIcon () {
      switch (this.type) {
        case 'info':
          return 'Info'
        case 'error':
          return 'ErrorBadge'
        case 'blocked':
          return 'Blocked2'
        case 'severeWarning':
          return 'Warning'
        case 'success':
          return 'Completed'
        case 'warning':
          return 'Info'
        default:
          return null
      }
    },
    iconName () {
      const { typeIcon, icon } = this
      return icon ?? typeIcon
    },
    hasActionsSlots () {
      return this.$slots.actions && this.$slots.actions().length > 0
    }
  },
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tipo de barra de mensaje.
     * @param type Tipo de barra de mensaje (info, error, blocked, severeWarning, success, warning).
     * @return Nombre de la clase CSS que corresponde al tipo de barra de mensaje.
     */
    getTypeClass (type) {
      return ['info', 'error', 'blocked', 'severeWarning', 'success', 'warning'].includes(type)
        ? `fura-${type}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-messageBar"
    :class="[getTypeClass(type), {
      'fura-noDismiss': !dismiss,
      'fura-singleline': singleline && !extended,
      'fura-multiline': !singleline
    }]"
  >
    <div class="fura-content">
      <div class="fura-icon">
        <FuraIcon :name="iconName" />
      </div>
      <div class="fura-text">
        <span class="fura-innerText">
          <span>
            <!-- @slot Contenido de la barra de mensajes. -->
            <slot />
          </span>
        </span>
      </div>
      <div
        v-if="!hasActionsSlots && singleline && truncated"
        class="fura-expand"
      >
        <button
          type="button"
          @click.stop="extended = !extended"
        >
          <span>
            <FuraIcon
              class="fura-buttonIcon"
              :name="extended ? 'DoubleChevronDown' : 'DoubleChevronUp'"
            />
          </span>
        </button>
      </div>
      <div
        v-if="hasActionsSlots && singleline"
        class="fura-actions"
      >
        <!-- @slot Acciones de la barra de mensajes. -->
        <slot name="actions" />
      </div>
      <div
        v-if="dismiss"
        class="fura-dismiss"
      >
        <button
          type="button"
          @click.stop="$emit('dismiss')"
        >
          <span>
            <FuraIcon
              class="fura-buttonIcon"
              :name="dismissIcon ?? 'Clear'"
            />
          </span>
        </button>
      </div>
    </div>
    <div
      v-if="hasActionsSlots && !singleline"
      class="fura-actions fura-multiline"
    >
      <!-- @slot Acciones de la barra de mensajes. -->
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="less" scoped src="./message-bar.less"></style>
