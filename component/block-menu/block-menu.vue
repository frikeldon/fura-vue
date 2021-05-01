<script>
import FuraBaseBlockMenu from '../base-block-menu'

function getExpandedState (items) {
  const expanded = []
  let current = items
  let found = true
  while (found && Array.isArray(current)) {
    found = false
    for (let index = 0; index < current.length; index += 1) {
      if (current[index].expanded) {
        expanded.push(index)
        current = current[index].childs
        found = true
        break
      }
    }
  }
  return expanded
}

function getItemsState (items, expanded) {
  const cloneItems = []
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]
    const isExpanded = expanded[0] === index
    cloneItems.push({
      ...item,
      expanded: isExpanded && Array.isArray(item.childs) && item.childs.length > 0,
      childs: Array.isArray(item.childs) && item.childs.length > 0
        ? getItemsState(item.childs, isExpanded ? expanded.slice(1) : [])
        : undefined
    })
  }
  return cloneItems
}

function getIdsPath (event) {
  const ids = []
  let current = event.path
  while (current) {
    ids.push(current.index)
    current = current.path
  }
  ids.push(event.index)
  return ids
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
     * @property {object} linkInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (path).
     */
    'click'
  ],
  data () {
    return {
      expanded: getExpandedState(this.items)
    }
  },
  computed: {
    currentStateItems () {
      return getItemsState(this.items, this.expanded)
    }
  },
  methods: {
    /**
     * Esconde todos los submenús desplegados.
     * @public
     */
    collapseAll () {
      this.expanded = []
    },
    handleClick (event) {
      if (typeof event.item.action === 'function') {
        event.item.action.call(null)
      }
      this.$emit('click', event)
      this.collapseAll()
    },
    handleExpand (event) {
      const ids = getIdsPath(event)
      if (ids.join() === this.expanded.join()) {
        this.expanded = this.expanded.slice(0, -1)
      } else {
        this.expanded = ids
      }
    }
  },
  watch: {
    items (value) {
      this.expanded = getExpandedState(value)
    }
  }
}
</script>

<template>
  <FuraBaseBlockMenu
    :items="currentStateItems"
    :mousestop-delay="mousestopDelay"
    @click="handleClick"
    @expand="handleExpand"
  />
</template>

<docs>
<script>
  export default {
    data () {
      return {
        mousestopDelay: 800,
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
        ]
      }
    }
  }
</script>
<template>
  <fura-block-menu
    :mousestop-delay="mousestopDelay"
    :items="items"
  />
</template>
</docs>
