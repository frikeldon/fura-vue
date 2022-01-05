<script>
import FuraButton from '../button'
import FuraLabel from '../label'

export default {
  name: 'FuraSpinNav',
  components: {
    FuraButton,
    FuraLabel
  },
  props: {
    /** Valor a mostrar como valor actual. */
    current: { type: [String, Number], required: true },
    /** Valor a mostrar como valor actual, cuando se tiene el foco sobre el valor. */
    currentFocus: { type: [String, Number], default: null },
    /** Valor a mostrar como valor total. */
    total: { type: [String, Number], default: null },
    /** Indica si se muestran el botón de inicio. */
    startButton: { type: Boolean, default: false },
    /** Indica si se muestran el botón de final. */
    endButton: { type: Boolean, default: false },
    /** Indica si la etiqueta que indica la página actual es editable. */
    editable: { type: Boolean, default: false },
    /** Indica si el botón de previo, inicio esta deshabilitado. */
    disablePrev: { type: Boolean, default: false },
    /** Indica si el botón de siguiente esta deshabilitado. */
    disableNext: { type: Boolean, default: false },
    /** Indica si el botón de incio, inicio esta deshabilitado. */
    disableStart: { type: Boolean, default: false },
    /** Indica si el botón de fin, inicio esta deshabilitado. */
    disableEnd: { type: Boolean, default: false },
    /** Indica el nombre del icono para el botón de previo. */
    iconPrev: { type: String, default: 'ChevronLeftSmall' },
    /** Indica el nombre del icono para el botón de siguiente. */
    iconNext: { type: String, default: 'ChevronRightSmall' },
    /** Indica el nombre del icono para el botón de incio. */
    iconStart: { type: String, default: 'ChevronLeftEnd6' },
    /** Indica el nombre del icono para el botón de fin. */
    iconEnd: { type: String, default: 'ChevronRightEnd6' }
  },
  emits: [
    /** Se genera cuando el usuario pulsa el botón de anterior. */
    'prev',
    /** Se genera cuando el usuario pulsa el botón de siguiente. */
    'next',
    /** Se genera cuando el usuario pulsa el botón de inicio. */
    'start',
    /** Se genera cuando el usuario pulsa el botón de fin. */
    'end',
    /**
     * Se genera cuando el usuario introduce un texto en el campo de valor.
     * @property {string} value Texto introducido por el usuario.
     */
    'goTo'
  ],
  data () {
    return { hasFocus: false }
  },
  computed: {
    textValue () {
      const { hasFocus, current, currentFocus } = this
      return hasFocus && currentFocus != null ? currentFocus : current
    }
  },
  methods: {
    handleFocus () {
      this.hasFocus = true
    },
    handleBlur () {
      this.hasFocus = false
      this.$refs.current.$el.innerText = String(this.current)
    },
    handlekeydown (event) {
      if (event.key === 'Enter') {
        event.preventDefault()
        this.$emit('goTo', this.$refs.current.$el.innerText)
        this.$refs.current.$el.blur()
      }
    }
  }
}
</script>

<template>
  <div class="fura-spinNav">
    <FuraButton
      v-if="startButton"
      type="icon"
      :icon="iconStart"
      :disabled="disableStart"
      @click="$emit('start')"
    />
    <FuraButton
      type="icon"
      :icon="iconPrev"
      :disabled="disablePrev"
      @click="$emit('prev')"
    />
    <FuraLabel
      ref="current"
      :contenteditable="editable"
      class="fura-current"
      v-text="textValue"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.stop="handlekeydown"
    />
    <template v-if="total">
      <FuraLabel
        class="fura-separator"
        v-text="'/'"
      />
      <FuraLabel
        class="fura-max"
        v-text="total"
      />
    </template>
    <FuraButton
      type="icon"
      :icon="iconNext"
      :disabled="disableNext"
      @click="$emit('next')"
    />
    <FuraButton
      v-if="endButton"
      type="icon"
      :icon="iconEnd"
      :disabled="disableEnd"
      @click="$emit('end')"
    />
  </div>
</template>

<style lang="less" scoped src="./spin-nav.less"></style>
