import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { TableFooter } from "@material-ui/core";
import { currencyFormat } from "@utils/utils";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});

export default function ObjectRender(props) {
  const classes = useStyles();

  const positive = props.payroll?.adjustments?.filter((item) => item.value > 0);
  const negative = props.payroll?.adjustments?.filter((item) => item.value < 0);
  let finalDeduction =
    props.payroll.deductions +
    Math.abs(negative.reduce((pre, curr) => pre + curr.value, 0));

  if (props.payroll.tax) {
    finalDeduction += props.payroll.tax;
  }

  const result = positive.length > negative.length ? positive : negative;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {" "}
              <b>Earnings</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {" "}
              <b>Gross Salary</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {" "}
              <b>Deductions</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {" "}
              <b>Total Amount</b>{" "}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">
              <b>Basic Salary</b>
            </StyledTableCell>
            <StyledTableCell align="center">
              {currencyFormat(
                props.payroll.employee.contract === "Hourly"
                  ? Number(props.payroll.employee.salary)
                  : props.payroll.total_salary
              )}{" "}
              {props.payroll.employee.contract === "Hourly" ? "per hour" : ""}
            </StyledTableCell>
            <StyledTableCell align="center">
              {" "}
              <b>Late Arrival</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {currencyFormat(
                (props.payroll.late_arrivals - props.payroll.exemptions) * 250
              )}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">
              <b>Medical Allowance</b>
            </StyledTableCell>
            <StyledTableCell align="center">
              {currencyFormat(props.payroll.employee.medical_allowance)}
            </StyledTableCell>
            <StyledTableCell align="center">
              <b>Leaves</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {parseInt(props.payroll.deductions) -
                props.payroll.advance_deduction -
                parseInt(
                  props.payroll.late_arrivals - props.payroll.exemptions
                ) *
                  250 >=
              0
                ? currencyFormat(
                    parseInt(props.payroll.deductions) -
                      props.payroll.advance_deduction -
                      parseInt(
                        props.payroll.late_arrivals - props.payroll.exemptions
                      ) *
                        250
                  )
                : 0}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            {props.payroll.bonus && props.payroll.tax ? (
              <>
                <StyledTableCell component="th" scope="row">
                  <b> Incentive</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {currencyFormat(props.payroll.bonus)}
                </StyledTableCell>{" "}
                <StyledTableCell align="center">
                  {" "}
                  <b>Tax</b>{" "}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {currencyFormat(props.payroll.tax)}
                </StyledTableCell>
              </>
            ) : props.payroll.tax ? (
              <>
                <StyledTableCell component="th" scope="row"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center">
                  <b>Tax</b>
                </StyledTableCell>

                <StyledTableCell align="center">
                  {currencyFormat(props.payroll.tax)}
                </StyledTableCell>
              </>
            ) : props.payroll.bonus ? (
              <>
                <StyledTableCell component="th" scope="row">
                  <b> Incentive</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {currencyFormat(props.payroll.bonus)}
                </StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </>
            ) : (
              ""
            )}
          </StyledTableRow>
          {result.map((adjustemnt, index) => {
            return (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  <b>{positive[index]?.label}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {currencyFormat(positive[index]?.value)}{" "}
                </StyledTableCell>
                <StyledTableCell align="center" component="th" scope="row">
                  <b>{negative[index]?.label}</b>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {currencyFormat(negative[index]?.value)}{" "}
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <StyledTableCell>
              {" "}
              <b>Gross Salary</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {currencyFormat(
                props.payroll.total_salary +
                  props.payroll.employee.medical_allowance +
                  props.payroll.bonus +
                  positive.reduce((pre, curr) => pre + curr.value, 0)
              )}
            </StyledTableCell>
            <StyledTableCell align="center">
              {" "}
              <b>Total Deductions</b>{" "}
            </StyledTableCell>
            <StyledTableCell align="center">
              {currencyFormat(finalDeduction)}
            </StyledTableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
