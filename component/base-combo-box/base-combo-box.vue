<script>
import FuraBaseFieldCombo from '../base-field-combo'
import FuraAutofill from '../autofill'
import FuraBaseSelect from '../base-select'
import FuraIcon from '../icon'
import FuraSpinner from '../spinner'

export default {
  name: 'FuraBaseComboBox',
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
     * Se genera cuando el componente recibe el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'focus',
    /**
     * Se genera cuando el componente pierde el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
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
        this.$refs.select.scrollToOption(index)
      }
    },
    open (open) {
      if (open) {
        const { select } = this.$refs
        if (select) {
          if (this.suggestedIndex in this.options) {
            select.scrollToOption(this.suggestedIndex, true)
          } else if (select.selectedIndices.length > 0) {
            select.scrollToOption(select.selectedIndices[0], true)
          }
        }
      }
    }
  }
}
</script>

<template>
  <FuraBaseFieldCombo
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
    @click="$refs.autofill.focus()"
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
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>
    <button
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

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Base comboBox',
        description: 'ComboBox field without behavior',
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
        allowFreeform: false,
        autoComplete: false,
        accentInsensitive: false,
        suggestedIndex: -1,
        optionsLoaded: true,
        loadingText: 'Loading...',
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
          const valueIndex = this.value && this.value.indexOf(value)
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
  <fura-base-combo-box
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
    :allow-freeform="allowFreeform"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :suggested-index="suggestedIndex"
    :options-loaded="optionsLoaded"
    :loading-text="loadingText"
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
        label: 'Base comboBox',
        description: 'ComboBox field without behavior',
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
        multiple: true,
        allowFreeform: false,
        autoComplete: false,
        accentInsensitive: false,
        suggestedIndex: -1,
        optionsLoaded: true,
        loadingText: 'Loading...',
        immediateScroll: false,
        options: [
          { text: 'menjàrem', value: 'menjarem' },
          { text: 'bàscula', value: 'bascula' },
          { text: 'vàlid', value: 'valid' },
          { text: 'matalàs', value: 'matalas' },
          { text: 'pàmfil', value: 'pamfil' },
          { text: 'interès', value: 'interes' },
          { text: 'bèstia', value: 'bestia' },
          { text: 'mèrit', value: 'merit' },
          { text: 'canapè', value: 'canape' },
          { text: 'perquè', value: 'perque' },
          { text: 'cèntim', value: 'centim' },
          { text: 'mòdul', value: 'modul' },
          { text: 'allò', value: 'allo' },
          { text: 'òliba', value: 'oliba' },
          { text: 'repòs', value: 'repos' },
          { text: 'Sònia', value: 'Sonia' },
          { text: 'arròsvindré', value: 'arrosvindre' },
          { text: 'créixens', value: 'creixens' },
          { text: 'haguéreu', value: 'haguereu' },
          { text: 'accés', value: 'acces' },
          { text: 'també', value: 'tambe' },
          { text: 'Berlín', value: 'Berlin' },
          { text: 'pastís', value: 'pastis' },
          { text: 'legítima', value: 'legitima' },
          { text: 'veí', value: 'vei' },
          { text: 'rítmic', value: 'ritmic' },
          { text: 'tísic', value: 'tisic' },
          { text: 'pastós', value: 'pastos' },
          { text: 'furóncol', value: 'furoncol' },
          { text: 'tórtora', value: 'tortora' },
          { text: 'cantó', value: 'canto' },
          { text: 'institució', value: 'institucio' },
          { text: 'cautxú', value: 'cautxu' },
          { text: 'múscul', value: 'muscul' },
          { text: 'fúcsia', value: 'fucsia' },
          { text: 'brúixola', value: 'bruixola' },
          { text: 'pallús', value: 'pallus' }
        ]
      }
    },
    methods: {
      onSelect (index) {
        if (this.multiple) {
          const value = this.options[index].value
          const valueIndex = this.value && this.value.indexOf(value)
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
  <fura-base-combo-box
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
    :allow-freeform="allowFreeform"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :suggested-index="suggestedIndex"
    :options-loaded="optionsLoaded"
    :loading-text="loadingText"
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
        label: 'Base comboBox',
        description: 'ComboBox field without behavior',
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
        allowFreeform: false,
        autoComplete: false,
        accentInsensitive: false,
        suggestedIndex: -1,
        optionsLoaded: true,
        loadingText: 'Loading...',
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
          const valueIndex = this.value && this.value.indexOf(value)
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
  <fura-base-combo-box
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
    :allow-freeform="allowFreeform"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :suggested-index="suggestedIndex"
    :options-loaded="optionsLoaded"
    :loading-text="loadingText"
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
  </fura-base-combo-box>
</template>
</docs>
