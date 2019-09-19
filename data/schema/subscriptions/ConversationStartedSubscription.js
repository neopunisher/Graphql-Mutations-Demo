import { cursorForObjectInConnection } from 'graphql-relay'
import { GraphQLObjectType } from 'graphql'

import { GraphQLConversationEdge } from '../nodes'

import { getConversations } from '../../database'

const ConversationStartedPayload = new GraphQLObjectType({
  name: 'ConversationStartedPayload',
  fields: {
    conversationEdge: {
      type: GraphQLConversationEdge,
      resolve: ({ conversation }) => {
        console.log(conversation)

        return {
          cursor: cursorForObjectInConnection(
            [getConversations()],
            conversation
          ),
          node: conversation,
        }
      },
    },
  },
})

const ConversationStartedSubscription = {
  type: ConversationStartedPayload,
  resolve: payload => payload,
  subscribe: (root, args, context) => {
    return context.pubsub.asyncIterator('CONVERSATION_STARTED')
  },
}

export { ConversationStartedSubscription }
