import {
  cursorForObjectInConnection,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { GraphQLAnimation } from '../nodes'

import {
  addAnimation,
} from '../../database'

const AddAnimationMutation = mutationWithClientMutationId({
  name: 'AddAnimation',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    delay: { type: GraphQLInt },
  },
  outputFields: {
    animation: {
      type: new GraphQLNonNull(GraphQLAnimation),
      resolve: ({ animation }) => animation,
    },
  },
  mutateAndGetPayload: ({ name, delay }, context) => {
    const animation = addAnimation(name, delay)
    return { animation }
  },
})

export { AddAnimationMutation }
