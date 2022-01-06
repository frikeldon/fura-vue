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
     * @property {object} linkInfo Índice del enlace dentro de la coleccion (index), referencia a las propiedades del enlace (link) y la ruta para llegar al enlace si es necesarui (parent).
    */
    'expand',
    /**
     * Se genera cuando el usuario hace click en un enalce.
     * @property {object} linkInfo Índice del enlace dentro de la coleccion (index), referencia a las propiedades del enlace (link) y la ruta para llegar al enlace si es necesarui (parent).
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
        type="button"
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
