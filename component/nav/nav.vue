<script>
import FuraBaseNav from '../base-nav'

function getExpandedTreeIds (elements, prefix = []) {
  const ids = []
  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index]
    const id = [...prefix, index]
    if (element.expanded) {
      ids.push(id.join(','))
    }
    if (Array.isArray(element.links) && element.links.length > 0) {
      ids.push(...getExpandedTreeIds(element.links, id))
    }
  }
  return ids
}

function cloneStateWithTreeExpands (elements, expanded, prefix = []) {
  const cloneElements = []
  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index]
    const id = [...prefix, index]
    cloneElements.push({
      ...element,
      expanded: expanded.has(id.join(',')),
      links: Array.isArray(element.links) && element.links.length > 0
        ? cloneStateWithTreeExpands(element.links, expanded, id)
        : undefined
    })
  }
  return cloneElements
}

export default {
  name: 'FuraNav',
  components: { FuraBaseNav },
  props: {
    /** Una colección de grupos de vínculos para mostrar en la barra de navegación. */
    groups: {
      type: Array,
      required: true,
      validator: groups => groups.every(group => Array.isArray(group.links))
    },
    /** Indica si los enlaces pueden contener saltos de línea. */
    wrappedText: { type: Boolean, default: false },
    /** Valor del elemento de menú seleccionado. */
    modelValue: { type: String, default: null }
  },
  data () {
    return {
      expanded: new Set(getExpandedTreeIds(this.groups))
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en un enalce.
     * @property {object} linkInfo Índice del enlace dentro de la coleccion (index), referencia a las propiedades del enlace (link) y la ruta para llegar al enlace si es necesarui (parent).
     */
    'click',
    /**
     * Se genera cuando el usuario selecciona un elemeto de menu.
     * @property {string} modelValue Valor del enalce seleccionado.
     */
    'update:modelValue'
  ],
  computed: {
    currentStateGroups () {
      return cloneStateWithTreeExpands(this.groups, this.expanded)
    }
  },
  methods: {
    handleExpand (event) {
      const indices = [event.groupIndex]
      let current = event.parent
      while (current) {
        indices.push(current.index)
        current = current.parent
      }
      if (event.index !== undefined) {
        indices.push(event.index)
      }
      const id = indices.join(',')
      if (this.expanded.has(id)) {
        this.expanded.delete(id)
      } else {
        this.expanded.add(id)
      }
    },
    handleClick (event) {
      const { link } = event
      if (typeof link.action === 'function') {
        link.action.call(null)
      }
      this.$emit('update:modelValue', link.key)
      this.$emit('click', event)
    }
  },
  watch: {
    groups (value) {
      this.expanded = new Set(getExpandedTreeIds(value))
    }
  }
}
</script>

<template>
  <FuraBaseNav
    :groups="currentStateGroups"
    :wrapped-text="wrappedText"
    :selected="modelValue"
    @expand="handleExpand"
    @click="handleClick"
  />
</template>
