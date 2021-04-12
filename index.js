import Autofill from './component/autofill'
import BaseCalendar from './component/base-calendar'
import BaseCalendarDays from './component/base-calendar-days'
import BaseCalendarMonths from './component/base-calendar-months'
import BaseCalendarYears from './component/base-calendar-years'
import BaseComboBox from './component/base-combo-box'
import BaseCommandButton from './component/base-command-button'
import BaseDetailsList from './component/base-details-list'
import BaseDetailsListBody from './component/base-details-list-body'
import BaseDetailsListRow from './component/base-details-list-row'
import BaseDropdown from './component/base-dropdown'
import BaseFieldCombo from './component/base-field-combo'
import BaseFieldInput from './component/base-field-input'
import BaseSelect from './component/base-select'
import BaseSplitButton from './component/base-split-button'
import BaseTagPicker from './component/base-tag-picker'
import BlockMenu from './component/block-menu'
import Button from './component/button'
import Calendar from './component/calendar'
import Checkbox from './component/checkbox'
import ChoiceGroup from './component/choice-group'
import ComboBox from './component/combo-box'
import CommandBar from './component/command-bar'
import DatePicker from './component/date-picker'
import DetailsList from './component/details-list'
import Dialog from './component/dialog'
import Dropdown from './component/dropdown'
import ExpanderButton from './component/expander-button'
import Icon from './component/icon'
import Label from './component/label'
import NumberField from './component/number-field'
import Overlay from './component/overlay'
import Panel from './component/panel'
import Pivot from './component/pivot'
import Select from './component/select'
import Spinner from './component/spinner'
import TagPicker from './component/tag-picker'
import TextField from './component/text-field'

const components = {
  Autofill,
  BaseCalendar,
  BaseCalendarDays,
  BaseCalendarMonths,
  BaseCalendarYears,
  BaseComboBox,
  BaseCommandButton,
  BaseDetailsList,
  BaseDetailsListBody,
  BaseDetailsListRow,
  BaseDropdown,
  BaseFieldCombo,
  BaseFieldInput,
  BaseSelect,
  BaseSplitButton,
  BaseTagPicker,
  BlockMenu,
  Button,
  Calendar,
  Checkbox,
  ChoiceGroup,
  ComboBox,
  CommandBar,
  DatePicker,
  DetailsList,
  Dialog,
  Dropdown,
  ExpanderButton,
  Icon,
  Label,
  NumberField,
  Overlay,
  Panel,
  Pivot,
  Select,
  Spinner,
  TagPicker,
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
