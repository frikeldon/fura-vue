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
    collapsible: { type: Boolean, default: false },
    /** Indica si no deben dibujarse las filas de cabecera de grupo. */
    withoutGroupHeader: { type: Boolean, default: false },
    /** Indica si la cabecera de la tabla ha de permanecer estàtica al principio de la tabla. */
    stickyHeader: { type: Boolean, default: false },
    /** Indica el margen superior que ha de dejar la cabecera en el modo sticky. */
    stickyHeaderOffset: { type: [String, Number], default: null }
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
    'clickCell',
    /**
     * Se genera cuando el usuario hace clic, con el botón derecho, sobre una fila.
     * @property {object} coords Objeto ({ row, column }) con el número de fila y columna pulsada.
     */
    'contextmenuRow',
    /**
     * Se genera cuando el usuario hace clic, con el botón derecho, sobre una celda.
     * @property {object} coords Objeto ({ row, column }) con el número de fila y columna pulsada.
     */
    'contextmenuCell'
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
    :without-group-header="withoutGroupHeader"
    :sticky-header="stickyHeader"
    :sticky-header-offset="stickyHeaderOffset"
    @expand-group="toggleGroupCollapsed"
    @expand-all="setAllCollapsed"
    @select-row="toggleSelectedRow"
    @select-group="toggleSelectedGroup"
    @select-all="toggleSelectedAll"
    @click-header="$emit('clickHeader', $event)"
    @click-cell="$emit('clickCell', $event)"
    @contextmenu-row="$emit('contextmenuRow', $event)"
    @contextmenu-cell="$emit('contextmenuCell', $event)"
  >
    <template #default="slotProps">
      <!--
        @slot Contenido de una celda.
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
        @slot Contenido de una cabecera.
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
        @slot Contenido de un encabezado de grupo.
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
    <template #bodyHeader="slotProps">
      <!--
        @slot Contenido de una celda de un encabezado de cuerpo.
        @binding {number} groupIndex Índice de la definición del grupo.
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {object} column Referencia a la definición de la columna.
        @binding {Array} data Datos del grupo.
      -->
      <slot
        name="bodyHeader"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      />
    </template>
    <template #bodyFooter="slotProps">
      <!--
        @slot Contenido de una celda de un pie de cuerpo.
        @binding {number} groupIndex Índice de la definición del grupo.
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {object} column Referencia a la definición de la columna.
        @binding {Array} data Datos del grupo.
      -->
      <slot
        name="bodyFooter"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      />
    </template>
  </FuraBaseDetailsList>
</template>
