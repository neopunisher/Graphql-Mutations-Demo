import { GraphQLObjectType } from 'graphql'
import { GraphQLMessage } from '../nodes'

const MessageAddedPayload = new GraphQLObjectType({
  name: 'MessageAddedPayload',
  fields: {
    message: {
      type: GraphQLMessage,
      resolve: ({ message }) => message,
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
