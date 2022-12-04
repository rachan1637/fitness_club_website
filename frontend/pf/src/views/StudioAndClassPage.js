import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useAxios from "../utils/useAxios";


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

function CourseInfo(props) {
    console.log(props.course.start_time)
    const start_time = props.course.start_time.split("T")[1].substring(0, props.course.start_time.split("T")[1].length-1);
    const end_time = props.course.end_time.split("T")[1].substring(0, props.course.end_time.split("T")[1].length-1)
    const schedule_type = props.course.times.match(/RRULE:FREQ=([^;]+)/)[1];
    let schedule_until = props.course.times.match(/UNTIL=([^T]+)/)[1];
    schedule_until = schedule_until.substring(0, 4) + "." + schedule_until.substring(4, 6) + "." + schedule_until.substring(6,8)
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

    // console.log(start_time, end_time, schedule_type, schedule_until, schedule_weekday);

    return (
        <>
                <div className="text-center my-5">
                    <h1 className="text-2xl"> {props.course.name} </h1>
                    <p> Coach: {props.course.coach} </p>
                    <p> Description: {props.course.description} </p>
                    <p> Capacity:  {props.course.capacity} </p>
                    <p> From {start_time} to {end_time}, every {schedule_weekday} </p>
                    <p> The lecture is hold {schedule_type}, until {schedule_until} </p>
                    {/* <p> Keywords: {props.course.keyword_names.map( name => ({name}))} </p> */}
                    {/* <a href={props.studio.url} className="underline"> Click here to get the direction. </a> */}
                    {/* <p> Images: </p>
                    {props.studio_images.map((image,index) => <a href={`${image.images}`}> Attachment{index} </a>)} */}
                </div>
        </>
    )
}

function StudioAndClassPage() {
    const api = useAxios();
    const { pk } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [studioInfo, setStudioInfo] = useState({})
    const [coursesInfo, setCoursesInfo] = useState([])
    // const [nextPage, set]

    useEffect(() => {
        const fetchData = async () => {
            await api.get(
                `http://localhost:8000/studios/view_studio/${pk}/`,
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

            await api.get(
                `http://localhost:8000/studios/list_classes/studio/${pk}/`,
                {headers: {"Content-Type": "application/json"}}
            ).then(
                response => {
                    // console.log(response.data.next)
                    // console.log(response.data)
                    setCoursesInfo(response.data.results)
                }
            ).catch(
                error => {
                    console.log(error.response)
                }
            )

            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<> <p> Still loading </p> </>)
    }
    // console.log(coursesInfo[0])


    return (
        <>
            <StudioInfoBlock studio={studioInfo}/>
            <CourseInfo course={coursesInfo[0]}/>
        </>
    )
}

export default StudioAndClassPage