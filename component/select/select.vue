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
    }
  }
</script>
<template>
  <fura-select
    :options="options"
    v-model="value"
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
    }
  }
</script>
<template>
  <fura-select
    :options="options"
    v-model="value"
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
    }
  }
</script>
<template>
  <fura-select
    multiple
    :options="options"
    v-model="values"
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
    }
  }
</script>
<template>
  <fura-select
    :options="options"
    :value="value"
    v-model="value"
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
  </fura-select>
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
    }
  }
</script>
<template>
  <fura-select
    style="max-height: 200px; overflow-y: scroll;"
    :options="options"
    v-model="value"
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
    }
  }
</script>
<template>
  <fura-select
    multiple
    :options="options"
    :max-selected-options="2"
    v-model="values"
  />
</template>
</docs>
