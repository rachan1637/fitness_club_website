import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Button from '../home_template/modules/components/Button';

function Title(props) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};


function createData(paid_at, plan_month_length, paid_card_number, amount, paid) {
  return { paid_at, plan_month_length, paid_card_number, amount, paid };
}

const rows = [
  createData(
    '2022-02-01',
    '12',
    '4505530142837598',
    144.99,
    true,
  ),
  // createData(
  //   1,
  //   '16 Mar, 2019',
  //   'Paul McCartney',
  //   'London, UK',
  //   'VISA ⠀•••• 2574',
  //   866.99,
  // ),
  // createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
  // createData(
  //   3,
  //   '16 Mar, 2019',
  //   'Michael Jackson',
  //   'Gary, IN',
  //   'AMEX ⠀•••• 2000',
  //   654.39,
  // ),
  // createData(
  //   4,
  //   '15 Mar, 2019',
  //   'Bruce Springsteen',
  //   'Long Branch, NJ',
  //   'VISA ⠀•••• 5919',
  //   212.79,
  // ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function PaymentHistory(props) {
  const rows = props.payments
  const goNext = props.goNext
  const goPrev = props.goPrev
  return (
    <React.Fragment>
      <Card sx={{px: 5, py: 5}}>
      <Title>Payment Hisotry</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Plan Month Length</TableCell>
            <TableCell>Paid Card Number</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell align="right">Already Paid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>{row.paid_at}</TableCell>
              <TableCell>{row.plan_month_length}</TableCell>
              <TableCell>{row.paid_card_number}</TableCell>
              <TableCell>{`$${row.amount}`}</TableCell>
              <TableCell align="right">{row.paid === true ? "True" : "False"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='mt-3'></div>
      <Button onClick={goPrev} sx={{ mt: 3, border:1, mr: 2}} size="small">
        Prev
      </Button>
      <Button onClick={goNext} sx={{ mt: 3, border:1}} size="small">
        Next
      </Button>
      </Card>
    </React.Fragment>
  );
}