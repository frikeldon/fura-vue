<script>
import BaseCalendarDays from '../base-calendar-days'
import BaseCalendarMonths from '../base-calendar-months'
import BaseCalendarYears from '../base-calendar-years'
import Icon from '../icon'

export default {
  components: {
    BaseCalendarDays,
    BaseCalendarMonths,
    BaseCalendarYears,
    Icon
  },
  props: {
    /** Mes a mostrar en el calendario. */
    currentMonth: {
      type: Number,
      required: true,
      validator: month => Number.isInteger(month) &&
        month >= 0 &&
        month <= 11
    },
    /** Año a mostrar en el calendario. */
    currentYear: {
      type: Number,
      required: true,
      validator: month => Number.isInteger(month)
    },
    /**
     * Especifica si el calendario permite seleccionar fechas, meses o años.
     * @values days, months, years
     */
    currentView: {
      type: String,
      default: 'days',
      validator: view => ['days', 'months', 'years'].includes(view)
    },
    /** Textos para identificar los dias de la semana empezando por el domingo. */
    days: {
      type: Array,
      required: true,
      validator: days => days.length === 7 &&
        days.every(day => typeof day === 'string')
    },
    /** Textos para identificar los meses. */
    months: {
      type: Array,
      required: true,
      validator: months => months.length === 12 &&
        months.every(month => typeof month === 'string')
    },
    /** Primer dia de la semana a mostrar en el calendario (0:domingo - 6:sabado). */
    firstDayOfTheWeek: {
      type: Number,
      required: true,
      validator: firstDayOfTheWeek => Number.isInteger(firstDayOfTheWeek) &&
        firstDayOfTheWeek >= 0 &&
        firstDayOfTheWeek <= 6
    },
    /** Día a resaltar como actual. */
    today: {
      type: Date,
      default: null
    },
    /** Fecha seleccionada en el calendario. */
    value: {
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
     * @property {Date} value Fecha seleccionada en el calendario.
     */
    'selectDate',
    /**
     * Se genera cuando el usuario selecciona una mes en la vista de meses.
     * @property {number} currentMonth Mes a mostrar en el calendario.
     */
    'selectMonth',
    /**
     * Se genera cuando el usuario selecciona un año en la vista de años.
     * @property {number} currentYear Año a mostrar en el calendario.
     */
    'selectYear',
    /**
     * Se genera cuando cambia la vista por una acción del usuario.
     * @property {string} currentView Año a mostrar en el calendario.
     */
    'selectView',
    /**
     * Se genera cuando el usuario hace clic en un botón de navegación.
     * @property {number} direction -1 si se pulsa el botón de previo, 1 si se pulsa el botón de siguiente.
     */
    'navigate',
    /** Se genera cuando el usuario hace clic en un botón "Ir a hoy". */
    'clickGoToday'
  ],
  computed: {
    currentMonthName () {
      return this.months[this.currentMonth]
    },
    currentYearRange () {
      return `${this.currentYear} - ${this.currentYear + 11}`
    },
    selectedYear () {
      return this.value?.getFullYear()
    }
  }
}
</script>

<template>
  <div
    class="calendar"
    :class="{ showGoToday: goToday }"
  >
    <div class="header">
      <div class="title">
        <div v-if="currentView === 'days'">
          <span
            v-text="currentMonthName"
            @click.stop="$emit('selectView', 'months')"
          />
          <span>&nbsp;</span>
          <span
            v-text="currentYear"
            @click.stop="$emit('selectView', 'years')"
          />
        </div>
        <div
          v-else-if="currentView === 'months'"
          v-text="currentYear"
          @click.stop="$emit('selectView', 'days')"
        />
        <div
          v-else-if="currentView === 'years'"
          v-text="currentYearRange"
          @click.stop="$emit('selectView', 'days')"
        />
      </div>
      <div class="titleComponents">
        <div class="navContainer">
          <button
            class="prev"
            @click="$emit('navigate', -1)"
          >
            <Icon name="Up" />
          </button>
          <button
            class="next"
            @click="$emit('navigate', 1)"
          >
            <Icon name="Down" />
          </button>
        </div>
      </div>
    </div>
    <BaseCalendarDays
      v-if="currentView === 'days'"
      :current-month="currentMonth"
      :current-year="currentYear"
      :days="days"
      :first-day-of-the-week="firstDayOfTheWeek"
      :today="today"
      :value="value"
      @select="$emit('selectDate', $event)"
    />
    <BaseCalendarMonths
      v-else-if="currentView === 'months'"
      :value="currentMonth"
      :current-year="currentYear"
      :months="months"
      @select="$emit('selectMonth', $event)"
    />
    <BaseCalendarYears
      v-else-if="currentView === 'years'"
      :first-year="currentYear"
      :value="selectedYear"
      @select="$emit('selectYear', $event)"
    />
    <button
      v-if="goToday"
      class="goToday"
      @click="$emit('clickGoToday')"
      v-text="goToday"
    />
  </div>
</template>

<style lang="less" scoped src="./base-calendar.less"></style>

<docs>
<script>
  export default {
    data () {
      const today = new Date()
      return {
        currentMonth: today.getMonth(),
        currentYear: today.getFullYear(),
        currentView: 'days',
        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        firstDayOfTheWeek: 0,
        today,
        value: null,
        goToday: 'Go today'
      }
    },
    methods: {
      onSelectDate (value) {
        this.value = value
      },
      onSelectMonth (month) {
        this.currentMonth = month
        this.currentView = 'days'
      },
      onSelectYear (year) {
        this.currentYear = year
        this.currentView = 'days'
      },
      onSelectView (view) {
        this.currentView = view
      },
      onNavigate (direction) {
        if (this.currentView === 'days') {
          this.currentMonth = (12 + this.currentMonth + direction) % 12
        } else if (this.currentView === 'months') {
          this.currentYear += direction
        } else if (this.currentView === 'years') {
          this.currentYear += direction * 12
        }
      },
      onClickGoToday () {
        this.currentMonth = this.today.getMonth()
        this.currentYear = this.today.getFullYear()
      }
    }
  }
</script>
<template>
  <fura-base-calendar
    :value="value"
    :current-month="currentMonth"
    :current-year="currentYear"
    :current-view="currentView"
    :days="days"
    :months="months"
    :first-day-of-the-week="firstDayOfTheWeek"
    :today="today"
    :go-today="goToday"
    @selectDate="onSelectDate"
    @selectMonth="onSelectMonth"
    @selectYear="onSelectYear"
    @selectView="onSelectView"
    @navigate="onNavigate"
    @clickGoToday="onClickGoToday"
  />
</template>
</docs>
