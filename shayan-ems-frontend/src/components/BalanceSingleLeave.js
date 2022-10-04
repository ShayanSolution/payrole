import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  FormControl,
  Select,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchEmployees } from "../Redux/actions";

const BalanceSingleLeave = () => {
  const employees = useSelector((state) => state.employees.payload);
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState(
    employees.length > 0 && employees[0]._id
  );

  useEffect(() => {
    if (employees.length === 0) {
      dispatch(fetchEmployees());
    } else {
      setEmployee(employees[0]._id);
    }
  }, [employees]);

  const handleBalanceSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/leave/balance-single-leave`,
      {
        _id: employee,
      }
    );
    const { success, message } = response.data;
    toast.success(message, {
      position: "bottom-left",
      autoClose: 2500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      type: success ? "success" : "error",
    });
  };
  const theme = useTheme();

  return (
    <form onSubmit={handleBalanceSubmit}>
      <Card
        style={{
          minHeight: "191px",
          minWidth: "270px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginRight: "20px",
        }}
      >
        {employees.length === 0 ? (
          <CircularProgress color="primary" />
        ) : (
          <>
            <CardContent>
              <Typography variant="h5" component="div">
                Balance Leave
              </Typography>
              <FormControl className="mt-3">
                <Select
                  style={{
                    marginLeft: theme.spacing.unit * 2,
                    marginRight: theme.spacing.unit * 2,
                    width: 205,
                  }}
                  native
                  required
                  fullWidth
                  onChange={(e) => setEmployee(e.target.value)}
                >
                  {employees.map(function (employee, i) {
                    return (
                      <option value={employee._id} key={i}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
            </CardContent>
            <CardActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  margin: theme.spacing.unit,
                  marginTop: theme.spacing.unit * 2,
                }}
              >
                Balance Leave
              </Button>
            </CardActions>
          </>
        )}
      </Card>
    </form>
  );
};

export default BalanceSingleLeave;
