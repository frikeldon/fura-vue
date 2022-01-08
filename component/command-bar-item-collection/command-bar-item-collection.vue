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
    /** Indices de los submenus expandidos */
    itemExpandedPath: { type: Array, default: null },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en el botón de expandir un submenú.
     * @property {Array} path Indices de los elementos para llegar al elemento que lanza el evento
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un elemento de menú.
     * @property {Array} path Indices de los elementos para llegar al elemento que lanza el evento
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
    handleClick (index) {
      this.$emit('click', [index])
    },
    handleExpand (index) {
      this.$emit('expand', [index])
    },
    handleChildClick (index, event) {
      this.$emit('click', [index, ...event])
    },
    handleChildExpand (index, event) {
      this.$emit('expand', [index, ...event])
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
        :click="() => handleClick(index)"
        :expand="() => handleExpand(index)"
      >
        <FuraBaseCommandButton
          v-if="item.type === 'more'"
          class="fura-more"
          :icon="item.icon || 'More'"
          :icon-color="item.iconColor"
          :mousestop-delay="mousestopDelay"
          :disabled="item.disabled"
          :checked="item.checked"
          @click="handleExpand(index)"
          @mousestop="handleExpand(index)"
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
          @click="handleClick(index)"
          @click-expand="handleExpand(index)"
          @mousestop="handleExpand(index)"
          @mousestop-expand="handleExpand(index)"
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
          @click="handleClick(index)"
          @click-expand="handleExpand(index)"
          @mousestop="handleExpand(index)"
        />
      </slot>
      <FuraBaseBlockMenu
        v-if="index === itemExpandedPath?.[0]"
        class="fura-submenu"
        :items="item.childs"
        :item-expanded-path="itemExpandedPath?.slice?.(1)"
        :mousestop-delay="mousestopDelay"
        @click="handleChildClick(index, $event)"
        @expand="handleChildExpand(index, $event)"
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
