export interface TraefikConfig {
    tls?: {
        certificates: []
    }
    http: TraefikHTTPConfig
    tcp?: TraefikHTTPConfig
}


export interface TraefikHTTPConfig {
    routers: {
        [name: string] : Router
    }, services: {
        [name: string]: {
            loadbalancer: {
                servers: [
                    {url: string, [others: string]: any}
                ]
            }
        }
    }, middlewares: any
}

export interface Router {
    entrypoints: string[],
    rule: string
    service: string,
    priority: number,
    middlewares: string[]
    [other: string]: any
}