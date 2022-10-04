import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateAttendance } from "@redux/actions";

const Exemptions = (props) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState(null);
  const exemptHandler = (event) => {
    event.preventDefault();
    if (!reason && props.exempt.reason) {
      dispatch(
        updateAttendance({
          id: props.exempt.id,
          exempt: false,
          reason: "",
        })
      );
    } else
      dispatch(
        updateAttendance({
          id: props.exempt.id,
          exempt: true,
          reason: reason,
        })
      );
    return props.closeModal();
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
                <p>Exempt confirmation</p>
              </div>
              <form onSubmit={exemptHandler}>
                {!props.exempt.reason ? (
                  <>
                    <div style={modalBody}>
                      Are you sure to Exempt this attendance late?
                    </div>

                    <div style={modalBody}>
                      <label>Reason: </label>
                      <div>
                        <textarea
                          value={reason}
                          required
                          onChange={(e) => setReason(e.target.value)}
                          defaultValue={
                            props.exempt.reason && props.exempt.reason
                          }
                          disabled={props.exempt.reason}
                          style={textArea}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={modalBody}>
                    Are you sure to unexempt this attendance late?
                  </div>
                )}
                <div style={modalFooter}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={() => props.closeModal()}
                  >
                    Close
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button type="submit" variant="contained" color="primary">
                    {props.exempt.reason ? "Confirm" : "Send"}
                  </Button>
                </div>
              </form>
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

const textArea = {
  width: "100%",
  height: "100px",
};

const modalFooter = {
  padding: "10px",
  float: "right",
};

export default Exemptions;
