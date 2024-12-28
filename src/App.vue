<script setup lang="ts">
// https://miro.com/miroverse/event-storming/
// Add legend
// Smaller size for user
// Views = Read models
import { ref, computed, onMounted } from 'vue'
import * as bootstrap from "bootstrap"
import AboutDialog from './components/AboutDialog.vue'
import CreateNodeDialog from './components/CreateNodeDialog.vue'
import ContextDialog from './components/ContextDialog.vue'
import KeyboardShortcutsDialog from './components/KeyboardShortcutsDialog.vue'
import RenameNodeDialog from './components/RenameNodeDialog.vue'
import { downloadImage, downloadJSON, downloadSVGImage } from './download'
import type { Node } from './shared'
import { NodeType } from './shared'
import bankExample from './assets/bankExample.json'
import serviceExample from './assets/serviceExample.json'
import shopExample from './assets/shopExample.json'

const nodes = ref<Node[]>([])
const contextualNode = ref<Node | null>(null)
const dragOffsetX = ref<number | null>(null)
const dragOffsetY = ref<number | null>(null)
const filePickerEl = ref<HTMLInputElement | null>(null)
const panX = ref<number>(0)
const panY = ref<number>(0)
const showActors = ref<boolean>(true)
const showAggregates = ref<boolean>(true)
const showBusinessProcesses = ref<boolean>(true)
const showCommands = ref<boolean>(true)
const showErrors = ref<boolean>(true)
const showEvents = ref<boolean>(true)
const showExternals = ref<boolean>(true)
const showViews = ref<boolean>(true)
const svgEl = ref<SVGElement | null>(null)
const zoom = ref<number>(1)
const nodeType = ref<NodeType>(NodeType.Event)
let activeNode: Node | null = null

let links: { source: string, target: string }[] = []
links.push({source: "Foo", target: "Cat"})

const theme = localStorage.getItem("theme") ?? "dark" 
document.documentElement.dataset.bsTheme = theme

onMounted(() => {
  if (window.location.hash !== "") {
    nodes.value = JSON.parse(atob(window.location.hash.substring(1)));
  }

  document.addEventListener("keydown", e => {
    if (e.code === 'NumpadAdd') {
      if (zoom.value < 6) {
        zoom.value += 0.10;
      }
    }
    else if (e.code === 'NumpadSubtract') {
      if (zoom.value > 0) {
        zoom.value -= 0.10;
      }
    }
    else if (e.ctrlKey && e.code === 'Digit0') {
      zoom.value = 1;
    }
  });

  addEventListener('wheel', e => {
    if (e.deltaY > 0) {
      if (zoom.value >= 0) {
        zoom.value -= 0.10;
      }
    } else {
      if (zoom.value < 2) {
        zoom.value += 0.10;
      }
    }
  });
});

const cursor = computed(() => {
  return `cursor: ${dragOffsetX.value ? 'grabbing' : 'grab'}`
})

function share() {
  console.log(btoa(JSON.stringify(nodes.value)))
}

function addNode(name: string, type: NodeType): void {
  nodes.value.push({id: crypto.randomUUID(), name, tilted: false, type, x: 50, y: 50})
}

function download(): void {
  downloadImage(svgEl.value!, "png");
}

function getColor(node: Node): string {
  switch (node.type) {
    case NodeType.Actor:
      return "#fff2c0";
    case NodeType.Aggregate:
      return "#ffd42d";
    case NodeType.BusinessProcess:
      return "#c391c2";
    case NodeType.Command:
      return "#3399fe";
    case NodeType.Error:
      return "#ec4d4e";
    case NodeType.Event:
      return "#ff992a";
    case NodeType.External:
      return "#ff68b9";
    case NodeType.View:
      return "#5fc08b";
    default:
      throw new Error(`Unknown node type: ${node.type}.`)
  }
}

function handleImport() {
  const reader = new FileReader();
  reader.onloadend = () => {
    if (typeof reader.result === "string") {
      try {
        nodes.value = JSON.parse(reader.result) as Node[];
      } catch (e) {
        alert(e);
      }
    }
  };
  const file: File = filePickerEl.value!.files![0];
  reader.readAsText(file);
}

function onContextMenu(e: MouseEvent, node: Node): void {
  e.preventDefault()
  activeNode = null
  contextualNode.value = node
  setTimeout(() => {
    const modal = new bootstrap.Modal('#contextModal')
    modal.show()
  }, 0)
}

function onDoubleClick(_e: MouseEvent, node: Node): void {
  contextualNode.value = node
  setTimeout(() => {
    const modal = new bootstrap.Modal('#renameNodeModal')
    modal.show()
  }, 0)
}

