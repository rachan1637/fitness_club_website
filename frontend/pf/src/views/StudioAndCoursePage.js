import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAxios from "../utils/useAxios";
import CourseManagementPage from "./CourseManagementPage";


function StudioInfoBlock(props) {
    return (
        <>
            <div className="text-center my-5">
                <h1 className="text-2xl"> {props.studio.name} Studio </h1>
                <p> Studio Address: {props.studio.address} </p>
                <p> Phone number: {props.studio.phone_number} </p>
                <p> Loaction:  {props.studio.geographical_location} </p>
                <p> Postal Code: {props.studio.postal_code} </p>
                <a href={props.studio.url} className="underline"> Click here to get the direction. </a>
                {/* <p> Images: </p>
                {props.studio_images.map((image,index) => <a href={`${image.images}`}> Attachment{index} </a>)} */}
            </div>
        </>
    )
}

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

function StudioAndCoursePage() {
    const api = useAxios();
    const { studio_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [studioInfo, setStudioInfo] = useState({})
    const [page, setPage]  = useState(1)
    const [coursesInfo, setCoursesInfo] = useState([])
    const [error, setError] = useState("")

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
            `http://localhost:8000/studios/list_classes/studio/${studio_id}/?page=${page}`,
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            getStudioInfo()
            getCourseInfo(page)
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<> <p> Still loading </p> </>)
    }
    // console.log(coursesInfo[0])

    console.log(coursesInfo)

    return (
        <>
            <StudioInfoBlock studio={studioInfo}/>
            <hr className="my-10"/>
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
            </div>
        </>
    )
}

export default StudioAndCoursePage