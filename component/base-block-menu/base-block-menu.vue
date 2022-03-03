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
     * @property {object} data Indices de los elementos para llegar al elemento que lanza el evento y el objeto descriptor del evento click.
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un elemento de menú.
     * @property {object} data Indices de los elementos para llegar al elemento que lanza el evento y el objeto descriptor del evento click.
     */
    'click',
    /**
     * Se genera cuando el elemento se renderiza fuera de los margenes visibles de la pagina
     * @property {object} event Lados que sobresalen de la pantalla y path para llegar al elemento que sobresale.
     */
    'overload'
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
        classes.push(`fura-${vertical}Menu`)
      }
      if (['before', 'left', 'right', 'after'].includes(horizontal)) {
        classes.push(`fura-${horizontal}Menu`)
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
    handleClick (index, event) {
      this.$emit('click', { event, path: [index] })
    },
    handleExpand (index, event) {
      if (!this.items[index].disabled) {
        this.$emit('expand', { event, path: [index] })
      }
    },
    handleOverload (event) {
      this.$emit('overload', { event, path: [] })
    },
    handleChildClick (index, data) {
      data.path = [index, ...data.path]
      this.$emit('click', data)
    },
    handleChildExpand (index, data) {
      data.path = [index, ...data.path]
      this.$emit('expand', data)
    },
    handleChildOverload (index, event) {
      event.path = [index, ...event.path]
      this.$emit('overload', event)
    }
  },
  mounted () {
    const clientRect = this.$el.getBoundingClientRect()

    const top = clientRect.top < 0
    const right = clientRect.right > document.body.scrollWidth
    const bottom = clientRect.bottom > document.body.scrollHeight
    const left = clientRect.left < 0

    if (top || right || bottom || left) {
      this.handleOverload({ top, right, bottom, left })
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
            :click="$event => handleClick(index, $event)"
            :expand="$event => handleExpand(index, $event)"
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
              @click="handleClick(index, $event)"
              @click-expand="handleExpand(index, $event)"
              @mousestop="handleExpand(index, $event)"
              @mousestop-expand="handleExpand(index, $event)"
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
              @click="handleClick(index, $event)"
              @click-expand="handleExpand(index, $event)"
              @mousestop="handleExpand(index, $event)"
            />
          </slot>
          <FuraBaseBlockMenu
            v-if="itemExpandedIndex === index && checkItemHasChilds(item)"
            class="fura-subBlockMenu"
            :class="itemExpandedPositionClasses"
            :items="item.childs"
            :item-expanded-path="itemExpandedPath?.slice?.(1)"
            :mousestop-delay="mousestopDelay"
            @click="handleChildClick(index, $event)"
            @expand="handleChildExpand(index, $event)"
            @overload="handleChildOverload(index, $event)"
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
