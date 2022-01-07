<script>
import FuraBaseBlockMenu from '../base-block-menu'

export function getExpandedPath (items) {
  const expanded = []
  let current = items
  while (Array.isArray(current)) {
    const index = current.findIndex(item => item.expanded)
    if (index > -1) {
      expanded.push(index)
    }
    current = current[index]?.childs
  }
  return expanded
}

export default {
  name: 'FuraBlockMenu',
  components: { FuraBaseBlockMenu },
  props: {
    /** Elementos del menú. */
    items: { type: Array, required: true },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en un elemento de menú.
     * @property {object} linkInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (parent).
     */
    'click'
  ],
  data () {
    return {
      expandedPath: getExpandedPath(this.items)
    }
  },
  methods: {
    /**
     * Esconde todos los submenús desplegados.
     * @public
     */
    collapseAll () {
      this.expandedPath = []
    },
    handleClick (event) {
      if (typeof event.item.action === 'function') {
        event.item.action.call(null)
      }
      this.$emit('click', event)
      this.collapseAll()
    },
    handleExpand (event) {
      const path = []
      for (let current = event; current; current = current.parent) {
        path.unshift(current.index)
      }

      const coincident = path.every(
        (item, index) => item === this.expandedPath[index]
      )

      if (coincident) {
        this.expandedPath = path.slice(0, -1)
      } else {
        this.expandedPath = path
      }
    }
  },
  watch: {
    items (value) {
      this.expandedPath = getExpandedPath(value)
    }
  }
}
</script>

<template>
  <FuraBaseBlockMenu
    :items="items"
    :item-expanded-path="expandedPath"
    :mousestop-delay="mousestopDelay"
    @click="handleClick"
    @expand="handleExpand"
  >
    <template #default="slotProps">
      <!--
        @slot Encabezado del menú.
        @binding {object} item Referencia al elemento.
        @binding {number} index Índice del elemento.
        @binding {function} click Método para invocar el evento click.
        @binding {function} expand Método para invocar el evento expand.
      -->
      <slot
        :item="slotProps.item"
        :index="slotProps.index"
        :click="slotProps.click"
        :expand="slotProps.expand"
      />
    </template>

    <template #title="slotProps">
      <!--
        @slot Encabezado del menú.
        @binding {object} item Referencia al elemento.
        @binding {number} index Índice del elemento.
      -->
      <slot
        name="title"
        :item="slotProps.item"
        :index="slotProps.index"
      />
    </template>
  </FuraBaseBlockMenu>
</template>
