import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { SET_CALENDAR_MONTH_STATE } from '../../actions/_action_types';
import CalendarRowComp from './calendar_row';

class CalendarContentComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstDay: 0
    };
  }

  findMomentMonth = (year, month) => {
    let temp_text;
    if (month.toString().length === 1) temp_text = `${year}-0${month}`;
    else temp_text = `${year}-${month}`;
    return moment(temp_text);
  }

  componentWillReceiveProps({ year, month }) {
    const temp_first_day = this.findMomentMonth(year, month).startOf('month').day();

    if (temp_first_day !== this.state.firstDay) {
      this.setState({ firstDay: temp_first_day });
    }
  }

  // 42 Boxes => 0 to 41

  render() {
    const monthNow = this.findMomentMonth(this.props.year, this.props.month);
    const numDatesThis = parseInt(monthNow.endOf('month').format('D'));
    const numDatesPrev = parseInt(monthNow.subtract(1, 'month').endOf('month').format('D'));
    const numDatesNext = parseInt(monthNow.add(2, 'month').endOf('month').format('D')); // Cause these functions changes the object
    

    const inFiveRows = (this.state.firstDay + numDatesThis) <= 35;    
    let rowArr;
    if (inFiveRows) rowArr = [1, 2, 3, 4, 5];
    else rowArr = [1, 2, 3, 4, 5, 6];
    
    return (
      <div className='calendar-content-000'>
        {rowArr.map((x, i) => {
          return (
            <CalendarRowComp
              key={i}
              index={i}
              numDatesPrev={numDatesPrev}
              numDatesThis={numDatesThis}
              rowFirstDate={((7 * (i - 1)) + 1) + (7 - this.state.firstDay)}
              inFiveRows={inFiveRows}
              // events
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = ({ calendarMonth, events }) => ({
  year: calendarMonth.year,
  month: calendarMonth.month,
  events: events
});

const mapDispatchToProps = (dispatch) => ({
  setReduxCalendar: ({ year, month }) => dispatch({ type: SET_CALENDAR_MONTH_STATE, year, month })
})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarContentComp);