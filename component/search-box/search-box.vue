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
    placeholder: { type: String, default: '' },
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
    class="searchBox"
    :class="{ disabled, underlined }"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    @click-label="$refs.field.focus()"
  >
    <div
      class="icon"
      :class="{ disableAnimation }"
    >
      <FuraIcon :name="icon" />
    </div>

    <input
      type="text"
      class="field"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input.stop="$emit('update:modelValue', $event.target.value)"
      @keydown="handleKeydown"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <div
      v-if="modelValue && !disabled"
      class="clear"
    >
      <button @click="clear">
        <span>
          <FuraIcon name="Clear" />
        </span>
      </button>
    </div>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./search-box.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'SearchBox',
        description: '',
        invalid: false,
        errorMessage: '',
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        icon: 'Search',
        placeholder: 'Search',
        disableAnimation: false,
        value: '',
      }
    }
  }
</script>
<template>
  <fura-search-box
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :icon="icon"
    :placeholder="placeholder"
    :disable-animation="disableAnimation"
    v-model="value"
  />
</template>
</docs>
