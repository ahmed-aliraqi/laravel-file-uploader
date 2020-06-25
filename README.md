# Laravel Media File Uploader

> This plugin register vue component to upload files using laravel-media-library.

#### Installation
```bash
npm i laravel-media-file-uploader
```
#### Register Component
```js
// app.js

import FileUploader from 'laravel-media-file-uploader';

Vue.use(FileUploader);
```
#### Usage
```blade
<file-uploader :media="{{ $files ?? '[]' }}"
               :max="1"
               collection="avatars"
               :tokens="{{ json_encode(old('media', [])) }}"
               label="Upload Avatar"
               notes="Supported types: jpeg, png,jpg,gif"
               accept="image/jpeg,image/png,image/jpg,image/gif"
></file-uploader>
```
> the `$files` variable contains the `MediaResource` instance from `ahmed-aliraqi/laravel-media-uploader`.