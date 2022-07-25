import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { Socket as PhoenixSocket } from "phoenix";
import { create } from "@absinthe/socket";
import { createAbsintheSocketLink } from "@absinthe/socket-apollo-link";

const httpServer = "http://localhost:4000";

const webSocketPrefix = import.meta.env.PROD ? "wss" : "ws";
const wsEndpoint = `${webSocketPrefix}${httpServer.substring(
  httpServer.indexOf(":")
)}/graphql_socket`;

const phoenixSocket = new PhoenixSocket(wsEndpoint);

const absintheSocket = create(phoenixSocket);
const absintheSocketLink = createAbsintheSocketLink(absintheSocket);

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: "http://localhost:3020/graphql",
});

export const fullLink = absintheSocketLink.concat(httpLink);

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: fullLink,
  cache,
});
