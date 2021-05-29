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
      return this.$slots.actions && this.$slots.actions().findIndex(o => o.type !== Comment) !== -1
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
        <button @click="extended = !extended">
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
        <button @click="$emit('dismiss')">
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

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar>
      Info/Default MessageBar.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar
      type="error"
      singleline
      dismiss
    >
      Error MessageBar with single line, with dismiss button.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar
      type="blocked"
      singleline
      dismiss
      truncated
    >
      <b>Blocked MessageBar - single line, with dismiss button and truncated text.</b> Truncation is not available if you
      use action buttons or multiline and should be used sparingly. Lorem ipsum dolor sit amet, consectetur adipiscing
      elit. Morbi luctus, purus a lobortis tristique, odio augue pharetra metus, ac placerat nunc mi nec dui. Vestibulum
      aliquam et nunc semper scelerisque. Curabitur vitae orci nec quam condimentum porttitor et sed lacus. Vivamus ac
      efficitur leo. Cras faucibus mauris libero, ac placerat erat euismod et. Donec pulvinar commodo odio sit amet
      faucibus. In hac habitasse platea dictumst. Duis eu ante commodo, condimentum nibh pellentesque, laoreet enim. Fusce
      massa lorem, ultrices eu mi a, fermentum suscipit magna. Integer porta purus pulvinar, hendrerit felis eget,
      condimentum mauris.
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar type="severeWarning">
      SevereWarning MessageBar with action buttons which defaults to multiline.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
      <template #actions>
        <div>
          <fura-button style="height: 24px;" text="Yes" />
          <fura-button style="height: 24px; margin-left: 8px;" text="No" />
        </div>
      </template>
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar
      type="success"
      singleline
    >
      Success MessageBar with single line and action buttons.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
      <template #actions>
        <div>
          <fura-button style="height: 24px;" text="Yes" />
          <fura-button style="height: 24px; margin-left: 8px;" text="No" />
        </div>
      </template>
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar
      type="warning"
      singleline
      dismiss
    >
      Warning MessageBar content.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
      <template #actions>
        <div>
          <fura-button style="height: 24px;" text="Action" />
        </div>
      </template>
    </fura-message-bar>
  </div>
</docs>

<docs>
  <div style="max-width: 450px;">
    <fura-message-bar
      type="warning"
      dismiss
    >
      <b>Warning defaults to multiline</b>. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi luctus, purus a
      lobortis tristique, odio augue pharetra metus, ac placerat nunc mi nec dui. Vestibulum aliquam et nunc semper
      scelerisque. Curabitur vitae orci nec quam condimentum porttitor et sed lacus. Vivamus ac efficitur leo. Cras
      faucibus mauris libero, ac placerat erat euismod et. Donec pulvinar commodo odio sit amet faucibus. In hac habitasse
      platea dictumst. Duis eu ante commodo, condimentum nibh pellentesque, laoreet enim. Fusce massa lorem, ultrices eu
      mi a, fermentum suscipit magna. Integer porta purus pulvinar, hendrerit felis eget, condimentum mauris.
      <a href="www.bing.com" target="_blank">Visit our website.</a>
      <template #actions>
        <div>
          <fura-button style="height: 24px;" text="Yes" />
          <fura-button style="height: 24px; margin-left: 8px;" text="No" />
        </div>
      </template>
    </fura-message-bar>
  </div>
</docs>
