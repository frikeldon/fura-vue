<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraBaseCommandButton',
  components: { FuraIcon },
  props: {
    /** Texto para representar la etiqueta del botón. */
    text: { type: String, default: '' },
    /** El nombre del icono a mostrar en el botón. */
    icon: { type: String, default: '' },
    /** Color para representar el icono. */
    iconColor: { type: String, default: '' },
    /** Si el botón debe reservar un espacio para el icono. */
    iconSpace: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en la parte expandida del botón. */
    expandIcon: { type: String, default: '' },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para activar el evento mousestop. */
    mousestopDelay: { type: Number, default: 800 },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Estado de selección. */
    checked: { type: Boolean, default: false },
    /** Si se proporciona, el componente se dibuja como enlace y no como botón. */
    href: { type: String, default: null },
    /** Atributo target del enlace. El atributo 'href' debe ser proporcionado. */
    target: { type: String, default: null }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click',
    /**
     * Se genera cuando el usuario hace clic en el icono de la parte expandida del botón.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'clickExpand',
    /** Se genera cuando el mouse está sobre el botón durante un período de tiempo determinado. */
    'mousestop'
  ],
  methods: {
    handleClick (event) {
      this.clearMouseHandler()
      if (!this.disabled) {
        this.$emit('click', event)
      }
    },
    handleExpandClick (event) {
      this.clearMouseHandler()
      if (!this.disabled) {
        this.$emit('clickExpand', event)
      }
    },
    handleMouseover () {
      this.mouseHandler = setTimeout(() => this.$emit('mousestop'), this.mousestopDelay)
    },
    clearMouseHandler () {
      if (this.mouseHandler) {
        clearTimeout(this.mouseHandler)
        this.mouseHandler = null
      }
    }
  }
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :type="href ? undefined : 'button'"
    :disabled="disabled || null"
    :class="checked ? 'fura-checked' : null"
    :href="disabled ? undefined : href"
    :target="(!disabled && href) ? target : undefined"
    @click.stop="handleClick"
    @mouseover.stop="handleMouseover"
    @mouseout.stop="clearMouseHandler"
  >
    <span>
      <FuraIcon
        v-if="iconSpace || icon"
        class="fura-icon"
        :style="{ color: disabled ? '' : iconColor }"
        :name="icon"
        @click.stop="handleClick"
      />
      <span
        v-if="text"
        class="fura-text"
      >
        <span v-text="text" />
      </span>
      <span
        v-if="expandIcon"
        class="fura-expand"
        @click.stop="handleExpandClick"
      >
        <FuraIcon
          class="fura-expandIcon"
          :name="expandIcon"
        />
      </span>
    </span>
  </component>
</template>

<style lang="less" scoped src="./base-command-button.less"></style>
