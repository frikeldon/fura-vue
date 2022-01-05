<script>
import code from './code.js'

export default {
  name: 'FuraIcon',
  props: {
    /** El nombre del icono. Si la cadena está vacía, un icono vacío se representará con el mismo ancho que un icono. */
    name: {
      type: String,
      default: null,
      validator: value => !value || value in code
    }
  },
  code
}
</script>

<template>
  <i v-text="$options.code[name]" />
</template>

<style lang="less" scoped src="./icon.less"></style>
