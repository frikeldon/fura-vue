import Autofill from './component/autofill/index.js'
import BaseBlockMenu from './component/base-block-menu/index.js'
import BaseCalendar from './component/base-calendar/index.js'
import BaseCalendarDays from './component/base-calendar-days/index.js'
import BaseCalendarMonths from './component/base-calendar-months/index.js'
import BaseCalendarYears from './component/base-calendar-years/index.js'
import BaseComboBox from './component/base-combo-box/index.js'
import BaseCommandButton from './component/base-command-button/index.js'
import BaseDetailsList from './component/base-details-list/index.js'
import BaseDetailsListBody from './component/base-details-list-body/index.js'
import BaseDetailsListRow from './component/base-details-list-row/index.js'
import BaseDropdown from './component/base-dropdown/index.js'
import BaseFieldCombo from './component/base-field-combo/index.js'
import BaseFieldInput from './component/base-field-input/index.js'
import BaseNav from './component/base-nav/index.js'
import BaseNavList from './component/base-nav-list/index.js'
import BaseSelect from './component/base-select/index.js'
import BaseSplitButton from './component/base-split-button/index.js'
import BaseTagPicker from './component/base-tag-picker/index.js'
import BlockMenu from './component/block-menu/index.js'
import Button from './component/button/index.js'
import Calendar from './component/calendar/index.js'
import Check from './component/check/index.js'
import Checkbox from './component/checkbox/index.js'
import ChoiceGroup from './component/choice-group/index.js'
import ComboBox from './component/combo-box/index.js'
import ComboBoxAsync from './component/combo-box-async/index.js'
import CommandBar from './component/command-bar/index.js'
import CommandBarItemCollection from './component/command-bar-item-collection/index.js'
import ContextualMenu from './component/contextual-menu/index.js'
import DatePicker from './component/date-picker/index.js'
import DetailsList from './component/details-list/index.js'
import Dialog from './component/dialog/index.js'
import Dropdown from './component/dropdown/index.js'
import ExpanderButton from './component/expander-button/index.js'
import Icon from './component/icon/index.js'
import Label from './component/label/index.js'
import Link from './component/link/index.js'
import MessageBar from './component/message-bar/index.js'
import Nav from './component/nav/index.js'
import NumberField from './component/number-field/index.js'
import Overlay from './component/overlay/index.js'
import Panel from './component/panel/index.js'
import Pivot from './component/pivot/index.js'
import ProgressIndicator from './component/progress-indicator/index.js'
import SearchBox from './component/search-box/index.js'
import Select from './component/select/index.js'
import Separator from './component/separator/index.js'
import SpinButton from './component/spin-button/index.js'
import SpinNav from './component/spin-nav/index.js'
import Spinner from './component/spinner/index.js'
import TagPicker from './component/tag-picker/index.js'
import TextField from './component/text-field/index.js'
import Toggle from './component/toggle/index.js'

export const components = {
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
  Link,
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
  SpinNav,
  Spinner,
  TagPicker,
  TextField,
  Toggle
}

export default function install (app) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component('fura-' + kebabName, components[name])
  }
}

install.components = components
