<script>
import FuraBaseFieldInput from '../base-field-input'
import FuraIcon from '../icon'

export default {
  name: 'FuraTextField',
  components: {
    FuraBaseFieldInput,
    FuraIcon
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
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: '' },
    /** Prefijo que se muestra antes del contenido del campo de texto. No está incluido en el valor. */
    prefix: { type: String, default: '' },
    /** Sufijo que se muestra después del contenido del campo de texto. No está incluido en el valor. */
    sufix: { type: String, default: '' },
    /** Si el campo de texto permite entrar varias líneas. */
    multiline: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en el campo de texto. */
    icon: { type: String, default: '' },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Longitud máxima (número de caracteres) del valor. */
    maxlength: { type: Number, default: -1 },
    /** Indica si el campo es no redimensionable para campos de texto de varias líneas. */
    unresizable: { type: Boolean, default: false },
    /** Indica si se ajustaautomáticamente la altura para campos de texto de varias líneas. */
    autoAdjustHeight: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: String, default: '' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /** Se genera cuando el usuario hace clic en el icono del campo. */
    'click'
  ],
  methods: {
    handleTextareaInput (event) {
      if (this.multiline && this.autoAdjustHeight) {
        const { field } = this.$refs
        if (field && field.tagName === 'TEXTAREA') {
          field.style.height = ''
          field.style.height = `${field.scrollHeight + 2}px` // +2 to avoid vertical scroll bars
        }
      }
      this.$emit('update:modelValue', event.target.value)
    }
  }
}
</script>

<template>
  <FuraBaseFieldInput
    class="textField"
    :class="{ multiline }"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    @click="$refs.field.focus()"
  >
    <div
      v-if="prefix"
      class="prefix"
    >
      <span v-text="prefix" />
    </div>

    <textarea
      v-if="multiline"
      ref="field"
      class="field"
      :class="{
        hasIcon: icon,
        unresizable
      }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input.stop="handleTextareaInput"
      v-bind="$attrs"
    />
    <input
      v-else
      ref="field"
      type="text"
      class="field"
      :class="{ hasIcon: icon }"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input.stop="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >

    <FuraIcon
      v-if="icon"
      class="icon"
      :name="icon"
      @click.stop="$emit('click')"
    />

    <div
      v-if="sufix"
      class="sufix"
    >
      <span v-text="sufix" />
    </div>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./text-field.less"></style>

<docs>
<script>
export default {
  data () {
    return { value: '' }
  }
}
</script>
<template>
  <fura-text-field
    label="I'm a field"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: "I'm a text." }
  }
}
</script>
<template>
  <fura-text-field
    readonly
    label="I am read-only"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: '' }
  }
}
</script>
<template>
  <fura-text-field
    label="With an icon"
    icon="Mail"
    placeholder="Write your email"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: 'github' }
  }
}
</script>
<template>
  <fura-text-field
    label="With prefix and sufix"
    prefix="www."
    sufix=".com"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: '' }
  }
}
</script>
<template>
  <fura-text-field
    multiline
    label="Multiline"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: '' }
  }
}
</script>
<template>
  <fura-text-field
    multiline
    unresizable
    label="Non-resizable"
    v-model="value"
  />
</template>
</docs>

<docs>
<script>
export default {
  data () {
    return { value: '' }
  }
}
</script>
<template>
  <fura-text-field
    multiline
    auto-adjust-height
    label="With auto adjusting height"
    v-model="value"
  />
</template>
</docs>
