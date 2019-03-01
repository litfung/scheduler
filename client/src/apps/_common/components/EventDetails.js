import React, { useState, useEffect } from 'react';
import { ApolloConsumer, Query } from 'react-apollo';

import StepStoreContext from '../contexts/StepStoreContext';
import EventDetailsHeader from '../components/EventDetailsHeader';
import ItemSubmitForm from './ItemSubmitForm';
import EventDetailsItem from './EventDetailsItem';

import { FETCH_STEPS_BY_EVENT } from '../../../graphql/queries';
import {
	EDIT_EVENT_BY_ID,
	EDIT_EVENT_TO_DONE,
	EDIT_EVENT_TO_NOT_DONE,
	ADD_NEW_STEP,
	EDIT_STEP_BY_ID,
	DELETE_STEP,
	EDIT_STEP_TO_DONE,
	EDIT_STEP_TO_NOT_DONE
} from '../../../graphql/mutations';

const EventDetails = (props) => {
	const { event, client, pathName, hex_color } = props;

	// Grnerate Steps Obj
	const genContextObj = (prevObj, array = []) => {
		// data.readStepsByEvent
		array.map((step) => {
			prevObj[step._rank] = step;
		});

		return prevObj;
	};

	// Handle Event Delete
	const handleEventDelete = () => {};

	// Handle Event Edit
	const handleEventEdit = async ({ title, description }) => {
		await client.mutate({
			mutation: EDIT_EVENT_BY_ID,
			variables: { eventId: event._id, title, description },
			refetchQueries: [ 'readAllGroups' ],
			awaitRefetchQueries: true
		});
	};

	// Handle Event Done / Undone
	const eventDoneHandeler = async (eventId, boolean) => {
		await client.mutate({
			mutation: boolean ? EDIT_EVENT_TO_DONE : EDIT_EVENT_TO_NOT_DONE,
			variables: { eventId },
			refetchQueries: [ 'readAllGroups' ]
		});
	};

	// Handle New Step Submit
	const onStepSubmit = (title) => {
		client
			.mutate({
				mutation: ADD_NEW_STEP,
				variables: { title, _event: event._id },
				refetchQueries: [ 'readStepsByEvent' ],
				awaitRefetchQueries: true
			})
			.then(() => {
				scrollToBottom('.EventDetails-The-List-01');
			});
	};

	// Handle Event Edit
	const handleStepEdit = async ({ stepId, title }) => {
		await client.mutate({
			mutation: EDIT_STEP_BY_ID,
			variables: { stepId, title },
			refetchQueries: [ 'readStepsByEvent' ]
		});
	};

	const handleStepDelete = async (stepId) => {
		await client.mutate({
			mutation: DELETE_STEP,
			variables: { stepId },
			refetchQueries: [ 'readStepsByEvent' ]
		});
	};

	const stepDoneHandeler = async (stepId, boolean) => {
		await client.mutate({
			mutation: boolean ? EDIT_STEP_TO_DONE : EDIT_STEP_TO_NOT_DONE,
			variables: { stepId },
			refetchQueries: [ 'readStepsByEvent' ]
		});
	};

	return (
		<StepStoreContext.Consumer>
			{(context) => {
				return (
					<div className="EventDetails-c-00">
						<EventDetailsHeader
							hex_color={pathName === 'todo' ? hex_color : event.hex_color}
							event={event}
							handleEventEdit={handleEventEdit}
							eventDoneHandeler={eventDoneHandeler}
						/>

						<Query query={FETCH_STEPS_BY_EVENT} variables={{ eventId: event._id }}>
							{({ data, loading, error }) => {
								if (data) {
									genContextObj(context.steps, data.readStepsByEvent);
								}

								return (
									<div className="EventDetails-The-List-01">
										{Object.values(context.steps).map((step, i) => {
											if (step && step._event === event._id) {
												return (
													<EventDetailsItem
														key={i}
														step={step}
														hex_color={hex_color}
														handleStepEdit={handleStepEdit}
														handleStepDelete={handleStepDelete}
														stepDoneHandeler={stepDoneHandeler}
													/>
												);
											}
										})}
									</div>
								);
							}}
						</Query>

						<ItemSubmitForm placeholder="+ Add Step" onSubmit={onStepSubmit} />
					</div>
				);
			}}
		</StepStoreContext.Consumer>
	);
};

export default (props) => <ApolloConsumer>{(client) => <EventDetails {...props} client={client} />}</ApolloConsumer>;
