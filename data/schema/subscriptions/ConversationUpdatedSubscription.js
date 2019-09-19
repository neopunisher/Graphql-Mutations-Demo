import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
import { withFilter } from 'graphql-subscriptions'

import { GraphQLConversation } from '../nodes'

const ConversationUpdatedPayload = new GraphQLObjectType({
  name: 'ConversationUpdatedPayload',
  fields: {
    conversation: {
      type: GraphQLConversation,
    },
  },
})

const ConversationUpdatedSubscription = {
  type: ConversationUpdatedPayload,
  args: {
    conversationId: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: payload => payload,
  subscribe: withFilter(
    (root, args, context) => {
      return context.pubsub.asyncIterator('CONVERSATION_MESSAGE_ADDED')
    },
    (payload, variables) => {
      return (
        payload.conversation.id === fromGlobalId(variables.conversationId).id
      )
    }
  ),
}

export { ConversationUpdatedSubscription }
