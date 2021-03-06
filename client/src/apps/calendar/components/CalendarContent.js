import React, { useState, useEffect } from 'react';
import Dropdown from 'react-dropdown-modal';

import CalendarRow from './CalendarRow';
import CalendarEventForm from './CalendarEventForm';

const CalendarContent = (props) => {
	const { groups, events, miniCalendar, miniCalendarState, handleUrlNavigation, setActiveEvent } = props;

	const dateProps = miniCalendar ? miniCalendarState : props;
	const { month, year } = dateProps;

	// States (Hooks)
	const [ dayOneIndex, setDayOneIndex ] = useState(new Date(year, month, 1).getDay());
	const [ dateDistMap, setDateDistMap ] = useState(null);
	const [ dateDistMapInverse, setDateDistMapInverse ] = useState(null);
	const [ eventDistMap, setEventDistMap ] = useState(null);
	const [ newEvent, setNewEvent ] = useState(null);
	const [ dropdown, setDropdown ] = useState(false);
	const [ dropdown_close, setDropdown_close ] = useState(false);
	// dropdown_visible: false,
	// dropdown_close: false

	// Grnerate & Update Date Distribution Object
	const updateDateDistribution = async (argYear, argMonth, argDayOneIdx) => {
		const tempDistMap = {};
		const tempDistMapInverse = {};

		// Loop for 42 Times - for 42 Box-es
		for (let k = 0; k < 42; k++) {
			const value = new Date(argYear, argMonth, k - argDayOneIdx + 1).valueOf();
			tempDistMap[k] = value;
			tempDistMapInverse[value] = k;
		}

		await setDateDistMap(tempDistMap);
		setDateDistMapInverse(tempDistMapInverse);
	};

	const updateEventDistribution = async () => {
		const tempEventDistMap = {};

		if (events) {
			// Filter event's that are only from 3 current months - This, Prev, Next
			const myEvents = events.filter(({ date_from, date_to, title }) => {
				const x =
					// date_from >= dateDistMap[0] && date_to <= dateDistMap[41]
					// || date_from >= dateDistMap[0] && date_from <= dateDistMap[41]
					// || date_to >= dateDistMap[0] && date_to <= dateDistMap[41]
					(date_from >= dateDistMap[0] && date_to <= dateDistMap[41]) ||
					(date_from >= dateDistMap[0] && date_from <= dateDistMap[41]) ||
					(date_from <= dateDistMap[0] && date_to >= dateDistMap[0]);
				// || date_from <= dateDistMap[0] && date_to <= dateDistMap[41]
				// || date_to >= dateDistMap[0] && date_to <= dateDistMap[41]

				return x;
			});

			// Map over myEvents to build a Event-map
			await myEvents.map((event) => {
				// Event start and end timestamp
				const eventStart = new Date(event.date_from).setHours(0, 0, 0, 0).valueOf();
				const eventEnd = new Date(event.date_to).setHours(0, 0, 0, 0).valueOf();

				// Event start and end index (index on calendar => 0-to-41)
				const startIndex = eventStart < dateDistMap[0] ? 0 : dateDistMapInverse[eventStart];
				const endIndex = eventEnd > dateDistMap[41] ? 41 : dateDistMapInverse[eventEnd];

				// Setting startIndex & endIndex on the event object
				event.startIndex = startIndex;
				event.endIndex = endIndex;

				// console.log(event);

				// tempLength => records length of calendar-index (only where startIndex matches)
				let tempLength;
				if (Array.isArray(tempEventDistMap[startIndex])) {
					// tempLength = tempEventDistMap[startIndex].length;

					// setDone => saves from adding two same eventObj
					let setDone = false;
					// loop over elements of calendar-index (only where startIndex matches)
					for (let f = 0; f < tempEventDistMap[startIndex].length; f++) {
						// if some spot is { null } it sets the new event there
						if (tempEventDistMap[startIndex][f].val === null) {
							tempEventDistMap[startIndex][f] = { val: event };
							tempLength = f;
							setDone = true;
							break;
						}
					}
					// if no { null } element then concat the eventObj
					if (!setDone) {
						tempLength = tempEventDistMap[startIndex].length;
						tempEventDistMap[startIndex] = [ ...tempEventDistMap[startIndex], { val: event } ];
					}
				} else {
					// If the value on tempEventDistMap is not an array
					tempLength = 0;
					tempEventDistMap[startIndex] = [ { val: event } ];
				}

				// For loop that iretates between { startIndex + 1 } and { endIndex } & sets the value to { false }
				for (let k = startIndex + 1; k <= endIndex; k++) {
					// To ignore the null spaces
					for (let g = 0; g < tempLength; g++) {
						if (Array.isArray(tempEventDistMap[k]) && tempEventDistMap[k][g]) {
							if (k % 7 !== 0 && tempEventDistMap[k][g].val !== false) {
								tempEventDistMap[k][g] = { val: null };
							}
						} else {
							tempEventDistMap[k] = [ { val: null } ];
						}
					}

					// If finds all { false } on the loop, concat { false }
					// But if Calendar-index is start of row add rest of the same event to it
					if (k % 7 === 0) {
						const tempEvent = { ...event };
						tempEvent.startIndex = k;
						tempEvent.endIndex = endIndex;

						if (Array.isArray(tempEventDistMap[k])) {
							tempEventDistMap[k][tempLength] = { val: tempEvent };
						} else {
							tempEventDistMap[k] = [ { val: { ...tempEvent } } ];
						}
					} else {
						if (Array.isArray(tempEventDistMap[k])) {
							tempEventDistMap[k][tempLength] = { val: false, refEvent: event };
						} else {
							tempEventDistMap[k] = [ { val: false, refEvent: event } ];
						}
					}
				}
			});

			await setEventDistMap(tempEventDistMap);
		}
	};

	useEffect(
		() => {
			if (!miniCalendar && dateDistMap && dateDistMapInverse) {
				updateEventDistribution();
			}
		},
		[ dateDistMap, dateDistMapInverse, events ]
	);

	useEffect(
		() => {
			(async () => {
				setDayOneIndex(new Date(year, month, 1).getDay());
				await updateDateDistribution(year, month, new Date(year, month, 1).getDay());
			})();
		},
		[ year, month ]
	);
	// }, [ year, month ])

	// Number of Days Current Month
	const numDatesThis = new Date(year, month + 1, 0).getDate();
	// Number of Days Previous Month
	const numDatesPrev = new Date(year, month, 0).getDate();
	// Checking Number of Days in Current Month
	const isFiveRows = dayOneIndex + numDatesThis <= 35;
	// Row for Iretating
	const rowArr = isFiveRows ? [ 1, 2, 3, 4, 5 ] : [ 1, 2, 3, 4, 5, 6 ];

	return (
		<div className={miniCalendar ? 'CalendarContent-c-00-Mini' : 'CalendarContent-c-00'}>
			{rowArr.map((x, i) => {
				return (
					<CalendarRow
						key={i}
						index={i}
						numDatesPrev={numDatesPrev} // Number of days in the Previous Month
						numDatesThis={numDatesThis} // Number of days in the This Month
						year={year} // { year } from (probably) context State
						month={month} // { month } from (probably) context State
						isFiveRows={isFiveRows} // if a 5-row-month { true } else { flase }
						handleUrlNavigation={handleUrlNavigation} // Function for Month Navigation + URL
						dateDistMap={dateDistMap || {}} // { dateDistMap } from Component-State
						dateDistMapInverse={dateDistMapInverse || {}} // { dateDistMapInverse } from Component-State
						eventDistMap={eventDistMap || {}} // { eventDistMap } from Component-State
						// For Mini-Calendar Only
						miniCalendar={miniCalendar} // If it's Mini-Calendar or Not
						miniCalendarState={miniCalendarState} // Mini-Calendar State { year } and { month }
						// For Big-Calendar Only
						setActiveEvent={setActiveEvent} // For Event Details
						newEventModalFunc={(obj) => setNewEvent(obj)}
					/>
				);
			})}
			{!miniCalendar &&
			newEvent && (
				<Dropdown
					visible={newEvent}
					onClose={() => setNewEvent(null)}
					// onButtonClick={() => setDropdown(true)}
					// preventDefaultClose={false}
					animation={true}
					animeType="slideUp"
					animeDuration={200}
					animatedClose={dropdown_close}
					showArrow={false}
					centerPositioning={true}
					modalShadow="0px 3px 13px 0px rgba(0,0,0,0.20)"
					modalBorder={false}
					modalContent={() => (
						<CalendarEventForm
							addEvent={true}
							event={newEvent}
							groups={groups}
							setNewEvent={setNewEvent}
							animatedClosing={async (someFunc) => {
								setDropdown_close(true);
								await someFunc();
								setTimeout(() => {
									setNewEvent(null);
									setDropdown_close(false);
								}, 200);
							}}
						/>
					)}
				>
					<div style={{ background: 'black', height: '300px', display: 'none' }} />
				</Dropdown>
			)}
		</div>
	);
};

export default CalendarContent;
