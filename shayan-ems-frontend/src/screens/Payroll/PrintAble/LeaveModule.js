import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

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

export default function LeaveModule({ payroll }) {
  return (
    <TableContainer>
      <Table style={{ padding: "0 0 10 1" }}>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell>
              <b>Assigned Quota:</b>
            </StyledTableCell>
            <StyledTableCell>{payroll.employee.yearly_quota}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>
              <b>Used Leaves:</b>
            </StyledTableCell>
            <StyledTableCell>{Math.abs(payroll.used_leaves)}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>
              <b>Current Month Leaves:</b>
            </StyledTableCell>
            <StyledTableCell>{payroll.availed_leaves}</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>
              <b>Total Availed Leaves:</b>
            </StyledTableCell>
            <StyledTableCell>
              {Math.abs(payroll.used_leaves) + payroll.availed_leaves}
            </StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell>
              <b>
                {payroll.remaining_leaves < 0
                  ? "Exceeding:"
                  : "Leaves Balance:"}
              </b>
            </StyledTableCell>
            <StyledTableCell>
              {Math.abs(payroll.remaining_leaves)}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
