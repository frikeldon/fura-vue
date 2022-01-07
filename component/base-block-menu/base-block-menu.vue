<script>
import FuraBaseSplitButton from '../base-split-button'
import FuraBaseCommandButton from '../base-command-button'
import FuraIcon from '../icon'

export default {
  name: 'FuraBaseBlockMenu',
  components: {
    FuraBaseSplitButton,
    FuraBaseCommandButton,
    FuraIcon
  },
  props: {
    /** Elementos del menú. */
    items: { type: Array, required: true },
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
  computed: {
    iconSpace () {
      return this.items
        .filter(item => !item.type || item.type === 'button')
        .some(button => button.icon)
    },
    itemExpandedIndex () {
      const element = this.itemExpandedPath?.[0]
      return typeof element === 'number'
        ? element
        : element?.index
    },
    itemExpandedPositionClasses () {
      const element = this.itemExpandedPath?.[0]
      const vertical = element?.vertical || 'top'
      const horizontal = element?.horizontal || 'after'
      const classes = []
      if (['over', 'top', 'bottom', 'under'].includes(vertical)) {
        classes.push(`fura-${vertical}`)
      }
      if (['before', 'left', 'right', 'after'].includes(horizontal)) {
        classes.push(`fura-${horizontal}`)
      }
      return classes
    }
  },
  methods: {
    /** Comprueba si un elemento tiene una acción asignada. */
    checkItemHasActions (item) {
      return typeof item.action === 'function'
    },
    /** Comprueba si un elemento tiene elementos hijos. */
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
  }
}
</script>

<template>
  <div class="fura-blockMenu">
    <ul>
      <template v-for="(item, index) in items">
        <li
          v-if="item.type === 'divider'"
          :key="`divider_${index}`"
          class="fura-divider"
        />
        <li
          v-else-if="item.type === 'title'"
          :key="`title_${index}`"
          class="fura-title"
        >
          <!--
            @slot Encabezado del menú.
            @binding {object} item Referencia al elemento.
            @binding {number} index Índice del elemento.
          -->
          <slot
            name="title"
            :item="item"
            :index="index"
          >
            <div>
              <FuraIcon
                class="fura-icon"
                :name="item.icon"
                :style="{ color: item.iconColor }"
              />
              <span v-text="item.text" />
            </div>
          </slot>
        </li>
        <li
          v-else
          :key="`item_${index}`"
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
            <FuraBaseSplitButton
              v-if="checkItemHasActions(item) && checkItemHasChilds(item)"
              class="fura-button"
              :text="item.text"
              :icon="item.icon"
              :icon-color="item.iconColor"
              :icon-space="iconSpace"
              :mousestop-delay="mousestopDelay"
              :disabled="item.disabled"
              :checked="item.checked"
              expand-icon="ChevronRight"
              :href="item.href"
              :target="item.target"
              :title="item.title"
              :download="item.download"
              @click="handleClick(index)"
              @click-expand="handleExpand(index)"
              @mousestop="handleExpand(item, index)"
              @mousestop-expand="handleExpand(item, index)"
            />
            <FuraBaseCommandButton
              v-else
              class="fura-button"
              :text="item.text"
              :icon="item.icon"
              :icon-color="item.iconColor"
              :icon-space="iconSpace"
              :mousestop-delay="mousestopDelay"
              :expand-icon="checkItemHasChilds(item) ? 'ChevronRight' : ''"
              :disabled="item.disabled"
              :checked="item.checked"
              :href="item.href"
              :target="item.target"
              :title="item.title"
              :download="item.download"
              @click="handleClick(index)"
              @click-expand="handleExpand(index)"
              @mousestop="handleExpand(item, index)"
            />
          </slot>
          <FuraBaseBlockMenu
            v-if="itemExpandedIndex === index && checkItemHasChilds(item)"
            :class="itemExpandedPositionClasses"
            :items="item.childs"
            :item-expanded-path="itemExpandedPath?.slice?.(1)"
            :mousestop-delay="mousestopDelay"
            @click="handleChildClick(index, $event)"
            @expand="handleChildExpand(index, $event)"
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
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="less" scoped src="./base-block-menu.less"></style>
