<script>
import { defineComponent } from 'vue'
import code from './code.js'

export default defineComponent({
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
})
</script>

<template>
  <i v-text="$options.code[name]" />
</template>

<style lang="less" scoped src="./icon.less"></style>

<docs>
<span style="font-size: 2em;">
  This is an icon:
  <fura-icon
    name="Contact"
    style="color: #0078d4;"
  />.
</span>
</docs>
