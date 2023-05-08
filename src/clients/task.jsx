import { gql } from '@apollo/client';

export const SUBSCRIBE_TASK = gql`
	subscription SUBSCRIBE_TASK($list_id: uuid) {
		task(
			where: { list_id: { _eq: $list_id } }
			order_by: [{ is_prioritize: desc }, { deadline: asc }]
		) {
			id
			name
			status
			deadline
			image
			description
			is_prioritize
		}
	}
`;

export const GET_TASK_BY_ID = gql`
	query GET_TASK_BY_ID($id: uuid) {
		task(where: { id: { _eq: $id } }) {
			id
			name
			deadline
			status
			image
			description
		}
	}
`;

export const INSERT_TASK = gql`
	mutation INSERT_TASK(
		$name: String
		$description: String
		$deadline: timestamptz
		$status: String
		$image: String
		$list_id: uuid
		$user_id: uuid
	) {
		insert_task(
			objects: {
				name: $name
				description: $description
				user_id: $user_id
				deadline: $deadline
				image: $image
				list_id: $list_id
				status: $status
			}
		) {
			returning {
				id
				name
			}
		}
	}
`;

export const DELETE_TASK = gql`
	mutation DELETE_TASK($id: uuid) {
		delete_task(where: { id: { _eq: $id } }) {
			returning {
				id
				name
			}
		}
	}
`;

export const UPDATE_TASK = gql`
	mutation UPDATE_TASK(
		$id: uuid
		$name: String
		$deadline: timestamptz
		$status: String
		$image: String
		$description: String
	) {
		update_task(
			where: { id: { _eq: $id } }
			_set: {
				name: $name
				deadline: $deadline
				status: $status
				image: $image
				description: $description
			}
		) {
			returning {
				id
				name
			}
		}
	}
`;

export const UPDATE_TASK_STATUS = gql`
	mutation UPDATE_TASK_STATUS($id: uuid, $status: String) {
		update_task(where: { id: { _eq: $id } }, _set: { status: $status }) {
			returning {
				id
				status
			}
		}
	}
`;

export const UPDATE_TASK_PRIORITY = gql`
	mutation UPDATE_TASK_PRIORITY($id: uuid, $is_prioritize: Boolean) {
		update_task(where: { id: { _eq: $id } }, _set: { is_prioritize: $is_prioritize }) {
			returning {
				id
				is_prioritize
			}
		}
	}
`;
