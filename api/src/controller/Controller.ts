export interface Controller<Response = unknown> {
    handle: (request: any) => Promise<Response>;
  }