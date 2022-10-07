<script>
import FuraLabel from '../label'
import FuraIcon from '../icon'

export default {
  name: 'FuraFileMulti',
  components: {
    FuraLabel,
    FuraIcon
  },
  props: {
    /** Etiqueta que se muestra encima del campo de formulario asociado. */
    label: { type: String, default: '' },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Estado requerido del campo de formulario asociado. */
    required: { type: Boolean, default: false },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** La cantidad máxima de arvhivos que se pueden seleccionar. */
    maxFiles: { type: Number, default: -1 },
    /** Lista de valores seleccionados. */
    modelValue: { type: Array, default: () => [] }
  },
  emits: [
    /** Se genera cuando el componente recibe el foco. */
    'focus',
    /** Se genera cuando el componente pierde el foco. */
    'blur',
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
      open: false,
      dragCount: 0,
      fileName: null,
      fileContent: null
    }
  },
  computed: {
    hasValue () {
      return this.modelValue.length > 0
    },
    maxFilesReached () {
      return this.maxFiles > -1 &&
        this.modelValue.length >= this.maxFiles
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
      if (!this.disabled && !this.readonly && !this.maxFilesReached) {
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
      this.open = false
    },
    handleChange (event) {
      if (!this.disabled && !this.readonly && !this.maxFilesReached) {
        if (event.target.files.length === 1) {
          const file = event.target.files[0]
          this.loadFile(file)
        }
        this.$refs.inputFile.value = ''
      }
      this.open = false
    },
    async handleDownload (index) {
      this.$refs.anchorFile.download = await this.modelValue[index][0]
      this.$refs.anchorFile.href = await this.modelValue[index][1]()
      this.$refs.anchorFile.click()
      this.$refs.anchorFile.download = null
      this.$refs.anchorFile.href = null
    },
    loadFile (file) {
      if (!this.disabled && !this.readonly) {
        this.$emit('load', file)
      }
    },
    getFileIcon (mimeType) {
      if (mimeType) {
        if (
          mimeType === 'application/msword' ||
          mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          return 'WordDocument'
        }
        if (
          mimeType === 'application/vnd.ms-excel' ||
          mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
          return 'ExcelDocument'
        }
        if (
          mimeType === 'application/vnd.ms-powerpoint' ||
          mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ) {
          return 'PowerPointDocument'
        }
        if (mimeType === 'application/pdf') {
          return 'PDF'
        }
        if (
          mimeType === 'text/html' ||
          mimeType === 'application/xhtml+xml' ||
          mimeType === 'text/xml' ||
          mimeType === 'application/xml'
        ) {
          return 'FileHTML'
        }
        if (mimeType === 'text/css') {
          return 'FileCSS'
        }
        if (
          mimeType === 'application/zip' ||
          mimeType === 'application/vnd.rar' ||
          mimeType === 'application/x-7z-compressed' ||
          mimeType === 'application/gzip' ||
          mimeType === 'application/x-tar' ||
          mimeType === 'application/x-bzip' ||
          mimeType === 'application/x-bzip2'
        ) {
          return 'ZipFolder'
        }
        if (mimeType.startsWith('image')) return 'FileImage'
        if (mimeType.startsWith('text')) return 'TextDocument'
        if (mimeType.startsWith('font')) return 'Font'
      }
      return 'Document'
    }
  }
}
</script>

<template>
  <div
    class="fura-fileMulti"
    :class="{
      'fura-disabled': disabled
    }"
  >
    <FuraLabel
      v-if="label"
      v-text="label"
      :disabled="disabled"
      :required="required"
    />
    <input
      ref="inputFile"
      type="file"
      class="fura-inputFile"
      @change="handleChange"
    >
    <a ref="anchorFile" />
    <div
      class="fura-fileContainer"
      :class="{
        'fura-dragging': dragCount > 0 && !disabled && !readonly && !maxFilesReached
      }"
      @dragover="handleDragOver"
      @dragenter="handleDragEnter"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div
        v-for="(item, index) in modelValue"
        :key="index"
        class="fura-fileItem"
      >
        <div class="fura-fileIcon">
          <FuraIcon :name="getFileIcon(item[2])" />
        </div>

        <div class="fura-fileName">
          <label v-text="item[0]" />
        </div>

        <button
          class="fura-fileDownload"
          @click.stop="handleDownload(index)"
        >
          <FuraIcon name="DownloadDocument" />
        </button>
        <button
          v-if="!disabled && !readonly"
          class="fura-fileDelete"
          @click.stop="$emit('delete', index)"
        >
          <FuraIcon name="Delete" />
        </button>
      </div>
      <div
        v-if="!disabled && !readonly && !maxFilesReached"
        class="fura-fileItem"
      >
        <button
          v-if="!disabled && !readonly && !maxFilesReached"
          class="fura-openButton"
          @click.stop="handleOpenButton"
        >
          <FuraIcon name="OpenFile" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./file-multi.less"></style>
