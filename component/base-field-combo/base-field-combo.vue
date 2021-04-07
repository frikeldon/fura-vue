<script>
import Label from '../label'

export default {
  components: { Label },
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
    underlined: { type: Boolean, default: false },
    /** Indica si se muestra el panel del campo de formulario asociado. */
    open: { type: Boolean, default: false }
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
    class="fieldCombo"
    :class="{
      required,
      disabled,
      underlined,
      borderless,
      open,
      requiredPlaceholder: !label && required,
      invalid: invalid || errorMessage
    }"
  >
    <div class="elementWrapper">
      <Label
        v-if="label"
        class="label"
        :required="required"
        :disabled="disabled"
        @click.stop="$emit('click', $event)"
        v-text="label"
      />
      <div class="fieldWrapper">
        <div class="fieldGroup">
          <!-- @slot Campo del formulario. -->
          <slot />
        </div>
        <div class="dropdownPanel">
          <!-- @slot Panel desplegable. -->
          <slot name="dropdown" />
        </div>
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

<style lang="less" scoped src="./base-field-combo.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Base combo field',
        description: 'Wrapper of a form field with a dropdown panel.',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        open: false,
      }
    }
  }
</script>
<template>
  <fura-base-field-combo
    :label="label"
    :description="description"
    :invalid="invalid"
    :errorMessage="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
  >
    <div
      tabindex="0"
      style="
        flex: 1 1 0px;
        border: 0;
        background-color: 'rgba(113, 175, 229, 0.4);
        outline: 0;
      }"
      @click="open = !open"
    />
    <template v-slot:dropdown>
      <div
        tabindex="0"
        style="
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          box-shadow: none;
          flex: 1 1 0px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 178, 148, 0.4);
          box-shadow: 0 0px 15px -5px rgba(0,0,0,.4);
          border: 1px solid #edebe9;
          outline: 0;
        "
      />
    </template>
  </fura-base-field-combo>
</template>
</docs>
