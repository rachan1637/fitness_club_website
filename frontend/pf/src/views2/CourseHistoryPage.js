import { useEffect, useState } from "react"
import useAxios from "../utils/useAxios";

function PastClassBlock(props) {
    const date = props.class.classDate.date_start.split("T")[0].substring(0, 10);
    const start_time = props.class.classDate.date_start.split("T")[1].substring(0, props.class.classDate.date_start.split("T")[1].length-4);
    const end_time = props.class.classDate.date_end.split("T")[1].substring(0, props.class.classDate.date_end.split("T")[1].length-4)

    let drop_or_not = "No"
    if (String(props.class.is_dropped) == "true") {
        drop_or_not = "Yes"
    } else {
        drop_or_not = "No"
    }

    return (
        <>
            <div className="text-center border-2 px-4 py-4 mb-3 rounded-xl">
                <h1 className="text-2xl"> {props.class.classDate.name} </h1>
                <p> Coach: {props.class.classDate.coach} </p>
                <p> {date}, From {start_time} to {end_time} </p>
                <p> Studio: {props.class.classDate.studio_id} </p>
                <p> Drop or not: {drop_or_not}</p>
                {/* <div className="mt-5 flex flex-col px-16">
                    <button onClick={dropLecture} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Drop the class </button>
                    <button onClick={dropCourse} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Drop the course </button>
                </div> */}
            </div>
        </>
    )
}


function CourseHistoryPage () {
    const [isLoading, setIsLoading] = useState()
    const api = useAxios();
    const [page, setPage] = useState(1);
    const [droppedClasses, setDroppedClasses] = useState([])
    const [pastClasses, setPastClasses] = useState([])

    const getClassHistory = async (page) => {
        await api.get(
            `http://localhost:8000/studios/history/?page=${page}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setPage(page);
                setPastClasses(response.data.results)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    }

    useEffect(()=> {
        const fetchData = async () => {
            setIsLoading(true);
            await getClassHistory(page);
            setIsLoading(false);
        }  
        
        fetchData();

    }, [])

    if (isLoading) {
        return (<><p> Still Loading </p></>)
    }

    return (
        <>
            <p className="text-2xl"> Class History </p>
            <hr className="my-3"/>
            <div className="flex gap-10x">
                {pastClasses.map((c) => (
                        <PastClassBlock class={c}/>
                    ))}
            </div>
        </>
    )
}

export default CourseHistoryPage