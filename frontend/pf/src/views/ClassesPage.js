import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useAxios from "../utils/useAxios";

function ClassBlock(props) {
    // console.log(props.class.date_start.split("T")[0].substring(0, 10))
    const date = props.class.date_start.split("T")[0].substring(0, 10);
    const start_time = props.class.date_start.split("T")[1].substring(0, props.class.date_start.split("T")[1].length-4);
    const end_time = props.class.date_end.split("T")[1].substring(0, props.class.date_end.split("T")[1].length-4)

    return (
        <>
            <p className="text-2xl"> {props.class.name} </p>
            <p> Coach: {props.class.coach} </p>
            <p> Date: {date} </p>
            <p> From {start_time} to {end_time} </p>
            <p> Current Enrollment {props.class.current_enrolment}/{props.class.capacity} </p>
        </>
    )
}

function ClassesPage() {
    const api = useAxios();
    const { course_id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [classes, setClasses] = useState([])
    // const [nextPage, set]

    useEffect(() => {
        const fetchData = async () => {
            await api.get(
                `http://localhost:8000/studios/view_classdate/${course_id}/`,
                {headers: {"Content-Type": "application/json"}}
            ).then(
                response => {
                    console.log(response.data)
                    setClasses(response.data.results)
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

    // console.log(classes[0])

    return (
        <>
            <p> Classes Under </p>
            <ClassBlock class={classes[0]}/>
        </>
    )
}

export default ClassesPage