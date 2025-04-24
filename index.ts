import { CoolifyTraefikSource } from "./sources/CoolifyTraefikSource"
import { YamlSource } from "./sources/YamlSource"
import { Source } from "./sources/Source"
import { TraefikConfig } from "./TraefikConfig"
import express from "express"


const app = express()
app.use(express.json())
const port = 58379
app.listen(port, () => {
    console.log(`Rest API listening on port ${port}`)
})

const sources: Source[] = [new CoolifyTraefikSource(), new YamlSource("/etc/traefik/config.yml")]



app.get("/", async (req, res) => {
    const config = await getTraefikConfig()
    console.log(JSON.stringify(config))
    console.log("\n\nREQUEST INFO\n", req.ip) 
    return res.json(config)
})

async function getTraefikConfig() {
    let globalConfig: TraefikConfig = {
        "http": {
            "routers": {},
            "services": {},
            "middlewares": {}
        }
    }
    for (const source of sources) {
        globalConfig = await source.loadConfig(globalConfig)
    }
    return globalConfig
}

