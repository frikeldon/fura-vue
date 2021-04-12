<script>
import FuraBaseDropdown from '../base-dropdown'
import { equalInsensitive } from '../../utils/text.js'

export default {
  name: 'FuraDropdown',
  components: { FuraBaseDropdown },
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
    /** Las opciones de Dropdown. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    modelValue: { type: undefined, default: undefined },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Dropdown.
     * @property {string,Array} modelValue Valor o lista de valores seleccionados.
     */
    'update:modelValue'
  ],
  data () {
    return {
      open: false,
      markedIndex: -1
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
    handleKeydown ({ code, key }) {
      if (this.open) {
        const { select } = this.$refs.dropdown.$refs
        if (code === 'ArrowDown') {
          this.markedIndex = select.getNextOptionIndex(this.markedIndex, 1)
          select.scrollToOption(this.markedIndex)
        } else if (code === 'ArrowUp') {
          this.markedIndex = select.getNextOptionIndex(this.markedIndex, -1)
          select.scrollToOption(this.markedIndex)
        } else if (code === 'Space' || code === 'Enter') {
          this.handleSelect(this.markedIndex)
        } else if (code.startsWith('Key')) {
          const index = select.options.findIndex(option =>
            option.text && equalInsensitive(option.text[0], key, true)
          )
          if (index >= 0) {
            this.markedIndex = index
            select.scrollToOption(this.markedIndex)
          }
        } else if (code === 'Escape' || code === 'Backspace') {
          this.open = false
        }
      } else {
        this.open = true
      }
    },
    handleClick () {
      if (!this.disabled && !this.readonly) {
        this.open = !this.open
      }
    },
    handleSelect (index) {
      this.markedIndex = -1
      const option = this.options[index]
      if (option && (!option.type || option.type === 'option')) {
        if (this.multiple) {
          if (Array.isArray(this.modelValue)) {
            const newValue = this.modelValue?.includes(option.value)
              ? this.modelValue.filter(value => value !== option.value)
              : [...this.modelValue, option.value]
            this.$emit('update:modelValue', newValue)
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
  <FuraBaseDropdown
    ref="dropdown"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open && !disabled && !readonly"
    :options="options"
    :value="modelValue"
    :selected-text="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :marked-index="markedIndex"
    :immediate-scroll="immediateScroll"
    @keydown="handleKeydown"
    @click="handleClick"
    @select="handleSelect"
  >
    <template #default="slotProps">
      <!--
        @slot Opción de Dropdown.
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
        @slot Encabezado de Dropdown
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
        @slot Separador del Dropdown
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
  </FuraBaseDropdown>
</template>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Base dropdown',
        description: 'Dropdown field without behavior',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        open: false,
        value: null,
        selectedText: '',
        placeholder: 'Pick an element',
        readonly: false,
        multiple: false,
        markedIndex: -1,
        immediateScroll: false,
        options: [
          { type: 'header', text: 'Fruits' },
          { text: 'Apple', value: 'apple' },
          { text: 'Banana', value: 'banana' },
          { text: 'Mango', value: 'mango' },
          { text: 'Orange', value: 'orange', disabled: true },
          { text: 'Passionfruit', value: 'passionfruit' },
          { text: 'Grape', value: 'grape' },
          { type: 'divider' },
          { type: 'header', text: 'Vegetables' },
          { text: 'Broccoli', value: 'broccoli' },
          { text: 'Carrot', value: 'carrot' },
          { text: 'Lettuce', value: 'lettuce' }
        ]
      }
    },
    methods: {
      onSelect (index) {
        if (this.multiple) {
          const value = this.options[index].value
          const valueIndex = this.value.indexOf(value)
          if (valueIndex > -1) {
            this.value.splice(valueIndex, 1)
          } else {
            this.value.push(value)
          }
          this.selectedText = this.value
            .map(value => this.options.find(option => option.value === value).text)
            .join(', ')
        } else {
          this.value = this.options[index].value
          this.selectedText = this.options[index].text
          this.open = false
        }
      },
      onClick () {
        this.open = !this.open
      }
    }
  }
</script>
<template>
  <fura-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selected-text="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :marked-index="markedIndex"
    :immediate-scroll="immediateScroll"
    :options="options"
    @select="onSelect"
    @click="onClick"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Base dropdown',
        description: 'Dropdown field without behavior',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        open: false,
        value: [],
        selectedText: '',
        placeholder: 'Pick an element',
        readonly: false,
        multiple: true,
        markedIndex: -1,
        immediateScroll: false,
        options: [
          { type: 'header', text: 'Fruits' },
          { text: 'Apple', value: 'apple' },
          { text: 'Banana', value: 'banana' },
          { text: 'Mango', value: 'mango' },
          { text: 'Orange', value: 'orange', disabled: true },
          { text: 'Passionfruit', value: 'passionfruit' },
          { text: 'Grape', value: 'grape' },
          { type: 'divider' },
          { type: 'header', text: 'Vegetables' },
          { text: 'Broccoli', value: 'broccoli' },
          { text: 'Carrot', value: 'carrot' },
          { text: 'Lettuce', value: 'lettuce' }
        ]
      }
    },
    methods: {
      onSelect (index) {
        if (this.multiple) {
          const value = this.options[index].value
          const valueIndex = this.value.indexOf(value)
          if (valueIndex > -1) {
            this.value.splice(valueIndex, 1)
          } else {
            this.value.push(value)
          }
          this.selectedText = this.value
            .map(value => this.options.find(option => option.value === value).text)
            .join(', ')
        } else {
          this.value = this.options[index].value
          this.selectedText = this.options[index].text
          this.open = false
        }
      },
      onClick () {
        this.open = !this.open
      }
    }
  }
