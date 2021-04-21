<script>
import FuraBaseFieldCombo from '../base-field-combo'
import FuraIcon from '../icon'
import FuraCalendar from '../calendar'

export default {
  name: 'FuraDatePicker',
  components: {
    FuraBaseFieldCombo,
    FuraIcon,
    FuraCalendar
  },
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
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: '' },
    /** Indica si DatePicker permite o no la entrada de teclado.  */
    notWritable: { type: Boolean, default: false },
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
    /** El texto del enlace "Ir a hoy" que se muestra en el calendario. */
    goToday: {
      type: String,
      default: ''
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
    /** Función para convertir de fecha a texto. */
    parse: {
      type: Function,
      default: text => {
        const [, day, month, year] =
        text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) || []
        return day && month && year
          ? new Date(Number(year), Number(month) - 1, Number(day))
          : null
      }
    },
    /** Función para convertir de texto a fecha. */
    stringify: {
      type: Function,
      default: date => {
        const padZero = (num, length = 2) => num.toString().padStart(length, '0')
        const day = padZero(date.getDate())
        const month = padZero(date.getMonth() + 1)
        const year = padZero(date.getFullYear(), 4)
        return `${day}/${month}/${year}`
      }
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona una fecha en la vista de dias.
     * @property {Date} modelValue Fecha seleccionada en el calendario.
     */
    'update:modelValue',
    /**
     * Se genera cuando el componente recibe el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'focus',
    /**
     * Se genera cuando el componente pierde el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'blur'
  ],
  data () {
    return {
      open: false,
      fieldValue: this.modelValue ? this.stringify(this.modelValue) : ''
    }
  },
  methods: {
    handleTextChange (event) {
      const date = this.parse(event.target.value)
      if (date) {
        if (date !== this.modelValue) {
          this.$emit('update:modelValue', date)
        }
      } else if (event.target.value === '' && this.modelValue) {
        this.$emit('update:modelValue', null)
      }
    },
    handleTextClick () {
      if (this.notWritable && !this.disabled) {
        this.open = !this.open
      }
    },
    handleIconClick () {
      if (!this.disabled && !this.readonly) {
        this.open = !this.open
      }
    },
    handleCalendarUpdateModelValue (value) {
      this.$emit('update:modelValue', value)
      this.open = false
    }
  },
  watch: {
    modelValue (value) {
      this.fieldValue = value ? this.stringify(value) : ''
    }
  }
}
</script>

<template>
  <FuraBaseFieldCombo
    class="datePicker"
    :class="{ notWritable }"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :open="open && !disabled && !readonly"
    @click="$refs.field.focus()"
  >
    <input
      ref="field"
      type="text"
      class="field"
      :value="fieldValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="notWritable || readonly"
      @change.stop="handleTextChange"
      @click.stop="handleTextClick"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    >
    <FuraIcon
      class="icon"
      name="Calendar"
      @click.stop="handleIconClick"
    />

    <template #dropdown>
      <FuraCalendar
        class="calendar"
        :days="days"
        :months="months"
        :first-day-of-the-week="firstDayOfTheWeek"
        :today="today"
        :model-value="modelValue"
        :go-today="goToday"
        @update:model-value="handleCalendarUpdateModelValue"
      />
    </template>
  </FuraBaseFieldCombo>
</template>

<style lang="less" scoped src="./date-picker.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        label: 'DatePicker',
        description: 'DatePicker field',
        invalid: false,
        errorMessage: null,
        disabled: false,
        required: false,
        borderless: false,
        underlined: false,
        readonly: false,
        placeholder: 'Pick a date',
        notWritable: false,
        goToday: 'Go to today',
        today: new Date(),
        modelValue: null,
      }
    }
  }
</script>
<template>
  <fura-date-picker
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :readonly="readonly"
    :placeholder="placeholder"
    :not-writable="notWritable"
    :go-today="goToday"
    :today="today"
    v-model="modelValue"
  />
</template>
</docs>
