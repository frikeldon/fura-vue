<script>
import Icon from '../icon'

export default {
  components: { Icon },
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
        }
        this.$emit('update:modelValue', !this.modelValue)
      }
    }
  }
}
</script>

<template>
  <label
    class="checkbox"
    :class="{
      indeterminate,
      checked: !indeterminate && modelValue,
      disabled,
      boxSideEnd: boxSide === 'end'
    }"
    @click.stop="handleClick"
  >
    <div class="box">
      <Icon
        class="icon"
        name="CheckMark"
      />
    </div>
    <span
      v-if="label"
      class="label"
      v-text="label"
    />
  </label>
</template>

<style lang="less" scoped src="./checkbox.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        value: false
      }
    }
  }
</script>
<template>
  <fura-checkbox
    label="Checkbox"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        value: false,
        indeterminate: true
      }
    }
  }
</script>
<template>
  <fura-checkbox
    label="Checkbox"
    v-model="value"
    v-model:indeterminate="indeterminate"
  />
</template>
</docs>
