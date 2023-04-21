import { chdir } from "process"
import server from "@ranklab/server"

chdir(new URL(".", import.meta.url).pathname)

server().catch((err) => {
  console.error(err)
  process.exit(1)
})
