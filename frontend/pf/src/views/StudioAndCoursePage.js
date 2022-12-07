import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAxios from "../utils/useAxios";
import CourseManagementPage from "./CourseManagementPage";
import MyGooleMap from "../components/MyGoogleMap"
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
// import Link from '@mui/material/Link';


function Title(props) {
    return (
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.children}
      </Typography>
    );
  }


function StudioCourses(props) {
    const api = useAxios();
    // const drop_id = props.class.id
    // const date = props.class.classDate.date_start.split("T")[0].substring(0, 10);
    // const start_time = props.class.classDate.date_start.split("T")[1].substring(0, props.class.classDate.date_start.split("T")[1].length-4);
    // const end_time = props.class.classDate.date_end.split("T")[1].substring(0, props.class.classDate.date_end.split("T")[1].length-4)
  
    // const name = props.class.classdate.name
    // const coach = props.class.classDate.coach
    const navigate = useNavigate()
    const rows = props.coursesInfo
    // console.log(rows)
  
    // const rows = props.payments
    // const goNext = props.goNext
    // const goPrev = props.goPrev
    const getScheduleWeekday = (schedule_weekday) => {
        if (schedule_weekday === "MO") {
            schedule_weekday = "Monday"
        } else if (schedule_weekday == "TU") {
            schedule_weekday = "Tuesday"
        } else if (schedule_weekday === "WE") {
            schedule_weekday = "Wednesday" 
        } else if (schedule_weekday === "TH") {
            schedule_weekday = "Thursday" 
        } else if (schedule_weekday === "FR") {
            schedule_weekday = "Friday" 
        } else if (schedule_weekday === "SA") {
            schedule_weekday = "Saturday" 
        } else if (schedule_weekday === "SU") {
            schedule_weekday = "Sunday" 
        }
        return schedule_weekday
    }

    const getScheduleUntil = (schedule_until) => {
        schedule_until = schedule_until.substring(0, 4) + "-" + schedule_until.substring(4, 6) + "-" + schedule_until.substring(6,8)
        return schedule_until
    }

    return (
      <React.Fragment>
        <Card sx={{px: 5, py: 5}}>
        <Title>Provided Courses</Title>
        <Typography>Total Number of courses: {props.count}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Course Size</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Schedule at</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Scehdule Until</TableCell>
              <TableCell>Enroll all classes?</TableCell>
              <TableCell>View and Enroll one class?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>
                    {row.name}
                </TableCell>
                <TableCell>
                  {row.coach}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.capacity}</TableCell>
                {/* <TableCell>{row.capacity}</TableCell>
                <TableCell>{}</TableCell> */}
                <TableCell>{
                    row.start_time.split("T")[1].substring(0, row.start_time.split("T")[1].length-4) + 
                    "-" + 
                    row.end_time.split("T")[1].substring(0, row.end_time.split("T")[1].length-4)
                }</TableCell>
                <TableCell>{getScheduleWeekday(row.times.match(/BYDAY=([^;]+)/)[1])}</TableCell>
                <TableCell>{row.times.match(/RRULE:FREQ=([^;]+)/)[1]}</TableCell>
                <TableCell>{getScheduleUntil(row.times.match(/UNTIL=([^T]+)/)[1])}</TableCell>
                <TableCell><Button size="small" variant="outlined" onClick={ async () => {
                    await api.post(
                        `http://localhost:8000/studios/enroll_class/`,
                        JSON.stringify({ "course_code":  row.id}),
                        {headers: {"Content-Type": "application/json"}}
                    ).then(
                        response => {
                            console.log(response.data)
                            navigate("/course-management/")
                        }
                    ).catch(
                        errors => {
                            console.log(errors)
                            props.setError(errors.response.data[0])
                            
                        }
                    )
                }
                }>Enroll</Button></TableCell>
                <TableCell><Button  size="small" variant="outlined" onClick={()=>{navigate(`/classes/${row.id}/`)}}>View</Button></TableCell>
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


function CourseCard(props) {
    const navigate = useNavigate()

    const course_code = props.course.id
    const class_link = "/classes/" + props.course.id + "/";
    // console.log(props.course.start_time)
    const start_time = props.course.start_time.split("T")[1].substring(0, props.course.start_time.split("T")[1].length-4);
    const end_time = props.course.end_time.split("T")[1].substring(0, props.course.end_time.split("T")[1].length-4)
    const schedule_type = props.course.times.match(/RRULE:FREQ=([^;]+)/)[1];
    let schedule_until = props.course.times.match(/UNTIL=([^T]+)/)[1];
    schedule_until = schedule_until.substring(0, 4) + "-" + schedule_until.substring(4, 6) + "-" + schedule_until.substring(6,8)
    let schedule_weekday = props.course.times.match(/BYDAY=([^;]+)/)[1];
    if (schedule_weekday === "MO") {
        schedule_weekday = "Monday"
    } else if (schedule_weekday == "TU") {
        schedule_weekday = "Tuesday"
    } else if (schedule_weekday === "WE") {
        schedule_weekday = "Wednesday" 
    } else if (schedule_weekday === "TH") {
        schedule_weekday = "Thursday" 
    } else if (schedule_weekday === "FR") {
        schedule_weekday = "Friday" 
    } else if (schedule_weekday === "SA") {
        schedule_weekday = "Saturday" 
    } else if (schedule_weekday === "SU") {
        schedule_weekday = "Sunday" 
    } 

    const enrollCourse = async () => {
        await props.api.post(
            `http://localhost:8000/studios/enroll_class/`,
            JSON.stringify({ "course_code":  course_code}),
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                console.log(response.data)
                navigate("/course-management/")
            }
        ).catch(
            errors => {
                console.log(errors)
                props.setError(errors.response.data[0])
                
            }
        )
    }

    return (
            <Card
            sx={{ height: '100%', width: "80%"}}
            >
            <CardContent sx={{ flexGrow: 1, }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.course.name}
                </Typography>
                <Typography>
                    Coach: {props.course.coach}
                </Typography>
                <Typography>
                    Description: {props.course.description}
                </Typography>
                <Typography>
                    Course Size: {props.course.capacity} 
                </Typography>
                <Typography>
                    Time: {start_time + "-" + end_time + ", every " + schedule_weekday}
                </Typography>
                <Typography>
                    Schedule: {"Hold " + schedule_type + ", until " + schedule_until}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="large" onClick={enrollCourse}>Enroll all classes</Button>
            </CardActions>
            <CardActions>
                <Button size="large" href={class_link}>View and enroll one of the classes</Button>
            </CardActions>
            </Card>
    )
}

