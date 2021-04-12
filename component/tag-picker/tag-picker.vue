<script>
import FuraBaseTagPicker from '../base-tag-picker'
import { startsWith, equalInsensitive } from '../../utils/text'
import debounce from '../../utils/debounce'

export default {
  name: 'FuraTagPicker',
  components: { FuraBaseTagPicker },
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
    /** Lista de valores seleccionados. */
    modelValue: { type: Array, default: () => [] },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Método asincrónico para solicitar los elementos candidatos a elegir. */
    getItems: { type: Function, required: true },
    /** Milisegundos entre dos solicitudes de elementos candidatos. */
    getItemsWait: { type: Number, default: 0 },
    /** Indica si los elementos seleccionados deben ocultarse de los elementos candidatos. */
    filterItems: { type: Boolean, default: false },
    /** Indica si el TagPicker se autocompleta. A medida que el usuario ingresa texto, se le sugerirán posibles coincidencias de la lista de opciones. */
    autoComplete: { type: Boolean, default: false },
    /** Indica si el campo ignora los acentos al autocompletar el valor. */
    accentInsensitive: { type: Boolean, default: false },
    /** La cantidad máxima de elementos que se pueden seleccionar. */
    maxSelectedItems: { type: Number, default: -1 },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: '' },
    /** El texto a mostrar en el progreso de carga. */
    loadingText: { type: String, default: '' },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false }
  },
  data () {
    return {
      open: false,
      items: [],
      suggestedIndex: -1,
      itemsLoaded: false
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de TagPicker.
     * @property {Array} modelValue Lista de valores seleccionados.
     */
    'update:modelValue'
  ],
  computed: {
    debouncedHandleInput () {
      const { handleInput, getItemsWait } = this
      return debounce(handleInput, getItemsWait, this)
    }
  },
  methods: {
    isItemSelected (item) {
      for (const selected of this.modelValue) {
        if (selected.value === item.value) return true
      }
      return false
    },
    handleRemove (index) {
      const prevElements = this.modelValue.slice(0, index)
      const nextElements = this.modelValue.slice(index + 1)
      const newValue = [...prevElements, ...nextElements]
      this.$emit('update:modelValue', newValue)
    },
    handleKeydown (event) {
      const { select, autofill } = this.$refs.tagPicker.$refs
      const { code } = event
      if (code === 'ArrowDown' || code === 'ArrowUp') {
        event.preventDefault()
        const indexIncrement = code === 'ArrowDown' ? 1 : -1
        this.suggestedIndex = select.getNextEnabledOptionIndex(this.suggestedIndex, indexIncrement)
        select.scrollToOption(this.suggestedIndex)
        this.$nextTick(() => autofill.suggest(this.items[this.suggestedIndex].text, !this.autoComplete))
      } else if (code === 'Enter') {
        if (this.autoComplete) {
          this.handleSelect(this.suggestedIndex)
        } else {
          const selectedIndex = this.items.findIndex(item =>
            (!item.type || item.type === 'option') &&
            !item.disabled &&
            equalInsensitive(item.text, autofill.$refs.field.value, this.accentInsensitive)
          )
          this.handleSelect(selectedIndex)
        }
      }
    },
    async handleInput (text) {
      this.items = []
      if (text) {
        this.itemsLoaded = false
        this.open = true
        const items = await this.getItems(text)
        this.items = this.filterItems
          ? items.filter(item => !this.isItemSelected(item))
          : items
        if (this.autoComplete) {
          this.suggestedIndex = this.items.findIndex(item =>
            (!item.type || item.type === 'option') &&
          !item.disabled &&
          startsWith(item.text, text, this.accentInsensitive)
          )
        }
      } else {
        this.open = false
      }
      this.itemsLoaded = true
    },
    handleSelect (index) {
      const selected = this.items[index]
      if (
        !this.isItemSelected(selected) &&
        (this.maxSelectedItems < 0 || this.modelValue.length < this.maxSelectedItems)
      ) {
        this.items = []
        this.$refs.tagPicker.$refs.autofill.$refs.field.value = ''
        this.open = false
        this.$emit('update:modelValue', [...this.modelValue, selected])
      }
    }
  },
  debounce
}
</script>
<template>
  <FuraBaseTagPicker
    ref="tagPicker"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :selected-items="modelValue"
    :items="items"
    :suggested-index="suggestedIndex"
    :placeholder="placeholder"
    :readonly="readonly"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :items-loaded="itemsLoaded"
    :loading-text="loadingText"
    :immediate-scroll="immediateScroll"
    @remove="handleRemove"
    @keydown="handleKeydown"
    @input="debouncedHandleInput"
    @select="handleSelect"
  >
    <template #tag="slotProps">
      <!--
        @slot Elemento seleccionado de TagPicker.
        @binding {object} item Item reference.
        @binding {number} index Item's index.
        @binding {function} click Function to unselect the item.
      -->
      <slot
        name="tag"
        :item="slotProps.item"
        :index="slotProps.index"
        :click="slotProps.click"
      />
    </template>

    <template #item="slotProps">
      <!--
        @slot Elemento candidato de TagPicker.
        @binding {object} option Referencia al elemento.
        @binding {number} index Índice del elemento.
        @binding {boolean} selected Estado de selecionado del elemento.
        @binding {boolean} marked Estado marcado del elemento.
        @binding {boolean} highlighted Estado resaltado del elemento.
        @binding {function} click Función para seleccionar el elemento.
      -->
      <slot
        name="item"
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
        @slot Encabezado de TagPicker
        @binding {object} option Referencia al elemento.
        @binding {number} index Índice del elemento.
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
        @slot Separador del TagPicker
        @binding {object} option Referencia al elemento.
        @binding {number} index Índice del elemento.
      -->
      <slot
        name="divider"
        :option="slotProps.option"
        :index="slotProps.index"
        :selected="slotProps.selected"
        :click="slotProps.click"
      />
    </template>
  </FuraBaseTagPicker>
</template>

<docs>
<script>
  import furaVue from 'fura-vue'

  const iconItems = Object.keys(furaVue.components.Icon.code)
    .map(name => ({ value: name, text: name }))
  function getItems (text) {
    return new Promise(function (resolve) {
      setTimeout(() => {
        const found = iconItems.filter(item => item.text.toLowerCase().startsWith(text))
        resolve(found)
      }, 500 + (Math.random() * 250));
    })
  }

  export default {
    data () {
      return {
        label: 'Base tagPicker',
        description: 'tagPicker field without behavior',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        suggestedIndex: -1,
        placeholder: 'Pick an element',
        readonly: false,
        autoComplete: false,
        accentInsensitive: false,
        loadingText: 'Loading...',
        immediateScroll: false,
        selectedItems: [],
        getItems: getItems,
        getItemsWait: 250,
        filterItems: false
      }
    }
  }
</script>
<template>
  <fura-tag-picker
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :suggested-index="suggestedIndex"
    :placeholder="placeholder"
    :readonly="readonly"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :loading-text="loadingText"
    :immediate-scroll="immediateScroll"
    :get-items="getItems"
    :get-items-wait="getItemsWait"
    :filter-items="filterItems"
    v-model="selectedItems"
  />
</template>
</docs>
