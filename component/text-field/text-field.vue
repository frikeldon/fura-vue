<script>
import FuraBaseFieldInput from '../base-field-input'
import FuraIcon from '../icon'

export default {
  name: 'FuraTextField',
  components: {
    FuraBaseFieldInput,
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
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Prefijo que se muestra antes del contenido del campo de texto. No está incluido en el valor. */
    prefix: { type: String, default: '' },
    /** Sufijo que se muestra después del contenido del campo de texto. No está incluido en el valor. */
    suffix: { type: String, default: '' },
    /** Si el campo de texto permite entrar varias líneas. */
    multiline: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en el campo de texto. */
    icon: { type: String, default: '' },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Longitud máxima (número de caracteres) del valor. */
    maxlength: { type: Number, default: null },
    /** Indica si el campo es no redimensionable para campos de texto de varias líneas. */
    unresizable: { type: Boolean, default: false },
    /** Indica si se ajustaautomáticamente la altura para campos de texto de varias líneas. */
    autoAdjustHeight: { type: Boolean, default: false },
    /** Indica si el campo es del tipo 'password' */
    password: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: String, default: '' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /** Se genera cuando el usuario hace clic en el icono del campo. */
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
     * Se genera cuando el usuario pulsa una tecla.
     * @property {KeyboardEvent} keyboardEvent Descripción del evento de pulsación de tecla.
     */
    'keydown'
  ],
  methods: {
    adjustHeight () {
      if (this.multiline && this.autoAdjustHeight) {
        const { field } = this.$refs
        if (field && field.tagName === 'TEXTAREA') {
          field.style.height = ''
          field.style.height = `${field.scrollHeight + 2}px` // +2 to avoid vertical scroll bars
        }
      }
    },
    handleTextareaInput (event) {
      this.adjustHeight()
      this.$emit('update:modelValue', event.target.value)
    },
    handleKeyDown (event) {
      if (!event.code === 'Tab') {
        this.$emit('keydown', event)
      }
    }

  },
  mounted () {
    this.adjustHeight()
  }
}
</script>

<template>
  <FuraBaseFieldInput
    class="fura-textField"
    :class="{ 'fura-multiline': multiline }"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    @click="$refs.field.focus()"
  >
    <div
      v-if="prefix"
      class="fura-prefix"
    >
      <span v-text="prefix" />
    </div>

    <textarea
      v-if="multiline"
      ref="field"
      class="fura-field"
      :class="{
        'fura-hasIcon': icon,
        'fura-unresizable': unresizable
      }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || null"
      :readonly="readonly || null"
      :maxlength="maxlength"
      @input.stop="handleTextareaInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @keydown="handleKeyDown"
    />
    <input
      v-else
      ref="field"
      :type="password ? 'password' : 'text'"
      class="fura-field"
      :class="{ 'fura-hasIcon': icon }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled || null"
      :readonly="readonly || null"
      :maxlength="maxlength"
      @input.stop="$emit('update:modelValue', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @keydown="handleKeyDown"
    >

    <FuraIcon
      v-if="icon"
      class="fura-icon"
      :name="icon"
      @click.stop="$emit('click')"
    />

    <div
      v-if="suffix"
      class="fura-suffix"
    >
      <span v-text="suffix" />
    </div>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./text-field.less"></style>
