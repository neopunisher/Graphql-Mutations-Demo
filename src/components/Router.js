import { BrowserProtocol, queryMiddleware } from 'farce'
import { createFarceRouter, createRender, makeRouteConfig, Route } from 'found'
import React from 'react'

import Main from './Main'

const Empty = () => null

const routeConfig = (
  <Route path="/">
    <Route Component={Main} />
  </Route>
)

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(routeConfig),
  render: createRender({}),
})

export default Router
