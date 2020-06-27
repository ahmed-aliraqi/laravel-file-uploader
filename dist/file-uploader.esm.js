//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
  props: {
    max: {
      default: 12
    },
    media: {
      required: false,
      type: Array,
      default: function () { return []; }
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
  data: function data() {
    return {
      files: this.media || [],
      values: this.tokens,
      inputFilesLength: 0,
      pending: -1,
    }
  },
  created: function created() {
    var this$1 = this;

    if (this.tokens.length) {

      var xhr = new XMLHttpRequest();
      var vueInstance = this;

      var params = Object.keys(this.tokens).map(function (key) {
        return 'tokens[]=' + this$1.tokens[key]
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
      var token = document.head.querySelector('meta[name="csrf-token"]');

      if (token) {
        xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
      } else {
        console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
      }
      xhr.send(null);
    }
  },
  methods: {
    readUrl: async function readUrl(event) {
      var this$1 = this;

      var input = event.target;
      if (input.files) {
        var fileList = input.files;

        var filesCount = fileList.length > this.max - this.files.length
          ? this.max - this.files.length : fileList.length;

        this.inputFilesLength = filesCount;

        this.pending = filesCount;

        for (var i = 0; i < filesCount; i++) {
          await this.upload(fileList[i])
            .then(function (response) {
              this$1.pending--;

              var file = response.data;

              this$1.files.push(file[0]);

              this$1.values.push(response.token);

              this$1.complete();
            })
            .catch(function (error) {
              this$1.pending--;
              this$1.complete();
            });

        }
      }
    },
    upload: function upload(file) {
      var this$1 = this;

      return new Promise(function (resolve, reject) {
        this$1.beforeUploading();
        var formData = new FormData();

        formData.append('file', file);
        formData.append('collection', this$1.collection);

        var xhr = new XMLHttpRequest();
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
        var token = document.head.querySelector('meta[name="csrf-token"]');

        if (token) {
          xhr.setRequestHeader('X-CSRF-TOKEN', token.content);
        } else {
          console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
        }
        xhr.send(formData);
      });
    },
    deleteFile: function deleteFile(file) {
      if (file.data) {
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", file.links.delete.href, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      var token = document.head.querySelector('meta[name="csrf-token"]');

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
    beforeUploading: function beforeUploading() {
      var input = document.querySelector('[type=submit]');
      if (input) {
        input.setAttribute('disabled', true);
      }
      this.$emit('beforeUpload');
    },
    complete: function complete() {
      if (this.values.length >= this.inputFilesLength) {
        var input = document.querySelector('[type=submit]');
        if (input) {
          input.removeAttribute('disabled');
        }
        this.$emit('complete');
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) { style.element.setAttribute('media', css.media); }
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) { style.element.removeChild(nodes[index]); }
      if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
    }
  }
}

var browser = createInjector;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-group"},[_c('label',[_vm._v(_vm._s(_vm.label))]),_vm._v(" "),_c('div',{staticClass:"row uploader"},[_vm._l((_vm.files),function(file){return _c('div',{staticClass:"col-6 col-sm-4 col-md-3 px-3 col-lg-2"},[_c('div',{staticClass:"img-item mw-100 mb-4",attrs:{"title":file.file_name}},[_c('img',{staticClass:"mw-100",attrs:{"src":file.preview,"alt":""}}),_vm._v(" "),_c('a',{staticClass:"delete",attrs:{"href":"#","title":"Delete File"},on:{"click":function($event){$event.preventDefault();return _vm.deleteFile(file)}}},[_c('svg',{attrs:{"baseProfile":"tiny","height":"20px","id":"Layer_1","version":"1.2","viewBox":"0 0 24 24","width":"20px","xml:space":"preserve","xmlns":"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}},[_c('path',{attrs:{"fill":"#ffffff","d":"M17.414,6.586c-0.78-0.781-2.048-0.781-2.828,0L12,9.172L9.414,6.586c-0.78-0.781-2.048-0.781-2.828,0  c-0.781,0.781-0.781,2.047,0,2.828L9.171,12l-2.585,2.586c-0.781,0.781-0.781,2.047,0,2.828C6.976,17.805,7.488,18,8,18  s1.024-0.195,1.414-0.586L12,14.828l2.586,2.586C14.976,17.805,15.488,18,16,18s1.024-0.195,1.414-0.586  c0.781-0.781,0.781-2.047,0-2.828L14.829,12l2.585-2.586C18.195,8.633,18.195,7.367,17.414,6.586z"}})])]),_vm._v(" "),_c('span',{staticClass:"size"},[_vm._v(_vm._s(file.human_readable_size))])])])}),_vm._v(" "),_vm._l(((_vm.max - _vm.files.length < 0 ? 0 : _vm.max - _vm.files.length)),function(i){return _c('div',{staticClass:"col-6 col-sm-4 col-md-3 px-3 col-lg-2"},[_c('label',{staticClass:"img-item add mw-100 mb-4"},[_c('input',{ref:"file",refInFor:true,staticClass:"d-none",attrs:{"type":"file","accept":_vm.accept,"multiple":_vm.max > 1},on:{"change":_vm.readUrl}}),_vm._v(" "),(i <= _vm.pending)?_c('img',{staticClass:"mw-100",attrs:{"src":"/images/loading-100.gif","alt":""}}):_c('img',{staticClass:"mw-100",attrs:{"src":"/images/plus-circle-solid.svg","alt":""}})])])})],2),_vm._v(" "),_vm._l((_vm.values),function(token){return _c('input',{attrs:{"type":"hidden","name":"media[]"},domProps:{"value":token}})}),_vm._v(" "),_c('small',{staticClass:"text-muted"},[_vm._v(_vm._s(_vm.notes))])],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-3f9da1c2_0", { source: "@charset \"UTF-8\";/*!\n * Bootstrap v4.4.1 (https://getbootstrap.com/)\n * Copyright 2011-2019 The Bootstrap Authors\n * Copyright 2011-2019 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */[data-v-3f9da1c2]:root{--blue:#007bff;--indigo:#6610f2;--purple:#6f42c1;--pink:#e83e8c;--red:#dc3545;--orange:#fd7e14;--yellow:#ffc107;--green:#28a745;--teal:#20c997;--cyan:#17a2b8;--white:#fff;--gray:#6c757d;--gray-dark:#343a40;--primary:#007bff;--secondary:#6c757d;--success:#28a745;--info:#17a2b8;--warning:#ffc107;--danger:#dc3545;--light:#f8f9fa;--dark:#343a40;--breakpoint-xs:0;--breakpoint-sm:576px;--breakpoint-md:768px;--breakpoint-lg:992px;--breakpoint-xl:1200px;--font-family-sans-serif:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";--font-family-monospace:SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace}*[data-v-3f9da1c2],[data-v-3f9da1c2]::after,[data-v-3f9da1c2]::before{box-sizing:border-box}html[data-v-3f9da1c2]{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}body[data-v-3f9da1c2]{margin:0;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}[tabindex=\"-1\"][data-v-3f9da1c2]:focus:not(:focus-visible){outline:0!important}small[data-v-3f9da1c2]{font-size:80%}a[data-v-3f9da1c2]{color:#007bff;text-decoration:none;background-color:transparent}a[data-v-3f9da1c2]:hover{color:#0056b3;text-decoration:underline}a[data-v-3f9da1c2]:not([href]){color:inherit;text-decoration:none}a[data-v-3f9da1c2]:not([href]):hover{color:inherit;text-decoration:none}img[data-v-3f9da1c2]{vertical-align:middle;border-style:none}svg[data-v-3f9da1c2]{overflow:hidden;vertical-align:middle}label[data-v-3f9da1c2]{display:inline-block;margin-bottom:.5rem}input[data-v-3f9da1c2]{margin:0;font-family:inherit;font-size:inherit;line-height:inherit}input[data-v-3f9da1c2]{overflow:visible}[type=button][data-v-3f9da1c2],[type=reset][data-v-3f9da1c2],[type=submit][data-v-3f9da1c2]{-webkit-appearance:button}[type=button][data-v-3f9da1c2]:not(:disabled),[type=reset][data-v-3f9da1c2]:not(:disabled),[type=submit][data-v-3f9da1c2]:not(:disabled){cursor:pointer}[type=button][data-v-3f9da1c2]::-moz-focus-inner,[type=reset][data-v-3f9da1c2]::-moz-focus-inner,[type=submit][data-v-3f9da1c2]::-moz-focus-inner{padding:0;border-style:none}input[type=checkbox][data-v-3f9da1c2],input[type=radio][data-v-3f9da1c2]{box-sizing:border-box;padding:0}input[type=date][data-v-3f9da1c2],input[type=datetime-local][data-v-3f9da1c2],input[type=month][data-v-3f9da1c2],input[type=time][data-v-3f9da1c2]{-webkit-appearance:listbox}[type=number][data-v-3f9da1c2]::-webkit-inner-spin-button,[type=number][data-v-3f9da1c2]::-webkit-outer-spin-button{height:auto}[type=search][data-v-3f9da1c2]{outline-offset:-2px;-webkit-appearance:none}[type=search][data-v-3f9da1c2]::-webkit-search-decoration{-webkit-appearance:none}[data-v-3f9da1c2]::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}[hidden][data-v-3f9da1c2]{display:none!important}.small[data-v-3f9da1c2],small[data-v-3f9da1c2]{font-size:80%;font-weight:400}.row[data-v-3f9da1c2]{display:flex;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}.col[data-v-3f9da1c2],.col-1[data-v-3f9da1c2],.col-10[data-v-3f9da1c2],.col-11[data-v-3f9da1c2],.col-12[data-v-3f9da1c2],.col-2[data-v-3f9da1c2],.col-3[data-v-3f9da1c2],.col-4[data-v-3f9da1c2],.col-5[data-v-3f9da1c2],.col-6[data-v-3f9da1c2],.col-7[data-v-3f9da1c2],.col-8[data-v-3f9da1c2],.col-9[data-v-3f9da1c2],.col-lg[data-v-3f9da1c2],.col-lg-1[data-v-3f9da1c2],.col-lg-10[data-v-3f9da1c2],.col-lg-11[data-v-3f9da1c2],.col-lg-12[data-v-3f9da1c2],.col-lg-2[data-v-3f9da1c2],.col-lg-3[data-v-3f9da1c2],.col-lg-4[data-v-3f9da1c2],.col-lg-5[data-v-3f9da1c2],.col-lg-6[data-v-3f9da1c2],.col-lg-7[data-v-3f9da1c2],.col-lg-8[data-v-3f9da1c2],.col-lg-9[data-v-3f9da1c2],.col-md[data-v-3f9da1c2],.col-md-1[data-v-3f9da1c2],.col-md-10[data-v-3f9da1c2],.col-md-11[data-v-3f9da1c2],.col-md-12[data-v-3f9da1c2],.col-md-2[data-v-3f9da1c2],.col-md-3[data-v-3f9da1c2],.col-md-4[data-v-3f9da1c2],.col-md-5[data-v-3f9da1c2],.col-md-6[data-v-3f9da1c2],.col-md-7[data-v-3f9da1c2],.col-md-8[data-v-3f9da1c2],.col-md-9[data-v-3f9da1c2],.col-sm[data-v-3f9da1c2],.col-sm-1[data-v-3f9da1c2],.col-sm-10[data-v-3f9da1c2],.col-sm-11[data-v-3f9da1c2],.col-sm-12[data-v-3f9da1c2],.col-sm-2[data-v-3f9da1c2],.col-sm-3[data-v-3f9da1c2],.col-sm-4[data-v-3f9da1c2],.col-sm-5[data-v-3f9da1c2],.col-sm-6[data-v-3f9da1c2],.col-sm-7[data-v-3f9da1c2],.col-sm-8[data-v-3f9da1c2],.col-sm-9[data-v-3f9da1c2]{position:relative;width:100%;padding-right:15px;padding-left:15px}.col[data-v-3f9da1c2]{flex-basis:0;flex-grow:1;max-width:100%}.col-1[data-v-3f9da1c2]{flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-2[data-v-3f9da1c2]{flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-3[data-v-3f9da1c2]{flex:0 0 25%;max-width:25%}.col-4[data-v-3f9da1c2]{flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-5[data-v-3f9da1c2]{flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-6[data-v-3f9da1c2]{flex:0 0 50%;max-width:50%}.col-7[data-v-3f9da1c2]{flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-8[data-v-3f9da1c2]{flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-9[data-v-3f9da1c2]{flex:0 0 75%;max-width:75%}.col-10[data-v-3f9da1c2]{flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-11[data-v-3f9da1c2]{flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-12[data-v-3f9da1c2]{flex:0 0 100%;max-width:100%}@media (min-width:576px){.col-sm[data-v-3f9da1c2]{flex-basis:0;flex-grow:1;max-width:100%}.col-sm-1[data-v-3f9da1c2]{flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-sm-2[data-v-3f9da1c2]{flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-sm-3[data-v-3f9da1c2]{flex:0 0 25%;max-width:25%}.col-sm-4[data-v-3f9da1c2]{flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-sm-5[data-v-3f9da1c2]{flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-sm-6[data-v-3f9da1c2]{flex:0 0 50%;max-width:50%}.col-sm-7[data-v-3f9da1c2]{flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-sm-8[data-v-3f9da1c2]{flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-sm-9[data-v-3f9da1c2]{flex:0 0 75%;max-width:75%}.col-sm-10[data-v-3f9da1c2]{flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-sm-11[data-v-3f9da1c2]{flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-sm-12[data-v-3f9da1c2]{flex:0 0 100%;max-width:100%}}@media (min-width:768px){.col-md[data-v-3f9da1c2]{flex-basis:0;flex-grow:1;max-width:100%}.col-md-1[data-v-3f9da1c2]{flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-md-2[data-v-3f9da1c2]{flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-md-3[data-v-3f9da1c2]{flex:0 0 25%;max-width:25%}.col-md-4[data-v-3f9da1c2]{flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-md-5[data-v-3f9da1c2]{flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-md-6[data-v-3f9da1c2]{flex:0 0 50%;max-width:50%}.col-md-7[data-v-3f9da1c2]{flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-md-8[data-v-3f9da1c2]{flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-md-9[data-v-3f9da1c2]{flex:0 0 75%;max-width:75%}.col-md-10[data-v-3f9da1c2]{flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-md-11[data-v-3f9da1c2]{flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-md-12[data-v-3f9da1c2]{flex:0 0 100%;max-width:100%}}@media (min-width:992px){.col-lg[data-v-3f9da1c2]{flex-basis:0;flex-grow:1;max-width:100%}.col-lg-1[data-v-3f9da1c2]{flex:0 0 8.3333333333%;max-width:8.3333333333%}.col-lg-2[data-v-3f9da1c2]{flex:0 0 16.6666666667%;max-width:16.6666666667%}.col-lg-3[data-v-3f9da1c2]{flex:0 0 25%;max-width:25%}.col-lg-4[data-v-3f9da1c2]{flex:0 0 33.3333333333%;max-width:33.3333333333%}.col-lg-5[data-v-3f9da1c2]{flex:0 0 41.6666666667%;max-width:41.6666666667%}.col-lg-6[data-v-3f9da1c2]{flex:0 0 50%;max-width:50%}.col-lg-7[data-v-3f9da1c2]{flex:0 0 58.3333333333%;max-width:58.3333333333%}.col-lg-8[data-v-3f9da1c2]{flex:0 0 66.6666666667%;max-width:66.6666666667%}.col-lg-9[data-v-3f9da1c2]{flex:0 0 75%;max-width:75%}.col-lg-10[data-v-3f9da1c2]{flex:0 0 83.3333333333%;max-width:83.3333333333%}.col-lg-11[data-v-3f9da1c2]{flex:0 0 91.6666666667%;max-width:91.6666666667%}.col-lg-12[data-v-3f9da1c2]{flex:0 0 100%;max-width:100%}}.col-form-label[data-v-3f9da1c2]{padding-top:calc(.375rem + 1px);padding-bottom:calc(.375rem + 1px);margin-bottom:0;font-size:inherit;line-height:1.5}.col-form-label-lg[data-v-3f9da1c2]{padding-top:calc(.5rem + 1px);padding-bottom:calc(.5rem + 1px);font-size:1.25rem;line-height:1.5}.col-form-label-sm[data-v-3f9da1c2]{padding-top:calc(.25rem + 1px);padding-bottom:calc(.25rem + 1px);font-size:.875rem;line-height:1.5}.form-group[data-v-3f9da1c2]{margin-bottom:1rem}.form-text[data-v-3f9da1c2]{display:block;margin-top:.25rem}.form-row[data-v-3f9da1c2]{display:flex;flex-wrap:wrap;margin-right:-5px;margin-left:-5px}.form-row>.col[data-v-3f9da1c2],.form-row>[class*=col-][data-v-3f9da1c2]{padding-right:5px;padding-left:5px}.input-group[data-v-3f9da1c2]{position:relative;display:flex;flex-wrap:wrap;align-items:stretch;width:100%}.input-group-text[data-v-3f9da1c2]{display:flex;align-items:center;padding:.375rem .75rem;margin-bottom:0;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;text-align:center;white-space:nowrap;background-color:#e9ecef;border:1px solid #ced4da;border-radius:.25rem}.input-group-text input[type=checkbox][data-v-3f9da1c2],.input-group-text input[type=radio][data-v-3f9da1c2]{margin-top:0}@-webkit-keyframes progress-bar-stripes-data-v-3f9da1c2{from{background-position:1rem 0}to{background-position:0 0}}@keyframes progress-bar-stripes-data-v-3f9da1c2{from{background-position:1rem 0}to{background-position:0 0}}.media[data-v-3f9da1c2]{display:flex;align-items:flex-start}.media-body[data-v-3f9da1c2]{flex:1}@-webkit-keyframes spinner-border-data-v-3f9da1c2{to{transform:rotate(360deg)}}@keyframes spinner-border-data-v-3f9da1c2{to{transform:rotate(360deg)}}@-webkit-keyframes spinner-grow-data-v-3f9da1c2{0%{transform:scale(0)}50%{opacity:1}}@keyframes spinner-grow-data-v-3f9da1c2{0%{transform:scale(0)}50%{opacity:1}}.d-none[data-v-3f9da1c2]{display:none!important}@media (min-width:576px){.d-sm-none[data-v-3f9da1c2]{display:none!important}}@media (min-width:768px){.d-md-none[data-v-3f9da1c2]{display:none!important}}@media (min-width:992px){.d-lg-none[data-v-3f9da1c2]{display:none!important}}@supports ((position:-webkit-sticky) or (position:sticky)){.sticky-top[data-v-3f9da1c2]{position:-webkit-sticky;position:sticky;top:0;z-index:1020}}.w-25[data-v-3f9da1c2]{width:25%!important}.w-50[data-v-3f9da1c2]{width:50%!important}.w-75[data-v-3f9da1c2]{width:75%!important}.w-100[data-v-3f9da1c2]{width:100%!important}.mw-100[data-v-3f9da1c2]{max-width:100%!important}.mb-0[data-v-3f9da1c2]{margin-bottom:0!important}.mb-1[data-v-3f9da1c2]{margin-bottom:.25rem!important}.mb-2[data-v-3f9da1c2]{margin-bottom:.5rem!important}.mb-3[data-v-3f9da1c2]{margin-bottom:1rem!important}.mb-4[data-v-3f9da1c2]{margin-bottom:1.5rem!important}.mb-5[data-v-3f9da1c2]{margin-bottom:3rem!important}.px-0[data-v-3f9da1c2]{padding-right:0!important}.px-0[data-v-3f9da1c2]{padding-left:0!important}.px-1[data-v-3f9da1c2]{padding-right:.25rem!important}.px-1[data-v-3f9da1c2]{padding-left:.25rem!important}.px-2[data-v-3f9da1c2]{padding-right:.5rem!important}.px-2[data-v-3f9da1c2]{padding-left:.5rem!important}.px-3[data-v-3f9da1c2]{padding-right:1rem!important}.px-3[data-v-3f9da1c2]{padding-left:1rem!important}.px-4[data-v-3f9da1c2]{padding-right:1.5rem!important}.px-4[data-v-3f9da1c2]{padding-left:1.5rem!important}.px-5[data-v-3f9da1c2]{padding-right:3rem!important}.px-5[data-v-3f9da1c2]{padding-left:3rem!important}@media (min-width:576px){.mb-sm-0[data-v-3f9da1c2]{margin-bottom:0!important}.mb-sm-1[data-v-3f9da1c2]{margin-bottom:.25rem!important}.mb-sm-2[data-v-3f9da1c2]{margin-bottom:.5rem!important}.mb-sm-3[data-v-3f9da1c2]{margin-bottom:1rem!important}.mb-sm-4[data-v-3f9da1c2]{margin-bottom:1.5rem!important}.mb-sm-5[data-v-3f9da1c2]{margin-bottom:3rem!important}.px-sm-0[data-v-3f9da1c2]{padding-right:0!important}.px-sm-0[data-v-3f9da1c2]{padding-left:0!important}.px-sm-1[data-v-3f9da1c2]{padding-right:.25rem!important}.px-sm-1[data-v-3f9da1c2]{padding-left:.25rem!important}.px-sm-2[data-v-3f9da1c2]{padding-right:.5rem!important}.px-sm-2[data-v-3f9da1c2]{padding-left:.5rem!important}.px-sm-3[data-v-3f9da1c2]{padding-right:1rem!important}.px-sm-3[data-v-3f9da1c2]{padding-left:1rem!important}.px-sm-4[data-v-3f9da1c2]{padding-right:1.5rem!important}.px-sm-4[data-v-3f9da1c2]{padding-left:1.5rem!important}.px-sm-5[data-v-3f9da1c2]{padding-right:3rem!important}.px-sm-5[data-v-3f9da1c2]{padding-left:3rem!important}}@media (min-width:768px){.mb-md-0[data-v-3f9da1c2]{margin-bottom:0!important}.mb-md-1[data-v-3f9da1c2]{margin-bottom:.25rem!important}.mb-md-2[data-v-3f9da1c2]{margin-bottom:.5rem!important}.mb-md-3[data-v-3f9da1c2]{margin-bottom:1rem!important}.mb-md-4[data-v-3f9da1c2]{margin-bottom:1.5rem!important}.mb-md-5[data-v-3f9da1c2]{margin-bottom:3rem!important}.px-md-0[data-v-3f9da1c2]{padding-right:0!important}.px-md-0[data-v-3f9da1c2]{padding-left:0!important}.px-md-1[data-v-3f9da1c2]{padding-right:.25rem!important}.px-md-1[data-v-3f9da1c2]{padding-left:.25rem!important}.px-md-2[data-v-3f9da1c2]{padding-right:.5rem!important}.px-md-2[data-v-3f9da1c2]{padding-left:.5rem!important}.px-md-3[data-v-3f9da1c2]{padding-right:1rem!important}.px-md-3[data-v-3f9da1c2]{padding-left:1rem!important}.px-md-4[data-v-3f9da1c2]{padding-right:1.5rem!important}.px-md-4[data-v-3f9da1c2]{padding-left:1.5rem!important}.px-md-5[data-v-3f9da1c2]{padding-right:3rem!important}.px-md-5[data-v-3f9da1c2]{padding-left:3rem!important}}@media (min-width:992px){.mb-lg-0[data-v-3f9da1c2]{margin-bottom:0!important}.mb-lg-1[data-v-3f9da1c2]{margin-bottom:.25rem!important}.mb-lg-2[data-v-3f9da1c2]{margin-bottom:.5rem!important}.mb-lg-3[data-v-3f9da1c2]{margin-bottom:1rem!important}.mb-lg-4[data-v-3f9da1c2]{margin-bottom:1.5rem!important}.mb-lg-5[data-v-3f9da1c2]{margin-bottom:3rem!important}.px-lg-0[data-v-3f9da1c2]{padding-right:0!important}.px-lg-0[data-v-3f9da1c2]{padding-left:0!important}.px-lg-1[data-v-3f9da1c2]{padding-right:.25rem!important}.px-lg-1[data-v-3f9da1c2]{padding-left:.25rem!important}.px-lg-2[data-v-3f9da1c2]{padding-right:.5rem!important}.px-lg-2[data-v-3f9da1c2]{padding-left:.5rem!important}.px-lg-3[data-v-3f9da1c2]{padding-right:1rem!important}.px-lg-3[data-v-3f9da1c2]{padding-left:1rem!important}.px-lg-4[data-v-3f9da1c2]{padding-right:1.5rem!important}.px-lg-4[data-v-3f9da1c2]{padding-left:1.5rem!important}.px-lg-5[data-v-3f9da1c2]{padding-right:3rem!important}.px-lg-5[data-v-3f9da1c2]{padding-left:3rem!important}}.text-body[data-v-3f9da1c2]{color:#212529!important}.text-muted[data-v-3f9da1c2]{color:#6c757d!important}@media print{*[data-v-3f9da1c2],[data-v-3f9da1c2]::after,[data-v-3f9da1c2]::before{text-shadow:none!important;box-shadow:none!important}a[data-v-3f9da1c2]:not(.btn){text-decoration:underline}img[data-v-3f9da1c2]{page-break-inside:avoid}@page{size:a3}body[data-v-3f9da1c2]{min-width:992px!important}}.uploader .img-item[data-v-3f9da1c2]:not(.add){position:relative;text-align:center;border:2px dashed gray;border-radius:15px 0;overflow:hidden}.uploader .img-item:not(.add) img[data-v-3f9da1c2]{text-align:center;max-width:100%}@media (min-width:992px){.uploader .img-item:not(.add) img[data-v-3f9da1c2]{height:100px}}@media (min-width:768px) and (max-width:991.98px){.uploader .img-item:not(.add) img[data-v-3f9da1c2]{height:130px}}@media (max-width:767.98px){.uploader .img-item:not(.add) img[data-v-3f9da1c2]{height:100px}}.uploader .img-item:not(.add) a.delete[data-v-3f9da1c2]{position:absolute;top:0;right:0;color:#fff!important;background:red;padding:1px;text-align:center;width:20px;height:20px;font-size:13px}.uploader .img-item:not(.add) .size[data-v-3f9da1c2]{position:absolute;width:100%;left:0;bottom:0;background:#808080d6;border-radius:0 0 15px 0;color:#fff;font-weight:700}.uploader .add[data-v-3f9da1c2]{cursor:pointer;border:2px dashed gray;border-radius:15px 0;display:flex;align-items:center}@media (min-width:992px){.uploader .add[data-v-3f9da1c2]{height:100px}}@media (min-width:768px) and (max-width:991.98px){.uploader .add[data-v-3f9da1c2]{height:130px}}@media (max-width:767.98px){.uploader .add[data-v-3f9da1c2]{height:100px}}.uploader .add img[data-v-3f9da1c2]{width:30%;margin:0 auto}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-3f9da1c2";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component("file-uploader", component);
}

var plugin = {
  install: install
};

var GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

component.install = install;

export default component;
