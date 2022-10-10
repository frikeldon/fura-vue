<script>
import { Comment, Fragment } from 'vue'
import FuraBaseDetailsListBody from '../base-details-list-body'
import FuraBaseDetailsListRow from '../base-details-list-row'
import FuraExpanderButton from '../expander-button'
import FuraIcon from '../icon'

function hasContentNodes (nodes) {
  return nodes.findIndex(node => {
    if (node.type === Comment) {
      return false
    }
    if (node.type === Fragment) {
      return hasContentNodes(node.children)
    }
    return true
  }) !== -1
}

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
          (
            typeof (column.key ?? '') === 'string' ||
            typeof (column.key ?? '') === 'number' ||
            typeof (column.key ?? '') === 'symbol'
          ) &&
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
          Number.isInteger(group.level || 0)
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
    collapsedIndices: { type: Set, default: () => new Set() },
    /** Indica si no deben dibujarse las filas de cabecera de grupo. */
    withoutGroupHeader: { type: Boolean, default: false },
    /** Indica si la cabecera de la tabla ha de permanecer estàtica al principio de la tabla. */
    stickyHeader: { type: Boolean, default: false }
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
     * Se genera cuando el usuario hace clic sobre el boton de desplegar de un grupo.
     * @property {number} index Índice del grupo pulsado.
     */
    'expandGroup',
    /**
     * Se genera cuando el usuario hace clic sobre el boton de desplegar de la cabecera de la tabla.
     * @property {boolean} notAllCollapsed Indica si no todos los grupos estan plegados.
     */
    'expandAll',
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
    },
    hasBodyHeaderSlots () {
      return this.$slots.bodyHeader && hasContentNodes(this.$slots.bodyHeader())
    },
    hasBodyFooterSlots () {
      return this.$slots.bodyFooter && hasContentNodes(this.$slots.bodyFooter())
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
    },
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada alineamiento.
     * @param align Alineamiento de texto (left, center, right).
     * @return Nombre de la clase CSS que corresponde al alineamiento.
     */
    getAlignClass (align) {
      return ['left', 'center', 'right'].includes(align)
        ? `fura-${align}`
        : null
    }
  }
}
</script>

<template>
  <table
    :class="{
      'fura-auto': autoLayout === 'auto',
      'fura-fullAuto': autoLayout === 'fullAuto',
      'fura-stickyHeader': stickyHeader
    }"
  >
    <thead data-type="header">
      <FuraBaseDetailsListRow
        type="header"
        class="fura-headerRow"
        :selection="selection"
        :compact="compact"
        :selected="allSelected"
        @click="$emit('selectAll')"
      >
        <th
          v-if="collapsible"
          class="fura-headerCell fura-expanderCell"
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
          class="fura-headerCell"
          :class="getAlignClass(column.align)"
          @click.stop="$emit('clickHeader', index)"
        >
          <!--
            @slot Contenido de una cabecera.
            @binding {object} column Referencia a la definición de la columna.
            @binding {number} index Índice de la definición de la columna.
          -->
          <slot
            name="header"
            :column="column"
            :index="index"
          >
            <div class="fura-headerTitle">
              <span v-text="column.title" />
              <FuraIcon
                v-if="column.icon"
                class="fura-icon"
                :name="column.icon"
              />
            </div>
          </slot>
        </th>
      </FuraBaseDetailsListRow>
    </thead>
    <template v-if="groups && groups.length > 0">
      <template
        v-for="(group, index) in groups"
        :key="index"
      >
        <thead
          v-if="!withoutGroupHeader"
          class="fura-group"
          data-type="group-header"
        >
          <FuraBaseDetailsListRow
            type="group"
            :selection="selection"
            :compact="compact"
            :selected="isGroupSelected(index)"
            @click="$emit('selectGroup', index)"
          >
            <th
              v-if="collapsible"
              class="fura-expanderCell"
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
              <!--
                @slot Contenido de un encabezado de grupo.
                @binding {object} group Referencia a la definición del grupo.
                @binding {number} index Índice de la definición del grupo.
                @binding {boolean} isCollapsed Indica si el grupo está plegado.
              -->
              <slot
                name="group"
                :group="group"
                :index="index"
                :is-collapsed="collapsedIndices.has(index)"
              >
                <div
                  class="fura-groupTitle"
                  :class="{ 'fura-collapsed': collapsedIndices.has(index) }"
                  v-text="group.name?.toString()"
                />
              </slot>
            </th>
          </FuraBaseDetailsListRow>
        </thead>
        <template v-if="!collapsedIndices.has(index)">
          <FuraBaseDetailsListBody
            :columns="columns"
            :data="data"
            :start-index="group.startIndex"
            :count="group.count"
            :selection="selection"
            :selected-indices="selectedIndices"
            :compact="compact"
            :collapsible="collapsible"
            :group-index="index"
            :group="group"
            @select="$emit('selectRow', $event)"
            @click-cell="$emit('clickCell', $event)"
          >
            <template
              v-if="hasBodyHeaderSlots"
              #header="slotProps"
            >
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
                :group-index="slotProps && slotProps.groupIndex"
                :group="slotProps && slotProps.group"
                :column-index="slotProps && slotProps.columnIndex"
                :column="slotProps && slotProps.column"
                :data="slotProps && slotProps.data"
              />
            </template>
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
            <template
              v-if="hasBodyFooterSlots"
              #footer="slotProps"
            >
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
                :group-index="slotProps && slotProps.groupIndex"
                :group="slotProps && slotProps.group"
                :column-index="slotProps && slotProps.columnIndex"
                :column="slotProps && slotProps.column"
                :data="slotProps && slotProps.data"
              />
            </template>
          </FuraBaseDetailsListBody>
        </template>
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
      @click-cell="$emit('clickCell', $event)"
    >
      <template
        v-if="hasBodyHeaderSlots"
        #header="slotProps"
      >
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
          :group-index="slotProps && slotProps.groupIndex"
          :group="slotProps && slotProps.group"
          :column-index="slotProps && slotProps.columnIndex"
          :column="slotProps && slotProps.column"
          :data="slotProps && slotProps.data"
        />
      </template>
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
      <template
        v-if="hasBodyFooterSlots"
        #footer="slotProps"
      >
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
          :group-index="slotProps && slotProps.groupIndex"
          :group="slotProps && slotProps.group"
          :column-index="slotProps && slotProps.columnIndex"
          :column="slotProps && slotProps.column"
          :data="slotProps && slotProps.data"
        />
      </template>
    </FuraBaseDetailsListBody>
  </table>
</template>

<style lang="less" scoped src="./base-details-list.less"></style>
