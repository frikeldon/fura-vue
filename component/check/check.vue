<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraCheck',
  components: { FuraIcon },
  props: {
    /** Valor actual del campo. */
    modelValue: { type: Boolean, default: false },
    /** Representa Label como deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario pulsa sobre Check.
     * @property {boolean} modelValue Nuevo valor de modelValue
     */
    'update:modelValue'
  ],
  methods: {
    handleClick () {
      if (!this.disabled && !this.readonly) {
        this.$emit('update:modelValue', !this.modelValue)
      }
    }
  }
}
</script>

<template>
  <div
    :class="{
      'fura-checked': modelValue,
      'fura-disabled': disabled
    }"
    @click.stop="handleClick"
  >
    <FuraIcon
      class="fura-circle"
      name="CircleRing"
    />
    <FuraIcon
      class="fura-checkmark"
      name="StatusCircleCheckmark"
    />
  </div>
</template>

<style lang="less" scoped src="./check.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        checked: true,
        disabled: false
      }
    }
  }
</script>
<template>
  <fura-check
    :disabled="disabled"
    v-model="checked"
  />
</template>
</docs>
