import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#232F3E",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function createData(name,details) {
    return { name,details };
}

export default function CustomizedTables(props) {
    const rows = [
        createData('Personal Email:',props.employeeData.personal_email),
        createData('Official Email:',props.employeeData.official_email),
        createData('Name:',props.employeeData.first_name+" "+props.employeeData.last_name),
        createData('Mobile Number:',props.employeeData.mobile_number),
        createData('CNIC No:',props.employeeData.national_id_number),
        createData('Job Title:',props.employeeData.job_title),
    ];

  return (
    <TableContainer component={Paper} elevation={3} variant="normal" square  >
      <Table sx={{ minWidth: 400}}>
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