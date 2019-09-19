import graphql from 'babel-plugin-relay/macro'
import React from 'react'
import { useMutation } from 'react-relay-mutation'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

const Container = styled.div`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  width: 100%;
`

const Content = styled.div`
  padding: 1rem;

  & > :not(:first-child) {
    margin-top: 0.5rem;
  }
`

const mutation = graphql`
  mutation MainMutation($input: StartConversationInput!) {
    startConversation(input: $input) {
      conversation {
        id
      }
    }
  }
`

const Main = ({ router }) => {
  const [name, setName] = React.useState('')

  const [mutate] = useMutation(mutation, {
    onCompleted: ({ startConversation }) => {
      router.push(`/conversation/${startConversation.conversation.id}`)
    },
  })

  const handleStart = () => {
    mutate({
      variables: {
        input: {
          name,
        },
      },
    })
  }

  return (
    <Container>
      <Paper>
        <Content>
          <h2>Help</h2>
          <p>To get started, tell us your name.</p>

          <TextField
            id="standard-name"
            label="Name"
            value={name}
            onChange={event => setName(event.target.value)}
            margin="normal"
          />

          <div>
            <Button variant="contained" color="primary" onClick={handleStart}>
              Get Started
            </Button>
          </div>
        </Content>
      </Paper>
    </Container>
  )
}

export default Main
