import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  nodeDefinitions,
} from 'graphql-relay'

import {
  Conversation,
  Message,
  getConversation,
  getMessage,
  getMessagesByConversationId,
} from '../database'

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId)

    if (type === 'Conversation') {
      return getConversation(id)
    } else if (type === 'Message') {
      return getMessage(id)
    }
    return null
  },
  obj => {
    if (obj instanceof Message) {
      return GraphQLMessage
    } else if (obj instanceof Conversation) {
      return GraphQLConversation
    }
    return null
  }
)

const GraphQLMessage = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message'),
    conversationId: globalIdField('Conversation'),
    text: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: message => message.text,
    },
    admin: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: message => message.admin,
    },
  },
  interfaces: [nodeInterface],
})

const {
  connectionType: MessagesConnection,
  edgeType: GraphQLMessageEdge,
} = connectionDefinitions({
  name: 'Message',
  nodeType: GraphQLMessage,
})

const GraphQLConversation = new GraphQLObjectType({
  name: 'Conversation',
  fields: {
    id: globalIdField('Conversation'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: root => getConversation(root.id).name,
    },
    messages: {
      type: MessagesConnection,
      args: connectionArgs,
      resolve: (root, { after, before, first, last }) =>
        connectionFromArray([...getMessagesByConversationId(root.id)], {
          after,
          before,
          first,
          last,
        }),
    },
    totalCount: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: root => getMessagesByConversationId(root.id).length,
    },
  },
  interfaces: [nodeInterface],
})

const {
  connectionType: ConversationConnection,
  edgeType: GraphQLConversationEdge,
} = connectionDefinitions({
  name: 'Conversation',
  nodeType: GraphQLConversation,
})

export {
  ConversationConnection,
  GraphQLConversation,
  GraphQLConversationEdge,
  GraphQLMessage,
  GraphQLMessageEdge,
  nodeField,
}
