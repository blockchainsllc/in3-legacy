import { N3Config, RPCRequest, RPCResponse } from '../types/config';
/**
 * Client for N3.
 *
 */
export declare class Client {
    private defConfig;
    constructor(config?: Partial<N3Config>);
    updateNodeList(): Promise<void>;
    call(request: RPCRequest, config?: Partial<N3Config>): Promise<string>;
    /**
     * sends a request.
     * If the callback is given it will be called with the response, if not a Promise will be returned.
     */
    send(request: RPCRequest[] | RPCRequest, callback?: (err: Error, response: RPCResponse | RPCResponse[]) => void, config?: Partial<N3Config>): void | Promise<RPCResponse | RPCResponse[]>;
    private sendIntern(requests, conf, prevExcludes?);
}
