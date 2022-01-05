<script>
import FuraBaseSelect from '../base-select'

export default {
  name: 'FuraSelect',
  components: { FuraBaseSelect },
  props: {
    /** Las opciones de Select. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    modelValue: { type: undefined, default: undefined },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false },
    /** La cantidad máxima de opciones que se pueden seleccionar. */
    maxSelectedOptions: { type: Number, default: -1 }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Select.
     * @property {string,Array} modelValue Valor o lista de valores seleccionados.
     */
    'update:modelValue'
  ],
  data () {
    return { markedIndex: -1 }
  },
  methods: {
    handleKeydown ({ code }) {
      const { select } = this.$refs
      if (code === 'ArrowDown') {
        this.markedIndex = select.getNextEnabledOptionIndex(this.markedIndex, 1)
        select.scrollToOption(this.markedIndex, this.immediateScroll)
      } else if (code === 'ArrowUp') {
        this.markedIndex = select.getNextEnabledOptionIndex(this.markedIndex, -1)
        select.scrollToOption(this.markedIndex, this.immediateScroll)
      } else if (code === 'Space' || code === 'Enter') {
        select.selectIndex(this.markedIndex)
        this.markedIndex = null
      }
    },
    handleSelect (index) {
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
          this.open = false
          this.$emit('update:modelValue', newValue)
        }
      }
    }
  }
}
</script>

<template>
  <FuraBaseSelect
    ref="select"
    :options="options"
    :value="modelValue"
    :disabled="disabled"
    :readonly="readonly"
    :multiple="multiple"
    :marked-index="markedIndex"
    @keydown="handleKeydown"
    @select="handleSelect"
  >
    <template #default="slotProps">
      <!--
        @slot Opción de Select.
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
        @slot Encabezado de Select
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
        @slot Separador del Select
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
  </FuraBaseSelect>
</template>
