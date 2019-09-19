import graphql from 'babel-plugin-relay/macro'
import { Link } from 'found'
import { useFragment } from 'relay-hooks'
import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const conversationFragment = graphql`
  fragment AdminConversationsList_conversations on Conversation
    @relay(plural: true) {
    id
    name
  }
`

function AdminConversationsList(props) {
  const conversations = useFragment(conversationFragment, props.conversations)

  return (
    <List>
      {conversations.map(conversation => (
        <Link
          as={ListItem}
          button
          to={`/admin/${conversation.id}`}
          key={conversation.id}
        >
          <ListItemText primary={conversation.name} />
        </Link>
      ))}
    </List>
  )
}

export default AdminConversationsList
