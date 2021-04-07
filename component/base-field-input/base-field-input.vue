<script>
import FuraLabel from '../../component/label'

export default {
  name: 'FuraBaseFieldInput',
  components: { FuraLabel },
  props: {
    /** Etiqueta que se muestra encima del campo de formulario asociado. */
    label: { type: String, default: '' },
    /** La descripción se muestra debajo del campo del formulario asociado para proporcionar detalles adicionales sobre qué valor ingresar. */
    description: { type: String, default: '' },
    /** Dibuja el borde del campo con color de error. */
    invalid: { type: Boolean, default: false },
    /** Mensaje de error estático que se muestra debajo del campo del formulario asociado. */
    errorMessage: { type: String, default: '' },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Estado requerido del campo de formulario asociado. */
    required: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado no tiene bordes. */
    borderless: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado está subrayado o no. */
    underlined: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en la etiqueta el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click'
  ]
}
</script>

<template>
  <div
    class="inputField"
    :class="{
      required,
      disabled,
      underlined,
      borderless,
      requiredPlaceholder: !label && required,
      invalid: invalid || errorMessage
    }"
  >
    <div class="wrapper">
      <FuraLabel
        v-if="label"
        class="label"
        :required="required"
        :disabled="disabled"
        @click.stop="$emit('click', $event)"
        v-text="label"
      />
      <div class="fieldGroup">
        <!-- @slot Campo del formulario. -->
        <slot />
      </div>
    </div>
    <span v-if="description || errorMessage">
      <span
        v-if="description"
        class="description"
        v-text="description"
      />
      <p
        v-if="errorMessage"
        class="errorMessage slideDownIn20"
      >
        <span v-text="errorMessage" />
      </p>
    </span>
  </div>
</template>

<style lang="less" scoped src="./base-field-input.less"></style>

<docs>
<fura-base-field-input
  label="Base input field"
  description="Wrapper of a form field."
  :invalid="false"
  :errorMessage="null"
  :disabled="false"
  :required="false"
  :borderless="false"
  :underlined="false"
>
  <input
    type="text"
    style="
      flex: 1 1 0px;
      border: 0;
      background-color: 'rgba(113, 175, 229, 0.4);
      outline: 0;
    "
  />
</fura-base-field-input>
</docs>
