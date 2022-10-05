<script>
import FuraBaseFieldInput from '../base-field-input'
import FuraIcon from '../icon'

export default {
  name: 'FuraFile',
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
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: '' },
    /** Nombre del archivo existente */
    fileName: { type: String, default: null },
    /** Método para recuperar el contenido del archivo existente en forma de Data URL. */
    dataUrlGetter: { type: Function, default: null }
  },
  emits: [
    /**
     * Se genera cuando el usuario selecciona un archivo.
     * @property {File} file Interfaz para acceder al archivo.
     */
    'load',
    /** Se genera cuando el usuario hace click sobre el boton para borrar el archivo. */
    'delete'
  ],
  data () {
    return {
      dragCount: 0
    }
  },
  computed: {
    hasValue () {
      return this.fileName && this.dataUrlGetter
    },
    displayedText () {
      return this.hasValue
        ? this.fileName
        : this.placeholder
    }
  },
  methods: {
    handleOpenButton () {
      if (!this.disabled && !this.readonly) {
        this.$refs.inputFile.click()
      }
    },
    handleDragEnter () {
      if (!this.disabled && !this.readonly) {
        this.dragCount += 1
      }
    },
    handleDragOver (event) {
      if (!this.disabled && !this.readonly) {
        if (event.dataTransfer.types.includes('Files')) {
          event.preventDefault()
        }
      }
    },
    handleDragLeave () {
      if (!this.disabled && !this.readonly) {
        this.dragCount = Math.max(this.dragCount - 1, 0)
      }
    },
    handleDrop (event) {
      if (!this.disabled && !this.readonly) {
        event.preventDefault()
        this.dragCount = 0
        if (
          event.dataTransfer.items.length === 1 &&
        event.dataTransfer.items[0].kind === 'file'
        ) {
          const file = event.dataTransfer.items[0].getAsFile()
          this.loadFile(file)
        }
      }
    },
    handleChange (event) {
      if (!this.disabled && !this.readonly) {
        if (event.target.files.length === 1) {
          const file = event.target.files[0]
          this.loadFile(file)
        }
        this.$refs.inputFile.value = ''
      }
    },
    async handleDownload () {
      this.$refs.anchorFile.href = await this.dataUrlGetter()
      this.$refs.anchorFile.click()
      this.$refs.anchorFile.href = null
    },
    loadFile (file) {
      if (!this.disabled && !this.readonly) {
        this.$emit('load', file)
      }
    }
  }
}
</script>

<template>
  <FuraBaseFieldInput
    class="fura-file"
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
  >
    <input
      ref="inputFile"
      type="file"
      class="fura-hidden"
      @change="handleChange"
    >
    <a
      ref="anchorFile"
      class="fura-hidden"
      :download="fileName"
    />
    <div
      class="fura-fileContainer"
      :class="{
        'fura-dragging': dragCount > 0 && !disabled && !readonly,
        'fura-readonly': readonly
      }"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <button
        v-if="!disabled && !readonly"
        class="fura-openButton"
        @click.stop="handleOpenButton"
      >
        <FuraIcon name="OpenFile" />
      </button>
      <div class="fura-fileName">
        <label
          :class="{ 'fura-placeholder': !hasValue }"
          v-text="displayedText"
        />
      </div>
      <button
        v-if="fileName && dataUrlGetter"
        class="fura-fileDownload"
        @click.stop="handleDownload"
      >
        <FuraIcon name="DownloadDocument" />
      </button>
      <button
        v-if="!disabled && !readonly && fileName && dataUrlGetter"
        class="fura-fileDelete"
        @click.stop="$emit('delete')"
      >
        <FuraIcon name="Delete" />
      </button>
    </div>
  </FuraBaseFieldInput>
</template>

<style lang="less" scoped src="./file.less"></style>
