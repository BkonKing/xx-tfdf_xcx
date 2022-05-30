<template>
  <uni-file-picker
    v-model="fileList"
    file-mediatype="image"
    multiple
    :limit="maxCount"
    @select="afterRead"
    @delete="handleDelete"
  />
</template>

<script>
import { uploadImage } from '@/utils/util'

export default {
  name: 'tf-uploader',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxCount: {
      type: Number,
      default: 9,
    },
  },
  data() {
    return {
      fileList: [],
      images: this.value,
    }
  },
  computed: {
    delIconClass() {
      const className = {
        1: 'mh-upload',
        2: 'default-upload',
      }
      return className[this.delIconType]
    },
  },
  created() {
    if (this.value && this.value.length > 0) {
      this.fileList = this.value.map((obj) => ({
        url: obj,
      }))
    }
  },
  methods: {
    afterRead(file) {
      const filePaths = file.tempFilePaths
      if (filePaths && filePaths.length) {
        filePaths.forEach((filePath, index) => {
          this.uploadImage(filePath, index)
        })
      }
    },
    uploadImage(filePath, index) {
      uploadImage(filePath, index).then((data) => {
        this.images.push(data)
      })
    },
    handleDelete(file) {
      const { tempFilePath } = file
      const index = this.fileList.findIndex((obj) => {
        return obj.url === tempFilePath
      })
      index > -1 && this.images.splice(index, 1)
    },
  },
  watch: {
    value(val) {
      this.images = val || []
      if (!val) return
      this.fileList = val.map((obj) => ({
        url: obj,
      }))
    },
    images(value) {
      this.$emit('input', value)
    },
  },
}
</script>
