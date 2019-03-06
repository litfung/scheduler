import React, { useState, useEffect } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { renderRoutes } from 'react-router-config';
import { Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';

import Header2 from '../_common/components/Header2';

import { FETCH_CURRENT_USER } from '../../graphql/queries';

import { SettingsProvider } from '../_common/contexts/SettingsContext';
import { ProgressbarProvider } from '../_common/contexts/ProgressbarContext';
import { SidebarProvider } from '../_common/contexts/SidebarContext';
import { StepStoreProvider } from '../_common/contexts/StepStoreContext';

import AuthContext from '../_common/contexts/AuthContext';

const Todo = (props) => {
	return (
		<Query query={FETCH_CURRENT_USER}>
			{({ data, loading, error }) => {
				return (
					<ProgressbarProvider>
						<SettingsProvider>
							<SidebarProvider>
								<StepStoreProvider>
									<AuthContext.Provider value={{ auth: data.currentUser }}>
										<div className="Todo-a-00">
											<Header2 pathName="todo" />
											{data.currentUser ? (
												<div>{renderRoutes(props.route.routes)}</div>
											) : (
												<Redirect to="/login" />
											)}
										</div>
									</AuthContext.Provider>
								</StepStoreProvider>
							</SidebarProvider>
						</SettingsProvider>
					</ProgressbarProvider>
				);
			}}
		</Query>
	);
};

export default {
	component: (props) => <ApolloConsumer>{(client) => <Todo {...props} client={client} />}</ApolloConsumer>,
	loadData: function(client) {
		return client.query({ query: FETCH_CURRENT_USER });
	}
};

Date.prototype.getFormattedDate = function() {
	return `${this.getFullYear()}-${this.getMonth() + 1}-${this.getDate()}`;
};
