import {
  cursorForObjectInConnection,
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import { GraphQLAnimationFrame, GraphQLInputPixel } from '../nodes'

import {
  addAnimationFrame,
} from '../../database'

const AddAnimationFrameMutation = mutationWithClientMutationId({
  name: 'AddAnimationFrame',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    leds: { type: new GraphQLNonNull(new GraphQLList(GraphQLInputPixel)) },
  },
  outputFields: {
    animationFrame: {
      type: new GraphQLNonNull(GraphQLAnimationFrame),
      resolve: ({ frame }) => frame,
    },
  },
  mutateAndGetPayload: ({ id, leds }, context) => {
    const ledVals = leds.map(Object.values)
    const frame = addAnimationFrame(fromGlobalId(id).id, ledVals)
    return { frame }
  },
})

export { AddAnimationFrameMutation }
