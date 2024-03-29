import { GraphQLObjectType } from 'graphql'

import { GraphQLMessage } from '../nodes'

import {
  ledbar
} from '../../ledbar'

const MessageAddedPayload = new GraphQLObjectType({
  name: 'MessageAddedPayload',
  fields: {
    message: {
      type: GraphQLMessage,
      resolve: ({ conversation }) => conversation,
    },
  },
})

const MessageAddedSubscription = {
  type: MessageAddedPayload,
  resolve: payload => payload,
  subscribe: (root, args, context) => {
    return context.pubsub.asyncIterator('MESSAGE_ADDED')
  },
}

export { MessageAddedSubscription }
