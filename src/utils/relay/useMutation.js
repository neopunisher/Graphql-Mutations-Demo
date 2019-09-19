import React from 'react'
import { commitMutation } from 'react-relay'

import environment from './environment'

const useMutation = (mutation, callback) => {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const commit = variables => {
    setLoading(true)

    commitMutation(environment, {
      mutation,
      variables,
      onCompleted: response => {
        setError(null)
        setLoading(false)
      },
      onError: err => {
        setError(err.toString())
        setLoading(false)
      },
    })
  }

  return [commit, { error, loading }]
}

export default useMutation
