import React, { useEffect, useState } from "react"
import useAxios from "../utils/useAxios";
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';

function Title(props) {
    return (
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {props.children}
      </Typography>
    );
  }
  


function PastClasses(props) {
    const rows = props.pastClasses
    // console.log(rows)
  
    // const rows = props.payments
    // const goNext = props.goNext
    // const goPrev = props.goPrev
    const getIsDropped = (s) => {
        if (s === true) {
            return "True"
        } else {
            return "False"
        }
    }
    
    // console.log(rows[0].is_dropped === true)
    return (
      <React.Fragment>
        <Card sx={{px: 5, py: 5}}>
        <Title>Class History</Title>
        <Typography>Total Number of Past Classes: {props.count}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Studio</TableCell>
              <TableCell>Is Dropped?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow>
                <TableCell>{row.classDate.date_start.split("T")[0].substring(0, 10)}</TableCell>
                <TableCell>
                  {
                  row.classDate.date_start.split("T")[1].substring(0, row.classDate.date_start.split("T")[1].length-4) + 
                  "-" +
                  row.classDate.date_end.split("T")[1].substring(0, row.classDate.date_end.split("T")[1].length-4)}
                </TableCell>
                <TableCell>{row.classDate.name}</TableCell>
                <TableCell>{row.classDate.coach}</TableCell>
                <TableCell>{row.classDate.studio_name}</TableCell>
                <TableCell>{getIsDropped(row.is_dropped)}</TableCell>
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



// function PastClassBlock(props) {
//     const date = props.class.classDate.date_start.split("T")[0].substring(0, 10);
//     const start_time = props.class.classDate.date_start.split("T")[1].substring(0, props.class.classDate.date_start.split("T")[1].length-4);
//     const end_time = props.class.classDate.date_end.split("T")[1].substring(0, props.class.classDate.date_end.split("T")[1].length-4)

//     let drop_or_not = "No"
//     if (String(props.class.is_dropped) == "true") {
//         drop_or_not = "Yes"
//     } else {
//         drop_or_not = "No"
//     }

//     return (
//         <>
//             <div className="text-center border-2 px-4 py-4 mb-3 rounded-xl">
//                 <h1 className="text-2xl"> {props.class.classDate.name} </h1>
//                 <p> Coach: {props.class.classDate.coach} </p>
//                 <p> {date}, From {start_time} to {end_time} </p>
//                 <p> Studio: {props.class.classDate.studio_id} </p>
//                 <p> Drop or not: {drop_or_not}</p>
//                 {/* <div className="mt-5 flex flex-col px-16">
//                     <button onClick={dropLecture} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Drop the class </button>
//                     <button onClick={dropCourse} className="mb-3 hover:bg-gray-100 border-blue-400 border-2 px-2 py-1 rounded-md"> Drop the course </button>
//                 </div> */}
//             </div>
//         </>
//     )
// }


function CourseHistoryPage () {
    const [isLoading, setIsLoading] = useState()
    const api = useAxios();
    const [page, setPage] = useState(1);
    const [count, setCount] = useState([])
    const [pastClasses, setPastClasses] = useState([])

    const getClassHistory = async (page) => {
        await api.get(
            `/api/studios/history/?page=${page}&size=10`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setPage(page);
                setPastClasses(response.data.results)
                setCount(response.data.count)
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
        <PastClasses pastClasses={pastClasses} count={count} goPrev={() => getClassHistory(page - 1)} goNext={() => getClassHistory(page + 1)} />
    )

    // return (
    //     <>
    //         <p className="text-2xl"> Class History </p>
    //         <hr className="my-3"/>
    //         <div className="flex gap-10x">
    //             {pastClasses.map((c) => (
    //                     <PastClassBlock class={c}/>
    //                 ))}
    //         </div>
    //         <div className="flex gap-3 my-5">
    //                 <button className="border-2 border-black px-2 py-1 ml-auto rounded-md" onClick={() => getClassHistory(page - 1)}>
    //                 Previous
    //                 </button>
    //             <button className="border-2 border-black px-2 py-1 mr-auto rounded-md"  onClick={() => getClassHistory(page + 1)}> Next </button>
    //         </div>
    //     </>
    // )
}

export default CourseHistoryPage