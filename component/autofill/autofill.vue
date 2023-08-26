<script>
import { commonStartLength, startsWith } from '../../utils/text.js'

export default {
  name: 'FuraAutofill',
  props: {
    /** Valor actual del campo. */
    modelValue: { type: String, default: '' },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Indica si el campo debe autocompletar el valor. */
    autofill: { type: Boolean, default: false },
    /** Indica si el campo ignora los acentos al autocompletar el valor. */
    accentInsensitive: { type: Boolean, default: false },
    /** El valor sugerido que se autocompletará. */
    suggestedValue: { type: String, default: '' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /**
     * Se genera cuando el usuario pulsa una tecla.
     * @property {KeyboardEvent} keyboardEvent Descripción del evento de pulsación de tecla.
     */
    'keydown'
  ],
  methods: {
    /**
     * Pone el foco del usuario en el campo.
     * @public
     */
    focus () {
      this.$refs.field.focus()
    },
    /**
     * Asigna un nuevo valor al campo, seleccionando la parte modificada del texto.
     * @param {string} text Nuevo valor del campo.
     * @param {boolean} fullSelection Cuando esta definido, el texto se selecciona completo.
     * @public
     */
    suggest (text, fullSelection = false) {
      const { field } = this.$refs
      const { value, selectionStart, selectionEnd } = field
      const maxselectionStart =
        selectionStart !== selectionEnd &&
        selectionEnd === value.length
          ? selectionStart
          : value.length
      const newSelecionStart = fullSelection
        ? 0
        : commonStartLength(
          value,
          text,
          maxselectionStart,
          this.accentInsensitive
        )
      field.focus()
      field.value = text
      field.setSelectionRange(newSelecionStart, text.length, 'backward')
      this.$emit('update:modelValue', field.value)
    },
    /**
     * Muestra el texto sugerido seleccionado, si es posible.
     */
    writeSuggestion () {
      const { field } = this.$refs
      const { value } = field
      if (
        document.activeElement === field &&
        this.autofill &&
        value &&
        startsWith(this.suggestedValue, value, this.accentInsensitive)
      ) {
        field.value = this.suggestedValue
        field.setSelectionRange(value.length, field.value.length, 'backward')
      }
    },
    handleInput (event) {
      const { value } = event.target
      if (this.autofill) {
        this.writeSuggestion()
      }
      this.$emit('update:modelValue', value)
    },
    handleKeydown (event) {
      if (event.code === 'Tab') return
      else event.stopPropagation()

      const { target: field } = event
      const { value, selectionStart, selectionEnd } = field

      if (this.autofill && event.code === 'Backspace') {
        if (value && value.length === selectionEnd) {
          if (selectionStart === 0 || selectionStart === 1) {
            event.preventDefault()
            field.value = ''
            this.$emit('update:modelValue', '')
          } else if (selectionStart !== selectionEnd) {
            event.preventDefault()
            const selectionPrev = selectionStart - 1
            field.setSelectionRange(selectionPrev, selectionEnd, 'backward')
            this.$emit('update:modelValue', value.slice(0, selectionPrev))
          }
        }
      }
      this.$emit('keydown', event)
    }
  },
  watch: {
    suggestedValue () {
      if (this.autofill && this.modelValue !== this.suggestedValue) {
        this.writeSuggestion()
      }
    }
  }
}
</script>

<template>
  <input
    type="text"
    ref="field"
    :placeholder="placeholder"
    :readonly="readonly || null"
    :disabled="disabled || null"
    @input.stop="handleInput"
    @keydown="handleKeydown"
  >
</template>
