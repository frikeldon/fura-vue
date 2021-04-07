<script>
import FuraBaseSplitButton from '../base-split-button'
import FuraBaseCommandButton from '../base-command-button'
import FuraIcon from '../icon'

export default {
  name: 'FuraBlockMenu',
  components: {
    FuraBaseSplitButton,
    FuraBaseCommandButton,
    FuraIcon
  },
  props: {
    /** Elementos del menú. */
    items: { type: Array, required: true },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 }
  },
  data () {
    return {
      expanded: null
    }
  },
  computed: {
    iconSpace () {
      return this.items
        .filter(item => !item.type || item.type === 'button')
        .some(button => button.icon)
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
    expandItem (index) {
      this.expanded = this.expanded === index
        ? null
        : index
    },
    handleClick (index) {
      if (this.expanded !== index) {
        this.expanded = null
      }
      const item = this.items[index]
      if (item) {
        if (typeof item.action === 'function') {
          item.action.call(null)
        } else if (item.childs && item.childs.length > 0) {
          this.expanded = index
        }
      }
    }
  }
}
</script>

<template>
  <div class="blockMenu">
    <ul>
      <template v-for="(item, index) in items">
        <!--
          @slot Elemento del menú.
          @binding {object} item Referencia al elemento.
          @binding {number} index Índice del elemento.
        -->
        <slot
          v-if="!item.type || item.type === 'button'"
          :item="item"
          :index="index"
        >
          <li :key="index">
            <FuraBaseSplitButton
              v-if="checkItemHasActions(item) && checkItemHasChilds(item)"
              class="button"
              :text="item.text"
              :icon="item.icon"
              :icon-color="item.iconColor"
              :icon-space="iconSpace"
              :mousestop-delay="mousestopDelay"
              :disabled="item.disabled"
              expand-icon="ChevronRight"
              @click="handleClick(index)"
              @click-expand="expandItem(index)"
              @mousestop="expandItem(index)"
              @mousestop-expand="expandItem(index)"
            />
            <FuraBaseCommandButton
              v-else
              class="button"
              :text="item.text"
              :icon="item.icon"
              :icon-color="item.iconColor"
              :icon-space="iconSpace"
              :mousestop-delay="mousestopDelay"
              :expand-icon="checkItemHasChilds(item) ? 'ChevronRight' : ''"
              :disabled="item.disabled"
              @click="handleClick(index)"
              @click-expand="expandItem(index)"
              @mousestop="expandItem(index)"
            />
            <FuraBlockMenu
              v-if="index === expanded && checkItemHasChilds(item)"
              class="childBlockMenu"
              :items="item.childs"
              :mousestop-delay="mousestopDelay"
            />
          </li>
        </slot>
        <!--
          @slot Encabezado del menú.
          @binding {object} item Referencia al elemento.
          @binding {number} index Índice del elemento.
        -->
        <slot
          v-else-if="item.type === 'title'"
          name="title"
          :item="item"
          :index="index"
        >
          <li
            :key="index"
            class="title"
          >
            <div>
              <FuraIcon
                class="icon"
                :name="item.icon"
                :style="{ color: item.iconColor }"
              />
              <span v-text="item.text" />
            </div>
            <slot />
          </li>
        </slot>
        <!--
          @slot Separador del menú.
          @binding {object} item Referencia al elemento.
          @binding {number} index Índice del elemento.
        -->
        <slot
          v-else-if="item.type === 'divider'"
          name="divider"
          :item="item"
          :index="index"
        >
          <li
            :key="index"
            class="divider"
          />
        </slot>
      </template>
    </ul>
  </div>
</template>

<style lang="less" scoped src="./block-menu.less"></style>

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
