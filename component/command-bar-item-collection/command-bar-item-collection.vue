<script>
import FuraBaseSplitButton from '../base-split-button'
import FuraBaseCommandButton from '../base-command-button'
import FuraBaseBlockMenu from '../base-block-menu'

export default {
  name: 'FuraCommandBarItemCollection',
  components: {
    FuraBaseSplitButton,
    FuraBaseCommandButton,
    FuraBaseBlockMenu
  },
  props: {
    /** Elementos de la barra de comandos. */
    items: { type: Array, default: () => [] },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en el botón de expandir un submenú.
     * @property {object} itemInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (parent).
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un elemento de menú.
     * @property {object} linkInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (parent).
     */
    'click'
  ],
  data () {
    return {
      refElements: [],
      expanded: null
    }
  },
  computed: {
    /** Referencia a los elementos de menú que se muestran actualmente. */
    refItems () {
      return this.refElements.filter(item => item.el)
        .map(item => ({ ...item }))
    }
  },
  methods: {
    /**
     * Devuelve información sobre el ancho de cada elemento del menú.
     * @returns {Array} Lista con los índices, propiedades, ancho y ancho acumulado de cada elemento del menú.
     * @public
     */
    getItemWidths () {
      const widths = []
      let accumulatedWidth = 0
      for (const { item, index, el } of this.refElements) {
        const width = el.getBoundingClientRect().width
        accumulatedWidth += width
        widths.push({ item, index, width, accumulatedWidth })
      }
      return widths
    },
    /** Comprueba si un elemento del menú tiene elementos hijos. */
    checkItemHasChilds (item) {
      return Array.isArray(item.childs) && item.childs.length > 0
    },
    handleClick (item, index) {
      this.$emit('click', { item, index, parent: undefined })
    },
    handleExpand (item, index) {
      this.$emit('expand', { item, index, parent: undefined })
    },
    handleChildClick (item, index, event) {
      event.parent = { item, index, parent: event.parent }
      this.$emit('click', event)
    },
    handleChildExpand (item, index, event) {
      event.parent = { item, index, parent: event.parent }
      this.$emit('expand', event)
    }
  },
  beforeUpdate () {
    this.refElements = []
  }
}
</script>

<template>
  <div class="fura-collection">
    <div
      v-for="(item, index) in items"
      :key="index"
      :ref="el => refElements.push({ item, index, el })"
      class="fura-item"
    >
      <!--
        @slot Elemento del menú.
        @binding {object} item Referencia al elemento.
        @binding {number} index Índice del elemento.
        @binding {function} click Método para invocar el evento click.
        @binding {function} expand Método para invocar el evento expand.
      -->
      <slot
        :item="item"
        :index="index"
        :click="() => handleClick(item, index)"
        :expand="() => handleExpand(item, index)"
      >
        <FuraBaseCommandButton
          v-if="item.type === 'more'"
          class="fura-more"
          :icon="item.icon || 'More'"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          :checked="item.checked"
          @click="handleExpand(item, index)"
          @mousestop="handleExpand(item, index)"
        />
        <FuraBaseSplitButton
          v-else-if="item.type === 'split'"
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          :checked="item.checked"
          expand-icon="ChevronDown"
          :href="item.href"
          :target="item.target"
          :title="item.title"
          :download="item.download"
          @click="handleClick(item, index)"
          @click-expand="handleExpand(item, index)"
          @mousestop="handleExpand(item, index)"
          @mousestop-expand="handleExpand(item, index)"
        />
        <FuraBaseCommandButton
          v-else
          :text="item.text"
          :icon="item.icon"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :expand-icon="checkItemHasChilds(item) ? 'ChevronDown' : ''"
          :disabled="item.disabled"
          :checked="item.checked"
          :href="item.href"
          :target="item.target"
          :title="item.title"
          :download="item.download"
          @click="handleClick(item, index)"
          @click-expand="handleExpand(item, index)"
          @mousestop="handleExpand(item, index)"
        />
      </slot>
      <FuraBaseBlockMenu
        v-if="item.expanded && checkItemHasChilds(item)"
        :items="item.childs"
        :mousestop-delay="mousestopDelay"
        @click="handleChildClick(item, index, $event)"
        @expand="handleChildExpand(item, index, $event)"
      >
        <template #submenu="slotProps">
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
    </div>
  </div>
</template>

<style lang="less" scoped src="./command-bar-item-collection.less"></style>
