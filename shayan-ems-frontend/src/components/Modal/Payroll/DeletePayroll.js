import React from "react";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { deletePayroll } from "@redux/actions";
import { ToastContainer, toast } from "react-toastify";

const DeletePayroll = (props) => {
  const delete_employee = async () => {
    const { _id } = props.employeeData;
    const response = await props.deletePayroll(_id);
    const { message, success } = response.data;

    if (success) {
      const payloadsInStorage = JSON.parse(localStorage.getItem("payrolls"));
      const newPayrolls = payloadsInStorage.payload.filter(
        (item) => item._id !== _id
      );
      localStorage.setItem(
        "payrolls",
        JSON.stringify({ ...payloadsInStorage, payload: newPayrolls })
      );

      toast.success(message, {
        position: "bottom-left",
        autoClose: 1000,
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
      }, 1000);
    } else {
      toast.error(message, {
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
    }
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
                <p>Delete Confirmation</p>
              </div>
              <div style={modalBody}>
                Are you sure you want to delete this Payroll?
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
                  onClick={delete_employee}
                >
                  Delete
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
const mapStateToProps = (state) => {
  return {
    posts: state.payload,
    users: state.users,
  };
};
export default connect(mapStateToProps, {
  deletePayroll,
})(DeletePayroll);
