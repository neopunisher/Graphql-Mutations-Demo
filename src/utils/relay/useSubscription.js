import React from 'react'
import { requestSubscription } from 'react-relay'

import environment from './environment'

const useSubscription = (subscription, variables, config) => {
  React.useEffect(() => {
    const activeSubscription = requestSubscription(environment, {
      subscription,
      variables,
      ...config,
    })

    return () => {
      activeSubscription.dispose()
    }
    // eslint-disable-next-line
  }, [])
}

export default useSubscription
