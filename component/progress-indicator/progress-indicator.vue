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
  <div class="progressIndicator">
    <div
      v-if="label"
      class="label"
      v-text="label"
    />
    <div class="itemProgress">
      <div class="progressTrack" />
      <div
        class="progressBar"
        :class="progress === null ? 'indeterminate' : ''"
        :style="{ width: progress }"
      />
    </div>
    <div
      v-if="description"
      class="description"
      v-text="description"
    />
  </div>
</template>

<style lang="less" scoped src="./progress-indicator.less"></style>

<docs>
<script>
  export default {
    data () {
      return {
        progress: 0,
        timer: null
      }
    },
    mounted () {
      this.timer = setInterval(() => {
        this.progress += 0.001
        if (this.progress > 1.1) {
          this.progress = -0.5        }
      }, 1);
    },
    unmounted () {
      clearInterval(this.timer)
    }
  }
</script>
<template>
  <fura-progress-indicator
    label="Example title"
    description="Example description"
    :percent-complete="progress"
  />
</template>
</docs>

<docs>
<fura-progress-indicator
  label="Example title"
  description="Example description"
/>
</docs>
