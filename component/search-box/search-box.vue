<script>
import FuraBaseFieldInput from '../base-field-input'
import FuraIcon from '../icon'

export default {
  name: 'FuraSearchBox',
  components: {
    FuraBaseFieldInput,
    FuraIcon
  },
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
    /** El nombre del icono a mostrar en el campo de texto. */
    icon: { type: String, default: 'Search' },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el icono de SearchBox debe estar animado o no. */
    disableAnimation: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: String, default: '' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /**
     * Se genera cuando el usuario pulsa 'Enter' en el campo.
     * @property {string} value Valor actual del campo.
     */
    'search',
    /** Se genera cuando el usuario pulsa 'Escape' en el campo. */
    'escape',
    /**
     * Se genera cuando el componente recibe el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'focus',
    /**
     * Se genera cuando el componente pierde el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'blur'
  ],
  methods: {
    handleKeydown (event) {
      const { code } = event
      if (code === 'Escape') {
        event.stopPropagation()
        event.preventDefault()
        this.clear()
        this.$emit('escape')
      } else if (code === 'Enter') {
        event.stopPropagation()
        event.preventDefault()
        this.$emit('search', event.target.value)
      }
    },
    clear () {
      this.$refs.field.value = ''
      this.$emit('update:modelValue', '')
    }
  }
}
</script>

<template>
  <FuraBaseFieldInput
    class="fura-searchBox"
    :class="{
      'fura-disabled': disabled,
      'fura-underlined': underlined
    }"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    @click="$refs.field.focus()"
  >
    <div
      class="fura-icon"
      :class="{ 'fura-disableAnimation': disableAnimation }"
    >
      <FuraIcon :name="icon" />
    </div>

    <input
      ref="field"
      type="text"
      class="fura-field"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || null"
      @input.stop="$emit('update:modelValue', $event.target.value)"
      @keydown="handleKeydown"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <div
      v-if="modelValue && !disabled"
      class="fura-clear"
    >
      <button
        type="button"
        @click.stop="clear"
      >
        <span>
          <FuraIcon name="Clear" />
        </span>
      </button>
    </div>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./search-box.less"></style>
