<script>
import FuraIcon from '../icon'
import FuraBaseNavList from '../base-nav-list'

export default {
  name: 'FuraBaseNav',
  components: {
    FuraIcon,
    FuraBaseNavList
  },
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
    selected: { type: String, default: null }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace click en el botón de expandir de un enlace.
     * @property {object} linkInfo Índice del enlace dentro de la coleccion (index), referencia a las propiedades del enlace (link) y la ruta para llegar al enlace si es necesarui (path).
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un enalce.
     * @property {object} linkInfo Índice del enlace dentro de la coleccion (index), referencia a las propiedades del enlace (link) y la ruta para llegar al enlace si es necesarui (path).
     */
    'click'
  ]
}
</script>

<template>
  <nav>
    <div
      v-for="(group, groupIndex) in groups"
      :key="groupIndex"
      class="fura-group"
      :class="{ 'fura-expanded': group.expanded }"
    >
      <button
        v-if="group.name"
        @click.stop="$emit('expand', { group, groupIndex })"
      >
        <FuraIcon
          class="fura-icon"
          name="ChevronDown"
        />
        {{ group.name }}
      </button>
      <div class="fura-content fura-slideDownIn20">
        <FuraBaseNavList
          :links="group.links"
          :nesting-level="0"
          :wrapped-text="wrappedText"
          :selected="selected"
          @expand="$emit('expand', { group, groupIndex, ...$event })"
          @click="$emit('click', { group, groupIndex, ...$event })"
        />
      </div>
    </div>
  </nav>
</template>

<style lang="less" scoped src="./base-nav.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        selected: null,
        groups: [
          {
            name: 'Basic components',
            links: [
              {
                key: 'ActivityItem',
                name: 'ActivityItem'
              },
              {
                key: 'Breadcrumb',
                name: 'Breadcrumb'
              },
              {
                key: 'Button',
                name: 'Button'
              }
            ]
          },
          {
            name: 'Extended components',
            links: [
              {
                key: 'ColorPicker',
                name: 'ColorPicker'
              },
              {
                key: 'ExtendedPeoplePicker',
                name: 'ExtendedPeoplePicker'
              },
              {
                key: 'GroupedList',
                name: 'GroupedList'
              }
            ]
          },
          {
            name: 'Utilities',
            links: [
              {
                key: 'FocusTrapZone',
                name: 'FocusTrapZone'
              },
              {
                key: 'FocusZone',
                name: 'FocusZone'
              },
              {
                key: 'MarqueeSelection',
                name: 'MarqueeSelection'
              }
            ]
          }
        ]
      }
    },
    methods: {
      onExpand ({ group }) {
        group.expanded = !group.expanded
      },
      onClick ({ link }) {
        this.selected = link.key
      }
    }
  }
</script>
<template>
  <fura-base-nav
    :groups="groups"
    :selected="selected"
    @expand="onExpand"
    @click="onClick"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        selected: null,
        groups: [
          {
            expanded: true,
            links: [
              {
                name: 'Home',
                key: 'home',
                links: [
                  {
                    name: 'Activity',
                    key: 'key1'
                  },
                  {
                    name: 'MSN',
                    disabled: true,
                    key: 'key2'
                  },
                ]
              },
              {
                name: 'Documents',
                key: 'key3'
              },
              {
                name: 'Pages',
                key: 'key4'
              },
              {
                name: 'Notebook',
                key: 'key5',
                disabled: true
              },
              {
                name: 'Communication and Media',
                key: 'key6'
              },
              {
                name: 'News',
                icon: 'News',
                key: 'key7'
              }
            ]
          }
        ]
      }
    },
    methods: {
      onExpand ({ link }) {
        link.expanded = !link.expanded
      },
      onClick ({ link }) {
        this.selected = link.key
      }
    }
  }
</script>
<template>
  <fura-base-nav
    :groups="groups"
    :selected="selected"
    @expand="onExpand"
    @click="onClick"
  />
</template>
</docs>
