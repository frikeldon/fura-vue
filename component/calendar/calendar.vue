<script>
import FuraBaseCalendar from '../base-calendar'

export default {
  name: 'FuraCalendar',
  components: { FuraBaseCalendar },
  props: {
    /** Textos para identificar los dias de la semana empezando por el domingo. */
    days: {
      type: Array,
      default: () => ['d', 'l', 'm', 'x', 'j', 'v', 's'],
      validator: days => days.length === 7 &&
        days.every(day => typeof day === 'string')
    },
    /** Textos para identificar los meses. */
    months: {
      type: Array,
      default: () => [
        'Gener',
        'Febrer',
        'Març',
        'Abril',
        'Maig',
        'Juny',
        'Juliol',
        'Agost',
        'Setembre',
        'Octubre',
        'Novembre',
        'Desembre'
      ],
      validator: months => months.length === 12 &&
        months.every(month => typeof month === 'string')
    },
    /** Primer dia de la semana a mostrar en el calendario (0:domingo - 6:sabado). */
    firstDayOfTheWeek: {
      type: Number,
      default: 1,
      validator: firstDayOfTheWeek => Number.isInteger(firstDayOfTheWeek) &&
        firstDayOfTheWeek >= 0 &&
        firstDayOfTheWeek <= 6
    },
    /** Día a resaltar como actual. Si no se especifica se coge la fecha actual del sistema. */
    today: {
      type: Date,
      default: () => new Date()
    },
    /** Fecha seleccionada en el calendario. */
    modelValue: {
      type: Date,
      default: null
    },
    /** El texto del enlace "Ir a hoy" que se muestra en el calendario. */
    goToday: {
      type: String,
      default: ''
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona una fecha en la vista de dias.
     * @property {Date} modelValue Fecha seleccionada en el calendario.
     */
    'update:modelValue'
  ],
  data () {
    const today = this.today || new Date()
    return {
      currentView: 'days',
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear()
    }
  },
  methods: {
    handleSelectMonth (month) {
      this.currentMonth = month
      this.currentView = 'days'
      this.$el.focus()
    },
    handleSelectYear (year) {
      this.currentYear = year
      this.currentView = 'days'
      this.$el.focus()
    },
    handleSelectView (value) {
      this.currentView = value
      this.$el.focus()
    },
    handleNavigate (direction) {
      if (this.currentView === 'days') {
        const newMonth = this.currentMonth + direction
        if (newMonth < 0) {
          this.currentMonth = newMonth + 12
          this.currentYear = this.currentYear - 1
        } else if (newMonth > 11) {
          this.currentMonth = newMonth - 12
          this.currentYear = this.currentYear + 1
        } else {
          this.currentMonth = newMonth
        }
      } else if (this.currentView === 'months') {
        this.currentYear = this.currentYear + direction
      } else if (this.currentView === 'years') {
        this.currentYear = this.currentYear + (direction * 12)
      }
      this.$el.focus()
    },
    handleClickGoToday () {
      const today = this.today || new Date()
      this.currentMonth = today.getMonth()
      this.currentYear = today.getFullYear()
      this.$el.focus()
    }
  },
  watch: {
    modelValue (value) {
      if (value) {
        this.currentMonth = value.getMonth()
        this.currentYear = value.getFullYear()
      }
    }
  }
}
</script>

<template>
  <FuraBaseCalendar
    :value="modelValue"
    :current-month="currentMonth"
    :current-year="currentYear"
    :current-view="currentView"
    :days="days"
    :months="months"
    :first-day-of-the-week="firstDayOfTheWeek"
    :today="today"
    :go-today="goToday"
    @selectDate="$emit('update:modelValue', $event)"
    @selectMonth="handleSelectMonth"
    @selectYear="handleSelectYear"
    @selectView="handleSelectView"
    @navigate="handleNavigate"
    @click-go-today="handleClickGoToday"
  />
</template>
