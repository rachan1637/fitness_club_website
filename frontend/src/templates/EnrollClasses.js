import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
// import Button from '../home_template/modules/components/Button';

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

export default function EnrolledClasses(props) {
  // const drop_id = props.class.id
  // const date = props.class.classDate.date_start.split("T")[0].substring(0, 10);
  // const start_time = props.class.classDate.date_start.split("T")[1].substring(0, props.class.classDate.date_start.split("T")[1].length-4);
  // const end_time = props.class.classDate.date_end.split("T")[1].substring(0, props.class.classDate.date_end.split("T")[1].length-4)

  // const name = props.class.classdate.name
  // const coach = props.class.classDate.coach
  const rows = props.enrolled_classes
  console.log(rows)

  // const rows = props.payments
  // const goNext = props.goNext
  // const goPrev = props.goPrev
  return (
    <React.Fragment>
      <Card sx={{px: 5, py: 5}}>
      <Title>Enrolled Classes</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Coach</TableCell>
            <TableCell>Studio</TableCell>
            <TableCell align="right">Drop</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              <TableCell>{row.classDate.date_start.split("T")[0].substring(0, 10)}</TableCell>
              <TableCell>
                {
                row.classDate.date_start.split("T")[1].substring(0, row.classDate.date_start.split("T")[1].length-4) + 
                "-" +
                row.classDate.date_end.split("T")[1].substring(0, row.classDate.date_end.split("T")[1].length-4)}
              </TableCell>
              <TableCell>{row.classDate.name}</TableCell>
              <TableCell>{row.classDate.coach}</TableCell>
              <TableCell>{row.classDate.studio_name}</TableCell>
              <TableCell align="right"><Button size="small" variant="outlined" onClick={ async () => {
                const drop_id = row.id
                await props.api.post(
                      `/api/studios/drop_classdate/`,
                      JSON.stringify({ DropDate:  drop_id}),
                      {headers: {"Content-Type": "application/json"}}
                  ).then(
                      () => {
                          window.location.reload()
                      }
                  ).catch(
                      errors => {
                          console.log(errors)
                          props.setError(errors.response.data[0])
                      }
                  )
              
                  // props.getEnrolledClasses(props.page);
                  
              }
              }>Drop</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='mt-3'></div>
      <Button onClick={props.goPrev} sx={{ mt: 3, border:1, mr: 2}} size="small">
        Prev
      </Button>
      <Button onClick={props.goNext} sx={{ mt: 3, border:1}} size="small">
        Next
      </Button>
      </Card>
    </React.Fragment>
  );
}