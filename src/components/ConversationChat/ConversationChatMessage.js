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

const getName = (message, name, isAdmin) => {
  if (isAdmin && message.admin) {
    return 'You'
  }

  if (isAdmin) {
    return name
  }

  if (message.admin) {
    return 'Admin'
  }

  return 'You'
}

function ConversationChatMessage({ isAdmin, name, ...props }) {
  const message = useFragment(messageFragment, props.message)

  return (
    <ListItem>
      <ListItemText
        primary={getName(message, name, isAdmin)}
        secondary={message.text}
      />
    </ListItem>
  )
}

export default ConversationChatMessage
