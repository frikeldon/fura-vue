<script>
import Icon from '../icon'

export default {
  name: 'FuraPanel',
  components: { Icon },
  props: {
    /**
     * El tipo de panel a mostrar.
     * @values custom, extraSmall, small, medium, large, extraLarge, fluid
     */
    type: {
      type: String,
      default: 'custom',
      validator: value => ['custom', 'extraSmall', 'small', 'medium', 'large', 'extraLarge', 'fluid'].includes(value)
    },
    /** Indica si el panel debe mostrarse en el lado izquierdo. */
    left: { type: Boolean, default: false },
    /** El texto a mostrar en la cabecera del panel. */
    headerText: { type: String, default: '' },
    /** Indica si el panel debe ocular el botón de cerrar. */
    withoutCloseButton: { type: Boolean, default: false }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de cerrar. */
    'click'
  ]
}
</script>

<template>
  <div
    class="panel"
    :class="[type, { left }]"
  >
    <div
      v-if="!withoutCloseButton"
      class="commands"
    >
      <div class="navigation">
        <div class="header">
          <div v-text="headerText" />
        </div>
        <button @click.stop="$emit('click')">
          <Icon
            class="icon"
            name="Cancel"
          />
        </button>
      </div>
    </div>
    <div class="contentInner">
      <div
        v-if="withoutCloseButton"
        class="header"
      >
        <div v-text="headerText" />
      </div>
      <div class="scrollableContent">
        <div class="content">
          <!-- @slot Cuerpo del panel. -->
          <slot />
        </div>
      </div>
      <div class="footer">
        <div class="footerInner">
          <!-- @slot Pie del panel. -->
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./panel.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        show: false,
        panelType: 'custom',
        options: [
          { value: 'A', text: 'Option A' },
          { value: 'B', text: 'Option B' },
          { value: 'C', text: 'Option C' }
        ],
        panelTypes: [
          { text: 'custom', value: 'custom' },
          { text: 'extraSmall', value: 'extraSmall' },
          { text: 'small', value: 'small' },
          { text: 'medium', value: 'medium' },
          { text: 'large', value: 'large' },
          { text: 'extraLarge', value: 'extraLarge' },
          { text: 'fluid', value: 'fluid' },
        ],
        choiceValue: 'B'
      }
    },
    methods: {
      openDialog() {
        this.show = true
      },
      closeDialog() {
        this.show = false
      }
    }
  }
</script>
<template>
  <div style="position: relative; height: 100%;">
    <fura-overlay
      dark
      v-if="show"
      style="display: flex; align-items: flex-start; justify-content: center;"
    >
      <fura-panel
        header-text="All emails together"
        :type="panelType"
        @click="closeDialog()"
      >
        <fura-choice-group
          label="Pick one"
          :options="options"
          v-model="choiceValue"
        />
        <template #footer>
          <div class="footer">
            <fura-button
              primary
              text="Ok"
              @click="closeDialog()"
            />
            <fura-button
              text="Cancel"
              @click="closeDialog()"
            />
          </div>
        </template>
      </fura-panel>
    </fura-overlay>
    <fura-button
      text="Show Dialog"
      @click="openDialog()"
    />
    <fura-dropdown
      label="Panel type"
      :options="panelTypes"
      v-model="panelType"
    />
  </div>
</template>
</docs>
