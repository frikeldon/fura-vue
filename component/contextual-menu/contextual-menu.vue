<script>
import FuraBlockMenu from '../block-menu'

export default {
  name: 'FuraContextualMenu',
  components: { FuraBlockMenu },
  props: {
    /** Indica si se muestra el menú. */
    showMenu: { type: Boolean, default: false },
    /** Elementos del menú. */
    items: { type: Array, required: true },
    /** Tiempo en milisegundos que el mouse debe estar sobre el botón para expandir el menú secundario. */
    mousestopDelay: { type: Number, default: 800 },
    /**
     * Posicionamiento vertical del menu.
     * @values above, top, vCenter, bottom, below
     */
    verticalPosition: {
      type: String,
      default: 'top',
      validator: position => !position || ['above', 'top', 'vCenter', 'bottom', 'below'].includes(position)
    },
    /**
     * Posicionamiento horizontal del menu.
     * @values before, left, hCenter, right, after
     */
    horizontalPosition: {
      type: String,
      default: 'after',
      validator: position => !position || ['before', 'left', 'hCenter', 'right', 'after'].includes(position)
    }
  },
  methods: {
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada alineamiento vertical.
     * @param verticalPosition Alineamiento vertical (above, top, vCenter, bottom, below).
     * @return Nombre de la clase CSS que corresponde al alineamiento.
     */
    getVerticalPositionClass (verticalPosition) {
      return ['above', 'top', 'vCenter', 'bottom', 'below'].includes(verticalPosition)
        ? `fura-${verticalPosition}`
        : null
    },
    /**
     * Devuelve el nombre de la clase CSS que corresponde a cada alineamiento horizontal.
     * @param verticalPosition Alineamiento horizontal (before, left, hCenter, right, after).
     * @return Nombre de la clase CSS que corresponde al alineamiento.
     */
    getHorizontalPositionClass (horizontalPosition) {
      return ['before', 'left', 'hCenter', 'right', 'after'].includes(horizontalPosition)
        ? `fura-${horizontalPosition}`
        : null
    }
  }
}
</script>

<template>
  <div>
    <slot />
    <FuraBlockMenu
      v-if="showMenu"
      class="fura-menu"
      :class="[
        getVerticalPositionClass(verticalPosition),
        getHorizontalPositionClass(horizontalPosition)
      ]"
      :items="items"
      :mousestop-delay="mousestopDelay"
    />
  </div>
</template>

<style lang="less" scoped src="./contextual-menu.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        showMenu: false,
        mousestopDelay: 800,
        horizontalPosition: 'after',
        verticalPosition: 'top',
        items: [
          {
            value: 'newItem',
            text: 'New',
            icon: 'Add'
          },
            {
              value: 'editItem',
              text: 'Edit',
              icon: 'Edit'
            },
          {
            value: 'deleteItem',
            text: 'Delete',
            icon: 'Delete'
          },
        ],
        horizontalOptions: [
          { text: 'before', value: 'before' },
          { text: 'left', value: 'left' },
          { text: 'hCenter', value: 'hCenter' },
          { text: 'right', value: 'right' },
          { text: 'after', value: 'after' },
        ],
        verticalOptions: [
          { text: 'above', value: 'above' },
          { text: 'top', value: 'top' },
          { text: 'vCenter', value: 'vCenter' },
          { text: 'bottom', value: 'bottom' },
          { text: 'below', value: 'below' },
        ]
      }
    }
  }
</script>
<template>
  <div>
    <fura-contextual-menu
      :show-menu="showMenu"
      :items="items"
      :horizontal-position="horizontalPosition"
      :vertical-position="verticalPosition"
    >
      <fura-button
        type="icon"
        icon="More"
        @click="showMenu = !showMenu"
      />
    </fura-contextual-menu>
    <fura-dropdown
      label="Horizontal position"
      :options="horizontalOptions"
      v-model="horizontalPosition"
    />
    <fura-dropdown
      label="Vertical position"
      :options="verticalOptions"
      v-model="verticalPosition"
    />
  </div>
</template>
</docs>
