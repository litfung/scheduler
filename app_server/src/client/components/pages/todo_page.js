import React from 'react';
import { connect } from 'react-redux';

import { handleAppMode } from '../../actions/app_mode_actions';
import { asyncFetchGroups } from '../../actions/group_actions';
import TodoSidebarComp from '../partials/todo_sidebar';

export class TodoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupId: ''
    }
  }

  changeGroupId = (groupId) => {
    this.setState({ groupId });
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({ groupId: urlParams.get('group') });
    this.props.handleAppMode(1);
    this.props.asyncFetchGroups();
  }
  
  render() {
    return (
      <div className='todo-page-000'>
        {this.props.sideBar && (
          <TodoSidebarComp groups={this.props.groups} changeGroupId={this.changeGroupId} />
        )}
        <p>GropuName -  {this.state.groupId}</p>
      </div>
    );
  }
}

const mapStateToProps = ({ groups, sideBar }) => ({ groups, sideBar });

const mapDispatchToProps = (dispatch) => ({
  handleAppMode: (x) => dispatch(handleAppMode(x)),
  asyncFetchGroups: () => dispatch(asyncFetchGroups())
});

export default {
  component: connect(mapStateToProps, mapDispatchToProps)(TodoPage),
  loadData: function (store) {
    store.dispatch(handleAppMode(1));
    return store.dispatch(asyncFetchGroups());
  }
};