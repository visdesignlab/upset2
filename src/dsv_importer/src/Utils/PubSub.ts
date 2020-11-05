export type EventHandler = (...event?: any[]) => void;
export type EventHandlerList = Array<EventHandler>;
export type EventHandlerMap = {
  [type: string]: EventHandlerList;
};

export function mitt(all?: EventHandlerMap) {
  all = all || Object.create(null);

  return {
    on(type: string, handler: EventHandler, ctx?: any) {
      if (ctx) (all[type] || (all[type] = [])).push(handler.bind(ctx));
      (all[type] || (all[type] = [])).push(handler);
    },
    off(type: string, handler: EventHandler) {
      if (all[type]) all[type].splice(all[type].indexOf(handler) >>> 0, 1);
    },
    emit(type: string, ...evt: any[]) {
      (all[type] || []).slice().map(handler => {
        handler(...evt);
      });
    }
  };
}

export type Mitt = {
  on(type: string, handler: EventHandler, ctx?: any): void;
  off(type: string, handler: EventHandler): void;
  emit(type: string, ...evt: any[]): void;
};
