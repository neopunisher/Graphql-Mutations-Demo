import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql'

import {
  playAnimation,
  rgb2Int
} from '../../ledbar'

import {
  getLedBar,
  Animation,
  addMessage
} from '../../database'

import { GraphQLLedBar } from '../nodes'

const ColorsEnum = new GraphQLEnumType({
  name: 'Colors',
  values: {'RED': {value: rgb2Int([255,0,0])}, 'GREEN': {value: rgb2Int([0,255,0])}, 'BLUE': {value: rgb2Int([0,0,255])}},
})

const IdentifySegmentMutation = mutationWithClientMutationId({
  name: 'IdentifySegment',
  inputFields: {
    ledBarId: { type: new GraphQLNonNull(GraphQLID) },
    color: { type: new GraphQLNonNull(ColorsEnum) },
  },
  outputFields: {
    ledBar: {
      type: new GraphQLNonNull(GraphQLLedBar),
      resolve: ({ ledBar }) => ledBar,
    },
  },
  mutateAndGetPayload: async ({ color, ledBarId }, context) => {
    console.log('identify:', color)
    const ledBar = await getLedBar(fromGlobalId(ledBarId).id)
    console.log('ledbar:', ledBar)
    const message = await addMessage(`Identify bar ${ledBar.index}`)
    console.log('msg:', message)
    context.pubsub.publish('MESSAGE_ADDED', { message })
    const blink = [Array(ledBar.numLeds).fill(color), Array(ledBar.numLeds).fill(0)]
    console.log('blink:', blink)
    const animation = new Animation(0,'identify', blink.concat(blink, blink, blink, blink), 500)
    console.log('ani:', animation)
    playAnimation(animation, ledBar.index)
    console.log('do return')
    return { ledBar }
  },
})

export { IdentifySegmentMutation }
