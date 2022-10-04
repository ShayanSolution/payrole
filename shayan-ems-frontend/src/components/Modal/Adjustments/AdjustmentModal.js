import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditSharpIcon from "@material-ui/icons/EditSharp";

import { useDispatch, useSelector } from "react-redux";
import { deleteAdjustment, fetchAdjustments } from "../../../Redux/actions";
import { CircularProgress } from "@mui/material";
import { Button } from "@material-ui/core";
import Form from "./Form";
import {
  FlexCont,
  modalBody,
  modalHeader,
  closeButton,
  modalStyle,
} from "../../../Styles/AdjustmentStyles";
import moment from "moment";

const adjustmentModal = ({ toggleAdjustmentModal, employee_id }) => {
  const { adjustments, loading } = useSelector((state) => state.adjustments);
  const [showForm, setShowForm] = useState(false);
  const [edit, setEdit] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!adjustments[employee_id]) dispatch(fetchAdjustments(employee_id));
  }, []);

  const tableHead = ["Purpose", "Amount", "From", "To", "Actions"];
  const handleDelete = (e, payload) => {
    e.preventDefault();
    dispatch(deleteAdjustment(payload));
  };
  return (
    <Modal
      open={true}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      onClose={toggleAdjustmentModal}
      style={modalStyle}
    >
      <Fade in={true}>
        <Paper elevation={1} variant="normal" square>
          <div style={modalHeader}>
            <p>
              Adjustments{" "}
              <span onClick={toggleAdjustmentModal} style={closeButton}>
                x
              </span>
            </p>
          </div>
          <div style={modalBody}>
            {loading && <CircularProgress />}
            {!loading && (
              <>
                {!showForm && (
                  <FlexCont className="mb-3">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowForm(true)}
                    >
                      Add
                    </Button>
                  </FlexCont>
                )}
                {showForm && (
                  <Form
                    setShowForm={setShowForm}
                    employee_id={employee_id}
                    edit={edit}
                    setEdit={setEdit}
                  />
                )}
                <table>
                  <thead>
                    <tr>
                      {tableHead.map((head, index) => {
                        return (
                          <th className="text-center" key={index}>
                            {head}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments[employee_id]?.map((each, i) => (
                      <tr key={i}>
                        <td className="text-center">{each.label}</td>
                        <td className="text-center">{Math.abs(each.value)}</td>
                        <td className="text-center">
                          {moment(each.valid_from).format("MMM YYYY")}
                        </td>
                        <td className="text-center">
                          {moment(each.valid_to).format("MMM YYYY")}
                        </td>
                        <td className="text-center">
                          {" "}
                          <EditSharpIcon
                            color="action"
                            fontSize="small"
                            cursor="pointer"
                            onClick={() => {
                              setEdit(each);
                              setShowForm(true);
                            }}
                          />
                          <DeleteIcon
                            color="action"
                            fontSize="small"
                            cursor="pointer"
                            onClick={(e) => handleDelete(e, each)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </Paper>
      </Fade>
    </Modal>
  );
};
export default adjustmentModal;
