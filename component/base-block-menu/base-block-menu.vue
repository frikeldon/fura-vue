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
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en el botón de expandir un submenú.
     * @property {object} itemInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (path).
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un elemento de menú.
     * @property {object} linkInfo Índice del elemento de menú dentro de la coleccion (index), referencia a las propiedades del elemento de menú (item) y la ruta para llegar al elemento de menú si es necesarui (path).
     */
    'click'
  ],
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
    handleClick (item, index) {
      this.$emit('click', { item, index, path: undefined })
    },
    handleExpand (item, index) {
      this.$emit('expand', { item, index, path: undefined })
    },
    handleChildClick (item, index, event) {
      event.path = { item, index, path: event.path }
      this.$emit('click', event)
    },
    handleChildExpand (item, index, event) {
      event.path = { item, index, path: event.path }
      this.$emit('expand', event)
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
            :click="() => handleClick(item, index)"
            :expand="() => handleExpand(item, index)"
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
              expand-icon="ChevronRight"
              @click="handleClick(item, index)"
              @click-expand="handleExpand(item, index)"
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
              @click="handleClick(item, index)"
              @click-expand="handleExpand(item, index)"
              @mousestop="handleExpand(item, index)"
            />
          </slot>
          <FuraBaseBlockMenu
            v-if="item.expanded && checkItemHasChilds(item)"
            class="fura-childBlockMenu"
            :items="item.childs"
            :mousestop-delay="mousestopDelay"
            @click="handleChildClick(item, index, $event)"
            @expand="handleChildExpand(item, index, $event)"
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
    },
    methods: {
      onClick ({ item }) {
        item.action && item.action()
      },
      onExpand ({ item }) {
        item.expanded = !item.expanded
      }
    }
  }
</script>
<template>
  <fura-base-block-menu
    :mousestop-delay="mousestopDelay"
    :items="items"
    @click="onClick"
    @expand="onExpand"
  />
</template>
</docs>

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
    },
    methods: {
      onClick ({ item }) {
        item.action && item.action()
      },
      onExpand ({ item }) {
        item.expanded = !item.expanded
      }
    }
  }
</script>
<template>
  <fura-base-block-menu
    :mousestop-delay="mousestopDelay"
    :items="items"
    @click="onClick"
    @expand="onExpand"
  >
    <template v-slot="slotProps">
      <div style="display: flex; align-items: center;">
        <fura-button
          style="flex-grow: 1;"
          :text="slotProps.item.text"
          @click="slotProps.click"
        />
        <fura-expander-button
          v-if="slotProps.item.childs"
          style="flex-grow: 0;"
          :expanded="slotProps.item.expanded"
          @click="slotProps.expand"
        />
      </div>
    </template>
    <template v-slot:title="slotProps">
      <fura-label
        v-text="slotProps.item.text"
      />
    </template>
  </fura-base-block-menu>
</template>
</docs>
