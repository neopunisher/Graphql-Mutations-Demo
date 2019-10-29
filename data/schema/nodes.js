import {
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
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
  getAnimation,
  getAnimationSequence,
  getAnimationName,
  getMessageText,
  getAnimationSequenceName,
} from '../database'

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId)

    if (type === 'Animation') {
      return getAnimation(id)
    } else if (type === 'AnimationSequence') {
      return getAnimationSequence(id)
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
    }
    return null
  }
)

const GraphQLPixel = new GraphQLObjectType({
  name: 'Pixel',
  fields: {
    r: {
      type: GraphQLInt,
      resolve: (root) =>
        root[0]
    },
    g: {
      type: GraphQLInt,
      resolve: (root) =>
        root[1]
    },
    b: {
      type: GraphQLInt,
      resolve: (root) =>
        root[2]
    },
  },
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
      resolve: (root) =>
        root.leds
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
  AnimationSequenceConnection,
  GraphQLAnimationSequence,
  GraphQLAnimationSequenceEdge,
  GraphQLPixel,
  GraphQLAnimationFrame,
  nodeField,
  GraphQLMessage
}
