import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { StyledTableCell, StyledTableRow } from "@styles/styledComponents";

function createData(name, details) {
  return { name, details };
}

export default function CustomizedTables(props) {
  const rows = [
    createData("Name:", props.data.employee_name),
    createData("Date:", props.data.suggestion_date),
    createData("Desc. :", props.data.suggestion_message),
    createData("Status:", props.data.suggestion_status),
  ];

  return (
    <TableContainer component={Paper} elevation={3} variant="normal" square>
      <Table sx={{ minWidth: 400 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Information</StyledTableCell>
            <StyledTableCell align="left"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="left">{row.details}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
