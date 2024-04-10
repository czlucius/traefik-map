import { TraefikConfig } from "../TraefikConfig";
import { Source } from "./Source";
import  * as fs from "fs"
import  * as yaml from "js-yaml"
export class YamlSource extends Source {
    sourceFile: string
    constructor(sourceFile: string) {
        super()
        this.sourceFile = sourceFile
    }
    async loadConfig(config: TraefikConfig): Promise<TraefikConfig> {
        config = {...config}
        const yamlRaw = this.readFileAsync(this.sourceFile)
        const yamlConfig: TraefikConfig = yaml.load(yamlRaw, "utf-8")

        config.http.routers = {
            ...config.http.routers,
            ...yamlConfig.http.routers
        }

        config.http.services = {
            ...config.http.services,
            ...yamlConfig.http.services
        }

        config.http.middlewares = {
            ...config.http.middlewares,
            ...yamlConfig.http.middlewares
        }

        if (!config.tcp) {
            config.tcp = {
                routers: {},
                services: {},
                middlewares: {}
            }
        }
        config.tcp.routers = {
            ...config.tcp?.routers,
            ...yamlConfig.tcp?.routers
        }

        config.tcp.services = {
            ...config.tcp?.services,
            ...yamlConfig.tcp?.services
        }
        config.tcp.middlewares = {
            ...config.tcp?.middlewares,
            ...yamlConfig.tcp?.middlewares
        }
        return config
    }
    

    async readFileAsync(fileName: string): Promise<string> {
        return await new Promise((resolve, reject) => {
            
            fs.readFile(this.sourceFile, {encoding: "utf-8"}, (err, data) => {
                if (err) {
                    return reject(err)
                } 
                if (data) {
                    return resolve(data)
                } else {
                    return reject("Invalid contents!")
                }
            })

        })
    }

}