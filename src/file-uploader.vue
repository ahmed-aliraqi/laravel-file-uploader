<template>
    <div class="form-group">
        <label>{{ label }}</label>
        <div class="row uploader">
            <div class="col-6 col-sm-4 col-md-3 px-3 col-lg-2" v-for="file in files">
                <div class="img-item mw-100 mb-4" :title="file.file_name">
                    <img class="mw-100" :src="file.preview" alt="">
                    <a class="delete" href="#"
                       title="Delete File"
                       @click.prevent="deleteFile(file)">
                        <svg baseProfile="tiny" height="20px" id="Layer_1" version="1.2" viewBox="0 0 24 24"
                             width="20px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                             xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#ffffff" d="M17.414,6.586c-0.78-0.781-2.048-0.781-2.828,0L12,9.172L9.414,6.586c-0.78-0.781-2.048-0.781-2.828,0  c-0.781,0.781-0.781,2.047,0,2.828L9.171,12l-2.585,2.586c-0.781,0.781-0.781,2.047,0,2.828C6.976,17.805,7.488,18,8,18  s1.024-0.195,1.414-0.586L12,14.828l2.586,2.586C14.976,17.805,15.488,18,16,18s1.024-0.195,1.414-0.586  c0.781-0.781,0.781-2.047,0-2.828L14.829,12l2.585-2.586C18.195,8.633,18.195,7.367,17.414,6.586z"/></svg>
                    </a>
                    <span class="size">{{ file.human_readable_size }}</span>
                </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3 px-3 col-lg-2"
                 v-for="i in (max - files.length < 0 ? 0 : max - files.length)">
                <label class="img-item add mw-100 mb-4">
                    <input class="d-none" ref="file" type="file" @change="readUrl"
                           :accept="accept" :multiple="max > 1">
                    <img class="mw-100" v-if="i <= pending" src="/images/loading-100.gif" alt="">
                    <img class="mw-100" v-else src="/images/plus-circle-solid.svg" alt="">
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
        xhr.send(null);
      }
    },
    methods: {
      serialize(obj) {
        var str = [];
        for (var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
      },
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
          xhr.send(formData);
        });
      },
      deleteFile(file) {
        if (file.data) {
          return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", file.links.delete.href, true);
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
    @charset "UTF-8";
    /*!
     * Bootstrap v4.4.1 (https://getbootstrap.com/)
     * Copyright 2011-2019 The Bootstrap Authors
     * Copyright 2011-2019 Twitter, Inc.
     * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
     */
    :root {
        --blue: #007bff;
        --indigo: #6610f2;
        --purple: #6f42c1;
        --pink: #e83e8c;
        --red: #dc3545;
        --orange: #fd7e14;
        --yellow: #ffc107;
        --green: #28a745;
        --teal: #20c997;
        --cyan: #17a2b8;
        --white: #fff;
        --gray: #6c757d;
        --gray-dark: #343a40;
        --primary: #007bff;
        --secondary: #6c757d;
        --success: #28a745;
        --info: #17a2b8;
        --warning: #ffc107;
        --danger: #dc3545;
        --light: #f8f9fa;
        --dark: #343a40;
        --breakpoint-xs: 0;
        --breakpoint-sm: 576px;
        --breakpoint-md: 768px;
        --breakpoint-lg: 992px;
        --breakpoint-xl: 1200px;
        --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace
    }

    *, ::after, ::before {
        box-sizing: border-box
    }

    html {
        font-family: sans-serif;
        line-height: 1.15;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: transparent
    }

    body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff
    }

    [tabindex="-1"]:focus:not(:focus-visible) {
        outline: 0 !important
    }

    small {
        font-size: 80%
    }

    a {
        color: #007bff;
        text-decoration: none;
        background-color: transparent
    }

    a:hover {
        color: #0056b3;
        text-decoration: underline
    }

    a:not([href]) {
        color: inherit;
        text-decoration: none
    }

    a:not([href]):hover {
        color: inherit;
        text-decoration: none
    }

    img {
        vertical-align: middle;
        border-style: none
    }

    svg {
        overflow: hidden;
        vertical-align: middle
    }

    label {
        display: inline-block;
        margin-bottom: .5rem
    }

    input {
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit
    }

    input {
        overflow: visible
    }

    [type=button], [type=reset], [type=submit] {
        -webkit-appearance: button
    }

    [type=button]:not(:disabled), [type=reset]:not(:disabled), [type=submit]:not(:disabled) {
        cursor: pointer
    }

    [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner {
        padding: 0;
        border-style: none
    }

    input[type=checkbox], input[type=radio] {
        box-sizing: border-box;
        padding: 0
    }

    input[type=date], input[type=datetime-local], input[type=month], input[type=time] {
        -webkit-appearance: listbox
    }

    [type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button {
        height: auto
    }

    [type=search] {
        outline-offset: -2px;
        -webkit-appearance: none
    }

    [type=search]::-webkit-search-decoration {
        -webkit-appearance: none
    }

    ::-webkit-file-upload-button {
        font: inherit;
        -webkit-appearance: button
    }

    [hidden] {
        display: none !important
    }

    .small, small {
        font-size: 80%;
        font-weight: 400
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px
    }

    .col, .col-1, .col-10, .col-11, .col-12, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-lg, .col-lg-1, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-md, .col-md-1, .col-md-10, .col-md-11, .col-md-12, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-sm, .col-sm-1, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9 {
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px
    }

    .col {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%
    }

    .col-1 {
        flex: 0 0 8.3333333333%;
        max-width: 8.3333333333%
    }

    .col-2 {
        flex: 0 0 16.6666666667%;
        max-width: 16.6666666667%
    }

    .col-3 {
        flex: 0 0 25%;
        max-width: 25%
    }

    .col-4 {
        flex: 0 0 33.3333333333%;
        max-width: 33.3333333333%
    }

    .col-5 {
        flex: 0 0 41.6666666667%;
        max-width: 41.6666666667%
    }

    .col-6 {
        flex: 0 0 50%;
        max-width: 50%
    }

    .col-7 {
        flex: 0 0 58.3333333333%;
        max-width: 58.3333333333%
    }

    .col-8 {
        flex: 0 0 66.6666666667%;
        max-width: 66.6666666667%
    }

    .col-9 {
        flex: 0 0 75%;
        max-width: 75%
    }

    .col-10 {
        flex: 0 0 83.3333333333%;
        max-width: 83.3333333333%
    }

    .col-11 {
        flex: 0 0 91.6666666667%;
        max-width: 91.6666666667%
    }

    .col-12 {
        flex: 0 0 100%;
        max-width: 100%
    }

    @media (min-width: 576px) {
        .col-sm {
            flex-basis: 0;
            flex-grow: 1;
            max-width: 100%
        }

        .col-sm-1 {
            flex: 0 0 8.3333333333%;
            max-width: 8.3333333333%
        }

        .col-sm-2 {
            flex: 0 0 16.6666666667%;
            max-width: 16.6666666667%
        }

        .col-sm-3 {
            flex: 0 0 25%;
            max-width: 25%
        }

        .col-sm-4 {
            flex: 0 0 33.3333333333%;
            max-width: 33.3333333333%
        }

        .col-sm-5 {
            flex: 0 0 41.6666666667%;
            max-width: 41.6666666667%
        }

        .col-sm-6 {
            flex: 0 0 50%;
            max-width: 50%
        }

        .col-sm-7 {
            flex: 0 0 58.3333333333%;
            max-width: 58.3333333333%
        }

        .col-sm-8 {
            flex: 0 0 66.6666666667%;
            max-width: 66.6666666667%
        }

        .col-sm-9 {
            flex: 0 0 75%;
            max-width: 75%
        }

        .col-sm-10 {
            flex: 0 0 83.3333333333%;
            max-width: 83.3333333333%
        }

        .col-sm-11 {
            flex: 0 0 91.6666666667%;
            max-width: 91.6666666667%
        }

        .col-sm-12 {
            flex: 0 0 100%;
            max-width: 100%
        }
    }

    @media (min-width: 768px) {
        .col-md {
            flex-basis: 0;
            flex-grow: 1;
            max-width: 100%
        }

        .col-md-1 {
            flex: 0 0 8.3333333333%;
            max-width: 8.3333333333%
        }

        .col-md-2 {
            flex: 0 0 16.6666666667%;
            max-width: 16.6666666667%
        }

        .col-md-3 {
            flex: 0 0 25%;
            max-width: 25%
        }

        .col-md-4 {
            flex: 0 0 33.3333333333%;
            max-width: 33.3333333333%
        }

        .col-md-5 {
            flex: 0 0 41.6666666667%;
            max-width: 41.6666666667%
        }

        .col-md-6 {
            flex: 0 0 50%;
            max-width: 50%
        }

        .col-md-7 {
            flex: 0 0 58.3333333333%;
            max-width: 58.3333333333%
        }

        .col-md-8 {
            flex: 0 0 66.6666666667%;
            max-width: 66.6666666667%
        }

        .col-md-9 {
            flex: 0 0 75%;
            max-width: 75%
        }

        .col-md-10 {
            flex: 0 0 83.3333333333%;
            max-width: 83.3333333333%
        }

        .col-md-11 {
            flex: 0 0 91.6666666667%;
            max-width: 91.6666666667%
        }

        .col-md-12 {
            flex: 0 0 100%;
            max-width: 100%
        }
    }

    @media (min-width: 992px) {
        .col-lg {
            flex-basis: 0;
            flex-grow: 1;
            max-width: 100%
        }

        .col-lg-1 {
            flex: 0 0 8.3333333333%;
            max-width: 8.3333333333%
        }

        .col-lg-2 {
            flex: 0 0 16.6666666667%;
            max-width: 16.6666666667%
        }

        .col-lg-3 {
            flex: 0 0 25%;
            max-width: 25%
        }

        .col-lg-4 {
            flex: 0 0 33.3333333333%;
            max-width: 33.3333333333%
        }

        .col-lg-5 {
            flex: 0 0 41.6666666667%;
            max-width: 41.6666666667%
        }

        .col-lg-6 {
            flex: 0 0 50%;
            max-width: 50%
        }

        .col-lg-7 {
            flex: 0 0 58.3333333333%;
            max-width: 58.3333333333%
        }

        .col-lg-8 {
            flex: 0 0 66.6666666667%;
            max-width: 66.6666666667%
        }

        .col-lg-9 {
            flex: 0 0 75%;
            max-width: 75%
        }

        .col-lg-10 {
            flex: 0 0 83.3333333333%;
            max-width: 83.3333333333%
        }

        .col-lg-11 {
            flex: 0 0 91.6666666667%;
            max-width: 91.6666666667%
        }

        .col-lg-12 {
            flex: 0 0 100%;
            max-width: 100%
        }
    }

    .col-form-label {
        padding-top: calc(.375rem + 1px);
        padding-bottom: calc(.375rem + 1px);
        margin-bottom: 0;
        font-size: inherit;
        line-height: 1.5
    }

    .col-form-label-lg {
        padding-top: calc(.5rem + 1px);
        padding-bottom: calc(.5rem + 1px);
        font-size: 1.25rem;
        line-height: 1.5
    }

    .col-form-label-sm {
        padding-top: calc(.25rem + 1px);
        padding-bottom: calc(.25rem + 1px);
        font-size: .875rem;
        line-height: 1.5
    }

    .form-group {
        margin-bottom: 1rem
    }

    .form-text {
        display: block;
        margin-top: .25rem
    }

    .form-row {
        display: flex;
        flex-wrap: wrap;
        margin-right: -5px;
        margin-left: -5px
    }

    .form-row > .col, .form-row > [class*=col-] {
        padding-right: 5px;
        padding-left: 5px
    }

    .input-group {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        width: 100%
    }

    .input-group-text {
        display: flex;
        align-items: center;
        padding: .375rem .75rem;
        margin-bottom: 0;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        text-align: center;
        white-space: nowrap;
        background-color: #e9ecef;
        border: 1px solid #ced4da;
        border-radius: .25rem
    }

    .input-group-text input[type=checkbox], .input-group-text input[type=radio] {
        margin-top: 0
    }

    @-webkit-keyframes progress-bar-stripes {
        from {
            background-position: 1rem 0
        }
        to {
            background-position: 0 0
        }
    }

    @keyframes progress-bar-stripes {
        from {
            background-position: 1rem 0
        }
        to {
            background-position: 0 0
        }
    }

    .media {
        display: flex;
        align-items: flex-start
    }

    .media-body {
        flex: 1
    }

    @-webkit-keyframes spinner-border {
        to {
            transform: rotate(360deg)
        }
    }

    @keyframes spinner-border {
        to {
            transform: rotate(360deg)
        }
    }

    @-webkit-keyframes spinner-grow {
        0% {
            transform: scale(0)
        }
        50% {
            opacity: 1
        }
    }

    @keyframes spinner-grow {
        0% {
            transform: scale(0)
        }
        50% {
            opacity: 1
        }
    }

    .d-none {
        display: none !important
    }

    @media (min-width: 576px) {
        .d-sm-none {
            display: none !important
        }
    }

    @media (min-width: 768px) {
        .d-md-none {
            display: none !important
        }
    }

    @media (min-width: 992px) {
        .d-lg-none {
            display: none !important
        }
    }

    @supports ((position:-webkit-sticky) or (position:sticky)) {
        .sticky-top {
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 1020
        }
    }

    .w-25 {
        width: 25% !important
    }

    .w-50 {
        width: 50% !important
    }

    .w-75 {
        width: 75% !important
    }

    .w-100 {
        width: 100% !important
    }

    .mw-100 {
        max-width: 100% !important
    }

    .mb-0 {
        margin-bottom: 0 !important
    }

    .mb-1 {
        margin-bottom: .25rem !important
    }

    .mb-2 {
        margin-bottom: .5rem !important
    }

    .mb-3 {
        margin-bottom: 1rem !important
    }

    .mb-4 {
        margin-bottom: 1.5rem !important
    }

    .mb-5 {
        margin-bottom: 3rem !important
    }

    .px-0 {
        padding-right: 0 !important
    }

    .px-0 {
        padding-left: 0 !important
    }

    .px-1 {
        padding-right: .25rem !important
    }

    .px-1 {
        padding-left: .25rem !important
    }

    .px-2 {
        padding-right: .5rem !important
    }

    .px-2 {
        padding-left: .5rem !important
    }

    .px-3 {
        padding-right: 1rem !important
    }

    .px-3 {
        padding-left: 1rem !important
    }

    .px-4 {
        padding-right: 1.5rem !important
    }

    .px-4 {
        padding-left: 1.5rem !important
    }

    .px-5 {
        padding-right: 3rem !important
    }

    .px-5 {
        padding-left: 3rem !important
    }

    @media (min-width: 576px) {
        .mb-sm-0 {
            margin-bottom: 0 !important
        }

        .mb-sm-1 {
            margin-bottom: .25rem !important
        }

        .mb-sm-2 {
            margin-bottom: .5rem !important
        }

        .mb-sm-3 {
            margin-bottom: 1rem !important
        }

        .mb-sm-4 {
            margin-bottom: 1.5rem !important
        }

        .mb-sm-5 {
            margin-bottom: 3rem !important
        }

        .px-sm-0 {
            padding-right: 0 !important
        }

        .px-sm-0 {
            padding-left: 0 !important
        }

        .px-sm-1 {
            padding-right: .25rem !important
        }

        .px-sm-1 {
            padding-left: .25rem !important
        }

        .px-sm-2 {
            padding-right: .5rem !important
        }

        .px-sm-2 {
            padding-left: .5rem !important
        }

        .px-sm-3 {
            padding-right: 1rem !important
        }

        .px-sm-3 {
            padding-left: 1rem !important
        }

        .px-sm-4 {
            padding-right: 1.5rem !important
        }

        .px-sm-4 {
            padding-left: 1.5rem !important
        }

        .px-sm-5 {
            padding-right: 3rem !important
        }

        .px-sm-5 {
            padding-left: 3rem !important
        }
    }

    @media (min-width: 768px) {
        .mb-md-0 {
            margin-bottom: 0 !important
        }

        .mb-md-1 {
            margin-bottom: .25rem !important
        }

        .mb-md-2 {
            margin-bottom: .5rem !important
        }

        .mb-md-3 {
            margin-bottom: 1rem !important
        }

        .mb-md-4 {
            margin-bottom: 1.5rem !important
        }

        .mb-md-5 {
            margin-bottom: 3rem !important
        }

        .px-md-0 {
            padding-right: 0 !important
        }

        .px-md-0 {
            padding-left: 0 !important
        }

        .px-md-1 {
            padding-right: .25rem !important
        }

        .px-md-1 {
            padding-left: .25rem !important
        }

        .px-md-2 {
            padding-right: .5rem !important
        }

        .px-md-2 {
            padding-left: .5rem !important
        }

        .px-md-3 {
            padding-right: 1rem !important
        }

        .px-md-3 {
            padding-left: 1rem !important
        }

        .px-md-4 {
            padding-right: 1.5rem !important
        }

        .px-md-4 {
            padding-left: 1.5rem !important
        }

        .px-md-5 {
            padding-right: 3rem !important
        }

        .px-md-5 {
            padding-left: 3rem !important
        }
    }

    @media (min-width: 992px) {
        .mb-lg-0 {
            margin-bottom: 0 !important
        }

        .mb-lg-1 {
            margin-bottom: .25rem !important
        }

        .mb-lg-2 {
            margin-bottom: .5rem !important
        }

        .mb-lg-3 {
            margin-bottom: 1rem !important
        }

        .mb-lg-4 {
            margin-bottom: 1.5rem !important
        }

        .mb-lg-5 {
            margin-bottom: 3rem !important
        }

        .px-lg-0 {
            padding-right: 0 !important
        }

        .px-lg-0 {
            padding-left: 0 !important
        }

        .px-lg-1 {
            padding-right: .25rem !important
        }

        .px-lg-1 {
            padding-left: .25rem !important
        }

        .px-lg-2 {
            padding-right: .5rem !important
        }

        .px-lg-2 {
            padding-left: .5rem !important
        }

        .px-lg-3 {
            padding-right: 1rem !important
        }

        .px-lg-3 {
            padding-left: 1rem !important
        }

        .px-lg-4 {
            padding-right: 1.5rem !important
        }

        .px-lg-4 {
            padding-left: 1.5rem !important
        }

        .px-lg-5 {
            padding-right: 3rem !important
        }

        .px-lg-5 {
            padding-left: 3rem !important
        }
    }

    .text-body {
        color: #212529 !important
    }

    .text-muted {
        color: #6c757d !important
    }

    @media print {
        *, ::after, ::before {
            text-shadow: none !important;
            box-shadow: none !important
        }

        a:not(.btn) {
            text-decoration: underline
        }

        img {
            page-break-inside: avoid
        }

        @page {
            size: a3
        }

        body {
            min-width: 992px !important
        }
    }

    .uploader .img-item:not(.add) {
        position: relative;
        text-align: center;
        border: 2px dashed gray;
        border-radius: 15px 0;
        overflow: hidden
    }

    .uploader .img-item:not(.add) img {
        text-align: center;
        max-width: 100%
    }

    @media (min-width: 992px) {
        .uploader .img-item:not(.add) img {
            height: 100px
        }
    }

    @media (min-width: 768px) and (max-width: 991.98px) {
        .uploader .img-item:not(.add) img {
            height: 130px
        }
    }

    @media (max-width: 767.98px) {
        .uploader .img-item:not(.add) img {
            height: 100px
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
            height: 100px
        }
    }

    @media (min-width: 768px) and (max-width: 991.98px) {
        .uploader .add {
            height: 130px
        }
    }

    @media (max-width: 767.98px) {
        .uploader .add {
            height: 100px
        }
    }

    .uploader .add img {
        width: 30%;
        margin: 0 auto
    }
</style>
