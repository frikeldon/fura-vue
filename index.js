import Autofill from './component/autofill'
import BaseCalendar from './component/base-calendar'
import BaseCalendarDays from './component/base-calendar-days'
import BaseCalendarMonths from './component/base-calendar-months'
import BaseCalendarYears from './component/base-calendar-years'
import BaseComboBox from './component/base-combo-box'
import BaseDropdown from './component/base-dropdown'
import BaseFieldCombo from './component/base-field-combo'
import BaseFieldInput from './component/base-field-input'
import BaseSelect from './component/base-select'
import Button from './component/button'
import Checkbox from './component/checkbox'
import ChoiceGroup from './component/choice-group'
import ComboBox from './component/combo-box'
import Dropdown from './component/dropdown'
import Icon from './component/icon'
import Label from './component/label'
import Select from './component/select'
import Spinner from './component/spinner'

const components = {
  Autofill,
  BaseCalendar,
  BaseCalendarDays,
  BaseCalendarMonths,
  BaseCalendarYears,
  BaseComboBox,
  BaseDropdown,
  BaseFieldCombo,
  BaseFieldInput,
  BaseSelect,
  Button,
  Checkbox,
  ChoiceGroup,
  ComboBox,
  Dropdown,
  Icon,
  Label,
  Select,
  Spinner
}

export default {
  install (app, { prefix = 'fura' } = {}) {
    for (const name in components) {
      const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      app.component(`${prefix}-${kebabName}`, components[name])
    }
  },
  components
}
