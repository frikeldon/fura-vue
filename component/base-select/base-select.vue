<script>
import Icon from '../icon'

export default {
  components: { Icon },
  props: {
    /** Las opciones de Select. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    value: { type: undefined, default: undefined },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Índice de la opción marcada. */
    markedIndex: { type: Number, default: -1 },
    /** Índice de la opción resaltada. */
    highlightedIndex: { type: Number, default: -1 },
    /** Indica si las opciones deben ocultar la caja de selección cuando el estado es multiple. */
    hideCheckbox: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona una opción.
     * @property {number} index Indice de la opcion seleccionada.
     */
    'select',
    /**
     * Se genera cuando el usuario pulsa una tecla.
     * @property {KeyboardEvent} keyboardEvent Descripción del evento de pulsación de tecla.
     */
    'keydown'
  ],
  data () {
    return {
      /** Coleccioón de referencias de las opciones. */
      refOptions: []
    }
  },
  computed: {
    /** Lista de índices con las opciones seleccionadas. */
    selectedIndices () {
      const { multiple, value, options } = this
      const values = multiple ? value : [value]
      const selectedIndices = []
      for (let index = 0; index < options.length; index += 1) {
        const option = options[index]
        if (
          (!option.type || option.type === 'option') &&
          values?.includes(option.value)
        ) {
          selectedIndices.push(index)
        }
      }
      return selectedIndices
    }
  },
  methods: {
    /**
     * Comprueba si 'value' es un valor seleccionado.
     * @param {object} value El valor a comprobar.
     * @returns {boolean} 'true' si 'value' es un valor seleccionado. 'false' en caso contrario.
     * @public
     */
    isValueSelected (value) {
      const currentValue = this.multiple ? this.value : [this.value]
      return Array.isArray(currentValue) &&
        currentValue.length > 0 &&
        currentValue.includes(value)
    },
    /**
     * Desplaza el componente hasta hacer visible la opción indicado.
     * @param {number} index Índice de la opción que debe ser visible.
     * @param {boolean} immediate Indica si el desplazamiento debe hacerse sin animación.
     * @public
     */
    scrollToOption (index, immediate = false) {
      const element = this.refOptions.find(ref => ref.index === index)?.el
      if (element) {
        const parent = this.$el
        if (immediate) {
          this.$nextTick(() => (parent.scrollTop = element.offsetTop))
        } else {
          const parentBottom = parent.scrollTop
          const parentTop = parentBottom + parent.getBoundingClientRect().height
          const elementBottom = element.offsetTop
          const elementTop = elementBottom + element.getBoundingClientRect().height
          if (parentBottom > elementBottom) {
            element.scrollIntoView({ block: 'start', behavior: 'smooth' })
          } else if (parentTop < elementTop) {
            element.scrollIntoView({ block: 'end', behavior: 'smooth' })
          }
        }
      }
    },
    /**
     * Recupera el índice de la opción de tipo 'option' no deshabilitada siguiente a la opción base.
     * @param {number} index Índice de la opción base.
     * @param {number} increment Distancia entre la opción base y la siguiente opción no deshabilitada.
     * @returns {number} Indice de la opción seleccionada a una distancia 'increment' de 'index'.
     * @public
     */
    getNextEnabledOptionIndex (index, increment) {
      const currentOption = this.options[index]
      const filteredOptions = this.options.filter(item => (!item.type || item.type === 'option') && !item.disabled)
      const currentOptionIndex = filteredOptions.indexOf(currentOption)
      const nextOptionIndex = currentOptionIndex > -1
        ? (filteredOptions.length + currentOptionIndex + increment) % filteredOptions.length
        : increment < 0
          ? filteredOptions.length - 1
          : 0
      const nextOptionItem = filteredOptions[nextOptionIndex]
      return this.options.indexOf(nextOptionItem)
    },
    handleKeydown (event) {
      if (!this.disabled && !this.readonly) {
        this.$emit('keydown', event)
      }
    },
    handleClick (index) {
      const option = this.options[index]
      if (
        !this.readonly &&
        !this.disabled &&
        !option.disabled &&
        (!option.type || option.type === 'option')
      ) {
        this.$emit('select', index)
      }
    }
  },
  beforeUpdate () {
    this.refOptions = []
  }
}
</script>

