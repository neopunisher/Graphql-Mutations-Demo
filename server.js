import cors from 'cors'
import express from 'express'
import graphQLHTTP from 'express-graphql'
import { execute, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { Server } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import { schema } from './data/schema'

const APP_PORT: number = 4000

const app = express()
const pubsub = new PubSub()

app.use(cors())

const context = {
  pubsub,
}

app.use(
  '/graphql',
  graphQLHTTP({
    context,
    schema,
    pretty: true,
    graphiql: true,

  })
)

const server = Server(app)

SubscriptionServer.create(
  {
    context,
    execute,
    schema,
    subscribe,
    onOperation: (message, params) => {
      return {
        ...params,
        context,
      }
    },
  },
  {
    server: server,
    path: '/graphql',
  }
)

server.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`)
})
