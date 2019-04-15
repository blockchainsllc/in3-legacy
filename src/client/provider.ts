import Client from './Client'

export class HttpProvider {
  IN3Client: Client
  host: string
  connected: boolean

  constructor(_host: string, options=  {}, client: Client){
    this.IN3Client = client
    this.host = _host
    this.connected = true;
  }

  send(method, parameters): Promise<object> {
    let request

    if(typeof(method) == "string")
      request = { method: method, params: parameters }
    else
      request = method

    if(typeof parameters == "function")
      return this.IN3Client.send(request, parameters)
    else
      return this.IN3Client.send(request)

  }

  sendBatch(methods, moduleInstance): Promise<object[]> {
    let methodCalls = [];

    methods.forEach((method) => {
        method.beforeExecution(moduleInstance);
        methodCalls.push(this.send(method.rpcMethod, method.parameters));
    });

    return Promise.all(methodCalls);
  }

  supportsSubscriptions(): boolean {
    return false
  }

  disconnect(): boolean {
    return true;
  }
}
