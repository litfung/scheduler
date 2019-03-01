import gql from 'graphql-tag';

export const LOGIN_USER = gql`
	mutation loginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			_id
			email
			name
			avatar_url
			custom_colors
		}
	}
`;

export const REGISTER_USER = gql`
	mutation registerUser($email: String!, $name: String!, $password: String!) {
		registerUser(email: $email, name: $name, password: $password) {
			_id
			email
			name
			avatar_url
			custom_colors
		}
	}
`;

export const ADD_NEW_GROUP = gql`
	mutation createGroup($title: String!) {
		createGroup(title: $title) {
			_id
			title
		}
	}
`;

export const EDIT_GROUP_BY_ID = gql`
	mutation editGroupById($groupId: ID!, $title: String, $hex_color: String) {
		editGroupById(groupId: $groupId, title: $title, hex_color: $hex_color) {
			_id
			title
		}
	}
`;

export const DELETE_GROUP = gql`
	mutation deleteGroup($groupId: ID!) {
		deleteGroup(groupId: $groupId) {
			_id
		}
	}
`;

export const ADD_NEW_EVENT = gql`
	mutation createEvent($title: String!, $groupId: ID!) {
		createEvent(title: $title, _group: $groupId) {
			_id
		}
	}
`;

export const EDIT_EVENT_TO_DONE = gql`
	mutation editEventToDone($eventId: ID!) {
		editEventToDone(eventId: $eventId) {
			_id
		}
	}
`;

export const EDIT_EVENT_TO_NOT_DONE = gql`
	mutation editEventToNotDone($eventId: ID!) {
		editEventToNotDone(eventId: $eventId) {
			_id
		}
	}
`;

//
