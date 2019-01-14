import React, { Component } from 'react';
import { connect } from 'react-redux';
import Datepicker from 'awesome-react-datepicker';
import { Selector, Option } from 'react-dropdown-selector';
import { GoCheck } from 'react-icons/go';
import { FaCircle } from 'react-icons/fa';

import { asyncDeleteEvent, asyncEditEventDate, asyncEditEvent } from '../../actions/event_actions';

class CalendarEventViewComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editTitle: true,
      dFromAsync: false,
      dToAsync: false,
      groupAsync: false,
    };
  }

  render() {
    const { editTitle, dFromAsync, dToAsync, groupAsync } = this.state;
    const { event } = this.props;
    const groupNow = this.props.groups.find(({ _id }) => _id === event._group);

    return (
      <div className='calendar-event-view-comp-000' onClick={(e) => e.stopPropagation()}>
        <div className='calendar-event-view-title-box-001'>
          {editTitle ? (
            <form>
              <input
                value='React Native'
              />
            </form>
          ) : (
            <p>React Native</p>
          )}
        </div>
        <div className='calendar-event-view-dates-box-001'>
          <Datepicker uniqueId={'sakcjaskca-1'}
            initDate={new Date(event.date_from)}
            onDateSelect={(timeStamp) => {
              this.setState({ dFromAsync: true });
              this.props.asyncEditEventDate(event._id, { date_from: timeStamp }).then(() => {
                this.setState({ dFromAsync: false });
              });
            }}
          >
            <button className={`view-dates-box-btn-002 ${dFromAsync && 'view-dates-box-btn-002-async'}`}>
              {new Date(event.date_from).getFormattedDate()}
            </button>
          </Datepicker>

          <p style={{ margin: '5px' }}>to</p>

          <Datepicker uniqueId={'sakcjaskca-1'}
            initDate={new Date(event.date_to)}
            onDateSelect={(timeStamp) => {
              this.setState({ dToAsync: true });
              this.props.asyncEditEventDate(event._id, { date_to: timeStamp }).then(() => {
                this.setState({ dToAsync: false });
              });
            }}
          >
            <button className={`view-dates-box-btn-002 ${dToAsync && 'view-dates-box-btn-002-async'}`}>
              {new Date(event.date_to).getFormattedDate()}
            </button>
          </Datepicker>
        
        </div>
        <div className='calendar-event-view-group-delector-box-001'>
        <Selector
          onSelect={(id) => {
            this.setState({ groupAsync: true });
            this.props.asyncEditEvent(event._id, { _group: id }).then(() => {
              this.setState({ groupAsync: false });
            });
          }}
          inputHeight={36}
          optionHeight={36}
          numOptions={5}
          numOptionsVisible={4}
          selectorBoxShadow='0px 3px 13px 0px rgba(0,0,0,0.20)'
          renderBtn={() => (
            <p
              className={`any-dropdown-content-item-999 ${groupAsync && 'view-group-delector-box-002-async'}`}
            >
              <FaCircle style={groupAsync ? {
                marginRight: '8px', marginBottom: '-2px'
              } : { color: groupNow.hex_color, marginRight: '8px', marginBottom: '-2px' }}/>
              {groupNow.title}
            </p>
          )}
        >
          {this.props.groups.map((group) => (
            <Option id={group._id}><p className='any-dropdown-content-item-999' style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', flexDirection: 'row', lignItems: 'center' }}>
                <FaCircle style={{ color: group.hex_color, marginRight: '8px', marginBottom: '-2px' }}/>
                {group.title}
              </div>
              {group._id === groupNow._id && <GoCheck />}
            </p></Option>
          ))}
        </Selector>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ groups }) => ({ groups });

const mapDispatchToProps = (dispatch) => ({
  asyncDeleteEvent: (xyz) => dispatch(asyncDeleteEvent(xyz)),
  asyncEditEventDate: (xyz, abc) => dispatch(asyncEditEventDate(xyz, abc)),
  asyncEditEvent: (xyz, abc) => dispatch(asyncEditEvent(xyz, abc)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarEventViewComp);