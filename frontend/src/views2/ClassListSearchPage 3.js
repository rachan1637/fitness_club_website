import { useEffect, useState,useRef } from "react"
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
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { requirePropFactory } from "@mui/material";


import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Data } from "@react-google-maps/api";

// function BasicDatePicker() {
//   const [value, setValue] = React.useState<Dayjs | null>(null);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DatePicker
//         label="Basic example"
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue);
//         }}
//         renderInput={(params) => <TextField {...params} />}
//       />
//     </LocalizationProvider>
//   );
// }

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
                    Coach: {props.course.coach}
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

// function StudioCard(props) {
//     const studio = props.studio
//     console.log(studio.studio_images[0].images)
//     return (
//         <>
//             <Card
//             sx={{ height: '75%', width: "80%"}}
//             >
//             <CardMedia
//                 component="img"
//                 sx={{
//                 // 16:9
//                 pt: '0%',
//                 }}
//                 image={"http://localhost:8000" + studio.studio_images[0].images}
//                 alt="random"
//             />
//             <CardContent sx={{ flexGrow: 1 }}>
//                 <Typography gutterBottom variant="h5" component="h2">
//                 {studio.name}
//                 </Typography>
//                 <Typography>
//                 Address: {studio.address}
//                 </Typography>
//                 <Typography>
//                     Phone Number: {studio.phone_number}
//                 </Typography>
//                 <Typography>
//                     Postal Code: {studio.postal_code}
//                 </Typography>
//             </CardContent>
//             <CardActions>
//                 <Button size="large" href={studio.url}>Get Direction</Button>
//             </CardActions>
//             </Card>
//         </>
//     )
// }


// function StudioInfoBlock(props) {
//     // console.log(props.studio.geographical_location.split(",")[1])
//     const lat = Number(props.studio.geographical_location.split(",")[0])
//     const lng = Number(props.studio.geographical_location.split(",")[1])
//     return (
//         <>
//             <div className="my-5">
//                 <h1 className="text-2xl"> {props.studio.name} Studio </h1>
//                 <p> Studio Address: {props.studio.address} </p>
//                 <p> Phone number: {props.studio.phone_number} </p>
//                 {/* <p> Loaction:  {props.studio.geographical_location} </p> */}
//                 <p> Postal Code: {props.studio.postal_code} </p>
//                 <a href={props.studio.url} className="underline"> Click here to get the direction. </a>

//                 <MyGooleMap state={{lat: lat, lng: lng}}/>
//                 {/* <p> Images: </p>
//                 {props.studio_images.map((image,index) => <a href={`${image.images}`}> Attachment{index} </a>)} */}
//             </div>
//         </>
//     )
// }

function CourseInfoBlock(props) {
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

    // console.log(start_time, end_time, schedule_type, schedule_until, schedule_weekday);

    return (
        <>
                <div className="text-center border-2 px-4 py-6 mb-3 rounded-xl">
                    <h1 className="text-2xl"> {props.course.name} </h1>
                    <p> Coach: {props.course.coach} </p>
                    <p> Description: {props.course.description} </p>
                    <p> Capacity:  {props.course.capacity} </p>
                    <p> From {start_time} to {end_time}, every {schedule_weekday} </p>
                    <p> The lecture is hold {schedule_type}, until {schedule_until} </p>
                    <div className="mt-5">
                        <button onClick={enrollCourse} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Enroll all lectures </button>
                        <br/>
                        <Link className="hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md" to={class_link}> View and enroll one lecture </Link>
                    </div>
                </div>
        </>
    )
}

