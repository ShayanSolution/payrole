import jsonPlaceholder from "../apis/jsonPlaceholder";
import axios from "axios";
import { toast } from "react-toastify";

export const fetchPostsAndUsers = () => async (dispatch) => {
  await dispatch(fetchPosts());
  await dispatch(fetchUsers());
};
export const getEmployees = () => async (dispatch) => {
  await dispatch(fetchEmployees());
};

export const getContracts = () => async (dispatch) => {
  await dispatch(fetchContracts());
};

//Action Creator returning a function using Redux-Thunk
export const fetchPosts = () => async (dispatch) => {
  const response = await jsonPlaceholder.get("/posts");
  dispatch({ type: "FETCH_POSTS", payload: response.data });
};

export const fetchUser = (id) => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};

export const fetchUsers = () => async (dispatch) => {
  const response = await jsonPlaceholder.get(`/users`);
  dispatch({ type: "FETCH_USER", payload: response.data });
};

export const fetchEmployees = () => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users?.token}`,
    },
  };
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/employees/`,
    config
  );
  dispatch({ type: "FETCH_EMPLOYEES", payload: response.data });
  localStorage.setItem("employees", JSON.stringify(response.data));
  return response;
};
// Login route without api call
export const login = (payload) => async (dispatch) => {
  dispatch({ type: "LOGIN", payload: payload });
  return payload;
};

export const createEmployee = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/employees/create-employee`,
    payload,
    config
  );
  if (response.data.success === true) {
    dispatch({ type: "CREATE_EMPLOYEE", payload: response.data });
  }
  return response;
};

export const deleteEmployee = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/employees/delete-employee/${payload}`,
    config
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_EMPLOYEE", payload: response.data });
  }
  return response;
};

export const fetchEmployee = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/employees/get-employee/${payload}`,
    config
  );
  dispatch({ type: "FETCH_EMPLOYEE", payload: response.data });
  return response;
};
export const fetchAdjustments = (payload) => async (dispatch, getState) => {
  dispatch({ type: "SET_LOADING", payload: true });
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/adjustment/${payload}`,
    config
  );
  dispatch({ type: "SET_LOADING", payload: false });
  dispatch({
    type: "ADD_ADJUSTMENT",
    payload: { adjustments: response.data.data, employee_id: payload },
  });
  return response;
};
export const addAdjustment = (payload) => async (dispatch, getState) => {
  dispatch({ type: "SET_LOADING", payload: true });
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
    payload,
  };
  let response;
  try {
    response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/adjustment`,
      config
    );
    if (response.status === 201) {
      dispatch({
        type: "ADD_ADJUSTMENT",
        payload: {
          adjustments: [response.data.data],
          employee_id: payload.employee_id,
        },
      });
      toast.success(response.data.message);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
  dispatch({ type: "SET_LOADING", payload: false });
  return response;
};

export const deleteAdjustment = (payload) => async (dispatch, getState) => {
  dispatch({ type: "SET_LOADING", payload: true });
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
    payload,
  };
  console.log("delete adjusemt payalod", payload);
  let response;
  try {
    response = await axios.delete(
      `${process.env.REACT_APP_NODE_API_URL}/adjustment/${payload._id}`,
      config
    );
    if (response.data.success) {
      dispatch({
        type: "DELETE_ADJUSTMENT",
        payload: {
          adjustment: response.data.data,
          employee_id: payload.employee,
        },
      });
      toast.success(response.data.message);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
  dispatch({ type: "SET_LOADING", payload: false });
  return response;
};

export const updateAdjustment = (payload) => async (dispatch, getState) => {
  dispatch({ type: "SET_LOADING", payload: true });
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
    payload,
  };
  let response;
  try {
    response = await axios.put(
      `${process.env.REACT_APP_NODE_API_URL}/adjustment/edit`,
      config
    );
    if (response.status === 201) {
      dispatch({
        type: "UPDATE_ADJUSTMENT",
        payload: {
          adjustment: response.data.data,
          employee_id: payload.employee_id,
        },
      });
      toast.success(response.data.message);
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
  dispatch({ type: "SET_LOADING", payload: false });
  return response;
};

export const updateEmployee = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };

  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/employees/update-employee`,
    payload,
    config
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_EMPLOYEE", payload: response.data });
  }
  return response;
};

// ---------------------------------Contract APIS---------------------------------------------------

export const fetchContracts = () => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/contracts/`
  );
  dispatch({ type: "FETCH_CONTRACTS", payload: response.data });
};

export const fetchContract = (payload) => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/contracts/get-contract/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "FETCH_CONTRACT", payload: response.data });
  }
};

export const updateContract = (payload) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/contracts/update-contract`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_CONTRACT", payload: response.data });
    dispatch({ type: "UPDATE_EMPLOYEE_CONTRACT", payload: response.data });
  }
  return response;
};

// ---------------------------------Payroll APIS---------------------------------------------------
export const fetchPayrolls = (payroll) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };

  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/payrolls/`,
    {
      month: payroll,
    },
    config
  );
  if (response.data.success) {
    dispatch({ type: "FETCH_PAYROLLS", payload: response.data });
    localStorage.setItem("payrolls", JSON.stringify(response.data));
  }
  return response;
};

export const deletePayroll = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/payrolls/delete-payroll/${payload}`,
    config
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_PAYROLL", payload: response.data });
  }
  return response;
};