function onMouseDown(e: MouseEvent | TouchEvent, node: Node): void {
  activeNode = node
  let offsetX = 0
  let offsetY = 0
  if (e.type === 'mousedown') {
    offsetX = (e as MouseEvent).offsetX
    offsetY = (e as MouseEvent).offsetY
  } else if (e.type === 'touchstart') {
    offsetX = (e as TouchEvent).touches[0].clientX
    offsetY = (e as TouchEvent).touches[0].clientY
  }
  dragOffsetX.value = offsetX - node.x
  dragOffsetY.value = offsetY - node.y
}

function onMouseUp(): void {
  activeNode = null;
  dragOffsetX.value = null
  dragOffsetY.value = null
}

function onMouseMove(e: MouseEvent | TouchEvent): void {
  if (e.type === 'mousemove' && (e as MouseEvent).buttons === 1 && e.ctrlKey) {
    panX.value = (e as MouseEvent).offsetX - dragOffsetX.value!
    panY.value = (e as MouseEvent).offsetY - dragOffsetY.value!
    return
  }
  if (activeNode) {
    let offsetX = 0
    let offsetY = 0
    if (e.type === 'mousemove') {
      offsetX = (e as MouseEvent).offsetX
      offsetY = (e as MouseEvent).offsetY
    } else if (e.type === 'touchmove') {
      offsetX = (e as TouchEvent).touches[0].clientX
      offsetY = (e as TouchEvent).touches[0].clientY
    }
    const node = activeNode;
    let posX = offsetX - dragOffsetX.value!
    let posY = offsetY - dragOffsetY.value!
    const gridSize = 16
    node!.x = Math.round(posX / gridSize) * gridSize
    node!.y = Math.round(posY / gridSize) * gridSize
    if (node!.x < 0) {
      node!.x = 0;
    }
    if (node!.y < 0) {
      node!.y = 0;
    }
  }
}

