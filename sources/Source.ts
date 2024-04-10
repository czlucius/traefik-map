import { Router, TraefikConfig } from "../TraefikConfig";

export abstract class Source {
    abstract loadConfig(config: TraefikConfig): Promise<TraefikConfig>
    protected renameHttpAndHttps(router: Router): Router {
        router.entrypoints.forEach((entrypoint, index) => {
            if (entrypoint === "web") { router.entrypoints[index] = "http"}
            if (entrypoint === "websecure") { router.entrypoints[index] = "https"}
        }) 
        return router
    }
}