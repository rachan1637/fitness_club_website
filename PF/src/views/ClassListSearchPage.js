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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { StudioCourses } from "./StudioAndCoursePage"

function Title(props) {
    return (
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.children}
      </Typography>
    );
  }

function StudioClasses(props) {
    const api = useAxios();
    const navigate = useNavigate()
    const rows = props.classes
    const [error, setError] = useState("")

    // console.log(rows[0])

    return (
      <React.Fragment>
        <Card sx={{px: 5, py: 5}}>
        <Title>Provided Courses</Title>
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
                        `http://localhost:8000/studios/enroll_classdate/`,
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


function ClassListSearchPage() {
    const api = useAxios();
    const { studio_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [allCourses, setAllCourses] = useState([])

    const [coursesInfo, setCoursesInfo] = useState([])
    // const [allCourses, setAllCourses] = useState([]);
    const [page_all_courses, setPageAllCourses] = useState(1)
    const [count, setCount] = useState(0)

    const [searchCourses, setSearchCourses] = useState([])
    const [doSearch, setDoSearch] = useState(false)
    const [page_search, setPageSearch] = useState(1)
    const [search_content, setSearchContent] = useState("")

    const [doFilter, setDoFilter] = useState(false)
    const [page_filter, setPageFilter] = useState(1)
    const [filterName, setFilterName] = useState("")
    const [filterCoach, setFilterCoach] = useState("")

    const [doFilterDate, setDoFilterDate] = useState(false)
    const [page_filter_date, setPageFilterDate] = useState(1)
    const [filterDate, setFilterDate] = useState("")

    const [doFilterTimeRage, setDoFilterTimeRange] = useState(false)
    const [page_filter_time_range, setPageFilterTimeRange] = useState(1)
    // const [filterTimeRange, setFilterTimeRange] = useState("")


    const [page, setPage]  = useState(1)
    const [page3, setPage3] = useState(1)
    // const [coursesInfo, setCoursesInfo] = useState([])
    const [error, setError] = useState("")
    const inputValv = useRef('')
    const [valuea, setValuea] = useState("");
    // const [valuers, setValuers] = useState(new Date());
    const [valuers, setValuers] = useState('');
    const [valuere, setValuere] = useState('');
    const [valuess, setValuess] = useState('');
    const [valuese, setValuese] = useState('');

    
    const getAllCourses = async () => {
        await api
          .get(`http://localhost:8000/studios/list_classes/studio/${studio_id}/search/`)
          .then((response) => {
            setAllCourses(response.data)
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error.responses);
          });
      };


    const getCoursesInfo = async (page) => {
        await api
          .get(`http://localhost:8000/studios/list_classes/studio/${studio_id}/search/?page=${page}&size=10`)
          .then((response) => {
            setPageAllCourses(page)
            setCoursesInfo(response.data.results);
            setCount(response.data.count)

            setDoSearch(false)
            setDoFilter(false)
            setDoFilterDate(false)
            setDoFilterTimeRange(false)
          })
          .catch((error) => {
            console.log(error.responses);
          });
      };

      const getCoursesInfoSearch = async (page, search_content) => {
        // console.log(search_content)
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/search/?page=${page}&search=${search_content}&size=10`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setDoSearch(true)
                setDoFilter(false)
                setDoFilterDate(false)
                setDoFilterTimeRange(false)

                setPageSearch(page);
                setCoursesInfo(response.data.results)
                setCount(response.data.count)
                // console.log(response.data.results)
                // console.log(coursesInfo)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
      }

      const getCoursesInfoFilter = async (page, filterName, filterCoach) => {
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/search/?page=${page}&size=10&name=${filterName}&coach=${filterCoach}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                setDoSearch(false)
                setDoFilter(true)
                setDoFilterDate(false)
                setDoFilterTimeRange(false)

                setPageFilter(page);
                setCoursesInfo(response.data.results)
                setCount(response.data.count)
                // console.log(response.data.results)
                // console.log(coursesInfo)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
      }

      const getCoursesInfoDateFilter = async (page, date) => {
        const year = date.split("/")[2]
        const month = date.split("/")[0]
        const day = date.split("/")[1]
        const date_format = `${year}-${month}-${day}`

        // console.log(date, date_format)
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/search_date/${date_format}/?page=${page}&size=10`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data.next)
                // console.log(response.data)
                // setPage2(page2);
                setDoSearch(false)
                setDoFilter(false)
                setDoFilterDate(true)
                setDoFilterTimeRange(false)
                
                setPageFilterDate(page)
                setCoursesInfo(response.data.results)
                setCount(response.data.count)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }


      const getCourseDateRangeInfo = async (page, start_time, end_time) => {
        // console.log('start_time', valuers)
        // console.log('ent_time', valuere)
        await api.get(
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/search_time/${start_time}/${end_time}/?page=${page}&size=5`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                setDoSearch(false)
                setDoFilter(false)
                setDoFilterDate(false)
                setDoFilterTimeRange(true)

                setPageFilterTimeRange(page);
                setCoursesInfo(response.data.results)
                setCount(response.data.count)
                // console.log(response.data)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }


      const searchCourseInfo = (e) => {
        e.preventDefault();
        const search_val = e.target.search_content.value
        setSearchContent(search_val)

        setPageSearch(1)
        setPageAllCourses(1)
        setPageFilter(1)
        setPageFilterDate(1)
        setPageFilterTimeRange(1)

        setDoSearch(true)
        setDoFilter(false)
        setDoFilterDate(false)
        setDoFilterTimeRange(false)

        setFilterName("")
        setFilterCoach("")

        getCoursesInfoSearch(1, search_val)
      }

      const filterCourseInfo = (e) => {
        e.preventDefault()
        const filter_name = e.target.name_input.value
        const filter_coach = e.target.coach_input.value
        setFilterName(filter_name)
        setFilterCoach(filter_coach)

        setPageSearch(1)
        setPageAllCourses(1)
        setPageFilter(1)
        setPageFilterDate(1)
        setPageFilterTimeRange(1)

        setDoSearch(false)
        setDoFilter(true)
        setDoFilterDate(false)
        setDoFilterTimeRange(false)
        
        setSearchContent("")

        getCoursesInfoFilter(1, filter_name, filter_coach)
      }

      const filterCourseInfoDate = (e) => {
        e.preventDefault()
        // setFilterDate(filterDate)
        
        setPageSearch(1)
        setPageAllCourses(1)
        setPageFilter(1)
        setPageFilterDate(1)
        setPageFilterTimeRange(1)

        setDoSearch(false)
        setDoFilter(false)
        setDoFilterDate(true)
        setDoFilterTimeRange(false)

        setSearchContent("")
        setFilterName("")
        setFilterCoach("")

        getCoursesInfoDateFilter(1, filterDate)
      }

      const filterCourseInfoTimeRange = (e) => {
        e.preventDefault()

        setPageSearch(1)
        setPageAllCourses(1)
        setPageFilter(1)
        setPageFilterDate(1)
        setPageFilterTimeRange(1)

        setDoSearch(false)
        setDoFilter(false)
        setDoFilterDate(false)
        setDoFilterTimeRange(true)

        setSearchContent("")
        setFilterName("")
        setFilterCoach("")

        getCourseDateRangeInfo(1, valuers, valuere)
      }


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            await getCoursesInfo(page_all_courses)
            getAllCourses()
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<> <p className="text-center"> Still loading... </p> </>)
    }

    // console.log(coursesInfo);
    let name_list_uqi= [];

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
    
    let goNext = null
    let goPrev = null
    // let courses = null
    if (doSearch) {
        goNext = () => {getCoursesInfoSearch(page_search+1, search_content)}
        goPrev = () => {getCoursesInfoSearch(page_search-1, search_content)}
        // courses = searchCourses
    } else if (doFilter) {
        goNext = () => {getCoursesInfoFilter(page_filter+1, filterName, filterCoach)}
        goPrev = () => {getCoursesInfoFilter(page_filter-1, filterName, filterCoach)}
    } else if (doFilterDate) {
        goNext = () => {getCoursesInfoDateFilter(page_filter+1, filterDate)}
        goPrev = () => {getCoursesInfoDateFilter(page_filter-1, filterDate)}
    } else if (doFilterTimeRage) {
        goNext = () => {getCourseDateRangeInfo(page_filter_time_range+1, valuers, valuere)}
        goPrev = () => {getCourseDateRangeInfo(page_filter_time_range-1, valuers, valuere)}
    } else {
        goNext = () => {getCoursesInfo(page_all_courses+1)}
        goPrev = () => {getCoursesInfo(page_all_courses-1)}
        // courses = coursesInfo
    }

    return (
        <>
                <div className="flex flex-col">
                <form className="mb-3" onSubmit={searchCourseInfo}>
                        <label className="block" htmlFor="search_content"></label>
                        <input 
                        id="search_content" 
                        className="border-2 py-2 border-black mt-5 px-2 w-64" 
                        type="text" 
                        placeholder="Fill Search Content"/>
                        <button className="border-2 border-black px-2 py-1 rounded-md ml-2 hover:bg-gray-200">Search</button>
                </form>

                <form className="mb-3 border-black border-2 px-4 py-3 rounded-lg w-96" onSubmit={filterCourseInfo}>
                    <div> Filter by Class Name
                    <select className="border-2 border-black px-2 py-1 ml-3 rounded-lg" id="name_input" defaultValue={""}> <option value="">All</option>{nameList} </select>
                    </div>
                    <div className="mt-2"> Filter by Coach Name
                    <select className="border-2 border-black px-2 py-1 ml-3 rounded-lg" id="coach_input" defaultValue={""}> <option value="">All</option>{coachList} </select>
                    </div>
                    <button className="border-2 border-black px-2 py-1 mt-2 rounded-md hover:bg-gray-200">Apply</button>
                </form>

                <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Filter By Class Date"
                            value={filterDate}
                            onChange={(date)=>{
                                const newValue1 = new Date(date).toLocaleDateString();
                                setFilterDate(newValue1); //yyyy-mm-dd
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            inputFormat="YYYY-MM-DD"
                        />
                        </LocalizationProvider>
                        <button className="border-2 border-black px-2 py-1 rounded-lg ml-3 mt-2 hover:bg-gray-200" onClick = {filterCourseInfoDate}>Apply</button>
                </div>
                <div className="my-3 flex flex-wrap gap-2">
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
                        <button className="border-2 border-black px-2 py-0.5 mr-auto rounded-md ml-3 hover:bg-gray-200"  onClick={filterCourseInfoTimeRange}> Apply </button>
                    
                    </div> 

                <StudioClasses 
                    classes={coursesInfo} 
                    count={count} 
                    goNext={goNext} 
                    goPrev={goPrev}
                />

                    {/* <div className="flex gap-3 my-5">
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
                    
                    </div> */}

                </div>
        </>
    )
}

export default ClassListSearchPage
