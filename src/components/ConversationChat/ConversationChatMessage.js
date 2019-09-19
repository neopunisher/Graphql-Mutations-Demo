import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import { useFragment } from 'relay-hooks'

const messageFragment = graphql`
  fragment ConversationChatMessage_message on Message {
    admin
    text
  }
`

function ConversationChatMessage(props) {
  const message = useFragment(messageFragment, props.message)

  return (
    <ListItem>
      <ListItemText
        primary={message.admin ? 'Admin' : 'You'}
        secondary={message.text}
      />
    </ListItem>
  )
}

export default ConversationChatMessage
