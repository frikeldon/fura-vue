<script>
import FuraBaseFieldCombo from '../base-field-combo'
import FuraAutofill from '../autofill'
import FuraBaseSelect from '../base-select'
import FuraIcon from '../icon'
import FuraSpinner from '../spinner'
import dropup from '../../mixin/dropup.js'

export default {
  name: 'FuraBaseComboBox',
  mixins: [dropup],
  components: {
    FuraBaseFieldCombo,
    FuraBaseSelect,
    FuraAutofill,
    FuraIcon,
    FuraSpinner
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
    /** Las opciones de ComboBox. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    value: { type: undefined, default: undefined },
    /** Texto descriptivo de los valores seleccionados.. */
    selectedText: { type: String, default: '' },
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
    /** Índice de la opción sugerida. */
    suggestedIndex: { type: Number, default: -1 },
    /** Indica si el ComboBox debe mostrar las opciones en vez de un progreso de carga. */
    optionsLoaded: { type: Boolean, default: true },
    /** El texto a mostrar en el progreso de carga. */
    loadingText: { type: String, default: '' },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false },
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
    'keydown',
    /** Se genera cuando el usuario hace clic en el desplegable de ComboBox. */
    'click',
    /**
     * Se genera cuando el usuario realiza un cambio en el campo de texto de ComboBox.
     * @property {string} text Texto introducido en el campo de texto de ComboBox.
     */
    'input',
    /**
     * Se genera cuando el componente tiene el panel desplegado y el usuario hace clic fuera del componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'clickOutside',
    /** Se genera cuando el componente recibe el foco. */
    'focus',
    /** Se genera cuando el componente pierde el foco. */
    'blur'
  ],
  computed: {
    suggestedText () {
      const suggestedOption = this.options[this.suggestedIndex]
      return suggestedOption?.text ?? ''
    },
    autofillPlaceholder () {
      const { selectedText, placeholder } = this
      return selectedText || placeholder || ''
    }
  },
  methods: {
    handleCaretClick (event) {
      if (!this.disabled && !this.readonly) {
        this.$emit('click')
      }
    },
    handleFuraAutofillClick (event) {
      if (!this.disabled && !this.readonly && !this.allowFreeform) {
        this.$emit('click')
      }
    }
  },
  watch: {
    suggestedIndex (index) {
      if (this.open && index in this.options) {
        this.$refs.select.scrollToOption(index, this.immediateScroll)
      }
    },
    open (open) {
      if (open) {
        const { select } = this.$refs
        if (select) {
          if (this.suggestedIndex in this.options) {
            select.scrollToOption(this.suggestedIndex, this.immediateScroll)
          } else if (select.selectedIndices.length > 0) {
            select.scrollToOption(select.selectedIndices[0], this.immediateScroll)
          }
        }
      }
    }
  }
}
</script>

<template>
  <FuraBaseFieldCombo
    ref="base"
    class="fura-comboBox"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open && !disabled && !readonly"
    :dropup="dropup"
    @click="$refs.autofill.focus()"
    @click-outside="$emit('clickOutside', $event)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <div class="fura-title">
      <FuraAutofill
        ref="autofill"
        class="fura-autofill"
        :autofill="autoComplete"
        :placeholder="autofillPlaceholder"
        :disabled="disabled"
        :readonly="!allowFreeform"
        :accent-insensitive="accentInsensitive"
        :suggested-value="autoComplete ? suggestedText : ''"
        @click.stop="handleFuraAutofillClick"
        @update:model-value="$emit('input', $event)"
        @keydown="$emit('keydown', $event)"
      />
    </div>
    <button
      type="button"
      class="fura-caret"
      :disabled="disabled || null"
      @click.stop="handleCaretClick"
    >
      <span>
        <FuraIcon
          class="fura-icon"
          name="ChevronDown"
          @click.stop="handleCaretClick"
        />
      </span>
    </button>
    <template #dropdown>
      <FuraBaseSelect
        v-if="optionsLoaded"
        ref="select"
        class="fura-select"
        :options="options"
        :value="value"
        :multiple="multiple"
        :hide-checkbox="hideCheckbox"
        :marked-index="suggestedIndex"
        @select="$emit('select', $event)"
        @keydown="$emit('keydown', $event)"
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
      </FuraBaseSelect>
      <div
        v-else
        class="fura-loadingDropdown"
      >
        <FuraSpinner
          class="fura-spinner"
          :label="loadingText"
        />
      </div>
    </template>
  </FuraBaseFieldCombo>
</template>

<style lang="less" scoped src="./base-combo-box.less"></style>
