import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
	uri: 'https://mini-project-said.hasura.app/v1/graphql',
	cache: new InMemoryCache(),
	headers: {
		'x-hasura-admin-secret': 'cjOMg6PacQrRunSUABwOqPc9h8W43P6Nx34oB4O6upK7OUI2LzHq5CNk2CDF5uny',
	},
});

export default client;
