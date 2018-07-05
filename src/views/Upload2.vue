<template>
  <div class="row mt-3 j-page" id="upload">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          上传
        </div>
        <div class="card-body p-0 card-body-h" id="uploadBody">
          <input type="file"
                 class="filepond"
                 name="uploadForm"
                 multiple
                 data-max-file-size="2MB"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as FilePond from 'filepond/dist/filepond.min'
import 'filepond/dist/filepond.min.css'
import FilepondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min'
FilePond.registerPlugin(
  FilepondPluginFileValidateSize
)

/* import vueFilePond from 'vue-filepond/dist/vue-filepond.min'
import 'filepond/dist/filepond.min.css'
const FilePond = vueFilePond(FilepondPluginFileValidateSize) */
/* {
  server: {
    url: 'http://localhost/jiuqian-mobile',
      timeout: 7000,
      process: {
      url: './upload',
        method: 'POST',
        headers: {
        'x-customheader': 'Hello World'
      },
      withCredentials: false,
        onload: (response) => {
        return response.key
      },
        onerror: (response) => {
        return response.data
      }
    }
  }
}, */

export default {
  name: 'Upload',
  mounted () {
    const pond = FilePond.create(document.querySelector('input[name="uploadForm"]'))
    pond.setOptions({
      labelIdle: '请选择文件',
      allowMultiple: true,
      server: {
        url: 'http://localhost/jiuqian-mobile',
        timeout: 7000,
        process: {
          url: '/order/upload/add',
          method: 'POST',
          withCredentials: true,
          onload: (response) => {
            console.log(response)
            return response.key
          },
          onerror: (response) => {
            console.log(response)
            return response.data
          }
        }
      }
    })
    // document.getElementById('uploadBody').appendChild(pond.element)
  },
  methods: {
    /* handleFilePondInit: function () {
      let d = this.$refs.pond.getFiles()
      console.log(d)
    } */
  },
  components: {
    // FilePond
  }
}
</script>

<style scoped>

</style>