function StudioCard(props) {
    const studio = props.studio
    console.log(studio.studio_images[0].images)
    return (
        <>
            <Card
            sx={{ height: '100%', width: "80%"}}
            >
            <CardMedia
                component="img"
                sx={{
                // 16:9
                pt: '0%',
                }}
                image={"http://localhost:8000" + studio.studio_images[0].images}
                alt="random"
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                {studio.name}
                </Typography>
                <Typography>
                Address: {studio.address}
                </Typography>
                <Typography>
                    Phone Number: {studio.phone_number}
                </Typography>
                <Typography>
                    Postal Code: {studio.postal_code}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="large" href={studio.url}>Get Direction</Button>
            </CardActions>
            </Card>
        </>
    )
}


function StudioAndCoursePage() {
    const api = useAxios();
    const { studio_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [studioInfo, setStudioInfo] = useState({})
    const [page, setPage]  = useState(1)
    const [coursesInfo, setCoursesInfo] = useState([])
    const [error, setError] = useState("")
    const [count, setCount] = useState(0)

    const getStudioInfo = async () => {
        await api.get(
            `http://localhost:8000/studios/view_studio/${studio_id}/`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setStudioInfo(response.data)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    };

    const getCourseInfo = async (page) => {
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/?page=${page}&size=5`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setPage(page);
                setCoursesInfo(response.data.results)
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
            setIsLoading(true)
            await getStudioInfo()
            await getCourseInfo(page)
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<> <p className="text-center"> Still loading... </p> </>)
    }
    // console.log(coursesInfo[0])

    const lat = Number(studioInfo.geographical_location.split(",")[0])
    const lng = Number(studioInfo.geographical_location.split(",")[1])

    return (
        <>
        <div className="flex flex-wrap">
            <StudioCard studio={studioInfo}/>
            <MyGooleMap state={{lat: lat, lng:lng}}/>
        </div>
        <hr className="my-5"/>
        {coursesInfo.length === 0 && 
            <>
                <div className="text-center">
                    <p> There are currently no courses provided at this studio.</p>
                    <div className="">
                        <p className="mt-10 mb-3">  Do you want to see other Studios? </p>
                        <Link to="/studios-list/" className="border-2 border-blue-500 px-2 py-1 hover:bg-gray-100 rounded-md"> Back to Studios Overview</Link>
                    </div>
                </div>
            </>
        }
        <StudioCourses 
        coursesInfo={coursesInfo} 
        count={count} 
        goNext={() => getCourseInfo(page + 1)} 
        goPrev={() => getCourseInfo(page - 1)}
        setError={setError}
        />
        {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }
        </>
    )



    // return (
    //     <>
    //         <div className="grid grid-cols-2 gap-x-8 divide-x divide-gray-200">
    //             <div>
    //                 <StudioCard studio={studioInfo}/>
    //                 <br className="my-5"/>
    //                 <MyGooleMap state={{lat: lat, lng: lng}}/>
    //             </div>
    //             {coursesInfo.length === 0 && 
    //                 <>
    //                     <div className="text-center">
    //                         <p> There are currently no courses provided at this studio.</p>
    //                         <div className="">
    //                             <p className="mt-10 mb-3">  Do you want to see other Studios? </p>
    //                             <Link to="/studios-list/" className="border-2 border-blue-500 px-2 py-1 hover:bg-gray-100 rounded-md"> Back to Studios Overview</Link>
    //                         </div>
    //                     </div>
    //                 </>
    //             }

    //             <div className="flex flex-col">
    //                 {coursesInfo.map((course) => (
    //                 <CourseCard course={course} api={api} setError={setError}/>
    //                 ))}
    //                 {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }
    //                 <div className="flex gap-3 my-5">
    //                     <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseInfo(page - 1)}>
    //                     Previous
    //                     </button>
    //                 <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseInfo(page + 1)}> Next </button>
    //                 </div>
    //             </div>
    //         </div>
    //         {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }
    // </>
    // )
}

export default StudioAndCoursePage