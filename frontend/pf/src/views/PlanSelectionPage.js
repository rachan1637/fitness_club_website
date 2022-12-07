import React, { useEffect, useState, useContext } from "react";
import useAxios from "../utils/useAxios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import { Link, useLocation, useNavigate } from "react-router-dom";

function PlansBlock(props) {
    const tiers = props.plans
    const api = useAxios()
    const navigate = useNavigate()

    const neverSubscribe = props.neverSubscribe
    const reactivate = props.reactivate

    const updatePlan = async (plan_code) => {
      await api.put(
          `http://localhost:8000/subscriptions/update_plan/`,
          JSON.stringify({plan_code: plan_code}),
          {headers: {"Content-Type": "application/json"}}
      ).then(()=> {
          navigate("/user-home/");
      }).catch( errors => {
          console.log(errors.response)
      })
  }

  const subscribePlan = async (plan_code) => {
      // console.log(props.neverSubscribe)
      if (props.neverSubscribe) {
          navigate("/fill-card-info/", {state: {neverSubscribe: neverSubscribe, plan_code: plan_code, reactivate: reactivate}});
      } else {
          if (!props.reactivate) {
              await updatePlan(plan_code);
              navigate("/user-home/");
          } else {
              navigate("/fill-card-info/", {state: {neverSubscribe: neverSubscribe, plan_code: plan_code, reactivate: reactivate}});
          }
      }
  }
    return (
      <>
    <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              // key={tier.title}
              xs={12}
              sm={6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={"Plan Code " + String(tier.id)}
                  titleTypographyProps={{ align: 'center' }}
                  // action={tier.title === 'Pro' ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${tier.price}
                    </Typography>
                    {/* <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography> */}
                  </Box>
                      <Typography
                        variant="subtitle1"
                        align="center"
                      >
                        Plan Length: {tier.month_length} months
                      </Typography>
                </CardContent>
                <CardActions>
                  <Button fullWidth sx={{border:1}} variant={tier.buttonVariant} onClick={() => subscribePlan(tier.id)}>
                    Click To Subscribe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <div className="flex justify-center">
      <Button onClick={props.goPrev} sx={{ mt: 3, border:1, mr: 2}} size="small">
        Prev
      </Button>
      <Button onClick={props.goNext} sx={{ mt: 3, border:1}} size="small">
        Next
      </Button>
      </div>
    </>
    )
}

// function PlanBlock(props) {
//     const plan_code = props.plan.id
//     // console.log(plan_code)
//     const navigate = useNavigate()

//     const updatePlan = async () => {
//         await props.api.put(
//             `http://localhost:8000/subscriptions/update_plan/`,
//             JSON.stringify({plan_code: plan_code}),
//             {headers: {"Content-Type": "application/json"}}
//         ).then(()=> {
//             navigate("/user-home/");
//         }).catch( errors => {
//             console.log(errors.response)
//         })
//     }

//     const subscribePlan = async () => {
//         console.log(props.neverSubscribe)
//         if (props.neverSubscribe) {
//             navigate("/fill-card-info/", {state: {neverSubscribe: props.neverSubscribe, plan_code: plan_code, reactivate: props.reactivate}});
//         } else {
//             if (!props.reactivate) {
//                 await updatePlan();
//                 navigate("/user-home/");
//             } else {
//                 navigate("/fill-card-info/", {state: {neverSubscribe: props.neverSubscribe, plan_code: plan_code, reactivate: props.reactivate}});
//             }
//         }
//     }

//     return (
//         <>
//             <button onClick={subscribePlan} className="hover:bg-gray-100 px-4 py-4 rounded-2xl relative group border-2">
//                 <p> Plan Code: {props.plan.id}</p>
//                 <p> Length of the Plan: {props.plan.month_length}</p>
//                 <p> Price: {props.plan.price} </p>
//             </button>
//         </>
//     )
// }

function PlanSelectionPage() {
    const api = useAxios();
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [allSubscriptionPlans, setAllSubscriptionPlans] = useState([])
    const [count, setCount] = useState(0)

    const location = useLocation()
    const { neverSubscribe, reactivate } = location.state

    const getPlans = async (page) => {
        await api.get(
            `http://localhost:8000/subscriptions/all_plans/?page=${page}&size=3`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setPage(page);
                setAllSubscriptionPlans(response.data.results)
                setCount(response.data.count)
            }
        ).catch(
            error => {
                console.log(error.response)
            }
        )
    };

    useEffect (() => {
        const fetchData = async () =>  {
            setIsLoading(true);
            await getPlans(page);
            setIsLoading(false);
        }

        fetchData();
    }, [])

    if (isLoading) {
        return (<><p> Still Loading </p></>)
    }

    console.log("neverSubscribe", neverSubscribe)

    return (
    <>
        <p className="text-center text-4xl"> Available Plans </p>
            <hr className="mt-3 mb-5"/>
            {allSubscriptionPlans.length === 0 && 
                <>
                    <p> No available plan is provided now. </p>
                </>
            }
            <PlansBlock 
            plans={allSubscriptionPlans} 
            neverSubscribe={neverSubscribe} 
            reactivate={reactivate}
            goPrev={()=>{getPlans(page-1)}}
            goNext={()=>{getPlans(page+1)}}
            />
            {/* <div className="flex gap-10 text-center justify-center">
                {allSubscriptionPlans.map((plan) => (
                    <PlanBlock plan={plan} neverSubscribe={neverSubscribe} reactivate={reactivate} api={api}/>
                ))}
            </div> */}
            {neverSubscribe &&
                <>
                <div className="text-center mt-10">
                    <p> Note: You never subscribe a plan or cancel it before. </p>
                    <p>You will be asked to provide credit card information for the initial subscription.</p>
                </div>
                </>
            }
            {!neverSubscribe &&
                    <>
                    <div className="text-center mt-10">
                        <p> Note: you have subscribed a plan before, so the system will use your old credit card information.</p>
                        <p> If you want to use another credit card, please update your credit card first. </p>
                    </div>
                    </>
                }
        </>
    )
}

export default PlanSelectionPage;