function ClassListSearchPage() {
    const api = useAxios();
    const { studio_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [studioInfo, setStudioInfo] = useState({})
    const [page, setPage]  = useState(1)
    const [page2, setPage2]  = useState(1)
    const [page3, setPage3] = useState(1)
    const [coursesInfo, setCoursesInfo] = useState([])
    const [error, setError] = useState("")
    const inputValv = useRef('')
    const [valuea, setValuea] = useState("");
    // const [valuers, setValuers] = useState(new Date());
    const [valuers, setValuers] = useState('');
    const [valuere, setValuere] = useState('');
    const [valuess, setValuess] = useState('');
    const [valuese, setValuese] = useState('');
    const filterName = useRef('');
    const filterCoach = useRef('');
    const [allCourses, setAllCourses] = useState([]);

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
    const getAllCourseInfo = async () => {
        await api
          .get(`http://127.0.0.1:8000/studios/list_all_classes/studio/${studio_id}/`)
          .then((response) => {
            setAllCourses(response.data);
          })
          .catch((error) => {
            console.log(error.responses);
          });
      };

    const getCourseInfo = async (page, inputVal,filterName,filterCoach) => {
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/?page=${page}&search=${inputVal}&name=${filterName}&coach=${filterCoach}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setPage(page);
                setCoursesInfo(response.data.results)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }

    const getCourseDateInfo = async (page2, valuea) => {
        console.log('valuueeeeee', valuea)
        await api.get(
            `http://127.0.0.1:8000/studios/list_classes/studio/${studio_id}/search_date/${valuea}/?page=${page2}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setPage2(page2);
                setCoursesInfo(response.data.results)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }
    const getCourseDateRangeInfo = async (page3, valuers, valuere) => {
        console.log('valuers', valuers)
        console.log('valuere', valuere)
        await api.get(
            `http://127.0.0.1:8000/studios/list_classes/studio/${studio_id}/search_time/${valuers}/${valuere}/?page=${page3}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setPage3(page3);
                setCoursesInfo(response.data.results)
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
            await getAllCourseInfo()
            await getCourseInfo(page)
            await getCourseDateInfo(page2,valuea)
            await getCourseDateRangeInfo(page3, valuers, valuere)
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<> <p className="text-center"> Still loading... </p> </>)
    }
    // console.log(coursesInfo[0])

    console.log(coursesInfo);
    let name_list_uqi= [];
  // let studio_list_uqi= [];
  allCourses.map(studio_i => {
    if (name_list_uqi.indexOf(studio_i.name) === -1) {
      name_list_uqi.push(studio_i.name)
      // studio_list_uqi.push(studio_i)
    }
});

let coaches_list_uqi= [];
allCourses.map(studio_i => {
    if (coaches_list_uqi.indexOf(studio_i.coach) === -1) {
      coaches_list_uqi.push(studio_i.coach)
    }
});

name_list_uqi = name_list_uqi.sort()
let nameList =  name_list_uqi.length > 0
  &&  name_list_uqi.map((item, i) => {
  return (
   <option key={i} value={item}>{item}</option>
  )
 });

 coaches_list_uqi = coaches_list_uqi.sort()
let coachList =  coaches_list_uqi.length > 0
&&  coaches_list_uqi.map((item, i) => {
return (
 <option key={i} value={item}>{item}</option>
)
});


    return (
        <>
            {/* <StudioInfoBlock studio={studioInfo}/> */}
            {/* <div className="grid grid-cols-2 gap-x-8 divide-x divide-gray-200"> */}
                {/* <StudioCard studio={studioInfo}/> */}

                {/* {coursesInfo.length === 0 && 
                    <>
                        <div className="text-center">
                            <p> There are currently no courses provided at this studio.</p>
                            <div className="">
                                <p className="mt-10 mb-3">  Do you want to see other Studios? </p>
                                <Link to="/studios-list/" className="border-2 border-blue-500 px-2 py-1 hover:bg-gray-100 rounded-md"> Back to Studios Overview</Link>
                            </div>
                        </div>
                    </>
                } */}

                <div className="flex flex-col">
                    {coursesInfo.map((course) => (
                    <CourseCard course={course} api={api} setError={setError}/>
                    ))}
                    {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }
                   
                    <div className="flex gap-3 my-5">
                        <input type="search" placeholder="Search..." ref = {inputValv} />
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick = {() => getCourseInfo(1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}>Search</button>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseInfo(page - 1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}>
                        Previous
                        </button>
                    <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseInfo(page + 1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}> Next </button>
                    </div>
                    <div className="flex gap-3 my-5">
                        <div> Filter By Class Name
                        <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {filterName}> <option value="">All</option>{nameList} </select>
                        </div>
                        <div> Filter By Coaches
                        <select className="border-2 border-black px-2 py-1 ml-auto rounded-lg" id="name-input" ref = {filterCoach}> <option value="">All</option>{coachList} </select>
                        </div>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick = {() => getCourseInfo(1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}>Filter</button>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseInfo(page -1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}>
                        Previous
                        </button>
                    <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseInfo(page+1, inputValv.current.value, filterName.current.value, filterCoach.current.value)}> Next </button>
                    </div>

                    


                    <div className="flex gap-3 my-5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Filter by class date"
                            // mask="____-__-__"
                            value={valuea}
                            // onChange={(newValue) => {
                            onChange={(date)=>{
                                const newValue1 = new Date(date).toLocaleDateString();
                                console.log('newssss',newValue1)
                                setValuea(newValue1); //yyyy-mm-dd
                            // setValue(value.getyear());
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="YYYY-MM-DD"
                        />
                        </LocalizationProvider>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick = {() => getCourseDateInfo(1, valuea)}>Filter</button>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseDateInfo(page2 - 1, valuea)}>
                        Previous
                        </button>
                        <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseDateInfo(page2 + 1, valuea)}> Next </button>
                    </div>
                    <div className="flex gap-3 my-5">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            ampm={false}
                            openTo="hours"
                            views={['hours', 'minutes', 'seconds']}
                            
                            mask="__:__:__"
                            label="Filter Start time"
                            inputFormat="HH:mm:ss"
                            value={valuess}
                            // onChange={(date) => {
                            //     var newValue2 = new Date(date).toLocaleTimeString();
                            //     let datec = JSON.stringify(newValue2)
                            //         console.log('new date',datec)
                            //     setValuers(newValue2);
                            // }}
                            onChange={(date) => {
                                const newValue2 = new Date(date).toLocaleTimeString('en-GB')
                                console.log('newValue2',newValue2)
                                setValuers(newValue2);
                                setValuess(date);
                            }}
                            renderInput={(params2) => <TextField {...params2} />}
                        />
                        </LocalizationProvider>
                        <p>to </p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            ampm={false}
                            openTo="hours"
                            views={['hours', 'minutes', 'seconds']}
                            inputFormat="HH:mm:ss"
                            mask="__:__:__"
                            label="Filter End time"
                            value={valuese}
                            onChange={(date) => {
                                const newValue3 = new Date(date).toLocaleTimeString('en-GB')
                                console.log('newValue3',newValue3)
                                setValuere(newValue3);
                                setValuese(date);
                            }}
                           
                            renderInput={(params3) => <TextField {...params3} />}
                            />
                        </LocalizationProvider>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick = {() => getCourseDateRangeInfo(1, valuers,valuere)}>Filter</button>
                        <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseDateRangeInfo(page3 - 1, valuers,valuere)}>
                        Previous
                        </button>
                        <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseDateRangeInfo(page3 + 1, valuers,valuere)}> Next </button>
                    
                    </div>

                </div>
            {/* </div> */}
            {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }


            
            {/* <hr className="my-10"/>
            {coursesInfo.length === 0 && 
            <>
                <div className="text-center">
                    <p className="mb-5"> There are currently no courses provided at this studio. Do you want to see other Studios?</p>
                    <Link to="/studios-list/" className="border-2 border-blue-500 px-2 py-1 hover:bg-gray-100 rounded-md"> Back to Studios Overview</Link>
                </div>
            </>
            }
            <div className="flex gap-10 text-center my-5 justify-center">
                {coursesInfo.map((course) => (
                <CourseInfoBlock course={course} api={api} setError={setError}/>
                ))}
            </div>
            {error && <p className="text-red-500 rounded-md my-5 text-center"> Fail to enroll: {error}</p> }
            <div className="flex gap-3 my-5">
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getCourseInfo(page - 1)}>
                Previous
                </button>
                <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getCourseInfo(page + 1)}> Next </button>
            </div> */}
        </>
    )
}

export default ClassListSearchPage
