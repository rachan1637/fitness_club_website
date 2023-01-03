import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAxios from "../utils/useAxios";
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function Title(props) {
    return (
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.children}
      </Typography>
    );
  }


export function StudioClasses(props) {
    const api = useAxios();
    const navigate = useNavigate()
    const rows = props.classes
    const [error, setError] = useState("")

    return (
      <React.Fragment>
        <Card sx={{px: 5, py: 5}}>
        <Title>Provided Classes</Title>
        <Typography>Total Number of classes: {props.count}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Coach</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Enrollment Number</TableCell>
              <TableCell>Enroll?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>
                    {row.coach}
                </TableCell>
                <TableCell>
                  {row.date_start.split("T")[0].substring(0, 10)}
                </TableCell>
                <TableCell>{
                    row.date_start.split("T")[1].substring(0, row.date_start.split("T")[1].length-4) +
                    "-" + 
                    row.date_end.split("T")[1].substring(0, row.date_end.split("T")[1].length-4)
                }</TableCell>
                <TableCell>{row.current_enrolment + "/" + row.capacity}</TableCell>
                <TableCell><Button size="small" variant="outlined" onClick={ async () => {
                    await api.post(
                        `/api/studios/enroll_classdate/`,
                        JSON.stringify({ enrollDate:  row.id}),
                        {headers: {"Content-Type": "application/json"}}
                    ).then(
                        () => {
                            navigate("/course-management/");
                        }
                    ).catch(
                        errors => {
                            console.log(errors.response.data["enrollDate"])
                            if (typeof(errors.response.data.enrollDate) !== "undefined") {
                                setError(errors.response.data.enrollDate[0])
                            } else {
                                setError(errors.response.data[0])
                            }
                        }
                    )
                }
                }>Enroll</Button></TableCell>
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
        {error && <p className="text-red-500 rounded-md my-5"> Fail to enroll: {error}</p> }
        </Card>
      </React.Fragment>
    );
  }


function ClassBlock(props) {
    // console.log(props.class.date_start.split("T")[0].substring(0, 10))
    const date = props.class.date_start.split("T")[0].substring(0, 10);
    const start_time = props.class.date_start.split("T")[1].substring(0, props.class.date_start.split("T")[1].length-4);
    const end_time = props.class.date_end.split("T")[1].substring(0, props.class.date_end.split("T")[1].length-4)
    const navigate = useNavigate()

    const enrollClass = async () => {
        await props.api.post(
            `/api/studios/enroll_classdate/`,
            JSON.stringify({ enrollDate:  props.class.id}),
            {headers: {"Content-Type": "application/json"}}
        ).then(
            () => {
                navigate("/course-management/");
            }
        ).catch(
            errors => {
                console.log(errors.response.data["enrollDate"])
                if (typeof(errors.response.data.enrollDate) !== "undefined") {
                    props.setError(errors.response.data.enrollDate[0])
                } else {
                    props.setError(errors.response.data[0])
                }
            }
        )
    }

    return (
        <>
            <div className="border-2 border-black px-5 py-3 hover:bg-gray-100 text-center rounded-2xl">
                {/* <p className="text-2xl"> {props.class.name} </p> */}
                <p> Coach: {props.class.coach} </p>
                <p> Date: {date} </p>
                <p> From {start_time} to {end_time} </p>
                <p> Current Enrollment {props.class.current_enrolment}/{props.class.capacity} </p>
                <button onClick={enrollClass} className="mt-5 border-2 border-blue-400 px-2 py-1 rounded-lg"> Enroll </button>
            </div>
        </>
    )
}

function ClassesPage() {
    const api = useAxios();
    const { course_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [courseName, setCourseName] = useState("")
    const [classes, setClasses] = useState([])
    const [page, setPage] = useState(1)
    const [error, setError] = useState("")
    const [count, setCount] = useState(0)

    const getClasses = async (page) => {
        await api.get(
            `/api/studios/view_classdate/${course_id}/?page=${page}&size=10`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                setClasses(response.data.results)
                setCourseName(response.data.results[0].name)
                setPage(page)
                setCount(response.data.count)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await getClasses(page);
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<p> Still loading </p>)
    }

    return (
        <>
            <StudioClasses classes={classes} count={count} goPrev={() => getClasses(page - 1)} goNext={() => getClasses(page + 1)}/>
        </>
    )

    // return (
    //     <>
    //         <p className="text-2xl"> {courseName} Classes </p>
    //         <hr className="my-3"/>
    //         <div className="flex gap-10">
    //             { classes.map(c => (<ClassBlock class={c} api={api} setError={setError}/>)) }
    //         </div>
    //         {error && <p className="text-red-500 rounded-md my-5"> Fail to enroll: {error}</p> }
    //         <div className="flex gap-3 mt-10">
    //             <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getClasses(page - 1)}>
    //         Previous
    //             </button>
    //             <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getClasses(page + 1)}> Next </button>
    //         </div>
    //     </>
    // )
}

export default ClassesPage