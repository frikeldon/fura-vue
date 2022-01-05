<script>
import FuraBaseFieldCombo from '../base-field-combo'
import FuraBaseSelect from '../base-select'
import FuraIcon from '../icon'
import dropup from '../../mixin/dropup.js'

export default {
  name: 'FuraBaseDropdown',
  mixins: [dropup],
  components: {
    FuraBaseFieldCombo,
    FuraBaseSelect,
    FuraIcon
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
    'click',
    /**
     * Se genera cuando el componente recibe el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'focus',
    /**
     * Se genera cuando el componente pierde el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'blur',
    /**
     * Se genera cuando el componente tiene el panel desplegado y el usuario hace clic fuera del componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'clickOutside'
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
          select.scrollToOption(this.markedIndex, this.immediateScroll)
        } else if (select.selectedIndices.length > 0) {
          select.scrollToOption(select.selectedIndices[0], this.immediateScroll)
        }
      }
    }
  }
}
</script>

<template>
  <FuraBaseFieldCombo
    ref="base"
    class="fura-dropdown"
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
    @click="$refs.container.focus()"
    @click-outside="$emit('clickOutside', $event)"
  >
    <div
      ref="container"
      class="fura-container"
      :tabindex="disabled ? '' : '0'"
      @click.stop="$emit('click')"
      @keydown.stop.prevent="$emit('keydown', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
      <span
        class="fura-title"
        v-text="selectedText || placeholder"
      />
      <span class="fura-caret">
        <FuraIcon
          class="fura-icon"
          name="ChevronDown"
          @click.stop="$emit('click')"
        />
      </span>
    </div>
    <template #dropdown>
      <FuraBaseSelect
        ref="select"
        class="fura-select"
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
      </FuraBaseSelect>
    </template>
  </FuraBaseFieldCombo>
</template>

<style lang="less" scoped src="./base-dropdown.less"></style>
