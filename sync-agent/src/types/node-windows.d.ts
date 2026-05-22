declare module 'node-windows' {
  export class Service {
    constructor(config: {
      name: string;
      description: string;
      script: string;
      env?: { name: string; value: string }[];
    });
    on(event: string, callback: () => void): void;
    install(): void;
    uninstall(): void;
    start(): void;
  }
}
