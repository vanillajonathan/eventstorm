<script setup lang="ts">
import { ref, watch } from "vue"
import { NodeType } from "../shared"

const props = defineProps<{
  type: NodeType;
}>()

const input = ref<string>("")

watch(props, () => {
  input.value = ""
})

function getNodeIcon(nodeType: NodeType): string {
  switch (nodeType) {
    case NodeType.Actor:
      return "node-actor";
    case NodeType.Aggregate:
      return "node-aggregate";
    case NodeType.BusinessProcess:
      return "node-process";
    case NodeType.Command:
      return "node-command";
    case NodeType.Error:
      return "node-error";
    case NodeType.Event:
      return "node-event";
    case NodeType.External:
      return "node-external";
    case NodeType.View:
      return "node-view";
    default:
      throw new Error(`Unknown node type: ${nodeType}.`)
  }
}

function getNodeName(nodeType: NodeType): string {
  switch (nodeType) {
    case NodeType.Actor:
      return "Actor";
    case NodeType.Aggregate:
      return "Aggregate";
    case NodeType.BusinessProcess:
      return "Business Process";
    case NodeType.Command:
      return "Command";
    case NodeType.Error:
      return "Error";
    case NodeType.Event:
      return "Domain Event";
    case NodeType.External:
      return "External System";
    case NodeType.View:
      return "View";
    default:
      throw new Error(`Unknown node type: ${nodeType}.`)
  }
}

type Suggestions = {
  [NodeType.Actor]: string[],
  [NodeType.Aggregate]: string[],
  [NodeType.BusinessProcess]: string[],
  [NodeType.Command]: string[],
  [NodeType.Error]: string[],
  [NodeType.Event]: string[],
  [NodeType.External]: string[],
  [NodeType.View]: string[]
}

const suggestions = {
  actor: ["Admin", "Analyst", "Bot", "Customer", "Developer", "Guest", "Manager", "Moderator", "Supplier", "User"],
  aggregate: ["Accounts", "Inventory", "Orders", "Shopping Cart", "Users"],
  command: ["Book Room", "Book Venue", "Cancel Subscription", "Create Account", "Delete Account"],
  event: ["Account Created", "Account Deleted", "Account Verified", "End of month", "End of quarter", "End of year", "Invoice Paid", "Order Delivered", "Order Shipped", "Subscription Cancelled", "Room Booked", "Venue Booked"],
  external: ["Auth", "CRM", "Dynamics 365", "Email", "Google", "IFTTT", "Payment Provider", "PayPal", "Power Automate", "Mailchimp", "Mailgun", "Stripe", "SendGrid", "SMS", "Twilio", "Zapier"],
  process: ["Reservation process", "Timeout policy"],
  view: ["Checkout Page", "Login Page", "Signup Page"]
} as Suggestions;
</script>

<template>
  <div class="modal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i :class="'bi bi-sticky-fill me-1 ' + getNodeIcon(type)"></i>
            Add {{ getNodeName(type) }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p v-if="type === NodeType.Actor">
            An <b>actor</b>, <b>role</b>, or <b>persona</b> executes a command through a view. Example <code>User</code> or <code>Admin</code>.
          </p>
          <p v-if="type === NodeType.Aggregate">
            An <b>aggregate</b> is a cluster of domain objects that can be treated as a single unit. Aggregates are written as pluralized nouns, example <code>Orders</code>.
          </p>
          <p v-if="type === NodeType.BusinessProcess">
            Processes a command according to a policy or business rules and logic. Creates one or more domain events.
          </p>
          <p v-if="type === NodeType.Command">
            A <b>command</b> executed by a user through a view on an aggregate that results in the creation of a domain event. Commands are written in present tense as verbs with a noun, example <code>Create Order</code>.
          </p>
          <p v-else-if="type === NodeType.Error">
            A <b>error</b>, <b>risk</b> or <b>concern</b> is written as a noun or a phrase, example <code>Internal Server Error</code>.
          </p>
          <template v-else-if="type === NodeType.Event">
            <p>A <b>domain event</b> can come from a action started by a user, from an external system, as a result of time passing, or as a consequence of another domain event.</p>
            <p>Domain events are written as nouns with a verb in the past tense,
            example <code>Order Created</code>.</p>
          </template>
          <p v-else-if="type === NodeType.External">
            A <b>external system</b> is a third-party service provider such as a payment gateway, shipping company or a communication platform. Example <code>Payment Provider</code>.
          </p>
          <p v-else-if="type === NodeType.View">
            A <b>view</b> or a <b>read model</b> is used by an actor to interact with a aggregate through a command.
            Example <code>Login Page</code> or <code>Signup Page</code>.
          </p>
          <form id="create-node-form" @submit.prevent="$emit('addEvent', input, type)">
            <label :for="type + '-name'" class="col-form-label">{{ getNodeName(type) }} name:</label>
            <input type="text" class="form-control" :id="type + '-name'" list="suggestions" required
              v-model.trim="input"
            />
            <datalist id="suggestions">
              <option v-for="(suggestion, index) in suggestions[type]" :key="index">{{suggestion}}</option>
            </datalist>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="submit" class="btn btn-primary" form="create-node-form"
            data-bs-dismiss="modal"
            :disabled="input === ''"
          >
            Add {{ getNodeName(type) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
