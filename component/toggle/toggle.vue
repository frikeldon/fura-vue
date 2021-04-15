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
  ]
}
</script>

<template>
  <div
    class="searchBox"
    :class="{ inline, disabled, withoutText: !onText && !offText }"
  >
    <FuraLabel
      v-if="label"
      class="label"
      :required="required"
      :disabled="disabled"
      v-text="label"
    />
    <div class="container">
      <button
        class="toggle"
        :class="{ checked: modelValue }"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <span />
      </button>
      <label
        v-if="onText || offText"
        class="stateText"
        v-text="modelValue ? onText : offText"
        @click="$emit('update:modelValue', !modelValue)"
      />
    </div>
  </div>
</template>

<style lang="less" scoped src="./toggle.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'Toggle',
        onText: 'On',
        offText: 'Off',
        inline: false,
        disabled: false,
        value: false
      }
    }
  }
</script>
<template>
  <fura-toggle
    :label="label"
    :on-text="onText"
    :off-text="offText"
    :inline="inline"
    :disabled="disabled"
    v-model="value"
  />
</template>
</docs>