export const createPayroll = (payload) => async (dispatch, getState) => {
  const { users } = getState();
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/payrolls/create-payroll`,
    payload,
    config
  );
  if (response.data.success === true) {
    dispatch({ type: "CREATE_PAYROLL", payload: response.data });
  }
  return response;
};

export const updatePayroll = (payload) => async (dispatch, getState) => {
  const { users } = getState();

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${users.token}`,
    },
  };

  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/payrolls/update-payroll/${payload._id}`,
    payload,
    config
  );

  if (response.data.success === true) {
    dispatch({ type: "UPDATE_PAYROLL", payload: response.data });
  }
  return response;
};

// ---------------------------------Leave APIS---------------------------------------------------
export const fetchLeaves = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/leave`,
    payload
  );
  if (response.data.success) {
    dispatch({ type: "FETCH_LEAVES", payload: response.data });
  }
  return response;
};

export const updateLeave = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/leave/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_LEAVE", payload: response.data });
  }
  return response;
};

export const deleteLeave = (payload) => async (dispatch) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/leave/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_LEAVE", payload: response.data });
  }
  return response;
};

export const createLeave = (payload) => async () => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/leave/create-leave`,
    payload
  );
  if (!response.data.success) toast.error(response.data.message);
  return response;
};

// ---------------------------------Attendance APIS---------------------------------------------------

export const fetchAttendance = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/attendance/get-attendance-by-month`,
    payload
  );
  if (response.data.success) {
    dispatch({ type: "FETCH_ATTENDANCE", payload: response.data });
  }
  return response;
};

export const updateAttendance = (payload) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/attendance`,
    payload
  );
  if (response.data.success) {
    dispatch({ type: "UPDATE_ATTENDANCE", payload: response.data });
  }
  return response;
};
// ---------------------------------Shift APIS---------------------------------------------------
export const fetchShifts = () => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/shift`
  );
  dispatch({ type: "FETCH_SHIFT", payload: response.data });
  return response;
};

export const createshift = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/shift/create-shift`,
    payload
  );
  if (response.data.success === true) {
    toast.success(response.data.message);
    dispatch({ type: "CREATE_SHIFT", payload: response.data });
  } else {
    toast.error(response.data.message);
  }
  return response;
};

export const deleteShift = (payload) => async (dispatch) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/shift/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_SHIFT", payload: response.data });
  }
  return response;
};
export const updateShift = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/shift/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_SHIFT", payload: response.data });
  }
  return response;
};
// ------------------------------------------Event APIS--------------------------------------------

export const createEvent = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/event/create-event`,
    payload
  );
  if (response.data.success === true) {
    toast.success(response.data.message);
    dispatch({ type: "CREATE_EVENT", payload: response.data });
  } else {
    toast.error(response.data.message);
  }
  return response;
};

export const fetchEvents = () => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/event`
  );
  dispatch({ type: "FETCH_EVENT", payload: response.data });
  return response;
};

export const deleteEvent = (payload) => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/event/delete-event/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_EVENT", payload: response.data });
  }
  return response;
};

export const updateEvent = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/event/update-event/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_EVENT", payload: response.data });
  }
  return response;
};

// ------------------------------------------Course APIS--------------------------------------------

export const createCourse = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/courses/create-course`,
    payload
  );
  if (response.data.success === true) {
    toast.success(response.data.message);
    dispatch({ type: "CREATE_COURSE", payload: response.data });
  } else {
    toast.error(response.data.message);
  }
  return response;
};

export const fetchCourses = () => async (dispatch) => {
  const response = await axios.get(
    `${process.env.REACT_APP_NODE_API_URL}/courses`
  );
  dispatch({ type: "FETCH_COURSE", payload: response.data });
  return response;
};

export const deleteCourse = (payload) => async (dispatch) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/courses/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_COURSE", payload: response.data });
  }
  return response;
};

export const updateCourse = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/courses/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_COURSE", payload: response.data });
  }
  return response;
};
// --------------------------------------------- Employee Requests ---------------------------------------------------
export const fetchRequests = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/requests`,
    payload
  );
  if (response.data.success) {
    dispatch({ type: "FETCH_REQUESTS", payload: response.data });
  }
  return response;
};

export const updateRequest = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/requests/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_REQUEST", payload: response.data });
  }
  return response;
};

export const deleteRequest = (payload) => async (dispatch) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/requests/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_REQUEST", payload: response.data });
  }
  return response;
};

// --------------------------------------------- Employee Suggestions ---------------------------------------------------
export const fetchSuggestions = (payload) => async (dispatch) => {
  const response = await axios.post(
    `${process.env.REACT_APP_NODE_API_URL}/suggestion`,
    payload
  );
  if (response.data.success) {
    dispatch({ type: "FETCH_SUGGESTIONS", payload: response.data });
  }
  return response;
};

export const updateSuggestion = (payload, id) => async (dispatch) => {
  const response = await axios.put(
    `${process.env.REACT_APP_NODE_API_URL}/suggestion/${id}`,
    payload
  );
  if (response.data.success === true) {
    dispatch({ type: "UPDATE_SUGGESTION", payload: response.data });
  }
  return response;
};

export const deleteSuggestion = (payload) => async (dispatch) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_NODE_API_URL}/suggestion/${payload}`
  );
  if (response.data.success === true) {
    dispatch({ type: "DELETE_SUGGESTION", payload: response.data });
  }
  return response;
};
