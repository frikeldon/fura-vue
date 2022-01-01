<script>
import FuraBaseCommandButton from '../base-command-button'

export default {
  name: 'FuraBaseSplitButton',
  components: { FuraBaseCommandButton },
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
    'mousestop',
    /** Se genera cuando el mouse está sobre el botón expandido durante un período de tiempo determinado. */
    'mousestopExpand'
  ]
}
</script>

<template>
  <div class="fura-splitButton">
    <span>
      <FuraBaseCommandButton
        class="fura-action"
        :text="text"
        :icon="icon"
        :icon-space="iconSpace"
        :icon-color="iconColor"
        :mousestop-delay="mousestopDelay"
        :disabled="disabled"
        :checked="checked"
        :href="href"
        :target="target"
        @click="$emit('click', $event)"
        @mousestop="$emit('mousestop')"
      />
      <FuraBaseCommandButton
        class="fura-expand"
        :expand-icon="expandIcon"
        :mousestop-delay="mousestopDelay"
        :disabled="disabled"
        :checked="checked"
        @click="$emit('clickExpand', $event)"
        @click-expand="$emit('clickExpand', $event)"
        @mousestop="$emit('mousestopExpand')"
      />
      <span class="fura-divisor" />
    </span>
  </div>
</template>

<style lang="less" scoped src="./base-split-button.less"></style>

<docs>
<script>
  export default {
    methods: {
      onClick() { alert('click') },
      onClickExpand() { alert('click expand') },
      onMousestop() { alert('mousestop') },
      onMousestopExpand() { alert('mousestop expand') }
    }
  }
</script>
<template>
  <div style="display: inline-block; border: 1px solid black">
    <fura-base-split-button
      text="Add Item"
      icon="Add"
      expand-icon="ChevronDown"
      @click="onClick"
      @click-expand="onClickExpand"
      @mousestop="onMousestop"
      @mousestop-expand="onMousestopExpand"
    />
  </div>
</template>
</docs>
