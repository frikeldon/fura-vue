<script>
import BaseFieldCombo from '../base-field-combo'
import BaseSelect from '../base-select'
import Icon from '../icon'

export default {
  name: 'FuraBaseDropdown',
  components: {
    BaseFieldCombo,
    BaseSelect,
    Icon
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
    /** Indica si se muestra el panel del campo de formulario asociado. */
    open: { type: Boolean, default: false },
    /** Las opciones de Dropdown. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    value: { type: undefined, default: undefined },
    /** Texto descriptivo de los valores seleccionados.. */
    selectedText: { type: String, default: '' },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Índice de la opción marcada. */
    markedIndex: { type: Number, default: -1 },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false }
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
    'keydown',
    /** Se genera cuando el usuario hace clic en el campo de Dropdown. */
    'click'
  ],
  watch: {
    markedIndex (index) {
      if (this.open && index in this.options) {
        this.$refs.select.scrollToOption(index, this.immediateScroll)
      }
    },
    open (open) {
      if (open) {
        const { select } = this.$refs
        if (this.markedIndex in this.options) {
          select.scrollToOption(this.markedIndex, true)
        } else if (select.selectedIndices.length > 0) {
          select.scrollToOption(select.selectedIndices[0], true)
        }
      }
    }
  }
}
</script>

<template>
  <BaseFieldCombo
    class="dropdown"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open && !disabled && !readonly"
    @click="$refs.container.focus()"
  >
    <div
      ref="container"
      class="container"
      :tabindex="disabled ? '' : '0'"
      @click.stop="$emit('click')"
      @keydown.stop.prevent="$emit('keydown', $event)"
    >
      <span
        class="title"
        v-text="selectedText || placeholder"
        v-bind="$attrs"
      />
      <span class="caret">
        <Icon
          class="icon"
          name="ChevronDown"
          @click.stop="$emit('click')"
        />
      </span>
    </div>
    <template #dropdown>
      <BaseSelect
        ref="select"
        class="select"
        :options="options"
        :value="value"
        :multiple="multiple"
        :marked-index="markedIndex"
        @select="$emit('select', $event)"
        @keydown="$emit('keydown', $event)"
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
      </BaseSelect>
    </template>
  </BaseFieldCombo>
</template>

<style lang="less" scoped src="./base-dropdown.less"></style>

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
          if (this.value && valueIndex > -1) {
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
  <fura-base-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :errorMessage="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selectedText="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :markedIndex="markedIndex"
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
  <fura-base-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :errorMessage="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selectedText="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :markedIndex="markedIndex"
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
  <fura-base-dropdown
    :label="label"
    :description="description"
    :invalid="invalid"
    :errorMessage="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open"
    :value="value"
    :selectedText="selectedText"
    :placeholder="placeholder"
    :readonly="readonly"
    :multiple="multiple"
    :markedIndex="markedIndex"
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
  </fura-base-dropdown>
</template>
</docs>
