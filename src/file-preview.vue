<template>
  <div class="uploader-mb-4">
    <div class="uploader-flex uploader-flex-wrap">
      <div
          v-for="file in files"
          :title="file.file_name"
          class="item uploader-flex uploader-relative uploader-overflow-hidden uploader-items-center uploader-justify-center uploader-m-2 uploader-w-32 uploader-h-32 uploader-border-2 uploader-border-dashed uploader-rounded-md uploader-border-gray-500 uploader-text-gray-500 focus:uploader-outline-none">
        <!-- Preview -->
        <img :src="file.preview"
             @click.prevent="preview = file"
             class="uploader-absolute uploader-w-full uploader-h-full uploader-object-contain uploader-cursor-pointer" alt="preview">

        <span
            class="uploader-font-sans uploader-absolute uploader-w-full uploader-flex uploader-justify-center uploader-bg-gray-900 uploader-text-white uploader-text-sm uploader-bottom-0">
          {{ file.human_readable_size }}
        </span>
      </div>
    </div>


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
    media: {
      required: false,
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      files: this.media || [],
      preview: null,
    }
  },
  created() {
    const handleEscape = e => {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.preview = null;
      }
    }
    document.addEventListener('keydown', handleEscape);

  }
}
</script>
<style scoped src="../dist/uploader.css"></style>