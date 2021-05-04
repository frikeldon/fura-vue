import Autofill from './component/autofill'
import BaseBlockMenu from './component/base-block-menu'
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
import BaseNav from './component/base-nav'
import BaseNavList from './component/base-nav-list'
import BaseSelect from './component/base-select'
import BaseSplitButton from './component/base-split-button'
import BaseTagPicker from './component/base-tag-picker'
import BlockMenu from './component/block-menu'
import Button from './component/button'
import Calendar from './component/calendar'
import Check from './component/check'
import Checkbox from './component/checkbox'
import ChoiceGroup from './component/choice-group'
import ComboBox from './component/combo-box'
import ComboBoxAsync from './component/combo-box-async'
import CommandBar from './component/command-bar'
import CommandBarItemCollection from './component/command-bar-item-collection'
import ContextualMenu from './component/contextual-menu'
import DatePicker from './component/date-picker'
import DetailsList from './component/details-list'
import Dialog from './component/dialog'
import Dropdown from './component/dropdown'
import ExpanderButton from './component/expander-button'
import Icon from './component/icon'
import Label from './component/label'
import MessageBar from './component/message-bar'
import Nav from './component/nav'
import NumberField from './component/number-field'
import Overlay from './component/overlay'
import Panel from './component/panel'
import Pivot from './component/pivot'
import ProgressIndicator from './component/progress-indicator'
import SearchBox from './component/search-box'
import Select from './component/select'
import Separator from './component/separator'
import SpinButton from './component/spin-button'
import Spinner from './component/spinner'
import TagPicker from './component/tag-picker'
import TextField from './component/text-field'
import Toggle from './component/toggle'

const components = {
  Autofill,
  BaseBlockMenu,
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
  BaseNav,
  BaseNavList,
  BaseSelect,
  BaseSplitButton,
  BaseTagPicker,
  BlockMenu,
  Button,
  Calendar,
  Check,
  Checkbox,
  ChoiceGroup,
  ComboBox,
  ComboBoxAsync,
  CommandBar,
  CommandBarItemCollection,
  ContextualMenu,
  DatePicker,
  DetailsList,
  Dialog,
  Dropdown,
  ExpanderButton,
  Icon,
  Label,
  MessageBar,
  Nav,
  NumberField,
  Overlay,
  Panel,
  Pivot,
  ProgressIndicator,
  SearchBox,
  Select,
  Separator,
  SpinButton,
  Spinner,
  TagPicker,
  TextField,
  Toggle
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
