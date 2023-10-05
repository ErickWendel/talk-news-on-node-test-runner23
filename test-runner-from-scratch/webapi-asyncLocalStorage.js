import { createServer } from 'node:http'
import { AsyncLocalStorage } from 'node:async_hooks'
import { randomUUID } from 'node:crypto'
import { setTimeout } from 'node:timers/promises'
const storage = new AsyncLocalStorage()

process.on('uncaughtException', () => {
    const { response, id } = storage.getStore()
    const shortenId = id.slice(0, 3)
    console.log(`[server] ${shortenId} has broken but will be nicely handled!`)
    response.end(`wow! - req id: ${shortenId}`)
})

createServer((request, response) => {
    const id = randomUUID()
    storage.enterWith({ response, id })
    throw new Error('oops!')
}).listen(3000, () => console.log('running at 30000'))

await setTimeout(1000)

let promises = []
for (let i = 0; i < 3; i++) {
    promises.push(fetch('http://localhost:3000').then(item => item.text()))
}

const messages = await Promise.all(promises)
messages.forEach(message => {
    console.log(`[client] ${message} received from API at ${new Date().toISOString()}`)
})

process.exit()
