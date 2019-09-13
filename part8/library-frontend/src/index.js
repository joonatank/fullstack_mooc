import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql'
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

const link = split(
  ({ query }) => {
    const {kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>, document.getElementById('root')
)
