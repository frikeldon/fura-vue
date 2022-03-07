<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraCheckbox',
  components: { FuraIcon },
  props: {
    /** El valor de Checkbox. */
    modelValue: { type: Boolean, default: false },
    /**
     * Estado visual indeterminado. La configuración del estado indeterminado tiene
     * prioridad visual sobre el valor de Checkbox, pero no afecta a este.
     */
    indeterminate: { type: Boolean, default: false },
    /** Label a mostrar junto a la casilla de verificación. */
    label: { type: String, default: '' },
    /**
     * Indica si la casilla de verificación se dibuja antes (start) o después (end) de Label.
     * @values start, end
     */
    boxSide: {
      type: String,
      default: 'start',
      validator: value => !value || ['start', 'end'].includes(value)
    },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si Checkbox es de solo lectura. */
    readonly: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Checkbox.
     * @property {boolean} modelValue Nuevo valor de modelValue
     */
    'update:modelValue',
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Checkbox cuando el estado visual es indeterminado.
     * @property {boolean} indeterminate Nuevo valor de indeterminate
     */
    'update:indeterminate'
  ],
  methods: {
    handleClick () {
      if (!this.disabled && !this.readonly) {
        if (this.indeterminate) {
          this.$emit('update:indeterminate', false)
        } else {
          this.$emit('update:modelValue', !this.modelValue)
        }
      }
    }
  }
}
</script>

<template>
  <label
    class="fura-checkbox"
    :class="{
      'fura-indeterminate': indeterminate,
      'fura-checked': !indeterminate && modelValue,
      'fura-disabled': disabled,
      'fura-boxSideEnd': boxSide === 'end'
    }"
    @click.stop="handleClick"
  >
    <div class="fura-box">
      <FuraIcon
        class="fura-icon"
        name="CheckMark"
      />
    </div>
    <span
      v-if="label"
      class="fura-label"
      v-text="label"
    />
  </label>
</template>

<style lang="less" scoped src="./checkbox.less"></style>
