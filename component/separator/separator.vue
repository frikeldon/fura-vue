<script>
export default {
  name: 'FuraSeparator',
  props: {
    alignContent: {
      type: String,
      default: null,
      validator: alignContent => alignContent === null || ['start', 'center', 'end'].includes(alignContent)
    },
    /** Indica si el separador se dibuja verticalmente. */
    vertical: { type: Boolean, default: false }
  }
}
</script>

<template>
  <div
    class="separator"
    :class="[
      alignContent,
      vertical ? 'vertical' : 'horizontal'
    ]"
  >
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped src="./separator.less"></style>

<docs>
<fura-label v-text="'Horizontal center aligned'" />
<fura-separator align-content="center">
  Today
</fura-separator>
</docs>

<docs>
<fura-label v-text="'Horizontal start aligned'" />
<fura-separator align-content="start">
  Today
</fura-separator>
</docs>

<docs>
<fura-label v-text="'Horizontal end aligned'" />
<fura-separator align-content="end">
  Today
</fura-separator>
</docs>

<docs>
<fura-label v-text="'Empty horizontal'" />
<fura-separator />
</docs>

<docs>
<fura-label v-text="'Vertical center aligned'" />
<div style="height: 150px;">
  <fura-separator vertical align-content="center">
    Today
  </fura-separator>
</div>
</docs>

<docs>
<fura-label v-text="'Vertical start aligned'" />
<div style="height: 150px;">
  <fura-separator vertical align-content="start">
    Today
  </fura-separator>
</div>
</docs>

<docs>
<fura-label v-text="'Vertical end aligned'" />
<div style="height: 150px;">
  <fura-separator vertical align-content="end">
    Today
  </fura-separator>
</div>
</docs>

<docs>
<fura-label v-text="'Empty vertical'" />
<div style="height: 150px; padding-left: 25px;">
  <fura-separator vertical />
</div>
</docs>

<docs>
<fura-label v-text="'Horizontal center aligned with an icon as content'" />
<fura-separator align-content="center">
  <fura-icon name="Clock" style="font-size: 24px;" />
</fura-separator>
</docs>
