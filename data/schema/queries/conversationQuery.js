import { GraphQLID, GraphQLNonNull } from 'graphql'
import {
  connectionArgs,
  connectionFromArray,
  fromGlobalId,
} from 'graphql-relay'
import { ConversationConnection, GraphQLConversation } from '../nodes'
import { getConversation, getConversations } from '../../database'

const ConversationsQuery = {
  type: ConversationConnection,
  args: connectionArgs,
  resolve: (root, { after, before, first, last }) => {
    return connectionFromArray(getConversations(), {
      after,
      before,
      first,
      last,
    })
  },
}

const ConversationQuery = {
  type: GraphQLConversation,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root, { id }) => getConversation(fromGlobalId(id).id),
}

export { ConversationQuery, ConversationsQuery }
