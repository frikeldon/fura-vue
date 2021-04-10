<script>
import FuraBaseDetailsListBody from '../base-details-list-body'
import FuraBaseDetailsListRow from '../base-details-list-row'
import FuraExpanderButton from '../expander-button'
import FuraIcon from '../icon'

export default {
  name: 'FuraBaseDetailsList',
  components: {
    FuraBaseDetailsListBody,
    FuraBaseDetailsListRow,
    FuraExpanderButton,
    FuraIcon
  },
  props: {
    /** Definición de las columnas. */
    columns: {
      type: Array,
      required: true,
      validator: columns => Array.isArray(columns) &&
        columns.every(column =>
          typeof (column.title ?? '') === 'string' &&
          typeof (column.key ?? '') === 'string' &&
          typeof (column.align ?? '') === 'string' &&
          typeof (column.width ?? '') === 'string' &&
          typeof (column.icon ?? '') === 'string'
        )
    },
    /** Datos a mostrar en la tabla. */
    data: { type: Array, required: true },
    /** Definición de las agrupaciones de datos. */
    groups: {
      type: Array,
      default: () => [],
      validator: groups => !groups || (
        Array.isArray(groups) &&
        groups.every(group =>
          Number.isInteger(group.startIndex) &&
          Number.isInteger(group.count) &&
          Number.isInteger(group.level || 0) &&
          typeof group.name === 'string'
        )
      )
    },
    /** Lista con los índices seleccionados. */
    selectedIndices: { type: Array, default: () => [] },
    /**
     * Indica si el ancho de las columnas debe calcularse automáticamente.
     * - auto: El ancho de las columnas se calcula automáticamente.
     * - fullAuto: El ancho de las columnas y el de la tabla se calculan automáticamente.
     * @values auto, fullAuto
     */
    autoLayout: {
      type: String,
      default: null,
      validator: autoLayout => !autoLayout || ['auto', 'fullAuto'].includes(autoLayout)
    },
    /** Indica si la tabla debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false },
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: {
      type: String,
      default: '',
      validator: selection => !selection || ['multiple', 'simple', 'safe'].includes(selection)
    },
    /** Indica si los grupos de la tabla se puede plegar. */
    collapsible: { type: Boolean, default: false },
    /** Lista con los índices de los grupos plegados. */
    collapsedIndices: { type: Set, default: () => new Set() }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic sobre una fila.
     * @property {number} index Índice de la fila pulsada.
     */
    'selectRow',
    /**
     * Se genera cuando el usuario hace clic sobre la cabecera de un grupo.
     * @property {number} index Índice del grupo pulsado.
     */
    'selectGroup',
    /** Se genera cuando el usuario hace clic sobre la fila de la cabecera de la tabla. */
    'selectAll',
    /**
     * Se genera cuando el usuario hace clic sobre el boton de expandir de un grupo.
     * @property {number} index Índice del grupo pulsado.
     */
    'expandGroup',
    /**
     * Se genera cuando el usuario hace clic sobre el boton de expandir de la cabecera de la tabla.
     * @property {boolean} notAllCollapsed Indica si no todos los grupos estan plegados.
     */
    'expandAll',
    /**
     * Se genera cuando el usuario hace clic sobre una celda de la cabecera.
     * @property {number} index Índice de la columna pulsada.
     */
    'clickHeader'
  ],
  computed: {
    /** Indica si todos los grupos estan plegados, si la tabla se puede plegar. */
    allCollapsed () {
      const { collapsible, groups, collapsedIndices } = this
      const groupIndices = Array.from(groups.keys())
      return collapsible && groupIndices.every(index => collapsedIndices.has(index))
    },
    /** Indica si todas las filas estan seleccionadas. */
    allSelected () {
      const { data, selectedIndices } = this
      const allIndices = Array.from(data.keys())
      return allIndices.every(index => selectedIndices.includes(index))
    }
  },
  methods: {
    /**
     * Devuelve todos los índices de los grupos hijos del grupo con indice 'groupIndex'.
     * @param {number} groupIndex Índice del grupo a consultar.
     * @returns {Array} Lista con los índices de los grupos hijos.
     * @public
     */
    getChildGroupIndices (groupIndex) {
      const { groups } = this
      const indices = []
      const level = groups[groupIndex].level || 0
      let index = groupIndex + 1
      while (groups[index] && groups[index].level > level) {
        indices.push(index)
        index += 1
      }
      return indices
    },
    /**
     * Devuelve una lista con los índices de los datos de un grupo, con sus subgrupos incluidos.
     * @param {number} groupIndex Índice del grupo a consultar.
     * @returns {Array} Lista con los índices de los datos.
     * @public
     */
    getDataGroupIndices (groupIndex) {
      const generateIndicesList = (startIndex, count) => Array.from(Array(count).keys()).map(key => startIndex + key)
      const groupIndices = [groupIndex, ...this.getChildGroupIndices(groupIndex)]
      return groupIndices
        .map(groupIndex => this.groups[groupIndex])
        .flatMap(group => generateIndicesList(group.startIndex, group.count))
    },
    /**
     * Indica si todos los datos de un grupo y sus subgrupos están seleccionados.
     * @param {number} groupIndex Índice del grupo a consultar.
     * @returns {boolean} 'true' si todos los datos del grupo están seleccionados. 'false' en caso contrario.
     */
    isGroupSelected (groupIndex) {
      const dataIndices = this.getDataGroupIndices(groupIndex)
      return dataIndices.length > 0 &&
        dataIndices.every(index => this.selectedIndices.includes(index))
    }
  }
}
</script>

