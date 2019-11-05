import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql'

import {
  connectionDefinitions,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay'

import {
  Animation,
  AnimationSequence,
  Message,
  LedBar,
  getLedBar,
  getAnimation,
  getAnimationSequence,
  getAnimationName,
  getMessageText,
  getAnimationSequenceName,
} from '../database'

import {
  Int2rgb
} from '../ledbar'

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId)

    if (type === 'Animation') {
      return getAnimation(id)
    } else if (type === 'AnimationSequence') {
      return getAnimationSequence(id)
    } else if (type === 'LedBar') {
      return getLedBar(id)
    }
    return null
  },
  obj => {
    if (obj instanceof Animation) {
      return GraphQLAnimation
    } else if (obj instanceof AnimationSequence) {
      return GraphQLAnimationSequence
    } else if (obj instanceof Message) {
      return GraphQLMessage
    } else if (obj instanceof LedBar) {
      return GraphQLLedBar
    }
    return null
  }
)

const GraphQLInputPixel = new GraphQLInputObjectType({
  name: 'PixelInput',
  fields: {
    r: {
      type: GraphQLInt,
    },
    g: {
      type: GraphQLInt,
    },
    b: {
      type: GraphQLInt,
    },
  },
})
const GraphQLPixel = new GraphQLObjectType({
  name: 'Pixel',
  fields: {
    r: {
      type: GraphQLInt,
      resolve: (root) => root[0]
    },
    g: {
      type: GraphQLInt,
      resolve: (root) => root[1]
    },
    b: {
      type: GraphQLInt,
      resolve: (root) => root[2]
    },
  },
})

const GraphQLLedBar = new GraphQLObjectType({
  name: 'LedBar',
  fields: {
    id: globalIdField('LedBar'),
    index: {
      type: GraphQLInt,
      resolve: (root) => root.index
    },
    numLeds: {
      type: GraphQLInt,
      resolve: (root) => root.numLeds
    },
  },
  interfaces: [nodeInterface],
})

const {
  connectionType: LedBarConnection,
  edgeType: GraphQLLedBarEdge,
} = connectionDefinitions({
  name: 'LedBar',
  nodeType: GraphQLLedBar,
})


const GraphQLMessage = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message'),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => getMessageText(root.id),
    },
  },
  interfaces: [nodeInterface],
})

const GraphQLAnimationFrame = new GraphQLObjectType({
  name: 'AnimationFrame',
  fields: {
    leds: {
      type: new GraphQLList(GraphQLPixel),
      resolve: (root) => root.map(Int2rgb)
    },
  },
})

const GraphQLAnimation = new GraphQLObjectType({
  name: 'Animation',
  fields: {
    id: globalIdField('Animation'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => getAnimationName(root.id),
    },
    delay: {
      type: GraphQLInt,
      resolve: (root) => root.delay
    },
    frames: {
      type: new GraphQLList(GraphQLAnimationFrame),
      resolve: (root) => root.frames
    },
  },
  interfaces: [nodeInterface],
})

const {
  connectionType: AnimationConnection,
  edgeType: GraphQLAnimationEdge,
} = connectionDefinitions({
  name: 'Animation',
  nodeType: GraphQLAnimation,
})

const GraphQLAnimationSequence = new GraphQLObjectType({
  name: 'AnimationSequence',
  fields: {
    id: globalIdField('AnimationSequence'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => getAnimationSequenceName(root.id),
    },
    animations: {
      type: new GraphQLList(GraphQLAnimation),
      resolve: (root) =>
        root.animations
    },
  },
  interfaces: [nodeInterface],
})

const {
  connectionType: AnimationSequenceConnection,
  edgeType: GraphQLAnimationSequenceEdge,
} = connectionDefinitions({
  name: 'AnimationSequence',
  nodeType: GraphQLAnimationSequence,
})

export {
  AnimationConnection,
  GraphQLAnimation,
  GraphQLAnimationEdge,
  LedBarConnection,
  GraphQLLedBarEdge,
  AnimationSequenceConnection,
  GraphQLAnimationSequence,
  GraphQLAnimationSequenceEdge,
  GraphQLPixel,
  GraphQLAnimationFrame,
  nodeField,
  GraphQLMessage,
  GraphQLLedBar,
  GraphQLInputPixel
}
