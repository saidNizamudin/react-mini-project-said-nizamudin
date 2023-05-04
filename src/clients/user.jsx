import { gql } from '@apollo/client';

export const INSERT_USER = gql`
	mutation INSERT_USER($email: String, $password: String, $username: String) {
		insert_user(
			objects: { email: $email, password: $password, username: $username }
			on_conflict: { constraint: user_email_key }
		) {
			returning {
				username
			}
		}
	}
`;

export const UPDATE_LOGIN_FLAG = gql`
	mutation UPDATE_LOGIN_FLAG($email: String, $password: String, $flag: Boolean) {
		update_user(
			where: { email: { _eq: $email }, password: { _eq: $password } }
			_set: { flag_login: $flag }
		) {
			returning {
				username
				id
			}
		}
	}
`;

export const SUBSCRIBE_USER = gql`
	subscription MySubscription($id: uuid) {
		user(where: { id: { _eq: $id } }) {
			flag_login
			username
			id
		}
	}
`;
