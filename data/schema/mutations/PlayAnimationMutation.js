import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  playAnimation
} from '../../ledbar'

import { GraphQLAnimation } from '../nodes'

import {
  getAnimation,
  getLedBar
} from '../../database'

const PlayAnimationMutation = mutationWithClientMutationId({
  name: 'PlayAnimation',
  inputFields: {
    animationId: { type: new GraphQLNonNull(GraphQLID) },
    ledBarId: { type: new GraphQLNonNull(GraphQLID) },
    secret: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    animation: {
      type: new GraphQLNonNull(GraphQLAnimation),
      resolve: ({ animation }) => animation,
    },
  },
  mutateAndGetPayload: async ({ animationId, ledBarId, secret }, context) => {
    //     context.pubsub.publish('CONVERSATION_MESSAGE_ADDED', { conversation })
    const [animation, ledbar] = await Promise.all([getAnimation(fromGlobalId(animationId).id),
    getLedBar(fromGlobalId(ledBarId).id)])
    if (ledbar.secret !== secret) {
      throw new Error(`Incorrect secret for ${ledbar.id}.`);
    }
    else {
      playAnimation(animation, ledbar.index);
    }
    return { animation }
  },
})

export { PlayAnimationMutation }
