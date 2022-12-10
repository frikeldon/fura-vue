<script>
import FuraLabel from '../label'

export default {
  name: 'FuraChoiceGroup',
  components: { FuraLabel },
  props: {
    /** Valor actual de ChoiceGroup. */
    modelValue: { type: String, default: null },
    /** Etiqueta descriptiva para ChoiceGroup. */
    label: { type: String, default: '' },
    /** Indicativo visual de que el campo es requerido. */
    required: { type: Boolean, default: false },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Las opciones de ChoiceGroup. */
    options: { type: Array, required: true },
    /** Dibuja ChoiceGroup en una fila en lugar de en una columna. */
    inRow: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Nuevo valor de modelValue
     */
    'update:modelValue'
  ],
  methods: {
    handleClick (option) {
      if (
        !this.disabled &&
        !this.readonly &&
        !option.disabled &&
        option.value !== this.modelValue
      ) {
        this.$emit('update:modelValue', option.value)
      }
    }
  }
}
</script>

<template>
  <div>
    <FuraLabel
      v-if="label"
      :disabled="disabled || null"
      :required="required"
    >
      {{ label }}
    </FuraLabel>
    <div
      class="fura-field"
      :class="{ 'fura-inRow': inRow }"
    >
      <div
        v-for="(option, index) in options"
        :key="index"
      >
        <div
          class="fura-option"
          :class="{
            'fura-checked': option.value === modelValue,
            'fura-disabled': disabled || option.disabled
          }"
          @click.stop="handleClick(option)"
        >
          <label>
            <!--
              @slot Opción de ChoiceGroup.
              @binding {object} option Referencia a la opción.
              @binding {number} index Indice de la opción.
            -->
            <slot
              :option="option"
              :index="index"
            >
              <span v-text="option.text" />
            </slot>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./choice-group.less"></style>
