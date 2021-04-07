<script>
import FuraBaseSplitButton from '../base-split-button'
import FuraBaseCommandButton from '../base-command-button'
import FuraBlockMenu from '../block-menu'
import debounce from '../../utils/debounce'

export default {
  name: 'FuraCommandBar',
  components: {
    FuraBaseSplitButton,
    FuraBaseCommandButton,
    FuraBlockMenu
  },
  props: {
    /** Elementos de la barra de comandos. */
    items: { type: Array, required: true },
    /** Elementos que aparecen por defecto en el menú desbordado. */
    overflowItems: { type: Array, default: () => [] },
    /** Elementos de la parte derecha de la barra de comandos. */
    farItems: { type: Array, default: () => [] },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 },
    /** Indica si la barra de comandos mueve automaticamente elementos al menú desbordado.  */
    autoupdateOverflow: { type: Boolean, default: false },
    /** Milisegundos entre dos comprobaciones consecutivas de cambio de tamaño. */
    autoupdateOverflowRate: { type: Number, default: 250 }
  },
  data () {
    return {
      refItems: [],
      expanded: null,
      overflowIndex: this.items.length
    }
  },
  computed: {
    /** Coleccion de elementos con el desbordamiento calculado. */
    currentItems () {
      const { items, overflowItems, overflowIndex } = this
      const currentItems = [...items.slice(0, overflowIndex)]
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
    /** Calcula el ancho de los elementos de la barra de comandos y los almacena en la propiedad 'itemWidths'. */
    calculateItemWidths () {
      const items = this.isMoreItemVisible
        ? this.refItems.slice(0, this.refItems.length - 1)
        : this.refItems
      this.itemWidths = []
      for (
        let index = 0, accumulated = 0;
        index < items.length;
        index += 1
      ) {
        accumulated += items[index].el.getBoundingClientRect().width
        this.itemWidths.push(accumulated)
      }
    },
    /** Calcula el índice del elemento que crea desbordamiento en la barra de comandos. */
    updateOverflowIndex () {
      if (Array.isArray(this.itemWidths)) {
        if (this.itemWidths.length === 0) { // First execution
          this.calculateItemWidths()
        }
        const parentWidth = this.$el.getBoundingClientRect().width
        const farWidth = this.$refs.far
          ? this.$refs.far.getBoundingClientRect().width
          : 0
        const moreWidth = this.isMoreItemVisible
          ? this.refItems[this.refItems.length - 1].el.getBoundingClientRect().width
          : 0
        const space = parentWidth - farWidth - moreWidth - 8
        let index = this.itemWidths.length - 1
        for (; index >= 0; index -= 1) {
          if (this.itemWidths[index] < space) { break }
        }
        this.overflowIndex = index + 1
      }
    },
    /** Establece 'overflowIndex' al máximo valor que válido qe puede tener. */
    resetOverflowIndex () {
      this.overflowIndex = this.items.length
      this.$nextTick(() => {
        this.calculateItemWidths()
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
    expandItem (index) {
      this.expanded = this.expanded === index
        ? null
        : index
    },
    handleClick (index) {
      if (this.expanded !== index) {
        this.expanded = null
      }
      const item = this.currentItems[index]
      if (item) {
        if (typeof item.action === 'function') {
          item.action.call(null)
        } else if (item.childs && item.childs.length > 0) {
          this.expanded = index
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
    this.calculateItemWidths()
  },
  beforeUnmount () {
    this.observer.unobserve(this.$el)
  },
  beforeUpdate () {
    this.refItems = []
  }
}
</script>

<template>
  <div class="commandBar">
    <div>
      <div
        v-for="(item, index) in currentItems"
        :key="index"
        :ref="el => refItems.push({ index, el })"
        class="item"
      >
        <FuraBaseCommandButton
          v-if="item.type === 'more'"
          class="more"
          icon="More"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          @click="handleClick(index)"
          @mousestop="expandItem(index)"
        />
        <FuraBaseSplitButton
          v-else-if="checkItemHasActions(item) && checkItemHasChilds(item)"
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          expand-icon="ChevronDown"
          @click="handleClick(index)"
          @click-expand="expandItem(index)"
          @mousestop="expandItem(index)"
          @mousestop-expand="expandItem(index)"
        />
        <FuraBaseCommandButton
          v-else
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :expand-icon="checkItemHasChilds(item) ? 'ChevronDown' : ''"
          :disabled="item.disabled"
          @click="handleClick(index)"
          @click-expand="expandItem(index)"
          @mousestop="expandItem(index)"
        />
        <FuraBlockMenu
          v-if="index === expanded && checkItemHasChilds(item)"
          :items="item.childs"
        />
      </div>
    </div>
    <div ref="far">
      <div
        v-for="(item, index) in farItems"
        :key="index"
        class="item"
      >
        <FuraBaseSplitButton
          v-if="checkItemHasActions(item) && checkItemHasChilds(item)"
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          expand-icon="ChevronDown"
          @click="handleClick(index)"
          @click-expand="expandItem(index)"
          @mousestop="expandItem(index)"
          @mousestop-expand="expandItem(index)"
        />
        <FuraBaseCommandButton
          v-else
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :expand-icon="checkItemHasChilds(item) ? 'ChevronDown' : ''"
          :disabled="item.disabled"
          @click="handleClick(index)"
          @click-expand="expandItem(index)"
          @mousestop="expandItem(index)"
        />
        <FuraBlockMenu
          v-if="index === expanded && checkItemHasChilds(item)"
          :items="item.childs"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./command-bar.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        mousestopDelay: 800,
        autoupdateOverflow: false,
        items: [
          {
            value: 'newItem',
            text: 'New',
            icon: 'Add',
            action: () => alert('New'),
            childs: [
              {
                type: 'title',
                text: 'Actions'
              },
              {
                value: 'upload',
                text: 'Upload',
                icon: 'Upload',
                iconColor: 'salmon'
              },
              {
                value: 'rename',
                text: 'Rename'
              },
              {
                value: 'share',
                text: 'Sharing',
                icon: 'Share',
                childs: [
                  {
                    value: 'sharetoemail',
                    text: 'Share to Email',
                    icon: 'Mail'
                  },
                  {
                    value: 'sharetotwitter',
                    text: 'Share to Twitter',
                    icon: 'Share'
                  }
                ]
              },
              {
                type: 'divider'
              },
              {
                type: 'title',
                text: 'Navigation'
              },
              {
                value: 'properties',
                text: 'Properties'
              },
              {
                value: 'print',
                text: 'Print',
                icon: 'Print',
                disabled: true
              },
              {
                value: 'bing',
                text: 'Go to Bing'
              }
            ]
          },
          {
            value: 'upload',
            text: 'Upload',
            icon: 'Upload',
            action: () => alert('upload')
          },
          {
            value: 'share',
            text: 'Share',
            icon: 'Share',
            childs: [
              {
                value: 'sharetoemail',
                text: 'Share to Email',
                icon: 'Mail'
              },
              {
                value: 'sharetotwitter',
                text: 'Share to Twitter',
                icon: 'Share'
              }
            ]
          },
          {
            value: 'download',
            text: 'Download',
            icon: 'Download'
          }
        ],
        overflowItems: [
          {
            value: 'move',
            text: 'Move to...',
            icon: 'MoveToFolder'
          },
          {
            value: 'copy',
            text: 'Copy to...',
            icon: 'Copy'
          },
          {
            value: 'rename',
            text: 'Rename...',
            icon: 'Edit'
          }
        ],
        farItems: [
          { value: 'tiles', icon: 'Tiles' },
          { value: 'info', icon: 'Info' }
        ]
      }
    }
  }
</script>
<template>
  <fura-command-bar
    :mousestop-delay="mousestopDelay"
    :items="items"
    :autoupdate-overflow="autoupdateOverflow"
    :overflow-items="overflowItems"
    :far-items="farItems"
  />
</template>
</docs>
