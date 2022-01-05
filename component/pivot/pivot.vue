<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraPivot',
  components: { FuraIcon },
  props: {
    /** Valor de la pestaña seleccionada. */
    modelValue: { type: String, default: null },
    /** Pestañas de Pivot */
    tabs: { type: Array, required: true },
    /** Indica si las pestañas deben dibujarse grandes. */
    large: { type: Boolean, default: false },
    /** Indica si las pestañas deben dibujarse como pestañas o como enlaces. */
    tabStyle: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona una pestaña.
     * @property {string} modelValue Valor de la pestaña seleccionada.
     */
    'update:modelValue'
  ]
}
</script>

<template>
  <div
    :class="{
      'fura-large': large,
      'fura-tabStyle': tabStyle
    }"
  >
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      type="button"
      :class="{ 'fura-selected': modelValue === tab.value }"
      @click.stop="$emit('update:modelValue', tab.value)"
    >
      <!--
        @slot Pestaña de Pivot.
        @binding {object} tab Referencia a la pestaña.
        @binding {number} index Indice de la pestaña.
      -->
      <slot
        :tab="tab"
        :index="index"
      >
        <span>
          <span>
            <FuraIcon
              v-if="tab.icon"
              class="fura-icon"
              :name="tab.icon"
            />
            <span
              class="fura-label"
              v-text="tab.text"
            />
            <span
              v-if="tab.count != null"
              class="fura-count"
              v-text="`(${tab.count.toString()})`"
            />
          </span>
        </span>
      </slot>
    </button>
  </div>
</template>

<style lang="less" scoped src="./pivot.less"></style>
