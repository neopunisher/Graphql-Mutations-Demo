import { get } from 'lodash'
import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import styled from 'styled-components'
import List from '@material-ui/core/List'

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

const ConversationChat = ({ conversation, match }) => {
  const isAdmin = !!get(match.route, 'data.isAdmin')

  return (
    <Container>
      <Messages>
        <List>
          {conversation.messages.edges.map(({ node }) => (
            <ConversationChatMessage
              key={node.id}
              isAdmin={isAdmin}
              name={conversation.name}
              message={node}
            />
          ))}
        </List>
      </Messages>

      <ConversationChatField
        conversationId={conversation.id}
        isAdmin={isAdmin}
      />
    </Container>
  )
}

const ConversationChatQuery = graphql`
  query ConversationChatQuery($conversationId: ID!) {
    conversation(id: $conversationId) {
      id
      name
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
