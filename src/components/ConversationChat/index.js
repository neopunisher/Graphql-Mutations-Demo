import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import styled from 'styled-components'
import List from '@material-ui/core/List'

import { useSubscription } from '../../utils/relay'

import ConversationChatMessage from './ConversationChatMessage'
import ConversationChatField from './ConversationChatField'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`

const Messages = styled.div`
  flex-grow: 1;
  overflow: auto;
`

const subscription = graphql`
  subscription ConversationChatSubscription($conversationId: ID!) {
    conversationUpdated(conversationId: $conversationId) {
      conversation {
        id
        messages(first: 100) @connection(key: "ConversationChat_messages") {
          edges {
            node {
              id
              ...ConversationChatMessage_message
            }
          }
        }
      }
    }
  }
`

const ConversationChat = ({ conversation }) => {
  useSubscription(subscription, { conversationId: conversation.id })

  return (
    <Container>
      <Messages>
        <List>
          {conversation.messages.edges.map(({ node }) => (
            <ConversationChatMessage key={node.id} message={node} />
          ))}
        </List>
      </Messages>

      <ConversationChatField conversationId={conversation.id} />
    </Container>
  )
}

const ConversationChatQuery = graphql`
  query ConversationChatQuery($conversationId: ID!) {
    conversation(id: $conversationId) {
      id
      messages(first: 100) @connection(key: "ConversationChat_messages") {
        edges {
          node {
            id
            ...ConversationChatMessage_message
          }
        }
      }
    }
  }
`

ConversationChat.Query = ConversationChatQuery

export default ConversationChat
