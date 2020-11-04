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
      default: 1
    },
    unlimited: {
      default: false
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
    },
    form: {
      required: false,
      default: false
    }
  },
  data: function data() {
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
  created: function created() {
    var this$1 = this;

    if (this.unlimited) {
      this.maximum = 0;
    }
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
        var filesCount = fileList.length > this.maximum - this.files.length
            ? this.maximum - this.files.length : fileList.length;
        this.inputFilesLength = filesCount;
        if (!this.unlimited) {
          this.pending = filesCount;
        } else {
          filesCount = fileList.length;
        }
        this.uploading = true;

        for (var i = 0; i < filesCount; i++) {
          await this.upload(fileList[i])
              .then(function (response) {
                if (!this$1.unlimited) {
                  this$1.pending--;
                }
                this$1.uploading = false;
                var file = response.data;
                this$1.files.push(file[0]);
                this$1.values.push(response.token);
                this$1.complete();
              })
              .catch(function (error) {
                if (!this$1.unlimited) {
                  this$1.pending--;
                }
                this$1.uploading = false;
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
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"uploader-mb-4"},[_c('label',[_vm._v(_vm._s(_vm.label))]),_vm._v(" "),_c('div',{staticClass:"uploader-flex uploader-flex-wrap"},[_vm._l((_vm.files),function(file){return _c('div',{staticClass:"item uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-md uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none",attrs:{"title":file.file_name}},[_c('img',{staticClass:"uploader-absolute uploader-w-full uploader-h-full uploader-object-contain",attrs:{"src":file.preview,"alt":"preview"}}),_vm._v(" "),_c('button',{staticClass:"uploader-absolute uploader-bg-red-600 uploader-text-white uploader-z-10 uploader-w-6 uploader-h-6 uploader-text-sm uploader-top-0 uploader-right-0 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none",attrs:{"title":"Delete"},on:{"click":function($event){$event.preventDefault();return _vm.deleteFile(file)}}},[_c('svg',{staticClass:"uploader-w-5 uploader-h-5",attrs:{"fill":"none","stroke":"currentColor","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"}})])]),_vm._v(" "),_c('button',{staticClass:"uploader-absolute uploader-bg-green-600 uploader-text-white uploader-z-10 uploader-w-6 uploader-h-6 uploader-text-sm uploader-top-0 uploader-left-0 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none",attrs:{"title":"Show"},on:{"click":function($event){$event.preventDefault();_vm.preview = file.preview;}}},[_c('svg',{staticClass:"uploader-w-5 uploader-h-5",attrs:{"fill":"none","stroke":"currentColor","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"}})])]),_vm._v(" "),_c('span',{staticClass:"uploader-font-sans uploader-absolute uploader-w-full uploader-flex uploader-justify-center uploader-bg-gray-900 uploader-text-white uploader-text-sm uploader-bottom-0"},[_vm._v("\n        "+_vm._s(file.human_readable_size)+"\n      ")])])}),_vm._v(" "),_vm._l(((_vm.maximum - _vm.files.length < 0 ? 0 : _vm.maximum - _vm.files.length)),function(i){return (!_vm.unlimited)?_c('label',{staticClass:"item uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-xl uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none hover:uploader-bg-gray-100 uploader-cursor-pointer"},[_c('input',{ref:"file",refInFor:true,staticClass:"uploader-hidden",attrs:{"type":"file","accept":_vm.accept,"multiple":_vm.maximum > 1},on:{"change":_vm.readUrl}}),_vm._v(" "),(i <= _vm.pending)?_c('svg',{staticClass:"uploader-animate-spin uploader-h-8 uploader-w-8 uploader-text-gray-500",attrs:{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24"}},[_c('circle',{staticClass:"uploader-opacity-50",attrs:{"cx":"12","cy":"12","r":"10","stroke":"currentColor","stroke-width":"4"}}),_vm._v(" "),_c('path',{staticClass:"uploader-opacity-75",attrs:{"fill":"currentColor","d":"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"}})]):_c('svg',{staticClass:"uploader-w-12 uploader-h-12",attrs:{"fill":"none","stroke":"currentColor","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"}})])]):_vm._e()}),_vm._v(" "),(_vm.unlimited)?_c('label',{staticClass:"uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-xl uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none hover:uploader-bg-gray-100 uploader-cursor-pointer"},[_c('input',{ref:"file",staticClass:"uploader-hidden",attrs:{"type":"file","accept":_vm.accept,"multiple":true},on:{"change":_vm.readUrl}}),_vm._v(" "),(_vm.uploading)?_c('svg',{staticClass:"uploader-animate-spin uploader-h-8 uploader-w-8 uploader-text-gray-500",attrs:{"xmlns":"http://www.w3.org/2000/svg","fill":"none","viewBox":"0 0 24 24"}},[_c('circle',{staticClass:"uploader-opacity-50",attrs:{"cx":"12","cy":"12","r":"10","stroke":"currentColor","stroke-width":"4"}}),_vm._v(" "),_c('path',{staticClass:"uploader-opacity-75",attrs:{"fill":"currentColor","d":"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"}})]):_c('svg',{staticClass:"uploader-w-12 uploader-h-12",attrs:{"fill":"none","stroke":"currentColor","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"}})])]):_vm._e()],2),_vm._v(" "),_vm._l((_vm.values),function(token){return _c('input',{attrs:{"type":"hidden","form":_vm.form,"name":"media[]"},domProps:{"value":token}})}),_vm._v(" "),_c('small',{staticClass:"uploader-text-gray-600"},[_vm._v(_vm._s(_vm.notes))]),_vm._v(" "),(_vm.preview)?_c('div',{staticClass:"uploader-overflow-auto uploader-fixed uploader-flex uploader-items-start uploader-pt-10 uploader-justify-center uploader-w-full uploader-h-full uploader-top-0 uploader-left-0 uploader-bg-black uploader-bg-opacity-75 uploader-z-999999999"},[_c('button',{staticClass:"uploader-absolute uploader-text-white uploader-z-10 uploader-w-8 uploader-h-8 uploader-text-sm uploader-top-0 uploader-right-0 uploader-flex uploader-items-center uploader-justify-center focus:uploader-outline-none",on:{"click":function($event){$event.preventDefault();_vm.preview = null;}}},[_c('svg',{staticClass:"uploader-w-8 uploader-h-8",attrs:{"fill":"none","stroke":"currentColor","viewBox":"0 0 24 24","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2","d":"M6 18L18 6M6 6l12 12"}})])]),_vm._v(" "),_c('div',{staticClass:"uploader-w-2/3"},[_c('img',{staticClass:"uploader-bg-white uploader-object-contain uploader-w-full uploader-p-1 uploader-h-300-px",attrs:{"src":_vm.preview,"alt":"preview"}}),_vm._v(" "),_c('div',{staticClass:"uploader-flex uploader-items-center uploader-justify-start uploader-overflow-auto uploader-h-32 uploader-w-full"},_vm._l((_vm.files),function(file){return _c('img',{staticClass:"uploader-opacity-50 uploader-cursor-pointer hover:uploader-opacity-100 uploader-object-contain uploader-bg-white uploader-mx-2 uploader-w-20 uploader-h-20 uploader-border uploader-border-gray-400",attrs:{"src":file.preview},on:{"mouseover":function($event){_vm.preview = file.preview;}}})}),0)])]):_vm._e()],2)};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-e683bc68_0", { source: "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html[data-v-e683bc68]{line-height:1.15;-webkit-text-size-adjust:100%}body[data-v-e683bc68]{margin:0}main[data-v-e683bc68]{display:block}h1[data-v-e683bc68]{font-size:2em;margin:.67em 0}hr[data-v-e683bc68]{box-sizing:content-box;height:0;overflow:visible}pre[data-v-e683bc68]{font-family:monospace,monospace;font-size:1em}a[data-v-e683bc68]{background-color:transparent}abbr[title][data-v-e683bc68]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b[data-v-e683bc68],strong[data-v-e683bc68]{font-weight:bolder}code[data-v-e683bc68],kbd[data-v-e683bc68],samp[data-v-e683bc68]{font-family:monospace,monospace;font-size:1em}small[data-v-e683bc68]{font-size:80%}sub[data-v-e683bc68],sup[data-v-e683bc68]{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub[data-v-e683bc68]{bottom:-.25em}sup[data-v-e683bc68]{top:-.5em}img[data-v-e683bc68]{border-style:none}button[data-v-e683bc68],input[data-v-e683bc68],optgroup[data-v-e683bc68],select[data-v-e683bc68],textarea[data-v-e683bc68]{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button[data-v-e683bc68],input[data-v-e683bc68]{overflow:visible}button[data-v-e683bc68],select[data-v-e683bc68]{text-transform:none}[type=button][data-v-e683bc68],[type=submit][data-v-e683bc68],button[data-v-e683bc68]{-webkit-appearance:button}[type=button][data-v-e683bc68]::-moz-focus-inner,[type=submit][data-v-e683bc68]::-moz-focus-inner,button[data-v-e683bc68]::-moz-focus-inner{border-style:none;padding:0}[type=button][data-v-e683bc68]:-moz-focusring,[type=submit][data-v-e683bc68]:-moz-focusring,button[data-v-e683bc68]:-moz-focusring{outline:1px dotted ButtonText}fieldset[data-v-e683bc68]{padding:.35em .75em .625em}legend[data-v-e683bc68]{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress[data-v-e683bc68]{vertical-align:baseline}textarea[data-v-e683bc68]{overflow:auto}details[data-v-e683bc68]{display:block}summary[data-v-e683bc68]{display:list-item}template[data-v-e683bc68]{display:none}[hidden][data-v-e683bc68]{display:none}blockquote[data-v-e683bc68],dd[data-v-e683bc68],dl[data-v-e683bc68],figure[data-v-e683bc68],h1[data-v-e683bc68],h2[data-v-e683bc68],h3[data-v-e683bc68],h4[data-v-e683bc68],h5[data-v-e683bc68],h6[data-v-e683bc68],hr[data-v-e683bc68],p[data-v-e683bc68],pre[data-v-e683bc68]{margin:0}button[data-v-e683bc68]{background-color:transparent;background-image:none}button[data-v-e683bc68]:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}fieldset[data-v-e683bc68]{margin:0;padding:0}ol[data-v-e683bc68],ul[data-v-e683bc68]{list-style:none;margin:0;padding:0}html[data-v-e683bc68]{font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";line-height:1.5}*[data-v-e683bc68],[data-v-e683bc68]::after,[data-v-e683bc68]::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e2e8f0}hr[data-v-e683bc68]{border-top-width:1px}img[data-v-e683bc68]{border-style:solid}textarea[data-v-e683bc68]{resize:vertical}input[data-v-e683bc68]::-moz-placeholder,textarea[data-v-e683bc68]::-moz-placeholder{color:#a0aec0}input[data-v-e683bc68]:-ms-input-placeholder,textarea[data-v-e683bc68]:-ms-input-placeholder{color:#a0aec0}input[data-v-e683bc68]::placeholder,textarea[data-v-e683bc68]::placeholder{color:#a0aec0}button[data-v-e683bc68]{cursor:pointer}table[data-v-e683bc68]{border-collapse:collapse}h1[data-v-e683bc68],h2[data-v-e683bc68],h3[data-v-e683bc68],h4[data-v-e683bc68],h5[data-v-e683bc68],h6[data-v-e683bc68]{font-size:inherit;font-weight:inherit}a[data-v-e683bc68]{color:inherit;text-decoration:inherit}button[data-v-e683bc68],input[data-v-e683bc68],optgroup[data-v-e683bc68],select[data-v-e683bc68],textarea[data-v-e683bc68]{padding:0;line-height:inherit;color:inherit}code[data-v-e683bc68],kbd[data-v-e683bc68],pre[data-v-e683bc68],samp[data-v-e683bc68]{font-family:Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace}audio[data-v-e683bc68],canvas[data-v-e683bc68],embed[data-v-e683bc68],iframe[data-v-e683bc68],img[data-v-e683bc68],object[data-v-e683bc68],svg[data-v-e683bc68],video[data-v-e683bc68]{display:block;vertical-align:middle}img[data-v-e683bc68],video[data-v-e683bc68]{max-width:100%;height:auto}.uploader-bg-black[data-v-e683bc68]{--bg-opacity:1;background-color:#000;background-color:rgba(0,0,0,var(--bg-opacity))}.uploader-bg-white[data-v-e683bc68]{--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity))}.uploader-bg-gray-900[data-v-e683bc68]{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26,32,44,var(--bg-opacity))}.uploader-bg-red-600[data-v-e683bc68]{--bg-opacity:1;background-color:#e53e3e;background-color:rgba(229,62,62,var(--bg-opacity))}.uploader-bg-green-600[data-v-e683bc68]{--bg-opacity:1;background-color:#38a169;background-color:rgba(56,161,105,var(--bg-opacity))}.hover\\:uploader-bg-gray-100[data-v-e683bc68]:hover{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247,250,252,var(--bg-opacity))}.uploader-bg-opacity-75[data-v-e683bc68]{--bg-opacity:0.75}.uploader-border-gray-400[data-v-e683bc68]{--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity))}.uploader-border-gray-500[data-v-e683bc68]{--border-opacity:1;border-color:#a0aec0;border-color:rgba(160,174,192,var(--border-opacity))}.uploader-rounded-md[data-v-e683bc68]{border-radius:.375rem}.uploader-rounded-xl[data-v-e683bc68]{border-radius:.75rem}.uploader-border-dashed[data-v-e683bc68]{border-style:dashed}.uploader-border-2[data-v-e683bc68]{border-width:2px}.uploader-border[data-v-e683bc68]{border-width:1px}.uploader-cursor-pointer[data-v-e683bc68]{cursor:pointer}.uploader-flex[data-v-e683bc68]{display:flex}.uploader-hidden[data-v-e683bc68]{display:none}.uploader-flex-wrap[data-v-e683bc68]{flex-wrap:wrap}.uploader-items-start[data-v-e683bc68]{align-items:flex-start}.uploader-items-center[data-v-e683bc68]{align-items:center}.uploader-justify-start[data-v-e683bc68]{justify-content:flex-start}.uploader-justify-center[data-v-e683bc68]{justify-content:center}.uploader-font-sans[data-v-e683bc68]{font-family:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\"}.uploader-h-5[data-v-e683bc68]{height:1.25rem}.uploader-h-6[data-v-e683bc68]{height:1.5rem}.uploader-h-8[data-v-e683bc68]{height:2rem}.uploader-h-12[data-v-e683bc68]{height:3rem}.uploader-h-20[data-v-e683bc68]{height:5rem}.uploader-h-32[data-v-e683bc68]{height:8rem}.uploader-h-full[data-v-e683bc68]{height:100%}.uploader-h-300-px[data-v-e683bc68]{height:300px}.uploader-text-sm[data-v-e683bc68]{font-size:.875rem}.uploader-m-2[data-v-e683bc68]{margin:.5rem}.uploader-mx-2[data-v-e683bc68]{margin-left:.5rem;margin-right:.5rem}.uploader-mb-4[data-v-e683bc68]{margin-bottom:1rem}.uploader-object-contain[data-v-e683bc68]{-o-object-fit:contain;object-fit:contain}.uploader-opacity-50[data-v-e683bc68]{opacity:.5}.uploader-opacity-75[data-v-e683bc68]{opacity:.75}.hover\\:uploader-opacity-100[data-v-e683bc68]:hover{opacity:1}.focus\\:uploader-outline-none[data-v-e683bc68]:focus{outline:2px solid transparent;outline-offset:2px}.uploader-overflow-auto[data-v-e683bc68]{overflow:auto}.uploader-overflow-hidden[data-v-e683bc68]{overflow:hidden}.uploader-p-1[data-v-e683bc68]{padding:.25rem}.uploader-pt-10[data-v-e683bc68]{padding-top:2.5rem}.uploader-fixed[data-v-e683bc68]{position:fixed}.uploader-absolute[data-v-e683bc68]{position:absolute}.uploader-relative[data-v-e683bc68]{position:relative}.uploader-top-0[data-v-e683bc68]{top:0}.uploader-right-0[data-v-e683bc68]{right:0}.uploader-bottom-0[data-v-e683bc68]{bottom:0}.uploader-left-0[data-v-e683bc68]{left:0}.uploader-text-white[data-v-e683bc68]{--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity))}.uploader-text-gray-500[data-v-e683bc68]{--text-opacity:1;color:#a0aec0;color:rgba(160,174,192,var(--text-opacity))}.uploader-text-gray-600[data-v-e683bc68]{--text-opacity:1;color:#718096;color:rgba(113,128,150,var(--text-opacity))}.uploader-w-5[data-v-e683bc68]{width:1.25rem}.uploader-w-6[data-v-e683bc68]{width:1.5rem}.uploader-w-8[data-v-e683bc68]{width:2rem}.uploader-w-12[data-v-e683bc68]{width:3rem}.uploader-w-20[data-v-e683bc68]{width:5rem}.uploader-w-32[data-v-e683bc68]{width:8rem}.uploader-w-2\\/3[data-v-e683bc68]{width:66.666667%}.uploader-w-full[data-v-e683bc68]{width:100%}.uploader-z-999999999[data-v-e683bc68]{z-index:999999999}@-webkit-keyframes spin-data-v-e683bc68{to{transform:rotate(360deg)}}@keyframes spin-data-v-e683bc68{to{transform:rotate(360deg)}}@-webkit-keyframes ping-data-v-e683bc68{100%,75%{transform:scale(2);opacity:0}}@keyframes ping-data-v-e683bc68{100%,75%{transform:scale(2);opacity:0}}@-webkit-keyframes pulse-data-v-e683bc68{50%{opacity:.5}}@keyframes pulse-data-v-e683bc68{50%{opacity:.5}}@-webkit-keyframes bounce-data-v-e683bc68{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}@keyframes bounce-data-v-e683bc68{0%,100%{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:none;-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}.uploader-animate-spin[data-v-e683bc68]{-webkit-animation:spin-data-v-e683bc68 1s linear infinite;animation:spin-data-v-e683bc68 1s linear infinite}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-e683bc68";
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