</script>
<template>
  <fura-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selected-text="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :marked-index="markedIndex"
    :immediate-scroll="immediateScroll"
    :options="options"
    @select="onSelect"
    @click="onClick"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Base dropdown',
        description: 'Dropdown field without behavior',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        open: false,
        value: null,
        selectedText: '',
        placeholder: 'Pick an element',
        readonly: false,
        multiple: false,
        markedIndex: -1,
        immediateScroll: false,
        options: [
          { type: 'header', text: 'Fruits' },
          { text: 'Apple', value: 'apple' },
          { text: 'Banana', value: 'banana' },
          { text: 'Mango', value: 'mango' },
          { text: 'Orange', value: 'orange', disabled: true },
          { text: 'Passionfruit', value: 'passionfruit' },
          { text: 'Grape', value: 'grape' },
          { type: 'divider' },
          { type: 'header', text: 'Vegetables' },
          { text: 'Broccoli', value: 'broccoli' },
          { text: 'Carrot', value: 'carrot' },
          { text: 'Lettuce', value: 'lettuce' }
        ]
      }
    },
    methods: {
      onSelect (index) {
        if (this.multiple) {
          const value = this.options[index].value
          const valueIndex = this.value.indexOf(value)
          if (valueIndex > -1) {
            this.value.splice(valueIndex, 1)
          } else {
            this.value.push(value)
          }
          this.selectedText = this.value
            .map(value => this.options.find(option => option.value === value).text)
            .join(', ')
        } else {
          this.value = this.options[index].value
          this.selectedText = this.options[index].text
          this.open = false
        }
      },
      onClick () {
        this.open = !this.open
      }
    }
  }
</script>
<template>
  <fura-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selected-text="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :marked-index="markedIndex"
    :immediate-scroll="immediateScroll"
    :options="options"
    @select="onSelect"
    @click="onClick"
  >
    <template v-slot:default="slotProps">
      <div>
        <fura-button
          style="width: 100%"
          :primary="slotProps.selected"
          :text="slotProps.option.text"
          @click="slotProps.click()"
        />
      </div>
    </template>
    <template v-slot:header="slotProps">
      <div>
        <h3 v-text="slotProps.option.text" />
      </div>
    </template>
    <template v-slot:divider>
      <div>
        <hr />
      </div>
    </template>
  </fura-dropdown>
</template>
</docs>