<template>
  <table :class="{ autoLayout }">
    <thead>
      <FuraBaseDetailsListRow
        type="header"
        :selection="selection"
        :compact="compact"
        :selected="allSelected"
        @click="$emit('selectAll')"
      >
        <th
          v-if="collapsible"
          class="headerCell expanderCell"
        >
          <FuraExpanderButton
            :expanded="!allCollapsed"
            @click="$emit('expandAll', !allCollapsed)"
          />
        </th>
        <th
          v-for="(column, index) in columns"
          :key="index"
          :style="{ width: column.width }"
          class="headerCell"
          :class="column.align"
          @click.stop="$emit('clickHeader', index)"
        >
          <div class="headerTitle">
            <span v-text="column.title" />
            <FuraIcon
              v-if="column.icon"
              class="icon"
              :name="column.icon"
            />
          </div>
        </th>
      </FuraBaseDetailsListRow>
    </thead>
    <template v-if="groups && groups.length > 0">
      <template
        v-for="(group, index) in groups"
        :key="index"
      >
        <thead class="group">
          <FuraBaseDetailsListRow
            type="group"
            :selection="selection"
            :compact="compact"
            :selected="isGroupSelected(index)"
            :checkbox="selection === 'multiple'"
            @click="$emit('selectGroup', index)"
          >
            <th
              v-if="collapsible"
              class="expanderCell"
            >
              <FuraExpanderButton
                :expanded="!collapsedIndices.has(index)"
                @click="$emit('expandGroup', index)"
              />
            </th>
            <th
              :colspan="columns.length"
              :style="{ paddingLeft: `${(group.level || 0) * 36}px`}"
            >
              <div
                class="groupTitle"
                :class="{ collapsed: collapsedIndices.has(index) }"
                v-text="group.name"
              />
            </th>
          </FuraBaseDetailsListRow>
        </thead>
        <FuraBaseDetailsListBody
          v-if="!collapsedIndices.has(index)"
          :columns="columns"
          :data="data"
          :start-index="group.startIndex"
          :count="group.count"
          :selection="selection"
          :selected-indices="selectedIndices"
          :compact="compact"
          :collapsible="collapsible"
          @select="$emit('selectRow', $event)"
          v-slot="slotProps"
        >
          <!--
            @slot Cell's content
            @binding {string,number} column Column's key of the current cell.
            @binding {number} row Row's index of the current cell.
            @binding {string} content Content of the current cell.
          -->
          <slot
            :column="slotProps.column"
            :column-index="slotProps.columnIndex"
            :row="slotProps.row"
            :row-index="slotProps.rowIndex"
            :content="slotProps.content"
          />
        </FuraBaseDetailsListBody>
      </template>
    </template>
    <FuraBaseDetailsListBody
      v-else
      :columns="columns"
      :data="data"
      :start-index="0"
      :count="data.length"
      :selection="selection"
      :selected-indices="selectedIndices"
      :compact="compact"
      :collapsible="collapsible"
      @select="$emit('selectRow', $event)"
      v-slot="slotProps"
    >
      <!--
        @slot Cell's content
        @binding {string,number} column Column's key of the current cell.
        @binding {number} row Row's index of the current cell.
        @binding {string} content Content of the current cell.
      -->
      <slot
        :column="slotProps.column"
        :column-index="slotProps.columnIndex"
        :row="slotProps.row"
        :row-index="slotProps.rowIndex"
        :content="slotProps.content"
      />
    </FuraBaseDetailsListBody>
  </table>
</template>

<style lang="less" scoped src="./base-details-list.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        columns: [
          { title: 'Name', key: 'name', align: 'left', width: '125px' },
          { title: 'Color', key: 'color', align: 'left' }
        ],
        groups: [
          { name: 'Color: "red"', startIndex: 0, count: 2, level: 0 },
          { name: 'Color: "green"', startIndex: 2, count: 0, level: 0 },
          { name: 'Color: "blue"', startIndex: 2, count: 3, level: 0 }
        ],
        data: [
          { name: 'a', color: 'red' },
          { name: 'b', color: 'red' },
          { name: 'c', color: 'blue' },
          { name: 'd', color: 'blue' },
          { name: 'e', color: 'blue' }
        ]
      }
    }
  }
</script>
<template>
  <fura-base-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        columns: [{ title: 'Name' }, { title: 'Value' }],
        groups: Array(4).fill(0)
          .map((_, i) => i * 5)
          .flatMap(i =>
            i % 10 === 0
              ? [
                  {
                    name: `Group ${i.toString().padStart(3, '0')}`,
                    startIndex: i,
                    count: 0,
                    level: 0
                  },
                  {
                    name: `Subgroup: ${i.toString().padStart(3, '0')}`,
                    startIndex: i,
                    count: 5,
                    level: 1
                  }
                ]
              : [
                  {
                    name: `Subgroup: ${i.toString().padStart(3, '0')}`,
                    startIndex: i,
                    count: 5,
                    level: 1
                  }
                ],
          ),
        data: Array(20)
        .fill(0)
        .map((_, i) => [`Item ${i}`, i.toString()])
      }
    }
  }
</script>
<template>
  <fura-base-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
  />
</template>
</docs>
