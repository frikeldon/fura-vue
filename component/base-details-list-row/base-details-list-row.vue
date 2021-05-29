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
    typeClass (value) {
      return ['header', 'group', 'data'].includes(value)
        ? `fura-${value}`
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

<docs>
<script>
  export default {
    data () {
      return {
        selection: 'multiple',
        compact: false,
        selected: [
          false,
          false,
          false
        ]
      }
    }
  }
</script>
<template>
  <table>
    <fura-base-details-list-row
      type="header"
      :selection="selection"
      :selected="selected[0]"
      :compact="compact"
      @click="selected[0] = !selected[0]"
    >
      <th>Header</th>
    </fura-base-details-list-row>
    <fura-base-details-list-row
      type="group"
      :selection="selection"
      :selected="selected[1]"
      :compact="compact"
      @click="selected[1] = !selected[1]"
    >
      <th>Group</th>
    </fura-base-details-list-row>
    <fura-base-details-list-row
      type="data"
      :selection="selection"
      :selected="selected[2]"
      :compact="compact"
      @click="selected[2] = !selected[2]"
    >
      <th>Data</th>
    </fura-base-details-list-row>
  </table>
</template>
</docs>
