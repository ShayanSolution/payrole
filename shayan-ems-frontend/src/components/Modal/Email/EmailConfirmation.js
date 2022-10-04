import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const EmailConfirmation = (props) => {
  const sendEmail = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_NODE_API_URL}/email/email`,
      { employee: props.employeeData }
    );
    const { message, success } = response.data;

    toast.success(message, {
      position: "bottom-left",
      autoClose: 3500,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      type: success ? "success" : "error",
    });

    setTimeout(() => {
      props.openModal();
    }, 3500);
  };
  return (
    <>
      <div>
        <Modal
          open={true}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          style={modalStyle}
        >
          <Fade in={true}>
            <Paper elevation={3} variant="normal" square>
              <div style={modalHeader}>
                <p>Email Confirmation</p>
              </div>
              <div style={modalBody}>
                Are you sure you want to send Email to{" "}
                {props.employeeData.personal_email}?
              </div>
              <div style={modalFooter}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={props.openModal}
                >
                  Close
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={sendEmail}
                >
                  Send
                </Button>
              </div>
            </Paper>
          </Fade>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};

const modalHeader = {
  background: "#232F3E",
  color: "white",
  textAlign: "center",
  paddingTop: "10px",
  paddingBottom: "0.02px",
};
const modalBody = {
  padding: "10px",
  minWidth: "250px",
};

const modalFooter = {
  padding: "10px",
  float: "right",
};

export default EmailConfirmation;
