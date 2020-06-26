# Laravel File Uploader

> This plugin register vue component to upload files using laravel-media-library.

#### Requirements
> You should install [ahmed-aliraqi/laravel-media-uploader](https://github.com/ahmed-aliraqi/laravel-media-uploader) composer package to work successfully.

#### Installation
```bash
npm i laravel-file-uploader --save-dev
```
#### Basic Usage
```html
<div id="app">
    <file-uploader
            :max="1"
            collection="avatars"
            :tokens="{{ json_encode(old('media', [])) }}"
            label="Upload Avatar"
            notes="Supported types: jpeg, png,jpg,gif"
            accept="image/jpeg,image/png,image/jpg,image/gif"
    ></file-uploader>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://unpkg.com/laravel-file-uploader@1.0.5/dist/file-uploader.min.js"></script>
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
               :max="1"
               collection="avatars"
               :tokens="{{ json_encode(old('media', [])) }}"
               label="Upload Avatar"
               notes="Supported types: jpeg, png,jpg,gif"
               accept="image/jpeg,image/png,image/jpg,image/gif"
></file-uploader>
```
##### Attributes
| Attribute |Rule | Type  |Description |
|--|--|--|--|
| media | optional - default: `[]`  |array | used to display an existing files  |
| max|optional - default:`12`| int| the maximum uploaded files - if `1` will not me multiple select|
|accept| optional - default: `*`| string| the accepted mime types|
|notes| optional - default `null`| string| the help-block that will be displayed under the files|
|label| optional - default `null`| string| the label of the uploader|
|collection| optional - default `default`|string| the media library collection that the file will store in|
|tokens| optional - default: `[]`|array|the recently uploaded files tokens, used to display recently uploaded files in validation case|