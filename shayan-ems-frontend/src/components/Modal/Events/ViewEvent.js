import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Eventdetails from "./Eventdetails";

const ViewEvents = (props) => {
  const { eventData } = props;
  return (
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
            <div>
              <Eventdetails eventData={eventData} />
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
            </div>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

const modalStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Arial",
};

const modalFooter = {
  color: "white",
  padding: "10px",
  float: "right",
};

export default ViewEvents;
