<script>
import FuraBaseDetailsList from '../base-details-list'

export default {
  name: 'FuraDetailsList',
  components: { FuraBaseDetailsList },
  props: {
    /** Definición de las columnas. */
    columns: { type: Array, required: true },
    /** Datos a mostrar en la tabla. */
    data: { type: Array, required: true },
    /** Definición de las agrupaciones de datos. */
    groups: { type: Array, default: () => [] },
    /** Lista con los índices seleccionados. */
    selectedIndices: { type: Array, default: () => [] },
    /**
     * Indica si el ancho de las columnas debe calcularse automáticamente.
     * - auto: El ancho de las columnas se calcula automáticamente.
     * - fullAuto: El ancho de las columnas y el de la tabla se calculan automáticamente.
     * @values auto, fullAuto
     */
    autoLayout: { type: String, default: null },
    /** Indica si la tabla debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false },
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: { type: String, default: '' },
    /** Indica si los grupos de la tabla se puede plegar. */
    collapsible: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona o deselecciona filas.
     * @property {Array} selectedIndices Lista con los índices seleccionados.
     */
    'update:selectedIndices',
    /**
     * Se genera cuando el usuario hace clic sobre una celda de la cabecera.
     * @property {number} index Índice de la columna pulsada.
     */
    'clickHeader',
    /**
     * Se genera cuando el usuario hace clic sobre una celda.
     * @property {object} coords Objeto ({ row, column }) con el número de fila y columna pulsada.
     */
    'clickCell'
  ],
  data () {
    return {
      collapsedIndices: new Set()
    }
  },
  methods: {
    /**
     * Alterna el estado de plegado de un grupo y sus subgrupos.
     * @param {number} groupIndex Índice del grupo.
     */
    toggleGroupCollapsed (groupIndex) {
      const { collapsedIndices } = this
      if (collapsedIndices.has(groupIndex)) {
        collapsedIndices.delete(groupIndex)
        const indicesToDelete = this.$refs.detailsList.getChildGroupIndices(groupIndex)
        indicesToDelete.forEach(index => collapsedIndices.delete(index))
      } else {
        collapsedIndices.add(groupIndex)
        const indicesToAdd = this.$refs.detailsList.getChildGroupIndices(groupIndex)
        indicesToAdd.forEach(index => collapsedIndices.add(index))
      }
    },
    /**
     * Establece el estado de plegado de todos los grupos.
     * @param {boolean} allCollapsed Estado de plegado a establecer.
     */
    setAllCollapsed (allCollapsed) {
      if (allCollapsed) {
        this.collapsedIndices = new Set(Array.from(this.groups.keys()))
      } else {
        this.collapsedIndices.clear()
      }
    },
    /**
     * Alterna el estado de seleccionado de una fila.
     * @param {number} dataIndex Índice de la fila.
     */
    toggleSelectedRow (dataIndex) {
      if (this.selection === 'multiple') {
        if (this.selectedIndices.includes(dataIndex)) {
          this.$emit('update:selectedIndices', this.selectedIndices.filter(index => index !== dataIndex))
        } else {
          this.$emit('update:selectedIndices', [...this.selectedIndices, dataIndex])
        }
      } else if (this.selection === 'simple') {
        if (this.selectedIndices.includes(dataIndex)) {
          this.$emit('update:selectedIndices', [])
        } else {
          this.$emit('update:selectedIndices', [dataIndex])
        }
      } else if (this.selection === 'safe') {
        if (this.selectedIndices.length === 0) {
          this.$emit('update:selectedIndices', [dataIndex])
        } else if (this.selectedIndices[0] === dataIndex) {
          this.$emit('update:selectedIndices', [])
        }
      }
    },
    /**
     * Alterna el estado de seleccionado de las filas de un grupo y sus subgrupos.
     * @param {number} groupIndex Índice del grupo.
     */
    toggleSelectedGroup (groupIndex) {
      if (this.selection === 'multiple') {
        const { detailsList } = this.$refs
        const groupIndices = detailsList.getDataGroupIndices(groupIndex)
        if (detailsList.isGroupSelected(groupIndex)) {
          const newIndices = this.selectedIndices.filter(index => !groupIndices.includes(index))
          this.$emit('update:selectedIndices', newIndices)
        } else {
          const newIndices = new Set([...this.selectedIndices, ...groupIndices])
          this.$emit('update:selectedIndices', Array.from(newIndices))
        }
      }
    },
    /** Alterna el estado de seleccionado de todas las filas. */
    toggleSelectedAll () {
      if (this.selection === 'multiple') {
        if (this.$refs.detailsList.allSelected) {
          this.$emit('update:selectedIndices', [])
        } else {
          this.$emit('update:selectedIndices', Array.from(this.data.keys()))
        }
      }
    }
  }
}
</script>