function showNode(node: Node): boolean {
  switch (node.type) {
    case NodeType.Actor:
      return showActors.value;
    case NodeType.Aggregate:
      return showAggregates.value;
    case NodeType.BusinessProcess:
      return showBusinessProcesses.value;
    case NodeType.Command:
      return showCommands.value;
    case NodeType.Error:
      return showErrors.value;
    case NodeType.Event:
      return showEvents.value;
    case NodeType.External:
      return showExternals.value;
    case NodeType.View:
      return showViews.value;
    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

function zoomIn(): void {
  zoom.value += 0.10;
}

function zoomOut(): void {
  zoom.value -= 0.10;
}
</script>

<template>
  <div class="flex-shrink-1">
    <nav class="navbar navbar-expand-sm bg-body-tertiary">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">Event Storm</span>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <div class="btn-group me-2">
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Event">
                Add Event
              </button>
              <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu">
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Actor"><i class="bi bi-sticky-fill node-actor"></i> Add Actor</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Aggregate"><i class="bi bi-sticky-fill node-aggregate"></i> Add Aggregate</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.BusinessProcess"><i class="bi bi-sticky-fill node-process"></i> Add Business Processes</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Command"><i class="bi bi-sticky-fill node-command"></i> Add Command</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Event"><i class="bi bi-sticky-fill node-event"></i> Add Domain Event</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.Error"><i class="bi bi-sticky-fill node-error"></i> Add Error</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.External"><i class="bi bi-sticky-fill node-external"></i> Add External System</button>
                <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#createNodeModal" @click="nodeType = NodeType.View"><i class="bi bi-sticky-fill node-view"></i> Add View</button>
              </ul>
            </div>
            <div class="dropdown">
              <button type="button" class="btn btn-secondary dropdown-toggle me-2" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                Show
              </button>
              <div class="dropdown-menu p-2">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-actors" v-model="showActors">
                  <label class="form-check-label text-nowrap" for="check-actors">
                    <i class="bi bi-sticky-fill node-actor"></i> Actors
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-processes" v-model="showAggregates">
                  <label class="form-check-label text-nowrap" for="check-processes">
                    <i class="bi bi-sticky-fill node-aggregate"></i> Aggregates
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-aggregates" v-model="showBusinessProcesses">
                  <label class="form-check-label text-nowrap" for="check-aggregates">
                    <i class="bi bi-sticky-fill node-process"></i>&nbsp;Business&nbsp;Processes
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-commands" v-model="showCommands">
                  <label class="form-check-label text-nowrap" for="check-commands">
                    <i class="bi bi-sticky-fill node-command"></i> Commands
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-events" v-model="showEvents">
                  <label class="form-check-label text-nowrap" for="check-events">
                    <i class="bi bi-sticky-fill node-event"></i> Domain Events
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-errors" v-model="showErrors">
                  <label class="form-check-label text-nowrap" for="check-errors">
                    <i class="bi bi-sticky-fill node-error"></i> Errors
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-externals" v-model="showExternals">
                  <label class="form-check-label text-nowrap" for="check-externals">
                    <i class="bi bi-sticky-fill node-external"></i> External Systems
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="check-views" v-model="showViews">
                  <label class="form-check-label" for="check-views">
                    <i class="bi bi-sticky-fill node-view"></i> Views
                  </label>
                </div>
              </div>
            </div>
            <div class="btn-group me-2" role="group" aria-label="Zooming">
              <button type="button" class="btn btn-secondary" @click="zoomIn" :disabled="zoom > 1.5">
                <i class="bi bi-zoom-in"></i>
              </button>
              <button type="button" class="btn btn-secondary" @click="zoomOut" :disabled="zoom < 0.5">
                <i class="bi bi-zoom-out"></i>
              </button>
            </div>
            <div class="dropdown">
              <button class="btn btn-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-three-dots"></i>
              </button>
              <ul class="dropdown-menu">
                <li><button type="button" class="dropdown-item" @click="filePickerEl?.click()">Open JSON...</button></li>
                <li><button type="button" class="dropdown-item" @click="downloadJSON(nodes)">Save JSON</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button type="button" class="dropdown-item" @click="download">Export as PNG</button></li>
                <li><button type="button" class="dropdown-item" @click="downloadSVGImage(svgEl!)">Export as SVG</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button type="button" class="dropdown-item" @click="share">Share</button></li>
                <li><button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#keyboardShortcutsModal">Keyboard Shortcuts</button></li>
                <li><button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#aboutModal">About Event Storm</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><h6 class="dropdown-header">Examples</h6></li>
                <li><button type="button" class="dropdown-item" @click="nodes = bankExample as Node[]">Bank</button></li>
                <li><button type="button" class="dropdown-item" @click="nodes = serviceExample as Node[]">Service</button></li>
                <li><button type="button" class="dropdown-item" @click="nodes = shopExample as Node[]">Shop</button></li>
              </ul>
            </div>
          </div>
      </div>
    </nav>
  </div>

  <svg style="width: 100%" class="p-2 h-100 user-select-none" @mouseup="activeNode = null" ref="svgEl"
    @mousemove="e => onMouseMove(e)"
    @touchmove="e => onMouseMove(e)">
    <g :transform="`scale(${zoom}) translate(${panX} ${panY})`">
      <g v-for="node in nodes" v-show="showNode(node)" :transform="`rotate(${node.tilted ? -10 : 0})`">
        <svg
          :class="'node node-' + node.type"
          :data-id="node.id"
          :data-type="node.type"
          :data-name="node.name"
          :style="cursor"
          width="120"
          :height="node.type === NodeType.Actor ? 50 : 100"
          :x="node.x"
          :y="node.y"
          :key="node.id"
          @contextmenu="e => onContextMenu(e, node)"
          @dblclick="e => onDoubleClick(e, node)"
          @mousedown="e => onMouseDown(e, node)"
          @mouseup="onMouseUp"
          @touchstart="e => onMouseDown(e, node)"
          @touchend="activeNode = null"
          @touchleave="activeNode = null"
          @touchcancel="activeNode = null">
          <rect
            :fill="getColor(node)"
            width="120"
            :height="node.type === NodeType.Actor ? 50 : 100"
            rx="3"
            stroke="black"
            stroke-width="2" />
          <!--<text :x="60" :y="node.type === NodeType.Actor ? 30 : 50" text-anchor="middle">{{node.name}}</text>-->
          <!--<text :y="node.type === NodeType.Actor ? 30 : 50 - ((node.name.split(' ').length * 19) / 2) - 9">
            <tspan v-for="(word, index) in node.name.split(' ')" :dy="19" x="60" text-anchor="middle">{{word}}</tspan>
          </text>-->
          <text v-for="(word, index) in node.name.split(' ')" :key="index" x="60" :y="node.type === NodeType.Actor ? 30 : 50 - (node.name.split(' ').length * 7) + (index * 23)" text-anchor="middle">
            {{word}}
          </text>
        </svg>
      </g>
    </g>
  </svg>
  
  <AboutDialog />
  <ContextDialog id="contextModal"
    v-if="contextualNode"
    :node="(contextualNode as Node)"
    @delete-node="(node) => nodes = nodes.filter(x => x.id !== node.id)"
    @node-selected="(type) => nodeType = type"
    @tilt="(node) => node.tilted = !node.tilted"
    />
  <CreateNodeDialog id="createNodeModal" @add-event="(name, type) => addNode(name, type)" :type="nodeType" />
  <KeyboardShortcutsDialog />
  <RenameNodeDialog id="renameNodeModal"
    v-if="contextualNode"
    :node="contextualNode"
    @rename-node="(node, name) => node.name = name"
    />
  <input id="file" type="file" accept="application/json" @change="handleImport" ref="filePickerEl" hidden />
</template>

<style scoped>
  .node-actor { color: #fff2c0; }
  .node-aggregate { color: #ffd42d; }
  .node-process { color: #c391c2; }
  .node-command { color: #3399fe; }
  .node-error { color: #ec4d4e; }
  .node-error text { fill: white; }
  .node-event { color: #ff992a; }
  .node-external { color: #ff68b9; }
  .node-view { color: #5fc08b; }

  svg text { pointer-events: none; }
</style>
