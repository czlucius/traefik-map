import { Source } from "./Source";
import { Router, TraefikConfig } from "../TraefikConfig";

export class CoolifyTraefikSource extends Source {
    async loadConfig(config: TraefikConfig): Promise<TraefikConfig> {
        config = {...config}
        const coolifyConfig: TraefikConfig = await (await fetch("http://localhost:3000/webhooks/traefik/main.json")).json()
        const newRouters: {
            [name: string]: Router
        } = {} 
        for (const routerName in coolifyConfig.http.routers) {
            newRouters[routerName] = this.renameHttpAndHttps(coolifyConfig.http.routers[routerName])
        }
        
        config.http.routers = {
            ...config.http.routers,
            ...newRouters
        }

        // Include all middlewares
        config.http.middlewares = {
            ...config.http.middlewares,
            ...coolifyConfig.http.middlewares
        }

        config.http.services = {
            ...config.http.services
        }

        return config
    }
    
}

