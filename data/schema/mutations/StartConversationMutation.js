import { mutationWithClientMutationId } from 'graphql-relay'

import { GraphQLNonNull, GraphQLString } from 'graphql'

import { GraphQLConversation } from '../nodes'

import { startConversation, getConversation } from '../../database'

const StartConversationMutation = mutationWithClientMutationId({
  name: 'StartConversation',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    conversation: {
      type: new GraphQLNonNull(GraphQLConversation),
      resolve: ({ conversationId }) => getConversation(conversationId),
    },
  },
  mutateAndGetPayload: ({ name }, context) => {
    const conversationId = startConversation(name)
    const conversation = getConversation(conversationId)

    context.pubsub.publish('CONVERSATION_STARTED', { conversation })

    return { conversationId }
  },
})

export { StartConversationMutation }
