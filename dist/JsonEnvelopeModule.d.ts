import { Module, ChowChow, BaseContext } from '@robb_j/chowchow';
import { IApiOptions } from 'api-formatter';
declare type JsonEnvelopeConfig = IApiOptions;
export declare type JsonEnvelopeContext = {
    sendData: (data: any) => void;
    sendFail: (messages: string[], status?: number) => void;
};
export declare function makeEnvelope(data: any, success: boolean, messages: string[], status: number, name: string, version: string): {
    meta: {
        success: boolean;
        messages: string[];
        status: number;
        name: string;
        version: string;
    };
    data: any;
};
export declare class JsonEnvelopeModule implements Module {
    config: JsonEnvelopeConfig;
    app: ChowChow;
    constructor(config?: JsonEnvelopeConfig);
    checkEnvironment(): void;
    setupModule(): void;
    clearModule(): void;
    extendExpress(): void;
    extendEndpointContext(ctx: BaseContext): JsonEnvelopeContext;
}
export {};
