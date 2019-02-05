import React from 'react';
import { connect } from 'react-redux';

import { funcHandleYear, funcHandleMonth } from '../../../utils/funcs';
import { builtin_color_list } from '../../../utils/constants';

import { asyncFetchGroups, asyncPostGroup, asyncEditGroup, asyncDeleteGroup } from '../../../actions/group_actions';
import CalendarContentComp from './calendar_content';
import CalendarSidebarNavigator from './calendar_sidebar_navigator';
import CalendarSidebarItem from './calendar_sidebar_item';

class CalendarSidebarComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      newGroupTitle: ''
    };
  }

  handleNavigation = (bool) => {
    this.setState((prevState) => ({
      year: funcHandleYear(prevState.year, prevState.month, bool),
      month: funcHandleMonth(prevState.month, bool)
    }));
  }

  navigateToNow = () => {
    this.setState((prevState) => ({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    }));
  }

  async componentDidMount() {
    this.props.asyncFetchGroups();

    const urlParams = new URLSearchParams(window.location.search);
    await this.setState({
      year: parseInt(urlParams.get('year')) || new Date().getFullYear(),
      month: parseInt(urlParams.get('month')) || new Date().getMonth(),
    });
  }

  render() {
    // console.log('this.props.visible', this.props.visible);    
    return (
      <div className={`calendar-sidebar-000 ${!this.props.visible ? 'sidebar-slided-right' : 'sidebar-slided-left'}`}>
        <CalendarSidebarNavigator
          miniCalendarState={{ year: this.state.year, month: this.state.month }}
          handleNavigation={this.handleNavigation}
          navigateToNow={this.navigateToNow}
        />
        
        <CalendarContentComp miniCalendarState={this.state} miniCalendar={true}/>

        <div className='any-list-comp-container-999'>
          <div
            style={{ height: 'calc(100% - 7px)' }}
            className='calendar-sidebar-001-the-list any-list-comp-the-list-999'
          >
            {this.props.groups.map((group, i) => (
              <CalendarSidebarItem
                key={i}
                index={i}
                group={group}
                asyncEditGroup={this.props.asyncEditGroup}
                asyncDeleteGroup={this.props.asyncDeleteGroup}
                color_options={[ ...builtin_color_list, ...this.props.auth.custom_colors]}
                changeColorFunc={async (color) => {             
                  await this.props.asyncEditGroup(group._id, { hex_color: color });
                }}
              />
            ))}
          </div>
          <form
            style={{ bottom: '0px' }}
            id='calendar-sidebar-add-group-form-x1'
            className='any-list-comp-bottom-form-999'
            onSubmit={async (e) => {
              e.preventDefault();              
              if (this.state.newGroupTitle !== '') {
                await this.props.asyncPostGroup({ title: this.state.newGroupTitle });
              };
              this.setState({ newGroupTitle: '' });
              scrollToBottom('.calendar-sidebar-001-the-list');
            }}
          >
            <input
              id='calendar-sidebar-add-group-input-x1'
              name='title'
              autoComplete='off'
              placeholder='+ New Group'
              value={this.state.newGroupTitle}
              onChange={(e) => {
                this.setState({ newGroupTitle: e.target.value });
              }}
            />
            {this.state.newGroupTitle !== '' && (
              <button
                name='Add New Item'
                className='any-list-comp-form-submit-btn-003'
                type='submit'
              >Add</button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ groups, auth }) => ({
  auth,
  groups: groups.sort((a, b) => a._rank > b._rank ? 1 : -1)
});

const mapDispatchToProps = (dispatch) => ({
  asyncFetchGroups: () => dispatch(asyncFetchGroups()),
  asyncPostGroup: (abc) => dispatch(asyncPostGroup(abc)),
  asyncEditGroup: (abc, xyz) => dispatch(asyncEditGroup(abc, xyz)),
  asyncDeleteGroup: (abc) => dispatch(asyncDeleteGroup(abc)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarSidebarComp);