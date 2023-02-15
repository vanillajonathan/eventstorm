<script setup lang="ts">
import { NodeType } from "../shared"
import type { Node } from "../shared"

defineEmits<{
  (e: 'deleteNode', node: Node): void
  (e: 'nodeSelected', nodeType: NodeType): void
  (e: 'tilt', node: Node): void
}>()

defineProps<{
  node: Node;
}>()
</script>

<template>
  <div class="modal modal-sm" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="dropdown-menu position-static show">
            <h6 class="dropdown-header">Actions</h6>
            <button type="button" class="dropdown-item" data-bs-dismiss="modal" @click="$emit('tilt', node)"><i class="bi bi-arrow-counterclockwise me-1"></i> Tilt</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#renameNodeModal"><i class="bi bi-pen me-1"></i> Rename</button>
            <button type="button" class="dropdown-item" data-bs-dismiss="modal" @click="$emit('deleteNode', node)"><i class="bi bi-trash me-1"></i> Delete</button>
            <h6 class="dropdown-header">Stickers</h6>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.Actor)"><i class="bi bi-sticky-fill me-1 node-actor"></i> Add Actor</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.Aggregate)"><i class="bi bi-sticky-fill me-1 node-aggregate"></i> Add Aggregate</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.BusinessProcess)"><i class="bi bi-sticky-fill me-1 node-process"></i> Add Business Processes</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.Command)"><i class="bi bi-sticky-fill me-1 node-command"></i> Add Command</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.Event)"><i class="bi bi-sticky-fill me-1 node-event"></i> Add Domain Event</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.Error)"><i class="bi bi-sticky-fill me-1 node-error"></i> Add Error</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.External)"><i class="bi bi-sticky-fill me-1 node-external"></i> Add External System</button>
            <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="$emit('nodeSelected', NodeType.View)"><i class="bi bi-sticky-fill me-1 node-view"></i> Add View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
