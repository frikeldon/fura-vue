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

<docs>
<script>
  export default {
    data () {
      return {
        current: 1,
        total: 15,
        finalButtons: true,
        editable: true,
        disablePrev: true,
        disableNext: false
      }
    },
    methods: {
      onPrev () {
        const value = this.current - 1
        if (value >= 1) {
          this.current = value
        }
      },
      onNext () {
        const value = this.current + 1
        if (value <= this.total) {
          this.current = value
        }
      },
      onStart () {
        this.current = 1
      },
      onEnd () {
        this.current = this.total
      },
      onGoTo (page) {
        const value = Number(page)
        if (!isNaN(value) && value >= 1 && value <= this.total) {
          this.current = value
        }
      }
    }
  }
</script>
<template>
  <fura-spin-nav
    :current="current"
    :total="total"
    :endButton="finalButtons"
    :startButton="finalButtons"
    :editable="editable"
    :disablePrev="current <= 1"
    :disableNext="current >= total"
    :disableStart="current <= 1"
    :disableEnd="current >= total"
    @prev="onPrev"
    @next="onNext"
    @start="onStart"
    @end="onEnd"
    @go-to="onGoTo"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      return {
        current: 1,
        total: 150,
        finalButtons: true,
        editable: true,
        disablePrev: true,
        disableNext: false,
        pageSize: 30
      }
    },
    computed: {
      endRange () {
        const { current, total, pageSize } = this
        return Math.min(current + (pageSize - 1), total)
      },
      currentText () {
        const { current, endRange } = this
        return `${current}-${endRange}`
      }
    },
    methods: {
      onPrev () {
        const value = Math.max(this.current - this.pageSize, 1)
        if (value >= 1) {
          this.current = value
        }
      },
      onNext () {
        const value = this.current + this.pageSize
        if (value <= this.total) {
          this.current = value
        }
      },
      onStart () {
        this.current = 1
      },
      onEnd () {
        this.current = Math.max(this.total - (this.pageSize - 1), 1)
      },
      onGoTo (page) {
        const value = Number(page)
        if (!isNaN(value) && value >= 1 && value <= this.total) {
          this.current = value
        }
      }
    }
  }
</script>
<template>
  <fura-spin-nav
    :current="currentText"
    :current-focus="current"
    :total="total"
    :endButton="finalButtons"
    :startButton="finalButtons"
    :editable="editable"
    :disablePrev="current <= 1"
    :disableNext="current + (pageSize - 1) >= total"
    :disableStart="current <= 1"
    :disableEnd="current + (pageSize - 1) >= total"
    @prev="onPrev"
    @next="onNext"
    @start="onStart"
    @end="onEnd"
    @go-to="onGoTo"
  />
</template>
</docs>

<docs>
<script>
  export default {
    data () {
      const today = new Date()
      const day = today.getDay()
      if (day === 0) {
        today.setDate(today.getDate() - 6)
      } else {
        today.setDate(today.getDate() - (day - 1))
      }
      return {
        current: today,
        total: 150,
        finalButtons: true,
        editable: true,
        disablePrev: true,
        disableNext: false,
        pageSize: 30
      }
    },
    computed: {
      currentText () {
        const { current } = this
        return `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`
      }
    },
    methods: {
      updateCurrent () {
        this.current = new Date(this.current)
      },
      onPrev () {
        this.current.setDate(this.current.getDate() - 7)
        this.updateCurrent()
      },
      onNext () {
        this.current.setDate(this.current.getDate() + 7)
        this.updateCurrent()
      },
      onStart () {
        this.current.setDate(this.current.getDate() - (7 * 4))
        this.updateCurrent()
      },
      onEnd () {
        this.current.setDate(this.current.getDate() + (7 * 4))
        this.updateCurrent()
      }
    }
  }
</script>
<template>
  <fura-spin-nav
    :current="currentText"
    :endButton="finalButtons"
    :startButton="finalButtons"
    icon-prev="ChevronLeftMed"
    icon-next="ChevronRightMed"
    icon-start="DoubleChevronLeftMed"
    icon-end="DoubleChevronLeftMedMirrored"
    @prev="onPrev"
    @next="onNext"
    @start="onStart"
    @end="onEnd"
  />
</template>
</docs>