<template>
  <div
    class="select"
    :tabindex="disabled ? '' : '0'"
    @keydown.stop.prevent="handleKeydown"
  >
    <template v-for="(option, index) in options">
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
        v-if="!option.type || option.type === 'option'"
        :option="option"
        :index="index"
        :marked="index === markedIndex"
        :highlighted="index === highlightedIndex"
        :selected="isValueSelected(option.value)"
        :click="() => handleClick(index)"
      >
        <div
          v-if="multiple && !hideCheckbox"
          :ref="el => refOptions.push({ index, el })"
          :key="`option_multiple_${index}`"
          class="option checkbox"
          :class="{
            selected: isValueSelected(option.value),
            disabled: disabled || option.disabled,
            marked: !(disabled || option.disabled) && (markedIndex === index),
            highlighted: !(disabled || option.disabled) && (highlightedIndex === index)
          }"
          @click.stop="handleClick(index)"
        >
          <label>
            <div>
              <Icon
                class="icon"
                name="CheckMark"
                @click.stop="handleClick(index)"
              />
            </div>
            <span v-text="option.text" />
          </label>
        </div>

        <button
          v-else
          :ref="el => refOptions.push({ index, el })"
          :key="`option_${index}`"
          class="option button"
          :class="{
            selected: isValueSelected(option.value),
            disabled: disabled || option.disabled,
            marked: !(disabled || option.disabled) && (markedIndex === index),
            highlighted: !(disabled || option.disabled) && (highlightedIndex === index)
          }"
          :disabled="disabled || option.disabled"
          @click.stop="handleClick(index)"
          v-text="option.text"
        />
      </slot>

      <!--
        @slot Encabezado de Select
        @binding {object} option Referencia al la opción.
        @binding {number} index Indice de la opción.
      -->
      <slot
        v-else-if="option.type === 'header'"
        name="header"
        :option="option"
        :index="index"
      >
        <div
          :key="index"
          class="header"
          :class="{ disabled: disabled || option.disabled }"
        >
          <span v-text="option.text" />
        </div>
      </slot>

      <!--
        @slot Separador del Select
        @binding {object} option Referencia a la opción.
        @binding {number} index Indice de la opción.
      -->
      <slot
        v-else-if="option.type === 'divider'"
        name="divider"
        :option="option"
        :index="index"
      >
        <div
          :key="index"
          class="divider"
        />
      </slot>
    </template>
  </div>
</template>

<style lang="less" scoped src="./base-select.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        options: [
          { text: 'Option a', value: 'a' },
          { text: 'Option b', value: 'b' },
          { text: 'Option c', value: 'c' },
          { text: 'Option d', value: 'd', disabled: true },
          { text: 'Option e', value: 'e' }
        ],
        value: null
      }
    },
    methods: {
      onSelect (index) {
        this.value = this.options[index].value
      }
    }
  }
</script>
<template>
  <fura-base-select
    :options="options"
    :value="value"
    @select="onSelect"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
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
        ],
        value: null
      }
    },
    methods: {
      onSelect (index) {
        this.value = this.options[index].value
      }
    }
  }
</script>
<template>
  <fura-base-select
    :options="options"
    :value="value"
    @select="onSelect"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
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
        ],
        values: []
      }
    },
    methods: {
      onSelect (index) {
        const value = this.options[index].value
        const valueIndex = this.values.indexOf(value)
        if (valueIndex > -1) {
          this.values.splice(valueIndex, 1)
        } else {
          this.values.push(value)
        }
      }
    }
  }
</script>
<template>
  <fura-base-select
    multiple
    :options="options"
    :value="values"
    @select="onSelect"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
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
        ],
        value: null
      }
    },
    methods: {
      onSelect (index) {
        this.value = this.options[index].value
      }
    }
  }
</script>
<template>
  <fura-base-select
    :options="options"
    :value="value"
    @select="onSelect"
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
  </fura-base-select>
</template>
</docs>
