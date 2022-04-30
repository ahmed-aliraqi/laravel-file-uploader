
# Laravel File Uploader

> This plugin register vue component to upload files using laravel-media-library.

![Uploader](https://github.com/ahmed-aliraqi/laravel-file-uploader/blob/master/screenshots/uploader-v2.gif?raw=true)


#### Requirements
> You should install [ahmed-aliraqi/laravel-media-uploader](https://github.com/ahmed-aliraqi/laravel-media-uploader) composer package to work successfully.

#### Installation
```bash  
npm i laravel-file-uploader --save-dev  
```  
#### Basic Usage
```blade  
<div id="app">  
    <file-uploader  
            :unlimited="true"  
            collection="avatars"  
            name="media"  
            :tokens="{{ json_encode(old('media', [])) }}"  
            label="Upload Avatar"  
            notes="Supported types: jpeg, png,jpg,gif"
            :display-validation-messages="true"  
    ></file-uploader>  
</div>  
  
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>  
<script src="https://cdn.jsdelivr.net/npm/laravel-file-uploader"></script>  
<script>  
  new Vue({  
    el: '#app'  
  })  
</script>  
```  
#### Configure With Laravel Ui
```js  
// app.js  
  
import FileUploader from 'laravel-file-uploader';  
  
Vue.use(FileUploader);  
```  
#### Usage
```blade  
<file-uploader :media="{{ $user->getMediaResource('avatars') }}"  
               :unlimited="true"  
               collection="avatars"  
               name="media"  
               :tokens="{{ json_encode(old('media', [])) }}"  
               label="Upload Avatar"  
               notes="Supported types: jpeg, png,jpg,gif"  
               accept="image/jpeg,image/png,image/jpg,image/gif"  
></file-uploader>  
```  

#### Working with images
> You optimize images size before uploading by adding `max-{width|height}` attribute and will upload the image as a base64 file:
```blade  
<file-uploader :media="{{ $user->getMediaResource('avatars') }}"  
               :unlimited="true"  
               collection="avatars"  
               name="media"  
               max-width="800"  
               max-height="800"  
               :tokens="{{ json_encode(old('media', [])) }}"  
               label="Upload Avatar"  
               notes="Supported types: jpeg, png,jpg,gif"  
               accept="image/jpeg,image/png,image/jpg,image/gif"  
></file-uploader>  
```  
##### Attributes
| Attribute |Rule | Type  |Description |  
|--|--|--|--|  
| name | optional - default: `media` |string | the name of tokens fields  |  
| media | optional - default: `[]` |array | used to display an existing files  |  
| unlimited |optional - default:`false`| boolean| upload unlimited files - if let it `false` will not be multiple select|  
| max|optional - default:`12`| int| the maximum uploaded files - if `1` will not me multiple select|  
|accept| optional - default: `*`| string| the accepted mime types|  
|form| optional - default: `false`| string| the form id of the uploaded media|  
|notes| optional - default `null`| string| the help-block that will be displayed under the files|  
|label| optional - default `null`| string| the label of the uploader|  
|collection| optional - default `default`|string| the media library collection that the file will store in|  
|tokens| optional - default: `[]`|array|the recently uploaded files tokens, used to display recently uploaded files in validation case|  
|name| optional - default: `null`|array|the input name of the uploader|  
|max-width| optional - default: `1200`|string|The maximum width of uploaded image|  
|max-height| optional - default: `1200`|string|The maximum height of uploaded image|
|display-validation-messages| optional - default: `false`|boolean|Used for displaying validation messages|

##### Use With Vue Or SPA Applications
```html  
<file-uploader   
    name="media"  
    v-model="tokens"  
></file-uploader>  
  
<script>  
    new Vue({  
        el: '#app',  
        data() {  
            return {  
                tokens: []  
            }  
        }  
    })  
</script>  
```  

##### Events
* beforeUpload
* complete
```html  
<file-uploader   
   label="Upload File"   
   @beforeUpload="handleBeforeUpload()"  
   @complete="handleComplete()"  
></file-uploader>  
```  
* upload-error
```html  
<file-uploader   
   label="Upload File"   
   @beforeUpload="handleBeforeUpload()"  
   @upload-error="errorHandler"
></file-uploader>  
<script>  
    new Vue({  
        el: '#app',  
        methods: {  
		  errorHandler(error) {  
			  console.log(error.file) // the file object  
			  console.log(error.response) // the error response from the server  
			  console.log(error.status) // the error status code from the server  
		  }  
		}
    })  
</script> 
```  

##### File Preview Component
This component used to preview uploaded media (images, audios, videos).
```blade  
<file-preview :media="{{ $user->getMediaResource('avatars') }}"></file-preview>  
```  

> **Note:**  
> Do not forget to store the laravel `csrf` token in an HTML `meta` tag:
```blade  
<meta name="csrf-token" content="{{ csrf_token() }}">  
```
