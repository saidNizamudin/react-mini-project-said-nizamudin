import { gql } from '@apollo/client';

export const SUBSCRIBE_LIST = gql`
	subscription SUBSCRIBE_LIST($user_id: uuid) {
		list(where: { user_id: { _eq: $user_id } }) {
			id
			name
			description
			created_at
		}
	}
`;

export const INSERT_LIST = gql`
	mutation INSERT_LIST($name: String, $description: String, $user_id: uuid) {
		insert_list(objects: { name: $name, description: $description, user_id: $user_id }) {
			returning {
				id
				name
			}
		}
	}
`;

export const DELETE_LIST = gql`
	mutation DELETE_LIST($id: uuid) {
		delete_list(where: { id: { _eq: $id } }) {
			returning {
				id
				name
			}
		}
	}
`;

export const UPDATE_LIST = gql`
	mutation UPDATE_LIST($description: String, $name: String, $id: uuid) {
		update_list(where: { id: { _eq: $id } }, _set: { description: $description, name: $name }) {
			returning {
				name
				description
			}
		}
	}
`;
