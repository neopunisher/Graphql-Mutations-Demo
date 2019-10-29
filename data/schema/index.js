import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import { nodeField } from './nodes.js'
import {
  AnimationQuery, 
  AnimationsQuery, 
  AnimationSequencesQuery, 
  AnimationSequenceQuery
} from './queries/AnimationQuery'
import { AddAnimationMutation } from './mutations/AddAnimationMutation'
import { AddAnimationFrameMutation } from './mutations/AddAnimationFrameMutation'
import { PlayAnimationMutation } from './mutations/PlayAnimationMutation'
import { MessageAddedSubscription } from './subscriptions/MessageAddedSubscription'

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    animation: AnimationQuery,
    animations: AnimationsQuery,
    animationSequence: AnimationSequenceQuery,
    animationSequences: AnimationSequencesQuery,
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
    addAnimation: AddAnimationMutation,
    addAnimationFrame: AddAnimationFrameMutation,
    playAnimation: PlayAnimationMutation,
  },
})

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    messageAdded: MessageAddedSubscription,
  },
})

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
})
