import Signals = NodeJS.Signals
import { app } from './app.js'
import * as http from 'http'
import * as util from 'util'
import config from './config.js'

let server: http.Server | null

startServer().catch((err) => {
  console.warn(err)
})

async function startServer(): Promise<void> {
  try {
    const port = await startAppListen(app)
    console.log(`server listening on ${port} ✔️`)
  } catch (e) {
    console.log('Failed to start server', util.inspect(e))
    await stopServer()
  }
}

export async function stopServer(): Promise<void> {
  await stopAppListen()
  console.log('server stopped successfully ✔️')
}

process.on('SIGINT', onSignal)
process.on('SIGTERM', onSignal)

async function onSignal(code: Signals): Promise<void> {
  console.log(`Received ${code} stopping server`)
  await stopServer()
  process.exit(0)
}

async function startAppListen(app: any): Promise<number> {
  const port = config.get('port')
  server = http.createServer(app)
  await new Promise<void>((resolve, reject) => {
    server?.on('error', reject)
    server?.listen(port, resolve)
  })
  return port
}

async function stopAppListen(): Promise<void> {
  if (server) {
    await new Promise((res) => (server ? server?.close(res) : res(null)))
    server = null
  }
}
