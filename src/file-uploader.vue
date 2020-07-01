<template>
    <div class="form-group">
        <label>{{ label }}</label>
        <div class="row uploader">
            <div class="px-3" v-for="file in files">
                <div class="img-item mw-100 mb-4" :title="file.file_name">
                    <img class="mw-100"
                         :src="file.preview || 'https://cdn.jsdelivr.net/npm/laravel-file-uploader/dist/img/attach.png'"
                         alt="">
                    <a class="delete" href="#"
                       title="Delete File"
                       @click.prevent="deleteFile(file)">
                        <svg baseProfile="tiny" height="24px" id="Layer_1" version="1.2" viewBox="0 0 22 30"
                             width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#ffffff" d="M17.414,6.586c-0.78-0.781-2.048-0.781-2.828,0L12,9.172L9.414,6.586c-0.78-0.781-2.048-0.781-2.828,0  c-0.781,0.781-0.781,2.047,0,2.828L9.171,12l-2.585,2.586c-0.781,0.781-0.781,2.047,0,2.828C6.976,17.805,7.488,18,8,18  s1.024-0.195,1.414-0.586L12,14.828l2.586,2.586C14.976,17.805,15.488,18,16,18s1.024-0.195,1.414-0.586  c0.781-0.781,0.781-2.047,0-2.828L14.829,12l2.585-2.586C18.195,8.633,18.195,7.367,17.414,6.586z"/></svg>
                    </a>
                    <span class="size">{{ file.human_readable_size }}</span>
                </div>
            </div>
            <div class="px-3"
                 v-for="i in (max - files.length < 0 ? 0 : max - files.length)">
                <label class="img-item add mw-100 mb-4">
                    <input class="d-none" ref="file" type="file" @change="readUrl"
                           :accept="accept" :multiple="max > 1">
                    <img class="mw-100" v-if="i <= pending"
                         src="https://cdn.jsdelivr.net/npm/laravel-file-uploader/dist/img/loading-100.gif" alt="">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus-circle"
                         class="svg-inline--fa fa-plus-circle fa-w-16" role="img"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="gray"
                              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path>
                    </svg>
                </label>
            </div>
        </div>
        <input type="hidden" name="media[]" v-for="token in values" :value="token">
        <small class="text-muted">{{ notes }}</small>
    </div>
</template>

<script>
  export default {
    props: {
      max: {
        default: 12
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
      }
    },
    data() {
      return {
        files: this.media || [],
        values: this.tokens,
        inputFilesLength: 0,
        pending: -1,
      }
    },
    created() {
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
        xhr.open("GET", '/api/uploader/media?' + params, true);
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
          let filesCount = fileList.length > this.max - this.files.length
            ? this.max - this.files.length : fileList.length;
          this.inputFilesLength = filesCount;
          this.pending = filesCount;
          for (let i = 0; i < filesCount; i++) {
            await this.upload(fileList[i])
              .then(response => {
                this.pending--;
                let file = response.data;
                this.files.push(file[0]);
                this.values.push(response.token);
                this.complete();
              })
              .catch(error => {
                this.pending--;
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
<style scoped>
    .mw-100 {
        max-width: 100% !important
    }

    .mb-4 {
        margin-bottom: 1.5rem !important
    }

    .px-3 {
        padding-right: 1rem !important
    }

    .px-3 {
        padding-left: 1rem !important
    }

    .text-muted {
        color: #6c757d !important
    }

    .uploader .img-item:not(.add) {
        position: relative;
        text-align: center;
        border: 2px dashed gray;
        border-radius: 15px 0;
        overflow: hidden;
    }

    .uploader .img-item:not(.add) img {
        text-align: center;
        max-width: 100%
    }

    @media (min-width: 992px) {
        .uploader .img-item {
            width: 140px;
        }

        .uploader .img-item:not(.add) img {
            height: 96px;
        }
    }

    @media (min-width: 768px) and (max-width: 991.98px) {
        .uploader .img-item {
            width: 170px;
        }

        .uploader .img-item:not(.add) img {
            height: 126px;
        }
    }

    @media (max-width: 767.98px) {
        .uploader .img-item:not(.add) img {
            height: 96px;
        }
    }

    .uploader .img-item:not(.add) a.delete {
        position: absolute;
        top: 0;
        right: 0;
        color: #fff !important;
        background: red;
        padding: 1px;
        text-align: center;
        width: 20px;
        height: 20px;
        font-size: 13px
    }

    .uploader .img-item:not(.add) .size {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        background: #808080d6;
        border-radius: 0 0 15px 0;
        color: #fff;
        font-weight: 700
    }

    .uploader .add {
        cursor: pointer;
        border: 2px dashed gray;
        border-radius: 15px 0;
        display: flex;
        align-items: center
    }

    @media (min-width: 992px) {
        .uploader .add {
            height: 100px;
            width: 140px;
        }
    }

    @media (min-width: 768px) and (max-width: 991.98px) {
        .uploader .add {
            height: 130px
        }
    }

    @media (max-width: 767.98px) {
        .uploader .add {
            height: 100px;
            width: 140px;
        }
    }

    .uploader .add img, .uploader .add svg {
        width: 30%;
        margin: 0 auto
    }
</style>