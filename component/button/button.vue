<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraButton',
  components: { FuraIcon },
  props: {
    /**
     * Tipo de botón.
     * @values default, action, command, compound, icon
     */
    type: {
      type: String,
      default: 'default',
      validator: value => !value || ['default', 'action', 'command', 'compound', 'icon'].includes(value)
    },
    /** Cambia la presentación visual del botón para enfatizarlo. */
    primary: { type: Boolean, default: false },
    /** Texto para representar la etiqueta del botón. */
    text: { type: String, default: '' },
    /** Descripción de la acción que realiza este botón. Solo se utiliza para botones de tipo 'compound'. */
    secondaryText: { type: String, default: '' },
    /** El nombre del icono a mostrar en el botón. */
    icon: { type: String, default: '' },
    /** Si se proporciona, el componente se dibuja como enlace y no como botón. */
    href: { type: String, default: null },
    /** Atributo target del enlace. El atributo 'href' debe ser proporcionado. */
    target: { type: String, default: null },
    /** Estado de seleccionado. */
    checked: { type: Boolean, default: false },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /**
     * Indica la función del botón dentro de un formulario.
     * @values button, submit, reset
     */
    formRole: {
      type: String,
      default: null,
      validator: value => !value || ['button', 'submit', 'reset'].includes(value)
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click'
  ],
  methods: {
    handleClick (event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="fura-button"
    :class="{
      'fura-default': type === 'default',
      'fura-action': type === 'action',
      'fura-command': type === 'command',
      'fura-compound': type === 'compound',
      'fura-icon': type === 'icon',
      'fura-primary': primary,
      'fura-checked': checked
    }"
    :href="disabled ? undefined : href"
    :target="(!disabled && href) ? target : undefined"
    :disabled="disabled || null"
    :type="(!href && formRole) || null"
    @click.stop="handleClick"
  >
    <span>
      <FuraIcon
        v-if="icon"
        :name="icon"
        class="fura-icon"
      />
      <span
        v-if="type !== 'icon' && (text || secondaryText)"
        class="fura-textContainer"
      >
        <span
          v-if="text"
          class="fura-label"
          v-text="text"
        />
        <span
          v-if="secondaryText"
          class="fura-description"
          v-text="secondaryText"
        />
      </span>
    </span>
  </component>
</template>

<style lang="less" scoped src="./button.less"></style>
