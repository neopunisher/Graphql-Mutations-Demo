import { GraphQLID, GraphQLNonNull } from 'graphql'
import {
  connectionArgs,
  connectionFromPromisedArray,
  fromGlobalId,
} from 'graphql-relay'
import { LedBarConnection, GraphQLLedBar } from '../nodes'
import { getLedBar, getLedBars } from '../../database'

const LedBarsQuery = {
  type: LedBarConnection,
  args: connectionArgs,
  resolve: (root, { after, before, first, last }) => {
    return connectionFromPromisedArray(getLedBars(), {
      after,
      before,
      first,
      last,
    })
  },
}

const LedBarQuery = {
  type: GraphQLLedBar,
  args: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  resolve: (root, { id }) => getLedBar(fromGlobalId(id).id),
}

export { LedBarQuery, LedBarsQuery }
