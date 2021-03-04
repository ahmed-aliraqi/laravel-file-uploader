<template>
  <div class="uploader-mb-4">
    <label>{{ label }}</label>
    <div class="uploader-flex uploader-flex-wrap">
      <div
          v-for="file in files"
          :title="file.file_name"
          class="item uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-md uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none">
        <!-- Preview -->
        <img :src="file.preview"
             class="uploader-absolute uploader-w-full uploader-h-full uploader-object-contain" alt="preview">

        <!-- Delete -->
        <a
            href="#"
            title="Delete"
            @click.prevent="deleteFile(file)"
            class="uploader-absolute uploader-bg-red-600 uploader-text-white uploader-z-10 uploader-w-6 uploader-h-6 uploader-text-sm uploader-top-0 uploader-right-0 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none">
          <svg class="uploader-w-5 uploader-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </a>

        <a
            href="#"
            title="Show"
            @click.prevent="preview = file"
            class="uploader-absolute uploader-bg-green-600 uploader-text-white uploader-z-10 uploader-w-6 uploader-h-6 uploader-text-sm uploader-top-0 uploader-left-0 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none">
          <svg class="uploader-w-5 uploader-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </a>

        <span
            class="uploader-font-sans uploader-absolute uploader-w-full uploader-flex uploader-justify-center uploader-bg-gray-900 uploader-text-white uploader-text-sm uploader-bottom-0">
          {{ file.human_readable_size }}
        </span>
      </div>
      <label v-if="!unlimited" v-for="i in (maximum - files.length < 0 ? 0 : maximum - files.length)"
             class="item uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-xl uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none hover:uploader-bg-gray-100 uploader-cursor-pointer">

        <input class="uploader-hidden" ref="file" type="file" @change="readUrl"
               :accept="accept" :multiple="maximum > 1">
        <!-- Spinner -->
        <svg v-if="i <= pending" class="uploader-animate-spin uploader-h-8 uploader-w-8 uploader-text-gray-500"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="uploader-opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="uploader-opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <!-- Add -->
        <svg v-else class="uploader-w-12 uploader-h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>

      </label>
      <label v-if="unlimited"
             class="uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-xl uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none hover:uploader-bg-gray-100 uploader-cursor-pointer">

        <input class="uploader-hidden" ref="file" type="file" @change="readUrl"
               :accept="accept" :multiple="true">
        <!-- Spinner -->
        <svg v-if="uploading" class="uploader-animate-spin uploader-h-8 uploader-w-8 uploader-text-gray-500"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="uploader-opacity-50" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="uploader-opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>

        <!-- Add -->
        <svg v-else class="uploader-w-12 uploader-h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>

      </label>
    </div>


    <input type="hidden" :form="form" :name="`${(name)}[]`" v-for="token in values" :value="token">
    <small class="uploader-text-gray-600">{{ notes }}</small>
    <div v-if="preview"
         @click.self="preview = null"
         class="uploader-overflow-auto uploader-fixed uploader-flex uploader-justify-center uploader-w-full uploader-h-full uploader-top-0 uploader-left-0 uploader-bg-black uploader-bg-opacity-50 uploader-z-999999999">

      <div class="uploader-w-full md:uploader-w-1/2 uploader-mx-2 uploader-rounded-t-lg uploader-shadow-md uploader-mt-10 uploader-bg-white uploader-h-300-px uploader-relative uploader-border uploader-border-gray-600">
        <button
            @click.prevent="preview = null"
            class="uploader-bg-gray-600 hover:uploader-bg-gray-800 uploader-shadow-md uploader-absolute uploader-text-white uploader-z-10 uploader-w-6 uploader-h-6 uploader-text-sm uploader-top-10 uploader-right-10 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none">
          <svg class="uploader-w-8 uploader-h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div class="uploader-h-full uploader-flex uploader-items-center">
          <img v-if="preview && preview.mime_type.includes('image')" class="uploader-object-contain uploader-w-full uploader-p-1 uploader-h-full"
               :src="preview.url"
               alt="preview">
          <audio v-if="preview && preview.mime_type.includes('audio')" controls class="focus:uploader-outline-none uploader-p-8 uploader-w-full uploader-h-48">
            <source :src="preview.url" :type="preview.mime_type">
            Your browser does not support the audio tag.
          </audio>
          <video v-if="preview && preview.mime_type.includes('video')" controls class="focus:uploader-outline-none uploader-p-8 uploader-w-full uploader-h-full">
            <source :src="preview.url" :type="preview.mime_type">
            Your browser does not support the video tag.
          </video>
        </div>
        <div
            class="uploader-bg-white uploader-flex uploader-items-center uploader-justify-start uploader-overflow-auto uploader-py-2 uploader-w-full uploader-mt-1 uploader-border uploader-border-gray-600 uploader-rounded-b-lg uploader-shadow-2xl">

          <img v-for="file in files"
               class="uploader-cursor-pointer hover:uploader-border-gray-600 uploader-object-cover uploader-bg-white uploader-mx-2 uploader-w-20 uploader-h-20 uploader-border uploader-border-gray-400"
               :src="file.preview"
               @mouseover="preview = file">

        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    max: {
      default: 1
    },
    unlimited: {
      default: false
    },
    media: {
      required: false,
      type: Array,
      default: () => []
    },
    accept: {
      required: false,
      type: String,
      default: '*',
    },
    notes: {
      required: false,
      type: String,
      default: '',
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    collection: {
      required: false,
      type: String,
      default: 'default',
    },
    tokens: {
      required: false,
      type: Array,
      default: [],
    },
    form: {
      required: false,
      default: false
    },
    name: {
      required: false,
      type: String,
      default: 'media'
    }
  },
  data() {
    return {
      files: this.media || [],
      values: this.tokens,
      inputFilesLength: 0,
      pending: -1,
      uploading: false,
      preview: null,
      maximum: this.max,
    }
  },
  created() {
    const handleEscape = e => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.preview = null;
      }
    }
    document.addEventListener('keydown', handleEscape);

    if (this.unlimited) {
      this.maximum = 0;
    }
    if (this.tokens.length) {
      let xhr = new XMLHttpRequest();
      var vueInstance = this;
      let params = Object.keys(this.tokens).map((key) => {
        return 'tokens[]=' + this.tokens[key]
      }).join('&');
      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            if (this.responseText) {
              vueInstance.files = JSON.parse(this.responseText).data;
            }
          }
        }
      };
      xhr.open("GET", '/api/uploader/media?collection=' + this.collection + '&' + params, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      let token = document.head.querySelector('meta[name="csrf-token"]');
      if (token) {
        xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
      } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
      }
      xhr.send(null);
    }
  },
  methods: {
    async readUrl(event) {
      let input = event.target;
      if (input.files) {
        let fileList = input.files;
        let filesCount = fileList.length > this.maximum - this.files.length
            ? this.maximum - this.files.length : fileList.length;
        this.inputFilesLength = filesCount;
        if (!this.unlimited) {
          this.pending = filesCount;
        } else {
          filesCount = fileList.length;
        }
        if (filesCount > 0) {
          this.uploading = true;
        }

        for (let i = 0; i < filesCount; i++) {
          await this.upload(fileList[i])
              .then(response => {
                if (!this.unlimited) {
                  this.pending--;
                }
                this.uploading = false;
                let file = response.data;
                this.files.push(file[0]);
                this.values.push(response.token);
                this.complete();
              })
              .catch(error => {
                if (!this.unlimited) {
                  this.pending--;
                }
                this.uploading = false;
                this.complete();
              });
        }
      }
    },
    upload(file) {
      return new Promise((resolve, reject) => {
        this.beforeUploading();
        let formData = new FormData();
        formData.append('file', file);
        formData.append('collection', this.collection);
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              if (this.responseText) {
                resolve(JSON.parse(this.responseText));
              }
            } else {
              if (this.responseText) {
                reject(JSON.parse(this.responseText));
              }
            }
          }
        };
        xhr.open("POST", '/api/uploader/media/upload', true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        let token = document.head.querySelector('meta[name="csrf-token"]');
        if (token) {
          xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
        } else {
          console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
        }
        xhr.send(formData);
      });
    },
    deleteFile(file) {
      if (file.data) {
        return;
      }
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", file.links.delete.href, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      let token = document.head.querySelector('meta[name="csrf-token"]');
      if (token) {
        xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
      } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
      }
      xhr.send();
      this.$delete(this.files, this.files.indexOf(file));
      this.$delete(this.values, this.files.indexOf(file));
      this.inputFilesLength--;
      this.complete();
    },
    beforeUploading() {
      let input = document.querySelector('[type=submit]');
      if (input) {
        input.setAttribute('disabled', true);
      }
      this.$emit('beforeUpload');
    },
    complete() {
      if (this.values.length >= this.inputFilesLength) {
        let input = document.querySelector('[type=submit]');
        if (input) {
          input.removeAttribute('disabled');
        }

        this.$emit('complete');
      }
    }
  }
}
</script>
<style scoped src="../dist/uploader.css"></style>