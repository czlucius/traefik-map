import { CoolifyTraefikSource } from "./sources/CoolifyTraefikSource"
import { Source } from "./sources/Source"
import { TraefikConfig } from "./TraefikConfig"
import express from "express"


const app = express()
app.use(express.json())
const port = 58379
app.listen(port, () => {
    console.log(`Rest API listening on port ${port}`)
})

const sources: Source[] = [new CoolifyTraefikSource()]



app.get("/", async (req, res) => {
    return res.json(await getTraefikConfig())
})

async function getTraefikConfig() {
    let globalConfig: TraefikConfig = {
        "tls": {
            "certificates": []
        },
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

