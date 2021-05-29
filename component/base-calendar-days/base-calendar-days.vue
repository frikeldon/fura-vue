<script>
export default {
  name: 'FuraBaseCalendarDays',
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
    /** Textos para identificar los dias de la semana empezando por el domingo. */
    days: {
      type: Array,
      required: true,
      validator: days => days.length === 7 &&
        days.every(day => typeof day === 'string')
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
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona una fecha.
     * @property {Date} value Fecha seleccionada en el calendario.
     */
    'select'
  ],
  computed: {
    sortedDays () {
      const { days, firstDayOfTheWeek } = this
      return [
        ...days.slice(firstDayOfTheWeek),
        ...days.slice(0, firstDayOfTheWeek)
      ]
    },
    currentWeeks () {
      const { currentMonth, currentYear, firstDayOfTheWeek } = this
      const currentDate = new Date(currentYear, currentMonth, 1)

      while (currentDate.getDay() !== firstDayOfTheWeek) {
        currentDate.setDate(currentDate.getDate() - 1)
      }

      const weeks = []

      while (true) {
        const week = []
        let someDayInCurrentMonth = false

        for (let day = 0; day < 7; day += 1) {
          someDayInCurrentMonth |= currentDate.getMonth() === currentMonth
          week.push(new Date(currentDate.getTime()))
          currentDate.setDate(currentDate.getDate() + 1)
        }

        if (someDayInCurrentMonth) {
          weeks.push(week)
        } else {
          break
        }
      }

      return weeks
    }
  },
  methods: {
    areSameDay (date1, date2) {
      return (
        date1 &&
        date2 &&
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      )
    }
  }
}
</script>

<template>
  <table class="fura-days">
    <thead class="fura-weekday">
      <tr>
        <th
          v-for="(day, index) in sortedDays"
          :key="index"
          v-text="day"
        />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(week, weekIndex) in currentWeeks"
        :key="weekIndex"
      >
        <td
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          class="fura-day"
          :class="{
            'fura-today': areSameDay(day, today),
            'fura-otherMonth': day.getMonth() !== currentMonth,
            'fura-selected': areSameDay(day, value)
          }"
        >
          <button @click="$emit('select', day)">
            <span v-text="day.getDate()" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="less" scoped src="./base-calendar-days.less"></style>

<docs>
<script>
  export default {
    data () {
      const today = new Date()
      return {
        currentMonth: today.getMonth(),
        currentYear: today.getFullYear(),
        days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        firstDayOfTheWeek: 0,
        today,
        value: null
      }
    },
    methods: {
      onSelect (value) {
        this.value = value
      }
    }
  }
</script>
<template>
  <fura-base-calendar-days
    :current-month="currentMonth"
    :current-year="currentYear"
    :days="days"
    :first-day-of-the-week="firstDayOfTheWeek"
    :today="today"
    :value="value"
    @select="onSelect"
  />
</template>
</docs>
