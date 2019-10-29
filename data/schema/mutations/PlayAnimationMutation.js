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

import ws281x from 'rpi-ws281x-native'

import { GraphQLAnimation } from '../nodes'

import {
  getAnimation,
} from '../../database'


function generateAnimation(animation){ 
  const frames = animation.frames.map(({ leds })=>leds.map(([r,g,b])=>(b << 16) + (g << 8) + r))

  return frames
}

ws281x.init(100);

const PlayAnimationMutation = mutationWithClientMutationId({
  name: 'PlayAnimation',
  inputFields: {
    animationId: { type: new GraphQLNonNull(GraphQLID) },
    ledBarId: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    animation: {
      type: new GraphQLNonNull(GraphQLAnimation),
      resolve: ({ animation }) => animation,
    },
  },
  mutateAndGetPayload: ({ animationId, ledBarId }, context) => {
    const animation = getAnimation(fromGlobalId(animationId).id)
    animation.then((animation)=>{
      const firstFrame = generateAnimation(animation)[0]
      ws281x.render(firstFrame)
    })
    
    return { animation }
  },
})

export { PlayAnimationMutation }
