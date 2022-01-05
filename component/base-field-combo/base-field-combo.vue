<script>
import FuraLabel from '../label'

export default {
  name: 'FuraBaseFieldCombo',
  components: { FuraLabel },
  props: {
    /** Etiqueta que se muestra encima del campo de formulario asociado. */
    label: { type: String, default: '' },
    /** La descripción se muestra debajo del campo del formulario asociado para proporcionar detalles adicionales sobre qué valor ingresar. */
    description: { type: String, default: '' },
    /** Dibuja el borde del campo con color de error. */
    invalid: { type: Boolean, default: false },
    /** Mensaje de error estático que se muestra debajo del campo del formulario asociado. */
    errorMessage: { type: String, default: '' },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Estado requerido del campo de formulario asociado. */
    required: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado no tiene bordes. */
    borderless: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado está subrayado o no. */
    underlined: { type: Boolean, default: false },
    /** Indica si se muestra el panel del campo de formulario asociado. */
    open: { type: Boolean, default: false },
    /** Indica si el panel del campo aparece en la parte superior. */
    dropup: { type: Boolean, default: false }
  },
  data () {
    return {
      clickOutsideHandler: null
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en la etiqueta el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click',
    /**
     * Se genera cuando el componente tiene el panel desplegado y el usuario hace clic fuera del componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'clickOutside'
  ],
  methods: {
    getViewportMargins () {
      const {
        top,
        right: boundingRight,
        bottom: boundingBottom,
        left
      } = this.$refs.fieldGroup.getBoundingClientRect()

      const bottom = (window.innerHeight || document.documentElement.clientHeight) - boundingBottom
      const right = (window.innerWidth || document.documentElement.clientWidth) - boundingRight

      return { top, right, bottom, left }
    }
  },
  watch: {
    open (open) {
      if (open) {
        window.addEventListener('click', this.clickOutsideHandler, true)
      } else {
        window.removeEventListener('click', this.clickOutsideHandler, true)
      }
    }
  },
  mounted () {
    this.clickOutsideHandler = event => {
      const { fieldGroup, dropdownPanel } = this.$refs
      if (!fieldGroup.contains(event.target) || event.target === dropdownPanel) {
        this.$emit('clickOutside', event)
      }
    }
  },
  unmounted () {
    if (this.clickOutsideHandler) {
      window.removeEventListener('click', this.clickOutsideHandler, true)
    }
    this.clickOutsideHandler = null
  }
}
</script>

<template>
  <div
    class="fura-fieldCombo"
    :class="{
      'fura-required': required,
      'fura-disabled': disabled,
      'fura-underlined': underlined,
      'fura-borderless': borderless,
      'fura-open': open,
      'fura-dropup': dropup,
      'fura-requiredPlaceholder': !label && required,
      'fura-invalid': invalid || errorMessage
    }"
  >
    <div class="fura-elementWrapper">
      <FuraLabel
        v-if="label"
        class="fura-label"
        :required="required"
        :disabled="disabled"
        @click.stop="$emit('click', $event)"
        v-text="label"
      />
      <div class="fura-fieldWrapper">
        <div
          ref="fieldGroup"
          class="fura-fieldGroup"
        >
          <!-- @slot Campo del formulario. -->
          <slot />
          <div
            ref="dropdownPanel"
            class="fura-dropdownPanel"
          >
            <!-- @slot Panel desplegable. -->
            <slot name="dropdown" />
          </div>
        </div>
      </div>
    </div>
    <span v-if="description || errorMessage">
      <span
        v-if="description"
        class="fura-description"
        v-text="description"
      />
      <p
        v-if="errorMessage"
        class="fura-errorMessage fura-slideDownIn20"
      >
        <span v-text="errorMessage" />
      </p>
    </span>
  </div>
</template>

<style lang="less" scoped src="./base-field-combo.less"></style>
