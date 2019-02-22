import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { asyncPatchEvent_isDone } from '../../../actions/event_actions';
import EventDoneIndicator from '../../reusables/event_done_indicator';

const TodoListItem = (props) => (
  <Draggable draggableId={props.event._id} index={props.index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`todo-list-item-000 ${props.active && 'todo-list-item-000-active'}`}
        // className={'todo-list-item-000'}
        // style={props.active ? { background: 'var(--hover-mint-medium)' } : {}}
        onClick={() => {
          props.changeEventId(props.event._id);
        }}
      >
        <EventDoneIndicator
          _isDone={props.event._isDone}
          hex_color={props.activeGroup.hex_color}
          patchFunction={() => {
            props.asyncPatchEvent_isDone(props.event._id, !props.event._isDone);
          }}
        />
        <p>
          <span style={props.event._isDone ? {
            textDecoration: 'line-through'
          } : {}}>{props.event.title}</span><br/>
          <span style={{
            color: 'var(--text-color-light-3)',
            fontSize: '12px'
          }}>{props.activeGroup.title}</span>
        </p>
      </div>
    )}
  </Draggable>
);

const mapDispatchToProps = (dispatch) => ({
  asyncPatchEvent_isDone: (xyz, abc) => dispatch(asyncPatchEvent_isDone(xyz, abc))
});

export default connect(null, mapDispatchToProps)(TodoListItem);