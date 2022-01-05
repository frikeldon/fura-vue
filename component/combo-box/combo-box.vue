<script>
import FuraBaseComboBox from '../base-combo-box'
import { startsWith, equalInsensitive } from '../../utils/text'

export default {
  name: 'FuraComboBox',
  components: { FuraBaseComboBox },
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
    /** Las opciones de ComboBox. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    modelValue: { type: undefined, default: undefined },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Indica si el ComboBox es de entrada libre, lo que permite escribir las opciones a seleccionar. */
    allowFreeform: { type: Boolean, default: false },
    /** Indica si el ComboBox se autocompleta. A medida que el usuario ingresa texto, se le sugerirán posibles coincidencias de la lista de opciones. */
    autoComplete: { type: Boolean, default: false },
    /** Indica si el campo ignora los acentos al autocompletar el valor. */
    accentInsensitive: { type: Boolean, default: false },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false },
    /** La cantidad máxima de opciones que se pueden seleccionar. */
    maxSelectedOptions: { type: Number, default: -1 }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de ComboBox.
     * @property {string,Array} modelValue Valor o lista de valores seleccionados.
     */
    'update:modelValue'
  ],
  data () {
    return {
      open: false,
      suggestedIndex: -1
    }
  },
  computed: {
    /** Texto descriptivo de los valores seleccionados. */
    selectedText () {
      const { multiple, modelValue, options } = this
      if (multiple) {
        return Array.isArray(modelValue)
          ? modelValue.map(selectedValue => options.find(option => option.value === selectedValue))
            .filter(selected => selected)
            .map(selected => selected.text)
            .join(', ')
          : ''
      } else {
        const selected = options.find(option => option.value === modelValue)
        return selected?.text ?? ''
      }
    }
  },
  methods: {
    selectOption (index) {
      const option = this.options[index]
      if (option && (!option.type || option.type === 'option')) {
        if (this.multiple) {
          if (Array.isArray(this.modelValue)) {
            if (this.modelValue.includes(option.value)) {
              const newValue = this.modelValue.filter(value => value !== option.value)
              this.$emit('update:modelValue', newValue)
            } else if (this.maxSelectedOptions < 0 || this.modelValue.length < this.maxSelectedOptions) {
              const newValue = [...this.modelValue, option.value]
              this.$emit('update:modelValue', newValue)
            }
          } else {
            this.$emit('update:modelValue', [option.value])
          }
        } else {
          const newValue = this.modelValue !== option.value
            ? option.value
            : null
          this.$emit('update:modelValue', newValue)
        }
      }
    },
    handleKeydown (event) {
      const { select, autofill } = this.$refs.comboBox.$refs
      const { code } = event
      if (!this.allowFreeform) {
        if (this.open) {
          if (code === 'ArrowDown') {
            this.suggestedIndex = select.getNextEnabledOptionIndex(this.suggestedIndex, 1)
            select.scrollToOption(this.suggestedIndex, this.immediateScroll)
          } else if (code === 'ArrowUp') {
            this.suggestedIndex = select.getNextEnabledOptionIndex(this.suggestedIndex, -1)
            select.scrollToOption(this.suggestedIndex, this.immediateScroll)
          } else if (code === 'Space' || code === 'Enter') {
            this.handleSelect(this.suggestedIndex)
          } else if (code.startsWith('Key')) {
            const index = select.options.findIndex(option =>
              option.text && equalInsensitive(option.text[0], event.key, true)
            )
            if (index >= 0) {
              this.suggestedIndex = index
              select.scrollToOption(this.suggestedIndex, this.immediateScroll)
            }
          } else if (code === 'Escape' || code === 'Backspace') {
            this.open = false
          }
        } else {
          this.open = true
        }
      } else if (code === 'ArrowDown' || code === 'ArrowUp') {
        event.preventDefault()
        const indexIncrement = code === 'ArrowDown' ? 1 : -1
        this.suggestedIndex = select.getNextEnabledOptionIndex(this.suggestedIndex, indexIncrement)
        if (this.allowFreeform) {
          this.$nextTick(() => autofill.suggest(this.options[this.suggestedIndex].text, !this.autoComplete))
        } else {
          autofill.$refs.field.value = this.options[this.suggestedIndex].text
        }
      } else if (code === 'Enter') {
        if (!this.allowFreeform || this.autoComplete) {
          this.handleSelect(this.suggestedIndex)
        } else if (this.allowFreeform) {
          const selectedIndex = this.options.findIndex(option =>
            (!option.type || option.type === 'option') &&
            !option.disabled &&
            equalInsensitive(option.text, autofill.$refs.field.value, this.accentInsensitive)
          )
          this.handleSelect(selectedIndex)
        }
      }
    },
    handleClick () {
      this.open = !this.open
      if (this.open) {
        this.$refs.comboBox.$refs.autofill.focus()
      }
    },
    handleSelect (index) {
      this.selectOption(index)
      if (!this.multiple) {
        this.open = false
        this.suggestedIndex = -1
      }
      if (this.allowFreeform) {
        this.$refs.comboBox.$refs.autofill.$refs.field.value = ''
      }
    },
    handleInput (value) {
      if (value) {
        this.open = true
      }
      if (this.autoComplete) {
        this.suggestedIndex = this.options.findIndex(option =>
          (!option.type || option.type === 'option') &&
          !option.disabled &&
          startsWith(option.text, value, this.accentInsensitive)
        )
      }
    }
  },
  watch: {
    open (open) {
      if (this.allowFreeform && !open) {
        this.$refs.comboBox.$refs.autofill.$refs.field.value = ''
      }
    }
  }
}
</script>

<template>
  <FuraBaseComboBox
    ref="comboBox"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :options="options"
    :value="modelValue"
    :readonly="readonly"
    :multiple="multiple"
    :allow-freeform="allowFreeform"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :placeholder="placeholder"
    :selected-text="selectedText"
    :open="open && !disabled && !readonly"
    :suggested-index="suggestedIndex"
    :immediate-scroll="immediateScroll"
    @keydown="handleKeydown"
    @click="handleClick"
    @select="handleSelect"
    @input="handleInput"
    @click-outside.stop.prevent="open = false"
  >
    <template #default="slotProps">
      <!--
            @slot Opción de ComboBox.
            @binding {object} option Referencia a la opción.
            @binding {number} index Índice de la opción.
            @binding {boolean} selected Estado de selecionado de la opción.
            @binding {boolean} marked Estado marcado de la opción.
            @binding {boolean} highlighted Estado resaltado de la opción.
            @binding {function} click Función para seleccionar la opción.
          -->
      <slot
        :option="slotProps.option"
        :index="slotProps.index"
        :selected="slotProps.selected"
        :marked="slotProps.marked"
        :highlighted="slotProps.highlighted"
        :click="slotProps.click"
      />
    </template>

    <template #header="slotProps">
      <!--
            @slot Encabezado de ComboBox
            @binding {object} option Referencia a la opción.
            @binding {number} index Índice de la opción.
          -->
      <slot
        name="header"
        :option="slotProps.option"
        :index="slotProps.index"
        :selected="slotProps.selected"
        :click="slotProps.click"
      />
    </template>

    <template #divider="slotProps">
      <!--
            @slot Separador del ComboBox
            @binding {object} option Referencia a la opción.
            @binding {number} index Índice de la opción.
          -->
      <slot
        name="divider"
        :option="slotProps.option"
        :index="slotProps.index"
        :selected="slotProps.selected"
        :click="slotProps.click"
      />
    </template>
  </FuraBaseComboBox>
</template>
