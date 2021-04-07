<script>
import TextField from '../text-field'

function defaultParse (text) {
  return text === ''
    ? null
    : Number(
      text
        .replace(/(?:€|%)$/g, '')
        .replace(/\./g, '')
        .replace(',', '.')
    )
}

function defaultStringify (number) {
  if (number == null) return ''

  const options = {
    style: this.formatStyle,
    currency: 'EUR',
    useGrouping: this.useGrouping,
    minimumIntegerDigits: this.minimumIntegerDigits,
    minimumFractionDigits: this.minimumFractionDigits,
    maximumFractionDigits: this.maximumFractionDigits
  }

  if (this.minimumSignificantDigits > 0 && this.minimumSignificantDigits < 22) {
    options.minimumSignificantDigits = this.minimumSignificantDigits
  }

  if (this.maximumSignificantDigits > 0 && this.maximumSignificantDigits < 22) {
    options.maximumSignificantDigits = this.maximumSignificantDigits
  }

  const normalizedNum = this.formatStyle === 'percent' ? number / 100 : number
  return normalizedNum.toLocaleString('ca-ES', options)
}

export default {
  name: 'FuraNumberField',
  components: { TextField },
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
    /** Whether or not the associated form field is underlined. */
    underlined: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado está subrayado o no. */
    placeholder: { type: String, default: '' },
    /** Prefijo que se muestra antes del contenido del campo. No está incluido en el valor. */
    prefix: { type: String, default: '' },
    /** Sufijo que se muestra después del contenido del campo. No está incluido en el valor. */
    sufix: { type: String, default: '' },
    /** Si el campo permite entrar varias líneas. */
    multiline: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en el campo. */
    icon: { type: String, default: '' },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Longitud máxima (número de caracteres) del valor. */
    maxlength: { type: Number, default: -1 },
    /** Indica si el campo es no redimensionable para campos de varias líneas. */
    unresizable: { type: Boolean, default: false },
    /** Indica si se ajustaautomáticamente la altura para campos de varias líneas. */
    autoAdjustHeight: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: Number, default: null },
    /**
     * El estilo de formato numerico a usar.
     * @values decimal, currency, percent, unit
     */
    formatStyle: {
      type: String,
      default: 'decimal',
      validator: value => ['decimal', 'currency', 'percent', 'unit'].includes(value)
    },
    /** Indica si se debe mostrar separadores de grupos numéricos. */
    useGrouping: { type: Boolean, default: false },
    /** El número mínimo de dígitos enteros que se utilizarán. */
    minimumIntegerDigits: {
      type: Number,
      default: 1,
      validator: value => Number.isInteger(value) && value >= 1 && value <= 21
    },
    /** El número mínimo de dígitos fraccionarios que se utilizarán. */
    minimumFractionDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 20
    },
    /** El número máximo de dígitos fraccionarios que se utilizarán. */
    maximumFractionDigits: {
      type: Number,
      default: 20,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 20
    },
    /** El número mínimo de dígitos significativos que se utilizarán. */
    minimumSignificantDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 21
    },
    /** El número máximo de dígitos significativos que se utilizarán. */
    maximumSignificantDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 21
    },
    /** Función para convertir de texto a número. */
    parse: { type: Function, default: defaultParse },
    /** Función para convertir de número a texto. */
    stringify: { type: Function, default: defaultStringify },
    /**
     * Alineación del texto cuando el campo no tiene el foco.
     * @values left, center, right
     */
    align: {
      type: String,
      default: 'left',
      validator: value => ['left', 'center', 'right'].includes(value)
    },
    /**
     * Alineación del texto cuando el campo tiene el foco.
     * @values left, center, right
     */
    alignFocus: {
      type: String,
      default: 'left',
      validator: value => ['left', 'center', 'right'].includes(value)
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /** Se genera cuando el usuario hace clic en el icono del campo. */
    'click'
  ],
  data () {
    return { hasFocus: false }
  },
  computed: {
    textValue: {
      get () {
        const { hasFocus, modelValue } = this
        if (hasFocus) {
          return typeof modelValue === 'number' && !isNaN(modelValue)
            ? String(modelValue)
            : ''
        } else {
          return this.stringify(modelValue)
        }
      },
      set (value) {
        if (!value) {
          this.$emit('update:modelValue', null)
        } else if (this.hasFocus) {
          this.$emit('update:modelValue', Number(value))
        } else {
          this.$emit('update:modelValue', this.parse(value))
        }
      }
    },
    textAlign () {
      const { hasFocus, align, alignFocus } = this
      return hasFocus
        ? alignFocus
        : align
    }
  },
  methods: {
    handleFocus () {
      this.hasFocus = true
    },
    handleBlur () {
      this.hasFocus = false
    },
    handleKeyDown (event) {
      const { target, key } = event
      const allowedKeys = ['Backspace', 'Delete', 'Enter', 'Tab', 'Escape', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End']
      if (!allowedKeys.includes(key)) {
        const { value, selectionStart, selectionEnd } = target
        const newValue = value.substring(0, selectionStart) + key + value.substring(selectionEnd)
        if (isNaN(newValue)) {
          event.preventDefault()
          event.stopPropagation()
          event.target.value = this.textValue
        }
      }
    }
  }
}
</script>

<template>
  <TextField
    ref="textField"
    :class="textAlign"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :placeholder="placeholder"
    :prefix="prefix"
    :sufix="sufix"
    :multiline="multiline"
    :icon="icon"
    :readonly="readonly"
    :maxlength="maxlength"
    :unresizable="unresizable"
    :auto-adjust-height="autoAdjustHeight"
    v-model:model-value="textValue"
    @click="$emit('click')"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeyDown"
  />
</template>

<style lang="less" scoped src="./number-field.less"></style>

<docs>
<script>
export default {
  data () {
    return { value: null }
  }
}
</script>
<template>
  <fura-number-field
    label="I'm a field"
    v-model="value"
  />
</template>
</docs>
