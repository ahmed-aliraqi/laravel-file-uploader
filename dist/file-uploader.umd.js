(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global['file-uploader'] = global['file-uploader'] || {}));
}(this, (function (exports) { 'use strict';

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
                default: []
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
                default: '',
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
                axios.get('/api/media', {
                    params: {
                        tokens: this.tokens
                    }
                }).then(function (response) {
                    this$1.files = response.data.data;
                });
            }
        },
        methods: {
            readUrl: async function readUrl(event) {
                var this$1 = this;

                this.$emit('beforeUpload');
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

                                var file = response.data.data;

                                this$1.files.push(file[0]);

                                this$1.values.push(response.data.token);

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
                    axios.post('/api/media/upload', formData)
                        .then(function (response) {
                            resolve(response);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                });
            },
            deleteFile: function deleteFile(file) {
                var this$1 = this;

                if (file.data) {
                    return;
                }
                axios.delete(file.links.delete.href).then(function () {
                    this$1.$delete(this$1.files, this$1.files.indexOf(file));
                });
                this.$delete(this.values, this.files.indexOf(file));
                this.inputFilesLength--;
                this.complete();
            },
            beforeUploading: function beforeUploading() {
                $('[type=submit]').attr('disabled', 'disabled');
            },
            complete: function complete() {
                if (this.values.length >= this.inputFilesLength) {
                    $('[type=submit]').removeAttr('disabled');
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
    var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"form-group"},[_c('label',[_vm._v(_vm._s(_vm.label))]),_vm._v(" "),_c('div',{staticClass:"row uploader"},[_vm._l((_vm.files),function(file){return _c('div',{staticClass:"col-6 col-sm-4 col-md-3 px-3 col-lg-2"},[_c('div',{staticClass:"img-item mw-100 mb-4",attrs:{"title":file.file_name}},[_c('img',{staticClass:"mw-100",attrs:{"src":file.preview,"alt":""}}),_vm._v(" "),_c('a',{staticClass:"delete",attrs:{"href":"#","title":"Delete File"},on:{"click":function($event){$event.preventDefault();return _vm.deleteFile(file)}}},[_c('div',{staticClass:"fas fa-times"})]),_vm._v(" "),_c('span',{staticClass:"size"},[_vm._v(_vm._s(file.human_readable_size))])])])}),_vm._v(" "),_vm._l(((_vm.max - _vm.files.length < 0 ? 0 : _vm.max - _vm.files.length)),function(i){return _c('div',{staticClass:"col-6 col-sm-4 col-md-3 px-3 col-lg-2"},[_c('label',{staticClass:"img-item add mw-100 mb-4"},[_c('input',{ref:"file",refInFor:true,staticClass:"d-none",attrs:{"type":"file","accept":_vm.accept,"multiple":_vm.max > 1},on:{"change":_vm.readUrl}}),_vm._v(" "),(i <= _vm.pending)?_c('img',{staticClass:"mw-100",attrs:{"src":"/images/loading-100.gif","alt":""}}):_c('img',{staticClass:"mw-100",attrs:{"src":"/images/plus-circle-solid.svg","alt":""}})])])})],2),_vm._v(" "),_vm._l((_vm.values),function(token){return _c('input',{attrs:{"type":"hidden","name":"media[]"},domProps:{"value":token}})}),_vm._v(" "),_c('small',{staticClass:"text-muted"},[_vm._v(_vm._s(_vm.notes))])],2)};
    var __vue_staticRenderFns__ = [];

      /* style */
      var __vue_inject_styles__ = function (inject) {
        if (!inject) { return }
        inject("data-v-eb342d9a_0", { source: ".uploader .img-item[data-v-eb342d9a]:not(.add){position:relative;text-align:center;border:2px dashed grey;border-radius:0 15px;overflow:hidden}.uploader .img-item:not(.add) img[data-v-eb342d9a]{text-align:center;max-width:100%}@media (min-width:992px){.uploader .img-item:not(.add) img[data-v-eb342d9a]{height:100px}}@media (min-width:768px) and (max-width:991.98px){.uploader .img-item:not(.add) img[data-v-eb342d9a]{height:130px}}@media (max-width:767.98px){.uploader .img-item:not(.add) img[data-v-eb342d9a]{height:100px}}.uploader .img-item:not(.add) a.delete[data-v-eb342d9a]{position:absolute;top:0;left:0;color:#fff!important;background:red;padding:1px;text-align:center;width:20px;height:20px;font-size:13px}.uploader .img-item:not(.add) .size[data-v-eb342d9a]{position:absolute;width:100%;right:0;bottom:0;background:hsla(0,0%,50.2%,.84);border-radius:0 0 0 15px;color:#fff;font-weight:700}.uploader .add[data-v-eb342d9a]{cursor:pointer;border:2px dashed grey;border-radius:0 15px;display:flex;align-items:center}@media (min-width:992px){.uploader .add[data-v-eb342d9a]{height:100px}}@media (min-width:768px) and (max-width:991.98px){.uploader .add[data-v-eb342d9a]{height:130px}}@media (max-width:767.98px){.uploader .add[data-v-eb342d9a]{height:100px}}.uploader .add img[data-v-eb342d9a]{width:30%;margin:0 auto}", map: undefined, media: undefined });

      };
      /* scoped */
      var __vue_scope_id__ = "data-v-eb342d9a";
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

    exports.default = component;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
