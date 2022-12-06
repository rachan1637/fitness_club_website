import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useAxios from "../utils/useAxios";

function ClassBlock(props) {
    // console.log(props.class.date_start.split("T")[0].substring(0, 10))
    const date = props.class.date_start.split("T")[0].substring(0, 10);
    const start_time = props.class.date_start.split("T")[1].substring(0, props.class.date_start.split("T")[1].length-4);
    const end_time = props.class.date_end.split("T")[1].substring(0, props.class.date_end.split("T")[1].length-4)
    const navigate = useNavigate()

    const enrollClass = async () => {
        await props.api.post(
            `http://localhost:8000/studios/enroll_classdate/`,
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
    // const [nextPage, set]

    const getClasses = async (page) => {
        await api.get(
            `http://localhost:8000/studios/view_classdate/${course_id}/?page=${page}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                setClasses(response.data.results)
                setCourseName(response.data.results[0].name)
                setPage(page)
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
            <p className="text-2xl"> {courseName} Classes </p>
            <hr className="my-3"/>
            <div className="flex gap-10">
                { classes.map(c => (<ClassBlock class={c} api={api} setError={setError}/>)) }
            </div>
            {error && <p className="text-red-500 rounded-md my-5"> Fail to enroll: {error}</p> }
            <div className="flex gap-3 mt-10">
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getClasses(page - 1)}>
            Previous
                </button>
                <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getClasses(page + 1)}> Next </button>
            </div>
        </>
    )
}

export default ClassesPage