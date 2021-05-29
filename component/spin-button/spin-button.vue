<script>
import FuraBaseFieldInput from '../base-field-input'
import FuraIcon from '../icon'

function defaultStringify (value) {
  return typeof value === 'number' ? value.toString() : ''
}

function defaultParse (text) {
  const value = Number(text)
  return isNaN(value) ? null : value
}

function defaultInc (value) {
  return value + (this.step ?? 1)
}

function defaultDec (value) {
  return value - (this.step ?? 1)
}

export default {
  name: 'FuraSpinButton',
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
    /** Diferencia entre dos valores adyacentes de SpinButton. */
    step: { type: Number, default: 1 },
    /** Función para calcular un incremento de valor. */
    inc: { type: Function, default: defaultInc },
    /** Función para calcular un decremento de valor. */
    dec: { type: Function, default: defaultDec },
    /** Función para convertir de texto a número. */
    parse: { type: Function, default: defaultParse },
    /** Función para convertir de número a texto. */
    stringify: { type: Function, default: defaultStringify },
    /** Valor actual del campo. */
    modelValue: { type: Number, default: null }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {number} modelValue Valor actual del campo.
     */
    'update:modelValue',
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
  computed: {
    textValue () {
      return this.stringify(this.modelValue)
    }
  },
  methods: {
    handleClickUp () {
      this.$emit('update:modelValue', this.inc(this.modelValue))
    },
    handleClickDown () {
      this.$emit('update:modelValue', this.dec(this.modelValue))
    },
    handleChange (event) {
      const newValue = this.parse(event.target.value)
      if (isNaN(newValue)) {
        this.$refs.field.value = this.textValue
      } else {
        this.$emit('update:modelValue', newValue)
      }
    }
  }
}
</script>

<template>
  <FuraBaseFieldInput
    class="fura-spinButton"
    :class="{ 'fura-disabled': disabled }"
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
    <input
      ref="field"
      type="text"
      :value="textValue"
      :disabled="disabled || null"
      @change="handleChange"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <span>
      <button
        class="fura-up"
        :disabled="disabled || null"
        @click="handleClickUp"
      >
        <FuraIcon
          class="fura-icon"
          name="ChevronUpSmall"
        />
      </button>
      <button
        class="fura-down"
        :disabled="disabled || null"
        @click="handleClickDown"
      >
        <FuraIcon
          class="fura-icon"
          name="ChevronDownSmall"
        />
      </button>
    </span>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./spin-button.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Spin Button',
        description: '',
        invalid: false,
        errorMessage: '',
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        step: 1,
        inc: undefined,
        dec: undefined,
        parse: undefined,
        stringify: undefined,
        modelValue: null,
      }
    }
  }
</script>
<template>
  <fura-spin-button
    :label="label"
    :description="description"
    :invalid="invalid"
    :errorMessage="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :step="step"
    :inc="inc"
    :dec="dec"
    :parse="parse"
    :stringify="stringify"
    v-model="modelValue"
  />
</template>
</docs>
