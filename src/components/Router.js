import { BrowserProtocol, queryMiddleware } from 'farce'
import { createFarceRouter, createRender, makeRouteConfig, Route } from 'found'
import React from 'react'

import AdminLayout from './AdminLayout'
import ConversationChat from './ConversationChat'
import Main from './Main'

const Empty = () => null

const routeConfig = (
  <Route path="/">
    <Route Component={Main} />
    <Route
      path="/conversation/:conversationId"
      Component={ConversationChat}
      query={ConversationChat.Query}
    />
    <Route path="admin" Component={AdminLayout} query={AdminLayout.Query}>
      <Route Component={Empty} />
      <Route
        data={{ isAdmin: true }}
        path=":conversationId"
        Component={ConversationChat}
        query={ConversationChat.Query}
      />
    </Route>
  </Route>
)

const Router = createFarceRouter({
  historyProtocol: new BrowserProtocol(),
  historyMiddlewares: [queryMiddleware],
  routeConfig: makeRouteConfig(routeConfig),
  render: createRender({}),
})

export default Router
