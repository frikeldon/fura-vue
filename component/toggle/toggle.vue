<script>
import FuraLabel from '../label'

export default {
  name: 'FuraToggle',
  components: {
    FuraLabel
  },
  props: {
    /** Etiqueta que se muestra encima del campo de formulario asociado. */
    label: { type: String, default: '' },
    /** El texto a mostrar cuando Toggle esta en On. */
    onText: { type: String, default: '' },
    /** El texto a mostrar cuando Toggle esta en Off. */
    offText: { type: String, default: '' },
    /** Indica si la etiqueta debe mostrarse en la misma linea que Toggle. */
    inline: { type: Boolean, default: false },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Toggle.
     * @property {boolean} modelValue Nuevo valor de modelValue
     */
    'update:modelValue'
  ],
  methods: {
    handleClick () {
      if (!this.disabled) {
        this.$emit('update:modelValue', !this.modelValue)
      }
    }
  }
}
</script>

<template>
  <div
    class="fura-searchBox"
    :class="{
      'fura-inline': inline,
      'fura-disabled': disabled,
      'fura-withoutText': !onText && !offText
    }"
  >
    <FuraLabel
      v-if="label"
      class="fura-label"
      :disabled="disabled"
      v-text="label"
    />
    <div class="fura-container">
      <button
        type="button"
        class="fura-toggle"
        :class="{ 'fura-checked': modelValue }"
        :disabled="disabled || null"
        @click.stop="handleClick"
      >
        <span />
      </button>
      <label
        v-if="onText || offText"
        class="fura-stateText"
        v-text="modelValue ? onText : offText"
        @click.stop="handleClick"
      />
    </div>
  </div>
</template>

<style lang="less" scoped src="./toggle.less"></style>
