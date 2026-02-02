type Listener = (event: any) => void;

class SimpleEventEmitter {
  private listeners: { [eventName: string]: Listener[] } = {};

  on(eventName: string, listener: Listener): () => void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);

    // Return an unsubscribe function
    return () => {
      this.removeListener(eventName, listener);
    };
  }

  removeListener(eventName: string, listenerToRemove: Listener): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        listener => listener !== listenerToRemove
      );
    }
  }

  emit(eventName: string, event: any): void {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(listener => listener(event));
    }
  }
}

export const errorEmitter = new SimpleEventEmitter();
