<script>
import Icon from '../icon'

export default {
  name: 'FuraPivot',
  components: { Icon },
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
  <div :class="{ large, tabStyle }">
    <button
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ selected: modelValue === tab.value }"
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
            <Icon
              v-if="tab.icon"
              class="icon"
              :name="tab.icon"
            />
            <span
              class="label"
              v-text="tab.text"
            />
            <span
              v-if="tab.count != null"
              class="count"
              v-text="`(${tab.count.toString()})`"
            />
          </span>
        </span>
      </slot>
    </button>
  </div>
</template>

<style lang="less" scoped src="./pivot.less"></style>

<docs>
<script>
export default {
  data () {
    return {
      modelValue: null,
      large: true,
      tabStyle: false,
      tabs: [
        { text: 'My files', value: 'files', icon: 'Emoji2', count: 42 },
        { text: 'Recent', value: 'recent', icon: 'Recent', count: 23 },
        { text: 'Shared with me', value: 'shared', icon: 'Ringer', count: 1 }
      ]
    }
  }
}
</script>
<template>
  <fura-pivot
    :large="large"
    :tabStyle="tabStyle"
    :tabs="tabs"
    v-model="modelValue"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return {
      modelValue: null,
      large: false,
      tabStyle: true,
      tabs: [
        { text: 'My files', value: 'files' },
        { text: 'Recent', value: 'recent' },
        { text: 'Shared with me', value: 'shared' }
      ]
    }
  }
}
</script>
<template>
  <fura-pivot
    :large="large"
    :tabStyle="tabStyle"
    :tabs="tabs"
    v-model="modelValue"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return {
      modelValue: null,
      large: false,
      tabStyle: false,
      tabs: [
        { text: 'My files', value: 'files', icon: 'Emoji2' },
        { text: 'Recent', value: 'recent', icon: 'Recent' },
        { text: 'Shared with me', value: 'shared', icon: 'Ringer' }
      ]
    }
  }
}
</script>
<template>
  <fura-pivot
    :large="large"
    :tabStyle="tabStyle"
    :tabs="tabs"
    v-model="modelValue"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return {
      modelValue: null,
      large: false,
      tabStyle: false,
      tabs: [
        { text: 'Passed', value: 'pass', color: '#b7ded2' },
        { text: 'Warning', value: 'warning', color: '#f7c297' },
        { text: 'Error', value: 'error', color: '#f6a6b2' }
      ]
    }
  }
}
</script>
<template>
  <fura-pivot
    :large="large"
    :tabStyle="tabStyle"
    :tabs="tabs"
    v-model="modelValue"
    v-slot="slotProps"
  >
    <span :style="{
      display: 'inline-block',
      height: '100%',
      padding: '0px 15px',
      background: slotProps.tab.color
    }">
      <span v-text="slotProps.tab.text" />
    </span>
  </fura-pivot>
</template>
</docs>
