import { Module, ChowChow, BaseContext } from '@robb_j/chowchow';
declare type JsonEnvelopeConfig = {
    name?: string;
    version?: string;
    handleErrors?: boolean;
};
export declare type JsonEnvelopeContext = {
    sendData: (data: any) => void;
    sendFail: (messages: string[], status?: number) => void;
};
export declare function processError(err: any): string[];
export declare class JsonEnvelopeModule implements Module {
    config: JsonEnvelopeConfig;
    app: ChowChow;
    publicName?: string;
    publicVersion?: string;
    constructor(config?: JsonEnvelopeConfig);
    checkEnvironment(): void;
    setupModule(): void;
    clearModule(): void;
    extendExpress(): void;
    extendEndpointContext({ res }: BaseContext): JsonEnvelopeContext;
    makeEnvelope(data: any, success?: boolean, messages?: string[], status?: number): any;
}
export {};
