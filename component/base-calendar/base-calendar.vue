<script>
import FuraBaseCalendarDays from '../base-calendar-days'
import FuraBaseCalendarMonths from '../base-calendar-months'
import FuraBaseCalendarYears from '../base-calendar-years'
import FuraIcon from '../icon'

export default {
  name: 'FuraBaseCalendar',
  components: {
    FuraBaseCalendarDays,
    FuraBaseCalendarMonths,
    FuraBaseCalendarYears,
    FuraIcon
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
    class="fura-calendar"
    :class="{ 'fura-showGoToday': goToday }"
  >
    <div class="fura-header">
      <div class="fura-title">
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
      <div class="fura-titleComponents">
        <button
          type="button"
          class="fura-prev"
          @click.stop="$emit('navigate', -1)"
        >
          <FuraIcon name="Up" />
        </button>
        <button
          type="button"
          class="fura-next"
          @click.stop="$emit('navigate', 1)"
        >
          <FuraIcon name="Down" />
        </button>
      </div>
    </div>
    <FuraBaseCalendarDays
      v-if="currentView === 'days'"
      :current-month="currentMonth"
      :current-year="currentYear"
      :days="days"
      :first-day-of-the-week="firstDayOfTheWeek"
      :today="today"
      :value="value"
      @select="$emit('selectDate', $event)"
    />
    <FuraBaseCalendarMonths
      v-else-if="currentView === 'months'"
      :value="currentMonth"
      :current-year="currentYear"
      :months="months"
      @select="$emit('selectMonth', $event)"
    />
    <FuraBaseCalendarYears
      v-else-if="currentView === 'years'"
      :first-year="currentYear"
      :value="selectedYear"
      @select="$emit('selectYear', $event)"
    />
    <button
      v-if="goToday"
      type="button"
      class="fura-goToday"
      @click.stop="$emit('clickGoToday')"
      v-text="goToday"
    />
  </div>
</template>

<style lang="less" scoped src="./base-calendar.less"></style>
