import BaseFieldCombo from './component/base-field-combo'
import BaseSelect from './component/base-select'
import Button from './component/button'
import Checkbox from './component/checkbox'
import ChoiceGroup from './component/choice-group'
import Icon from './component/icon'
import Label from './component/label'
import Select from './component/select'
import Spinner from './component/spinner'

const components = {
  BaseFieldCombo,
  BaseSelect,
  Button,
  Checkbox,
  ChoiceGroup,
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
