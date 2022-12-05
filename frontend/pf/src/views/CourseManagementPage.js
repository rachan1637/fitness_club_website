import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import { Link } from "react-router-dom";


function EnrolledClassBlock(props) {
    const drop_id = props.class.id
    const date = props.class.classDate.date_start.split("T")[0].substring(0, 10);
    const start_time = props.class.classDate.date_start.split("T")[1].substring(0, props.class.classDate.date_start.split("T")[1].length-4);
    const end_time = props.class.classDate.date_end.split("T")[1].substring(0, props.class.classDate.date_end.split("T")[1].length-4)

    const dropLecture = async () => {
        await props.api.post(
            `http://localhost:8000/studios/drop_classdate/`,
            JSON.stringify({ "DropDate":  drop_id}),
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

        props.getEnrolledClasses(props.page);
    }

    return (
        <>
            <div className="text-center border-2 px-4 py-6 mb-3 rounded-xl">
                <h1 className="text-2xl"> {props.class.classDate.name} </h1>
                <p> Coach: {props.class.classDate.coach} </p>
                <p> {date}, From {start_time} to {end_time} </p>
                <p> Studio: {props.class.classDate.studio_id} </p>
                <div className="mt-5">
                    <button onClick={dropLecture} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Drop the class </button>
                </div>
            </div>
        </>
    )
}

function CourseManagementPage() {
  const [subscription_status, setSubScriptionStatus] = useState(false)
  const [enrolled_classes, setEnrolledClasses] = useState([])
  const [ page, setPage ] = useState(1)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ error, setError ] = useState("")
  const [ neverSubscribe, setNeverSubscribe ] = useState(false)
  const api = useAxios();

  const getSubscriptionStatus = async () => {
    await api.get(
        "http://localhost:8000/subscriptions/view_subscription/"
    ).then(
        response => {
            if (response.data.cancelled) {
                setSubScriptionStatus(false)
            } else {
                setSubScriptionStatus(true)
            }
            setNeverSubscribe(false)
            // console.log(response)
            // console.log(response.data)
        }
    ).catch(
        error => {
            console.log(error.response)
            setNeverSubscribe(true)
        }
    )
  }

  const getEnrolledClasses = async (page) => {
    await api.get(
        `http://localhost:8000/studios/list_enrolled_classdate/?page=${page}`
    ).then(
        response => {
            // console.log(response.data)
            setPage(page)
            setEnrolledClasses(response.data.results)
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

        getSubscriptionStatus()
        getEnrolledClasses(page)

        setIsLoading(false)
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    if (isLoading) {
        return (<p> Wait for Loading...</p>)
    }

    return (
        <div>
        <p> Enrolled Class List, </p>
        <hr className="mt-3 mb-10"/>
        <div className="flex gap-10">
            { enrolled_classes.map( (enrolled_class) => (
                <EnrolledClassBlock class={enrolled_class} api={api} getEnrolledClasses={getEnrolledClasses} page={page} setError={setError}/>
            ))}
        </div>
        {error && <p className="text-red-500 rounded-md my-5"> Fail to drop: {error}</p> }
        {   enrolled_classes.length != 0 ?
            <div className="flex gap-3 my-5">
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg " onClick={() => getEnrolledClasses(page - 1)}>
                Previous
                </button>
                <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getEnrolledClasses(page + 1)}> Next </button>
            </div>:
            <div>
                <p> You are not enrolled in any class</p>
            </div>
        }
    
        <hr className="my-10"/>
        { !subscription_status &&
        <>
            <div className="mb-0">
                <p className="mt-10 mb-5"> You still haven't subscribed a plan. </p> 
                <Link to="/plan-selection/" className="underline hover:text-blue-500" state={{neverSubscribe: neverSubscribe}}> Go subscribe a plan! </Link>
            </div>
        </>
        }
        { subscription_status && 
        <>
            <div className="mb-0">
                <p className="mt-10 mb-5"> Do you want to enroll in other courses?</p>
                <Link to="/studios-list/" className="underline hover:text-blue-500"> Select a studio and enroll classes </Link>
                {/* <Link to="/studios-list/" className="px-2 py-2 border-gray-800 border-2 rounded-md hover:shadow-lg hover:bg-gray-400">Studios Overview</Link> */}
            </div>
        </>
        }
        </div>
    );
//   } else {
//     return <div>Not allowed</div>
//   }
}

export default CourseManagementPage;