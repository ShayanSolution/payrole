import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import axios from "axios";
import { toast } from "react-toastify";

const MonthlyQuotaAdd = () => {
  const theme = useTheme();
  const [month, setMonth] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/leave/monthly-quota`,
      {
        date: month,
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

  return (
    <form onSubmit={handleSubmit}>
      <Card
        style={{
          marginRight: "20px",
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Select Month
          </Typography>

          <TextField
            style={{
              marginLeft: theme.spacing.unit * 2,
              marginRight: theme.spacing.unit * 2,
              marginTop: theme.spacing.unit * 2,
              width: 205,
            }}
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
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
            ADD
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default MonthlyQuotaAdd;
