import { ASYNC_FETCH_STEPS,
  ASYNC_POST_STEP,
  ASYNC_EDIT_STEP,
  ASYNC_PATCH_STEP_ISDONE,
  ASYNC_DELETE_STEP,
  ASYNC_REARRANGE_STEPS,
  REARRANGE_REDUX_STEPS
} from './_action_types';

// FETCH ALL STEPS
export const asyncFetchSteps = () => async (dispatch, getState, api) => {
  const response = await api.get(`/step/all`);
  dispatch({ type: ASYNC_FETCH_STEPS, steps: response.data });

  return new Promise((resolve, reject) => {
    if (response.data) resolve(response.data);
    else reject('Somenthing went wrong');
  });
}

// POST NEW STEP
export const asyncPostStep = (stepObj) => async (dispatch, getState, api) => {
  const response = await api.post('/step/new', { ...stepObj });
  dispatch({ type: ASYNC_POST_STEP, step: response.data });

  return new Promise((resolve, reject) => {
    if (response.data) resolve(response.data);
    else reject('Somenthing went wrong');
  });
}

// EDIT A STEP
export const asyncEditStep = (stepId, stepObj) => async (dispatch, getState, api) => {
  const response = await api.put(`/step/edit/${stepId}`, { ...stepObj });
  dispatch({ type: ASYNC_EDIT_STEP, step: response.data });

  return new Promise((resolve, reject) => {
    if (response.data) resolve(response.data);
    else reject('Somenthing went wrong');
  });
}

// PATCH STEP _isDone
export const asyncPatchStep_isDone = (stepId, bool) => async (dispatch, getState, api) => {
  let response;
  if (bool) response = await api.patch(`/step/done/${stepId}`);
  else response = await api.patch(`/step/undo/${stepId}`);
  
  dispatch({ type: ASYNC_PATCH_STEP_ISDONE, step: response.data });

  return new Promise((resolve, reject) => {
    if (response.data) resolve(response.data);
    else reject('Somenthing went wrong');
  });
}

// REARRANGE_REDUX_STEPS
export const rearrangeReduxSteps = ({ fromRank, toRank }) => {
  // console.log({ fromRank, toRank });  
  return ({
    type: REARRANGE_REDUX_STEPS, fromRank, toRank
  });
}

// ASYNC_REARRANGE_STEPS
export const asyncRearrangeSteps = ({ focusedStep, fromRank, toRank, movedSteps }) => {
  return async (dispatch, getState, api) => {
    const response = await api.put(`/step/rearrange`, {
      focusedStep, fromRank, toRank, movedSteps
    });
    
    dispatch({ type: ASYNC_REARRANGE_STEPS, steps: response.data });
  
    return new Promise((resolve, reject) => {
      if (response.data) resolve(response.data);
      else reject('Somenthing went wrong');
    });
  };
};

// ASYNC_DELETE_STEP
export const asyncDeleteStep = (stepId) => async (dispatch, getState, api) => {
  const response = await api.patch(`/step/delete/${stepId}`);
  dispatch({ type: ASYNC_DELETE_STEP, _id: response.data._id });

  return new Promise((resolve, reject) => {
    if (response.data) resolve(response.data);
    else reject('Somenthing went wrong');
  });
}