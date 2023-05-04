import { split, HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const WS_ENDPOINT = import.meta.env.VITE_REACT_APP_GRAPHQL_WS_ENDPOINT;
const API_ENDPOINT = import.meta.env.VITE_REACT_APP_GRAPHQL_API_ENDPOINT;
const ADMIN_SECRET = import.meta.env.VITE_REACT_APP_GRAPHQL_ADMIN_SECRET;

const httpLink = new HttpLink({
	uri: API_ENDPOINT,
	headers: {
		'x-hasura-admin-secret': ADMIN_SECRET,
	},
});

const wsLink = new WebSocketLink(
	new SubscriptionClient(WS_ENDPOINT, {
		reconnect: true,
		connectionParams: {
			headers: {
				'x-hasura-admin-secret': ADMIN_SECRET,
			},
		},
	})
);

const splitLink = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLink
);

const apolloClient = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache(),
});

export default apolloClient;
