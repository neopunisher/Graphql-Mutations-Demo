import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import { nodeField } from './nodes.js'
import {
  ConversationsQuery,
  ConversationQuery,
} from './queries/ConversationQuery'
import { AddMessageMutation } from './mutations/AddMessageMutation'
import { StartConversationMutation } from './mutations/StartConversationMutation'
import { ConversationUpdatedSubscription } from './subscriptions/ConversationUpdatedSubscription'
import { ConversationStartedSubscription } from './subscriptions/ConversationStartedSubscription'

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    conversations: ConversationsQuery,
    conversation: ConversationQuery,
    node: nodeField,
    viewer: {
      type: Query,
      resolve: viewer => ({ viewer }),
    },
  }),
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMessage: AddMessageMutation,
    startConversation: StartConversationMutation,
  },
})

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    conversationUpdated: ConversationUpdatedSubscription,
    conversationStarted: ConversationStartedSubscription,
  },
})

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
})
