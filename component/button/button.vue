<script>
import Icon from '../icon'

export default {
  name: 'FuraButton',
  components: { Icon },
  props: {
    /**
     * Tipo de botón.
     * @values default, action, command, compound, icon
     */
    type: {
      type: String,
      default: 'default',
      validator: value => !value || ['default', 'action', 'command', 'compound', 'icon'].includes(value)
    },
    /** Cambia la presentación visual del botón para enfatizarlo. */
    primary: { type: Boolean, default: false },
    /** Texto para representar la etiqueta del botón. */
    text: { type: String, default: '' },
    /** Descripción de la acción que realiza este botón. Solo se utiliza para botones de tipo 'compound'. */
    secondaryText: { type: String, default: '' },
    /** El nombre del icono a mostrar en el botón. */
    icon: { type: String, default: '' },
    /** Si se proporciona, el componente se dibuja como enlace y no como botón. */
    href: { type: String, default: '' },
    /** Atributo target del enlace. El atributo 'href' debe ser proporcionado. */
    target: { type: String, default: '' },
    /** Estado de seleccionado. */
    checked: { type: Boolean, default: false },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false }
  },
  emits: [
    /**
     * Se genera cuando el usuario hace clic en el componente.
     * @property {MouseEvent} mouseEvent Descripción del evento de pulsación de ratón.
     */
    'click'
  ]
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="button"
    :class="{
      default: type === 'default',
      action: type === 'action',
      command: type === 'command',
      compound: type === 'compound',
      icon: type === 'icon',
      primary,
      checked
    }"
    :href="href"
    :target="href ? target : ''"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span>
      <Icon
        v-if="icon"
        :name="icon"
        class="icon"
      />
      <span
        v-if="type !== 'icon' && (text || secondaryText)"
        class="textContainer"
      >
        <span
          v-if="text"
          class="label"
          v-text="text"
        />
        <span
          v-if="secondaryText"
          class="description"
          v-text="secondaryText"
        />
      </span>
    </span>
  </component>
</template>

<style lang="less" scoped src="./button.less"></style>

<docs>
<fura-button text="Standard" />
</docs>

<docs>
<fura-button
  primary
  text="Primary"
/>
</docs>

<docs>
<fura-button
  type="compound"
  text="Standard"
  secondary-text="This is the secondary text."
/>
</docs>

<docs>
<fura-button
  type="compound"
  primary
  text="Primary"
  secondary-text="This is the secondary text."
/>
</docs>

<docs>
<fura-button
  type="command"
  text="Send mail"
  icon="Mail"
/>
</docs>

<docs>
<fura-button
  type="icon"
  icon="Emoji2"
/>
</docs>

<docs>
<fura-button
  type="action"
  text="Create account"
  icon="AddFriend"
/>
</docs>