<template>
  <FuraBaseDetailsList
    ref="detailsList"
    :columns="columns"
    :data="data"
    :groups="groups"
    :selected-indices="selectedIndices"
    :auto-layout="autoLayout"
    :compact="compact"
    :selection="selection"
    :collapsible="collapsible"
    :collapsed-indices="collapsedIndices"
    @expand-group="toggleGroupCollapsed"
    @expand-all="setAllCollapsed"
    @select-row="toggleSelectedRow"
    @select-group="toggleSelectedGroup"
    @select-all="toggleSelectedAll"
    @click-header="$emit('clickHeader', $event)"
    @click-cell="$emit('clickCell', $event)"
  >
    <template #default="slotProps">
      <!--
        @slot Contenido de una celda
        @binding {number} rowIndex Índice de la fila.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {string} content Contenido de la celda.
        @binding {object} column Referencia a la definición de la columna.
      -->
      <slot
        :row-index="slotProps.rowIndex"
        :column-index="slotProps.columnIndex"
        :content="slotProps.content"
        :column="slotProps.column"
      />
    </template>
    <template #header="slotProps">
      <!--
        @slot Contenido de una cabecera
        @binding {object} column Referencia a la definición de la columna.
        @binding {number} index Índice de la definición de la columna.
      -->
      <slot
        name="header"
        :column="slotProps.column"
        :index="slotProps.index"
      />
    </template>
    <template #group="slotProps">
      <!--
        @slot Contenido de un encabezado de grupo
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} index Índice de la definición del grupo.
        @binding {boolean} isCollapsed Indica si el grupo está plegado.
      -->
      <slot
        name="group"
        :group="slotProps.group"
        :index="slotProps.index"
        :is-collapsed="slotProps.isCollapsed"
      />
    </template>
    <template #groupFooter="slotProps">
      <!--
        @slot Contenido de una celda de un pie de grupo
        @binding {number} groupIndex Índice de la definición del grupo.
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {object} column Referencia a la definición de la columna.
        @binding {Array} data Datos del grupo.
      -->
      <slot
        name="groupFooter"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      />
    </template>
  </FuraBaseDetailsList>
</template>

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
        ],
        selectedIndices: []
      }
    }
  }
</script>
<template>
  <fura-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
    v-model:selected-indices="selectedIndices"
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
        .map((_, i) => [`Item ${i}`, i.toString()]),
        selectedIndices: []
      }
    },
    methods: {
      clickHeader (index) {
        console.log(`Click in header ${index}`)
      },
      clickCell (coords) {
        console.log(`Click in cell with row ${coords.row} and column ${coords.column}`)
      },
    }
  }
</script>
<template>
  <fura-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
    v-model:selected-indices="selectedIndices"
    @click-header="clickHeader"
    @click-cell="clickCell"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        columns: [
          { key: 'button', width: '75px' },
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
        ],
        selectedIndices: []
      }
    },
    methods: {
      getGroupName (group) {
        return `${group.name} (${group.count})`
      }
    }
  }
</script>
<template>
  <fura-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
    v-model:selected-indices="selectedIndices"
  >
    <template v-slot:default="slotProps">
      <fura-button
        v-if="slotProps.column.key === 'button'"
        type="icon"
        icon="Edit"
      />
    </template>
    <template v-slot:header="slotProps">
      <fura-button
        v-if="slotProps.column.key === 'button'"
        type="icon"
        icon="Add"
      />
    </template>
    <template v-slot:group="slotProps">
      <fura-label v-text="getGroupName(slotProps.group)" />
    </template>
  </fura-details-list>
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
        .map((_, i) => [`Item ${i}`, i.toString()]),
        selectedIndices: []
      }
    },
    methods: {
      getGroupFooter (slotProps) {
        if (slotProps) {
          if (slotProps.columnIndex === 0) {
            const first = this.data[slotProps.group.startIndex][1]
            const last = this.data[slotProps.group.startIndex + slotProps.group.count - 1][1]
            return `Items ${first}..${last}`
           } else if (slotProps.columnIndex === 1) {
            return this.data.slice(slotProps.group.startIndex, slotProps.group.startIndex + slotProps.group.count)
              .map(row => row[1])
              .join(', ')
          }
        }
        return ''
      }
    }
  }
</script>
<template>
  <fura-details-list
    :columns="columns"
    :groups="groups"
    :data="data"
    v-model:selected-indices="selectedIndices"
  >
    <template v-slot:groupFooter="slotProps">
      <span>
        <b v-text="getGroupFooter(slotProps)"></b>
      </span>
    </template>
  </fura-details-list>
</template>
</docs>
