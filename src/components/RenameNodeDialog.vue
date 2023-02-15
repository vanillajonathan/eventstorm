<script setup lang="ts">
import { ref, watch } from "vue"
import type { Node } from "../shared"

defineEmits<{
  (e: 'renameNode', node: Node, input: string): void
}>()

const props = defineProps<{
  node: Node;
}>()

const input = ref<string>("")

watch(props, async (newProps) => {
  input.value = newProps.node.name
})
</script>

<template>
  <div class="modal modal-sm" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Rename
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="rename-form" @submit.prevent="$emit('renameNode', node, input)">
            <label for="rename-name" class="col-form-label">Name</label>
            <input type="text" class="form-control" id="rename-name" list="suggestions" required
              v-model.trim="input"
            />
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" form="rename-form"
            data-bs-dismiss="modal"
            :disabled="input === ''"
          >
            Rename
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
