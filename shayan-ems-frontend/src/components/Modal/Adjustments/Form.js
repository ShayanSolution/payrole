import { Button, TextField, MenuItem } from "@material-ui/core";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAdjustment, updateAdjustment } from "../../../Redux/actions";

const Form = ({ setShowForm, employee_id, edit, setEdit }) => {
  const dispatch = useDispatch();
  const [label, setLabel] = useState(edit ? edit.label : "");
  const [value, setValue] = useState(edit ? Math.abs(edit.value) : "");
  const [valueType, setValueType] = useState(
    edit ? (edit.value < 0 ? "deduction" : "earning") : ""
  );
  const [validFrom, setValidFrom] = useState(
    edit ? moment(edit.valid_from).format("YYYY-MM") : ""
  );
  const [validTo, setValidTo] = useState(
    edit ? moment(edit.valid_to).format("YYYY-MM") : ""
  );

  const closeForm = () => {
    setShowForm(false);
    if (edit) setEdit(null);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (edit) {
      const payload = {
        type: "salary",
        value: valueType === "deduction" ? value * -1 : value,
        valid_from: validFrom,
        valid_to: validTo,
        employee_id,
        label,
        adjustment_id: edit._id,
      };
      dispatch(updateAdjustment(payload));
    } else {
      const payload = {
        type: "salary",
        value: valueType === "deduction" ? value * -1 : value,
        valid_from: validFrom,
        valid_to: validTo,
        label,
        employee_id,
      };
      dispatch(addAdjustment(payload));
    }

    closeForm();
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="row">
        <div className="col-6">
          <TextField
            id="label"
            name="label"
            label="Label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="mb-2"
          />
        </div>
        <div className="col-6">
          <TextField
            id="value-type"
            name="value-type"
            label="Value Type"
            select
            value={valueType}
            onChange={(e) => setValueType(e.target.value)}
            required
            className="mb-2 col-12"
          >
            <MenuItem value="earning">Earning</MenuItem>
            <MenuItem value="deduction">Deduction</MenuItem>
          </TextField>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <TextField
            id="value"
            name="value"
            label="Value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="mb-2"
          />
        </div>
        <div className="col-6">
          <TextField
            id="valid_from"
            name="valid_from"
            label="valid from"
            type="month"
            required
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <TextField
            id="valid_to"
            name="valid_to"
            label="Valid To"
            type="month"
            value={validTo}
            onChange={(e) => setValidTo(e.target.value)}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col-6"></div>
        <div className="col-6">
          <Button
            variant="contained"
            color="primary"
            onClick={closeForm}
            style={{ marginRight: ".5rem" }}
          >
            Close
          </Button>
          <Button
            style={{ marginLeft: ".5rem" }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};
export default Form;
