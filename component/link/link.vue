<script>
export default {
  name: 'FuraLink',
  props: {
    /** Si se proporciona, el componente se dibuja como enlace y no como botón. */
    href: { type: String, default: null },
    /** Atributo target del enlace. El atributo 'href' debe ser proporcionado. */
    target: { type: String, default: null },
    /** Representa Link subrallado. */
    underline: { type: Boolean, default: false },
    /** Representa Link como deshabilitado. */
    disabled: { type: Boolean, default: false }
  }
}
</script>

<template>
  <a
    :class="{
      'fura-underline': underline,
      'fura-disabled': disabled
    }"
    :href="disabled ? undefined : href"
    :target="disabled ? undefined : target"
  >
    <!-- @slot Contenido de Label. -->
    <slot />
  </a>
</template>

<style lang="less" scoped src="./link.less"></style>
