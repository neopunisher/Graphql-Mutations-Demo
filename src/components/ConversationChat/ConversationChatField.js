import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import { useMutation } from 'react-relay-mutation'
import styled from 'styled-components'

const Container = styled.div`
  background: #fff;
  border-top: 1px solid #e6e6e6;
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
`

const Input = styled.input.attrs({
  type: 'text',
})`
  background: none;
  border: 0;
  flex-grow: 1;
  font-size: 1rem;
  height: 40px;
  outline: 0;
  padding: 0.5rem 1rem;
`

const SubmitButton = styled.button`
  background: #56A2F7;
  border: 0;
  color: #fff;
  font-size: 1rem;
  height: 56px;
  padding: 0.5rem 1rem;
  outline: 0;
`

const mutation = graphql`
  mutation ConversationChatFieldMutation($input: AddMessageInput!) {
    addMessage(input: $input) {
      messageEdge {
        node {
          id
          ...ConversationChatMessage_message
        }
      }
    }
  }
`

const ConversationChatField = ({ conversationId, isAdmin }) => {
  const [message, setMessage] = React.useState('')

  const [mutate, { loading }] = useMutation(mutation, {
    configs: [
      {
        type: 'RANGE_ADD',
        parentID: conversationId,
        connectionInfo: [
          {
            key: 'ConversationChat_messages',
            rangeBehavior: 'append',
          },
        ],
        edgeName: 'messageEdge',
      },
    ],
    onCompleted: () => {
      setMessage('')
    },
  })

  const handleSend = () => {
    mutate({
      variables: {
        input: {
          conversationId: conversationId,
          admin: isAdmin,
          text: message,
        },
      },
    })
  }

  const handleChange = React.useCallback(event => {
    setMessage(event.target.value)
  }, [])

  return (
    <Container>
      <Input onChange={handleChange} value={message} />
      {message ? (
        <SubmitButton disabled={loading} onClick={handleSend}>
          Send
        </SubmitButton>
      ) : null}
    </Container>
  )
}

export default ConversationChatField
