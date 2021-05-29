<script>
export default {
  name: 'FuraBaseCalendarYears',
  props: {
    /** Primer año a mostrar en la lista. */
    firstYear: {
      type: Number,
      required: true,
      validator: year => Number.isInteger(year)
    },
    /** Año a mostrar seleccionado. */
    value: {
      type: Number,
      default: null
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona un año.
     * @property {Date} value Año a mostrar seleccionado.
     */
    'select'
  ],
  computed: {
    rows () {
      const { firstYear } = this
      const getRow = year => [year, year + 1, year + 2, year + 3]
      return [
        getRow(firstYear),
        getRow(firstYear + 4),
        getRow(firstYear + 8)
      ]
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
        v-for="(year, yearIndex) in row"
        :key="yearIndex"
        class="fura-button"
        :class="{ 'fura-selected': year === value }"
        @click="$emit('select', year)"
        v-text="year"
      />
    </div>
  </div>
</template>

<style lang="less" scoped src="./base-calendar-years.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        firstYear: (new Date()).getFullYear(),
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
  <fura-base-calendar-years
    :first-year="firstYear"
    :value="value"
    @select="onSelect"
  />
</template>
</docs>
