<script setup lang="ts">
const description = (document.querySelector("meta[name=description]") as HTMLMetaElement)?.content;
</script>

<template>
  <div class="modal fade" id="aboutModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-bottom-0">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body pt-0">
          <h1 class="text-center">Event Storm</h1>
          <p v-text="description" class="text-center"></p>
          <a href="https://github.com/vanillajonathan/eventstorm" target="_blank">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</template>
