<script>
import FuraCommandBarItemCollection from '../command-bar-item-collection'
import debounce from '../../utils/debounce'

export default {
  name: 'FuraCommandBar',
  components: {
    FuraCommandBarItemCollection
  },
  props: {
    /** Elementos de la barra de comandos. */
    items: { type: Array, default: () => [] },
    /** Elementos que aparecen por defecto en el menú desbordado. */
    overflowItems: { type: Array, default: () => [] },
    /** Elementos de la parte derecha de la barra de comandos. */
    farItems: { type: Array, default: () => [] },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 },
    /** Indica si la barra de comandos mueve automaticamente elementos al menú desbordado. */
    autoupdateOverflow: { type: Boolean, default: false },
    /** Milisegundos entre dos comprobaciones consecutivas de cambio de tamaño. */
    autoupdateOverflowRate: { type: Number, default: 250 }
  },
  data () {
    return {
      overflowIndex: this.items.length,
      expandedSide: 'none',
      expandedPath: []
    }
  },
  computed: {
    /** Coleccion de elementos con el desbordamiento calculado. */
    currentItems () {
      const { items, overflowItems, overflowIndex } = this
      const currentItems = items.slice(0, overflowIndex)
      const currentOverflowItems = [
        ...items.slice(overflowIndex),
        ...overflowItems
      ]
      if (currentOverflowItems.length > 0) {
        currentItems.push({
          type: 'more',
          childs: currentOverflowItems
        })
      }
      return currentItems
    },
    isMoreItemVisible () {
      const { currentItems } = this
      return currentItems[currentItems.length - 1]?.type === 'more'
    }
  },
  methods: {
    /** Crea un ResizeObserver en la propiedad 'observer' para detectar cambios de tamaño en la barra de comandos. */
    createObserver () {
      if (this.observer) {
        this.observer.unobserve(this.$el)
      }
      this.observer = new ResizeObserver(debounce(() => this.updateOverflowIndex(), this.autoupdateOverflowRate))
      if (this.autoupdateOverflow) {
        this.observer.observe(this.$el)
      }
    },
    /** Calcula el índice del elemento que crea desbordamiento en la barra de comandos. */
    updateOverflowIndex () {
      if (Array.isArray(this.itemWidths)) {
        if (this.itemWidths.length === 0) { // First execution
          this.itemWidths = this.$refs.near.getItemWidths()
        }
        const parentWidth = this.$el.getBoundingClientRect().width
        const farWidth = this.$refs.far
          ? this.$refs.far.$el.getBoundingClientRect().width
          : 0
        const moreWidth = this.isMoreItemVisible
          ? this.$refs.near.refItems[this.$refs.near.refItems.length - 1].el.getBoundingClientRect().width
          : 0
        const space = parentWidth - farWidth - moreWidth - 8
        let index = this.itemWidths.length - 1
        for (; index >= 0; index -= 1) {
          if (this.itemWidths[index].accumulatedWidth < space) { break }
        }
        this.overflowIndex = index + 1
      }
    },
    /** Establece 'overflowIndex' al máximo valor que válido que puede tener. */
    resetOverflowIndex () {
      this.overflowIndex = this.items.length
      this.$nextTick(() => {
        this.itemWidths = this.$refs.near.getItemWidths()
        if (this.autoupdateOverflow) {
          this.updateOverflowIndex()
        }
      })
    },
    /** Comprueba si un elemento tiene una acción asignada. */
    checkItemHasActions (item) {
      return typeof item.action === 'function'
    },
    /** Comprueba si un elemento tiene elementos hijos. */
    checkItemHasChilds (item) {
      return Array.isArray(item.childs) && item.childs.length > 0
    },
    /**
     * Esconde todos los submenús desplegados.
     * @public
     */
    collapseAll () {
      this.expandedSide = 'none'
      this.expandedPath = []
    },
    handleClick (bar, event) {
      if (typeof event.item.action === 'function') {
        event.item.action.call(null)
        this.collapseAll()
      } else {
        this.handleExpand(bar, event)
      }
    },
    handleExpand (bar, event) {
      const path = []
      for (let current = event; current; current = current.parent) {
        path.unshift(current.index)
      }

      if (this.expandedSide !== bar) {
        this.expandedSide = bar
        this.expandedPath = path
      } else {
        const coincident = path.every(
          (item, index) => item === this.expandedPath[index]
        )

        if (coincident) {
          this.expandedPath = path.slice(0, -1)
        } else {
          this.expandedPath = path
        }

        if (this.expandedPath.length === 0) {
          this.expandedSide = 'none'
        }
      }
    }
  },
  watch: {
    autoupdateOverflow (value) {
      if (value) {
        this.observer.observe(this.$el)
      } else {
        this.observer.unobserve(this.$el)
      }
      this.resetOverflowIndex()
    },
    autoupdateOverflowRate () {
      this.createObserver()
    },
    items (value) {
      this.overflowIndex = value.length
    }
  },
  mounted () {
    this.createObserver()
    this.itemWidths = this.$refs.near.getItemWidths()
  },
  beforeUnmount () {
    this.observer.unobserve(this.$el)
  }
}
</script>

<template>
  <div class="fura-commandBar">
    <FuraCommandBarItemCollection
      ref="near"
      class="fura-near"
      :items="currentItems"
      :item-expanded-path="expandedSide === 'near' && expandedPath || []"
      :mousestop-delay="mousestopDelay"
      @click="handleClick('near', $event)"
      @expand="handleExpand('near', $event)"
    />
    <FuraCommandBarItemCollection
      ref="far"
      class="fura-far"
      :items="farItems"
      :item-expanded-path="expandedSide === 'far' && expandedPath || []"
      :mousestop-delay="mousestopDelay"
      @click="handleClick('far', $event)"
      @expand="handleExpand('far', $event)"
    />
  </div>
</template>

<style lang="less" scoped src="./command-bar.less"></style>
