<script>
export default {
  name: 'FuraBaseCalendarMonths',
  props: {
    /** Mes a mostrar en el calendario. */
    value: {
      type: Number,
      default: null,
      validator: month => month === null || (
        Number.isInteger(month) &&
        month >= 0 &&
        month <= 11
      )
    },
    /** Textos para identificar los meses. */
    months: {
      type: Array,
      required: true,
      validator: months => months.length === 12 &&
        months.every(month => typeof month === 'string')
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona un mes.
     * @property {number} value Mes a mostrar en el calendario.
     */
    'select'
  ],
  computed: {
    rows () {
      const { months } = this
      const getSlice = index => months
        .slice(index, index + 4)
        .map(month => month.substr(0, 3))
      return [
        getSlice(0),
        getSlice(4),
        getSlice(8)
      ]
    }
  },
  methods: {
    getMonthByCoords (row, col) {
      return col + (row * 4)
    }
  }
}
</script>

<template>
  <div class="fura-grid">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
    >
      <button
        v-for="(monthName, colIndex) in row"
        :key="colIndex"
        class="fura-button"
        :class="{ 'fura-selected': getMonthByCoords(rowIndex, colIndex) === value }"
        @click.stop="$emit('select', getMonthByCoords(rowIndex, colIndex))"
        v-text="monthName"
      />
    </div>
  </div>
</template>

<style lang="less" scoped src="./base-calendar-months.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        value: null,
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
        ]
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
  <fura-base-calendar-months
    :value="value"
    :months="months"
    @select="onSelect"
  />
</template>
</docs>
