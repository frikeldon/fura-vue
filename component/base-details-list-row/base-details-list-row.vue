<script>
import FuraCheck from '../check'

export default {
  name: 'FuraBaseDetailsListRow',
  components: { FuraCheck },
  props: {
    /**
     * Tipo de fila.
     * @values header, group, data
     */
    type: {
      type: String,
      required: true,
      validator: value => ['header', 'group', 'data'].includes(value)
    },
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: {
      type: String,
      default: null,
      validator: selection => !selection || ['multiple', 'simple', 'safe'].includes(selection)
    },
    /** Estado de seleccionado. */
    selected: { type: Boolean, default: false },
    /** Indica si la fila debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false }
  },
  emits: [
    /** Se genera cuando el usuario hace clic en el componente. */
    'click'
  ],
  computed: {
    typeClass () {
      return ['header', 'group', 'data'].includes(this.type)
        ? `fura-${this.type}`
        : null
    }
  }
}
</script>

<template>
  <tr
    :class="[typeClass, {
      'fura-selected': selected,
      'fura-compact': compact
    }]"
    @click.stop="$emit('click')"
  >
    <td
      v-if="selection"
      class="fura-checkboxCell"
    >
      <div v-if="type === 'data' || selection === 'multiple'">
        <FuraCheck
          class="fura-check"
          :model-value="selected"
          @update:model-value="$emit('click')"
        />
      </div>
    </td>
    <!-- @slot Row's content -->
    <slot />
  </tr>
</template>

<style lang="less" scoped src="./base-details-list-row.less"></style>
