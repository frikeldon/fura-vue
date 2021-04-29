<script>
import FuraIcon from '../icon'
import FuraExpanderButton from '../expander-button'

export default {
  components: {
    FuraIcon,
    FuraExpanderButton
  },
  name: 'FuraBaseNavList',
  props: {
    /** Una colección de enlaces. */
    links: { type: Array, required: true },
    /** Nivel de anidado de la colección de enlaces. */
    nestingLevel: { type: Number, default: 0 },
    /** Indica si los enlaces pueden contener saltos de línea. */
    wrappedText: { type: Boolean, default: false },
    /** Valor del enlace seleccionado. */
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
  ],
  methods: {
    handleClickExpander (link, index) {
      this.$emit('expand', { link, index, path: undefined })
    },
    handleExpandChild (link, index, event) {
      event.path = { link, index, path: event.path }
      this.$emit('expand', event)
    },
    handleClickLink (link, index) {
      this.$emit('click', { link, index, path: undefined })
    },
    handleClickChild (link, index, event) {
      event.path = { link, index, path: event.path }
      this.$emit('click', event)
    }
  }
}
</script>

<template>
  <ul>
    <li
      v-for="(link, index) in links"
      :key="index"
    >
      <div
        class="container"
        :class="{
          wrappedText,
          selected: selected !== null && selected === link.key
        }"
      >
        <FuraExpanderButton
          v-if="Array.isArray(link.links) && link.links.length > 0"
          class="expander"
          vertical
          :extended="link.extended"
          @click="handleClickExpander(link, index)"
        />
        <component
          :is="link.href ? 'a' : 'button'"
          class="link"
          :style="`padding: 0 20px 0 ${(14 * nestingLevel) + (link.icon ? 3 : 27)}px`"
          :href="link.href"
          :target="link.href ? link.target : null"
          :title="link.title ?? link.name"
          :disabled="link.disabled || null"
          @click="handleClickLink(link, index)"
        >
          <span>
            <FuraIcon
              v-if="link.icon"
              :name="link.icon"
              class="icon"
            />
            <div
              class="label"
              v-text="link.name"
            />
          </span>
        </component>
      </div>
      <FuraBaseNavList
        v-if="Array.isArray(link.links) && link.links.length > 0 && !link.expanded"
        :links="link.links"
        :nesting-level="nestingLevel + 1"
        :wrapped-text="wrappedText"
        :selected="selected"
        @expand="handleExpandChild(link, index, $event)"
        @click="handleClickChild(link, index, $event)"
      />
    </li>
  </ul>
</template>

<style lang="less" scoped src="./base-nav-list.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        selected: null,
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
    },
    methods: {
      onClick (event) {
        this.selected = event.link.key
      },
      onExpand (event) {
        event.link.expanded = !event.link.expanded
      }
    }
  }
</script>
<template>
  <fura-base-nav-list
    :links="links"
    :selected="selected"
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
        links: [
          {
            name: 'Parent link 1',
            href: 'http://example.com',
            target: '_blank',
            links: [
              {
                name: 'Child link 1',
                href: 'http://example.com',
                target: '_blank'
              },
              {
                name: 'Child link 2',
                href: 'http://example.com',
                target: '_blank',
                links: [
                  {
                    name: '3rd level link 1',
                    href: 'http://example.com',
                    target: '_blank',
                    links: [
                      {
                        name: '4rd level link 1',
                        href: 'http://example.com',
                        target: '_blank'
                      },
                      {
                        name: '4rd level link 2',
                        href: 'http://example.com',
                        target: '_blank'
                      }
                    ]
                  },
                  {
                    name: '3rd level link 2',
                    href: 'http://example.com',
                    target: '_blank'
                  }
                ]
              },
              {
                name: 'Child link 3',
                href: 'http://example.com',
                target: '_blank'
              }
            ]
          },
          {
            name: 'Parent link 2',
            href: 'http://example.com',
            target: '_blank',
            links: [
              {
                name: 'Child link 4',
                href: 'http://example.com',
                target: '_blank'
              }
            ]
          }
        ]
      }
    },
    methods: {
      onExpand (event) {
        let parent = this
        let currentPath = event.path
        while (currentPath) {
          parent = parent.links[currentPath.index]
          currentPath = currentPath.path
        }
        parent.links[event.index].expanded = !parent.links[event.index].expanded
      }
    }
  }
</script>
<template>
  <fura-base-nav-list
    :links="links"
    @expand="onExpand"
  />
</template>
</docs>
