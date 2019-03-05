import React, { useState, useEffect } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { GoCheck } from 'react-icons/go';
import { FaCircle } from 'react-icons/fa';

import EventGroupSelector from '../../_common/components/EventGroupSelector';
import EventDatepicker from '../../_common/components/EventDatepicker';

import { ADD_NEW_EVENT } from '../../../graphql/mutations';

const CalendarEventForm = (props) => {
	const { event, setNewEvent, groups, animatedClosing, client } = props;

	const [ title, setTitle ] = useState(event.title);
	const [ date_from, setDate_from ] = useState(event.date_from);
	const [ date_to, setDate_to ] = useState(event.date_to);
	const [ selectedGroupId, setSelectedGroupId ] = useState(
		groups.filter(({ _isOnCalendar }) => _isOnCalendar)[0]._id || groups[0]._id
	);

	const handleEventDateEdit = (args) => {
		// setNewEvent({ ...event, date_from, date_to });
		setDate_from(args.date_from || date_from);
		setDate_to(args.date_to || date_to);
	};

	const handleEventEdit = ({ _group }) => {
		setSelectedGroupId(_group);
	};

	const handleSubmit = () => {
		if (title.length > 0) {
			animatedClosing(async () => {
				await client.mutate({
					mutation: ADD_NEW_EVENT,
					variables: { title, _group: selectedGroupId, date_from, date_to },
					refetchQueries: [ 'readGroupsOnCalendar' ],
					awaitRefetchQueries: true
				});
			});
		}
	};

	return (
		<div className="CalendarEventModal-c-00" onClick={(e) => e.stopPropagation()}>
			<div className="CalendarEventModal-Title-Div-01">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmit();
					}}
				>
					<input
						autoFocus={true}
						className="Theme-Input-Underline-OnFoucs-99"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</form>
			</div>

			<EventDatepicker event={{ date_from, date_to }} handleEventDateEdit={handleEventDateEdit} />

			{selectedGroupId && (
				<EventGroupSelector
					event={{ _group: selectedGroupId }}
					groups={groups}
					handleEventEdit={handleEventEdit}
				/>
			)}

			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					marginTop: '10px'
				}}
			>
				<button name="Add a new Event" className={`Theme-Btn-Type2-Normal-99`} onClick={handleSubmit}>
					Save
				</button>
			</div>
		</div>
	);
};

export default (props) => (
	<ApolloConsumer>{(client) => <CalendarEventForm {...props} client={client} />}</ApolloConsumer>
);
