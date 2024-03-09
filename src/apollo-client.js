import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

export const baseURL = "http://localhost:3001";

const httpLink = new HttpLink({
  uri: `${baseURL}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    uri: `${baseURL}/graphql`,
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  ssrMode: true,
  link: splitLink,
  cache: new InMemoryCache(),
});
