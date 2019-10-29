import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'

import { useSubscription } from '../../utils/relay'

import AdminConversationsList from './AdminConversationsList'

const drawerWidth = 240

const Container = styled.div`
  display: flex;
`

const Navigation = styled.nav`
  width: ${drawerWidth}px;
`

const Content = styled.main`
  flex-grow: 1;
`

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: drawerWidth,
  },
}))

const subscription = graphql`
  subscription AdminLayoutSubscription {
    conversationStarted {
      conversationEdge {
        node {
          ...AdminConversationsList_conversations
        }
      }
    }
  }
`

function AdminLayout({ conversations, children }) {
  useSubscription(subscription, null, {
    configs: [
      {
        type: 'RANGE_ADD',
        parentID: 'client:root',
        connectionInfo: [
          {
            key: 'AdminLayout_conversations',
            rangeBehavior: 'append',
          },
        ],
        edgeName: 'conversationEdge',
      },
    ],
  })

  const classes = useStyles()

  return (
    <Container>
      <Navigation>
        <Drawer
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          open
        >
          <AdminConversationsList
            conversations={conversations.edges.map(edge => edge.node)}
          />
        </Drawer>
      </Navigation>
      <Content>{children}</Content>
    </Container>
  )
}

const AdminLayoutQuery = graphql`
  query AdminLayoutQuery {
    conversations(first: 100) @connection(key: "AdminLayout_conversations") {
      edges {
        node {
          ...AdminConversationsList_conversations
        }
      }
    }
  }
`

AdminLayout.Query = AdminLayoutQuery

export default AdminLayout
