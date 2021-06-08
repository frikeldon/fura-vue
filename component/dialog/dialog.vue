<script>
import FuraIcon from '../icon'

export default {
  name: 'FuraDialog',
  components: { FuraIcon },
  props: {
    /**
     * El tipo de diálogo a mostrar.
     * @values normal, largeHeader, close
     */
    type: {
      type: String,
      default: 'normal',
      validator: value => !value || ['normal', 'largeHeader', 'close'].includes(value)
    },
    /** El texto a mostrar en el título del diálogo. */
    header: { type: String, default: '' },
    /** El texto a mostrar en el cuerpo del diálogo. */
    text: { type: String, default: '' }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de cerrar. */
    'click'
  ],
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada tipo de dialogo.
     * @param type Tipo de dialogo (normal, largeHeader, close).
     * @return Nombre de la clase CSS que corresponde al tipo de dialogo.
     */
    getTypeClass (type) {
      return ['normal', 'largeHeader', 'close'].includes(type)
        ? `fura-${type}`
        : null
    }
  }
}
</script>

<template>
  <div
    class="fura-dialog"
    :class="getTypeClass(type)"
  >
    <div class="fura-header">
      <div
        class="fura-title"
        v-text="header"
      />
      <div
        v-if="type === 'close'"
        class="fura-topButton"
      >
        <button @click.stop="$emit('click')">
          <FuraIcon
            class="fura-icon"
            name="Cancel"
          />
        </button>
      </div>
    </div>
    <div class="fura-inner">
      <div class="fura-content">
        <p
          v-if="text"
          class="fura-subText"
          v-text="text"
        />
        <!-- @slot Cuerpo del diálogo. -->
        <slot />
      </div>
      <!-- @slot Pie del diálogo. -->
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="less" scoped src="./dialog.less"></style>

<docs>
<fura-dialog
  header="Missing Subject"
  text="Do you want to send this message without a subject?"
  style="max-width: 400px;"
/>
</docs>

<docs>
<fura-dialog
  type="close"
  header="Missing Subject"
  text="Do you want to send this message without a subject?"
  style="max-width: 400px;"
/>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        options: [
          { value: 'A', text: 'Option A' },
          { value: 'B', text: 'Option B' },
          { value: 'C', text: 'Option C' }
        ],
        choiceValue: 'B'
      }
    }
  }
</script>
<template>
  <fura-dialog
    header="All emails together"
    type="largeHeader"
    text="Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails."
    style="max-width: 400px; max-height: 250px"
  >
    <fura-choice-group
      label="Pick one"
      :options="options"
      v-model="choiceValue"
    />
    <template #footer>
      <div class="fura-footer">
        <fura-button
          primary
          text="Ok"
        />
        <fura-button text="Cancel" />
      </div>
    </template>
  </fura-dialog>
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        show: false,
        options: [
          { value: 'A', text: 'Option A' },
          { value: 'B', text: 'Option B' },
          { value: 'C', text: 'Option C' }
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
      <fura-dialog
        header="All emails together"
        type="largeHeader"
        text="Your Inbox has changed. No longer does it include favorites, it is a singular destination for your emails."
        style="max-width: 400px; margin-top: 15px;"
      >
        <fura-choice-group
          label="Pick one"
          :options="options"
          v-model="choiceValue"
        />
        <template #footer>
          <div class="fura-footer">
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
      </fura-dialog>
    </fura-overlay>
    <fura-button
      text="Show Dialog"
      @click="openDialog()"
    />
  </div>
</template>
</docs>
