import React from 'react';

import { FETCH_ALL_GROUPS } from '../../../graphql/queries';
import { Query } from 'react-apollo';

import TodoComp from './TodoComp';

const TodoPage = (props, staticContext) => {
	return (
		<Query query={FETCH_ALL_GROUPS}>
			{({ data, loading, error }) => {
				console.log('data', data);

				return (
					<React.Fragment>
						{data.readAllGroups ? (
							<TodoComp staticContext={staticContext} groups={data.readAllGroups || []} />
						) : (
							<div>Unable to Fetch Data, try Again</div>
						)}
					</React.Fragment>
				);
			}}
		</Query>
	);
};

export default {
	component: TodoPage,
	loadData: function(client) {
		return client.query({ query: FETCH_ALL_GROUPS });
	}
};
