import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  InputLabel,
  FormControl,
  TextField,
  Grid,
  Button,
} from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import {} from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import * as XLSX from "xlsx";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 500,
    margin: "auto",
    overflow: "hidden",
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing.unit,
  },
  form: {
    marginTop: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 450,
  },
  halfTextField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 205,
  },
  halfSelectField: {
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: 205,
  },
  checkbox: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit * 2,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 2,
  },
  switch: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 450,
  },
  selectHalfFormControl: {
    marginTop: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit * 2,
    width: 215,
  },
}));

const UploadAttendance = () => {
  const [excelFile, setExcelFile] = useState(null);
  //   const [excelFileError, setExcelFileError] = useState(null);
  const classes = useStyles();

  const fileType = ["application/vnd.ms-excel"];

  const handleChange = (event) => {
    event.preventDefault();
    let selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log(selectedFile.type);
      if (fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          //   setExcelFileError(null);
          setExcelFile(e.target.result);
        };
      } else {
        toast.error("Please select only excel file type");
        setExcelFile(null);
      }
    } else {
      console.log("please select your file");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, {
        type: "buffer",
      });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data);
      const result = await axios.post(
        `${process.env.REACT_APP_NODE_API_URL}/attendance/add-attendance-by-month`,
        { data: data }
      );

      if (result.data.success) {
        toast.success(result.data.message);
      }
    }
  };

  return (
    <>
      <Paper className={classes.paper}>
        <form
          className={classes.form}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="filled-age-native-simple">
              Upload File
            </InputLabel>
            <TextField
              id="no_of_days"
              name="no_of_days"
              label="Upload File"
              required
              type="file"
              //   value={noOfDays}
              onChange={handleChange}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-end"
          >
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
          {/* <FormControl className={classes.formControl}>
             
              <Select
                native
                required
                fullWidth
                defaultValue={employees[0]._id}
                onChange={(e) => setEmployeeId(e.target.value)}
                inputProps={{
                  name: "employeeId",
                  id: "filled-age-native-simple",
                }}
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
            <FormControl className={classes.selectHalfFormControl}>
              <InputLabel htmlFor="filled-age-native-simple">Type</InputLabel>
              <Select
                native
                required
                fullWidth
                className={classes.halfSelectField}
                onChange={(e) => setType(e.target.value)}
                inputProps={{
                  name: "employeeId",
                  id: "filled-age-native-simple",
                }}
              >
                <option value="Sick"> Sick </option>
                <option value="Casual"> Casual </option>
                <option value="Marriage"> Marriage </option>
              </Select>
            </FormControl>
            <TextField
              id="no_of_days"
              name="no_of_days"
              label="No. of days"
              required
              type="number"
              value={noOfDays}
              onChange={(e) => setNoOfDays(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="start_date"
              name="start_date"
              label="Start Date"
              required
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="end_date"
              name="end_date"
              label="End Date"
              required
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date_join"
              name="date_join"
              label="Date Join"
              required
              type="date"
              value={dateJoin}
              onChange={(e) => setDateJoin(e.target.value)}
              className={isMobile() ? classes.TextField : classes.halfTextField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <br />
            <TextField
              id="reason"
              name="reason"
              label="Reason"
              placeholder="Enter Reason"
              multiline
              required
              value={reason}
              type="text"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.textField}
              onChange={(e) => setReason(e.target.value)}
              margin="normal"
            />
            <br />
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="flex-end"
            >
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submitButton}
                >
                  Create
                </Button>
              </Grid>
            </Grid> */}
        </form>
      </Paper>
      {/* )} */}

      <ToastContainer
        position="bottom-left"
        autoClose={2500}
        hideProgressBar={true}
        closeOnClick={false}
        pauseOnHover={false}
        draggable={false}
        theme="dark"
      />
    </>
  );
};

export default UploadAttendance;
