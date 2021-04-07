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
    disabled: { type: Boolean, default: false }
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
  <button
    :disabled="disabled"
    @click.stop="handleClick"
    @mouseover.stop="handleMouseover"
    @mouseout.stop="clearMouseHandler"
  >
    <span>
      <FuraIcon
        v-if="iconSpace || icon"
        class="icon"
        :style="{ color: disabled ? '' : iconColor }"
        :name="icon"
        @click.stop="handleClick"
      />
      <span
        v-if="text"
        class="text"
      >
        <span v-text="text" />
      </span>
      <FuraIcon
        v-if="expandIcon"
        class="expand"
        :name="expandIcon"
        @click.stop="handleExpandClick"
      />
    </span>
  </button>
</template>

<style lang="less" scoped src="./base-command-button.less"></style>

<docs>
<script>
  export default {
    methods: {
      onClick() { alert('click') },
      onClickExpand() { alert('click expand') },
      onMousestop() { alert('mousestop') }
    }
  }
</script>
<template>
  <div style="display: inline-block; border: 1px solid black">
    <fura-base-command-button
      text="Send Mail"
      icon="Mail"
      expand-icon="ChevronDown"
      @click="onClick"
      @click-expand="onClickExpand"
      @mousestop="onMousestop"
    />
  </div>
</template>
</docs>
