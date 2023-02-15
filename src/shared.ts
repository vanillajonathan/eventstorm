export interface Node {
  id: string,
  name: string,
  tilted: boolean,
  type: NodeType,
  x: number,
  y: number,
}

export enum NodeType {
  Actor = "actor",
  Aggregate = "aggregate",
  BusinessProcess = "process",
  Command = "command",
  Error = "error",
  Event = "event",
  External = "external",
  View = "view",
}
