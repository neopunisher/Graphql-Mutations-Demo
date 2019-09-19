import { execute } from 'apollo-link'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'

const API_ENDPOINT = 'http://localhost:4000/graphql'
const SUBSCRIPTION_ENDPOINT = 'ws://localhost:4000/graphql'

function fetchQuery(operation, variables) {
  return fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json()
  })
}

const subscriptionClient = new SubscriptionClient(SUBSCRIPTION_ENDPOINT, {
  reconnect: true,
})

const subscriptionLink = new WebSocketLink(subscriptionClient)

const networkSubscriptions = (operation, variables) =>
  execute(subscriptionLink, {
    query: operation.text,
    variables,
  })

const environment = new Environment({
  network: Network.create(fetchQuery, networkSubscriptions),
  store: new Store(new RecordSource()),
})

export default environment
