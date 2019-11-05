/* eslint-disable no-extend-native */
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


if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {

      // Steps 1-2.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }

      var O = Object(this);

      // Steps 3-5.
      var len = O.length >>> 0;

      // Steps 6-7.
      var start = arguments[1];
      var relativeStart = start >> 0;

      // Step 8.
      var k = relativeStart < 0 ?
        Math.max(len + relativeStart, 0) :
        Math.min(relativeStart, len);

      // Steps 9-10.
      var end = arguments[2];
      var relativeEnd = end === undefined ?
        len : end >> 0;

      // Step 11.
      var final = relativeEnd < 0 ?
        Math.max(len + relativeEnd, 0) :
        Math.min(relativeEnd, len);

      // Step 12.
      while (k < final) {
        O[k] = value;
        k++;
      }

      // Step 13.
      return O;
    }
  });
}