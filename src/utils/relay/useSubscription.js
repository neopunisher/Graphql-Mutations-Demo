import React from 'react'
import { requestSubscription } from 'react-relay'

import environment from './environment'

const useSubscription = (subscription, variables, config = {}) => {
  const activeSubscriptionRef = React.useRef()

  React.useEffect(() => {
    activeSubscriptionRef.current = requestSubscription(environment, {
      subscription,
      variables,
      ...config,
    })

    return () => {
      if (activeSubscriptionRef.current) {
        activeSubscriptionRef.current.dispose()
      }
    }
    // eslint-disable-next-line
  }, [subscription, JSON.stringify(variables)])
}

export default useSubscription
