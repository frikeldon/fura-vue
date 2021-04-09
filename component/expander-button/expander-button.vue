<script>
import FuraIcon from '../../component/icon'

export default {
  name: 'FuraExpanderButton',
  components: { FuraIcon },
  props: {
    /** El nombre del icono. */
    icon: { type: String, default: 'ChevronRightMed' },
    /** Estado de expandido. */
    expanded: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click'
  ]
}
</script>

<template>
  <div
    :class="{ expanded }"
    @click.stop="$emit('click', $event)"
  >
    <FuraIcon
      class="icon"
      :name="icon"
    />
  </div>
</template>

<style lang="less" scoped src="./expander-button.less"></style>

<docs>
<script>
  export default {
    data () {
      return { expanded: false }
    }
  }
</script>
<template>
  <fura-expander-button
    :expanded="expanded"
    @click="expanded = !expanded"
  />
</template>
</docs>
