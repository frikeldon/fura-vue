import Autofill from './component/autofill'
import BaseCalendar from './component/base-calendar'
import BaseCalendarDays from './component/base-calendar-days'
import BaseCalendarMonths from './component/base-calendar-months'
import BaseCalendarYears from './component/base-calendar-years'
import BaseComboBox from './component/base-combo-box'
import BaseCommandButton from './component/base-command-button'
import BaseDropdown from './component/base-dropdown'
import BaseFieldCombo from './component/base-field-combo'
import BaseFieldInput from './component/base-field-input'
import BaseSelect from './component/base-select'
import BaseSplitButton from './component/base-split-button'
import BlockMenu from './component/block-menu'
import Button from './component/button'
import Calendar from './component/calendar'
import Checkbox from './component/checkbox'
import ChoiceGroup from './component/choice-group'
import ComboBox from './component/combo-box'
import CommandBar from './component/command-bar'
import DatePicker from './component/date-picker'
import Dropdown from './component/dropdown'
import Icon from './component/icon'
import Label from './component/label'
import NumberField from './component/number-field'
import Overlay from './component/overlay'
import Pivot from './component/pivot'
import Select from './component/select'
import Spinner from './component/spinner'
import TextField from './component/text-field'

const components = {
  Autofill,
  BaseCalendar,
  BaseCalendarDays,
  BaseCalendarMonths,
  BaseCalendarYears,
  BaseComboBox,
  BaseCommandButton,
  BaseDropdown,
  BaseFieldCombo,
  BaseFieldInput,
  BaseSelect,
  BaseSplitButton,
  BlockMenu,
  Button,
  Calendar,
  Checkbox,
  ChoiceGroup,
  ComboBox,
  CommandBar,
  DatePicker,
  Dropdown,
  Icon,
  Label,
  NumberField,
  Overlay,
  Pivot,
  Select,
  Spinner,
  TextField
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
