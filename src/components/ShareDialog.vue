<script setup lang="ts">
defineProps<{
  url?: String
}>()
</script>

<template>
  <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Share</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="url" class="col-form-label">Link:</label>
              <input type="url" class="form-control" id="url" :value="url" readonly>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
