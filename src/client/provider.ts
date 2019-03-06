import Client from './Client'

export class EthereumProvider {
  IN3Client: Client
  host: string

  constructor(client: Client, _host: string){
    this.IN3Client = client
    this.host = _host
  }

  send(method, parameters): Promise<object> {
    return this.IN3Client.send(method, parameters)
  }

  sendBatch(methods, moduleInstance): Promise<object[]> {
    let methodCalls = [];

    methods.forEach((method) => {
        method.beforeExecution(moduleInstance);
        methodCalls.push(this.send(method.rpcMethod, method.parameters));
    });

    return Promise.all(methodCalls);
  }

  registerEventListeners(): void {
    throw new Error("Method not Implemented")
  }

  subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string> {
    throw new Error("Method not Implemented")
  }

  unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>{
    throw new Error("Method not Implemented")
  }

  clearSubscriptions(unsubscribeMethod: string): Promise<boolean> {
    throw new Error("Method not Implemented")
  }

  on(type: string, callback: () => void): void{
    throw new Error("Method not Implemented")
  }

  removeListener(type: string, callback: () => void): void {
    throw new Error("Method not Implemented")
  }

  removeAllListeners(type: string): void {
    throw new Error("Method not Implemented")
  }

  reset(): void {
    throw new Error("Method not Implemented")
  }
}
