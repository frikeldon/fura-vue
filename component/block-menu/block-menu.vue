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
    current = current[index]?.children
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
     * @property {object} data Indices de los elementos para llegar al elemento que lanza el evento y el objeto descriptor del evento click.
     */
    'click',
    /**
     * Se genera cuando el el usuario hace clic fuera del componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'clickOutside'
  ],
  data () {
    return {
      expandedIndices: getExpandedPath(this.items),
      breakDirections: [],
      clickOutsideHandler: null

    }
  },
  computed: {
    expandedPath () {
      const { expandedIndices, breakDirections } = this
      const path = []

      let vertical
      let horizontal

      for (let index = 0; index < expandedIndices.length; index += 1) {
        const breakDirection = breakDirections.find(item => item.position === index)
        if (breakDirection?.vertical) vertical = breakDirection.vertical
        if (breakDirection?.horizontal) horizontal = breakDirection.horizontal
        path.push({ index: expandedIndices[index], vertical, horizontal })
      }

      return path
    }
  },
  methods: {
    /**
     * Esconde todos los submenús desplegados.
     * @public
     */
    collapseAll () {
      this.expandedIndices = []
      this.breakDirections = []
    },
    handleClick (data) {
      let item = { children: this.items }
      for (let index = 0; index < data.path.length; index += 1) {
        if (item.children) {
          item = item.children[data.path[index]]
        }
      }
      if (typeof item?.action === 'function') {
        item.action.call(null, data.event)
      }
      this.$emit('click', data)
      this.collapseAll()
    },
    handleExpand ({ path }) {
      const coincident = path.every(
        (item, index) => item === this.expandedIndices[index]
      )

      this.expandedIndices = coincident
        ? path.slice(0, -1)
        : path
      this.breakDirections = this.breakDirections
        .filter(item => item.position < this.expandedIndices.length)
    },
    handleOverload ({ event, path }) {
      if (path.length > 0) {
        const currentBreak = {
          position: path.length - 1,
          vertical: undefined,
          horizontal: undefined
        }

        if (event.top) currentBreak.vertical = 'top'
        if (event.right) currentBreak.horizontal = 'before'
        if (event.bottom) currentBreak.vertical = 'bottom'
        if (event.left) currentBreak.horizontal = 'after'

        this.breakDirections = this.breakDirections
          .filter(item => item.position < currentBreak.position)
          .sort((a, b) => a.position - b.position)
          .concat([currentBreak])
      }
    }
  },
  watch: {
    items (value) {
      this.expandedIndices = getExpandedPath(value)
      this.breakDirections = []
    }
  },
  mounted () {
    this.clickOutsideHandler = event => {
      if (this.$el !== event.target && !this.$el.contains(event.target)) {
        this.collapseAll()
        this.$emit('clickOutside', event)
      }
    }

    window.addEventListener('click', this.clickOutsideHandler, true)
  },
  unmounted () {
    if (this.clickOutsideHandler) {
      window.removeEventListener('click', this.clickOutsideHandler, true)
    }
    this.clickOutsideHandler = null
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
    @overload="handleOverload"
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
