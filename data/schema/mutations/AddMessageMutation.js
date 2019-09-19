import {
  cursorForObjectInConnection,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { GraphQLConversation, GraphQLMessageEdge } from '../nodes'

import {
  addMessage,
  getConversation,
  getMessage,
  getMessagesByConversationId,
} from '../../database'

const AddMessageMutation = mutationWithClientMutationId({
  name: 'AddMessage',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
    conversationId: { type: new GraphQLNonNull(GraphQLID) },
    admin: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  outputFields: {
    messageEdge: {
      type: new GraphQLNonNull(GraphQLMessageEdge),
      resolve: ({ conversationId, messageId }) => {
        const message = getMessage(messageId)

        return {
          cursor: cursorForObjectInConnection(
            [...getMessagesByConversationId(conversationId)],
            message
          ),
          node: message,
        }
      },
    },
    conversation: {
      type: new GraphQLNonNull(GraphQLConversation),
      resolve: ({ conversationId }) => getConversation(conversationId),
    },
  },
  mutateAndGetPayload: ({ admin, conversationId, text }, context) => {
    const dbConversationId = fromGlobalId(conversationId).id
    const messageId = addMessage(dbConversationId, text, admin)
    const conversation = getConversation(dbConversationId)

    context.pubsub.publish('CONVERSATION_MESSAGE_ADDED', { conversation })

    return { messageId, conversationId: dbConversationId }
  },
})

export { AddMessageMutation }
