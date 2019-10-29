import { GraphQLID, GraphQLNonNull } from 'graphql'
import {
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId,
} from 'graphql-relay'
import { AnimationConnection, GraphQLAnimation, AnimationSequenceConnection, GraphQLAnimationSequence } from '../nodes'
import { getAnimation, getAnimations, getAnimationSequence, getAnimationSequences } from '../../database'

const AnimationsQuery = {
  type: AnimationConnection,
  args: connectionArgs,
  resolve: (root, { after, before, first, last }) => {
    return connectionFromPromisedArray(getAnimations(), {
      after,
      before,
      first,
      last,
    })
  },
}

const AnimationQuery = {
  type: GraphQLAnimation,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root, { id }) => getAnimation(fromGlobalId(id).id),
}

const AnimationSequencesQuery = {
  type: AnimationSequenceConnection,
  args: connectionArgs,
  resolve: (root, { after, before, first, last }) => {
    return connectionFromPromisedArray(getAnimationSequences(), {
      after,
      before,
      first,
      last,
    })
  },
}

const AnimationSequenceQuery = {
  type: GraphQLAnimationSequence,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root, { id }) => getAnimationSequence(fromGlobalId(id).id),
}
export { AnimationQuery, AnimationsQuery, AnimationSequencesQuery, AnimationSequenceQuery }
