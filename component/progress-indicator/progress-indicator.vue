<script>
export default {
  name: 'FuraProgressIndicator',
  props: {
    /** Texto a mostrar sobre la barra de progreso. */
    label: { type: String, default: null },
    /** Texto que describe o complementa la operación. */
    description: { type: String, default: null },
    /**
     * Porcentaje de finalización de la operación, numéricamente entre 0 y 1.
     * Si no se establece, se mostrará la animación de progreso indeterminado.
     */
    percentComplete: { type: Number, default: null }
  },
  computed: {
    progress () {
      const { percentComplete } = this
      return percentComplete === null
        ? null
        : `${Math.max(0, Math.min(percentComplete, 1)) * 100}%`
    }
  }
}
</script>

<template>
  <div class="fura-progressIndicator">
    <div
      v-if="label"
      class="fura-label"
      v-text="label"
    />
    <div class="fura-itemProgress">
      <div class="fura-progressTrack" />
      <div
        class="fura-progressBar"
        :class="progress === null ? 'fura-indeterminate' : null"
        :style="{ 'width': progress }"
      />
    </div>
    <div
      v-if="description"
      class="fura-description"
      v-text="description"
    />
  </div>
</template>

<style lang="less" scoped src="./progress-indicator.less"></style>
