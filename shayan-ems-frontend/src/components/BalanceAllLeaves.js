import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import axios from "axios";
import React from "react";
import { toast } from "react-toastify";

const BalanceAllLeaves = () => {
  const handleBalanceSubmit = async (e) => {
    e.preventDefault();
    const date = new Date()
    const response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/leave/balance-leaves`,
      {
        date: new Date(`${date.getFullYear} ${date.getMonth}`),
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
          justifyContent: "space-between",
          marginRight: '20px'
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Balance Leaves
          </Typography>
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
            Balance All Leaves
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default BalanceAllLeaves;
