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
    const tiers = props.tiers
    return (
    <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
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
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant={tier.buttonVariant}>
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
}

function PlanBlock(props) {
    const plan_code = props.plan.id
    // console.log(plan_code)
    const navigate = useNavigate()

    const updatePlan = async () => {
        await props.api.put(
            `http://localhost:8000/subscriptions/update_plan/`,
            JSON.stringify({plan_code: plan_code}),
            {headers: {"Content-Type": "application/json"}}
        ).then(()=> {
            navigate("subscription-management");
        }).catch( errors => {
            console.log(errors.response)
        })
    }

    const subscribePlan = async () => {
        console.log(props.neverSubscribe)
        if (props.neverSubscribe) {
            navigate("/fill-card-info/", {state: {neverSubscribe: props.neverSubscribe, plan_code: plan_code, reactivate: props.reactivate}});
        } else {
            if (!props.reactivate) {
                await updatePlan();
                navigate("/subscription-management/");
            } else {
                navigate("/fill-card-info/", {state: {neverSubscribe: props.neverSubscribe, plan_code: plan_code, reactivate: props.reactivate}});
            }
        }
    }

    return (
        <>
            <button onClick={subscribePlan} className="hover:bg-gray-100 px-4 py-4 rounded-2xl relative group border-2">
                <p> Plan Code: {props.plan.id}</p>
                <p> Length of the Plan: {props.plan.month_length}</p>
                <p> Price: {props.plan.price} </p>
            </button>
        </>
    )
}

function PlanSelectionPage() {
    const api = useAxios();
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1);
    const [allSubscriptionPlans, setAllSubscriptionPlans] = useState([])

    const location = useLocation()
    const { neverSubscribe, reactivate } = location.state

    const getPlans = async (page) => {
        await api.get(
            `http://localhost:8000/subscriptions/all_plans/?page=${page}`,
            {headers: {"Content-Type": "application/json"}}
        ).then(
            response => {
                // console.log(response.data)
                setPage(page);
                setAllSubscriptionPlans(response.data.results)
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
        <p className="text-center"> All available subscription plans are listed below </p>
            <hr className="mt-5 mb-3"/>
            {allSubscriptionPlans.length === 0 && 
                <>
                    <p> No available plan is provided now. </p>
                </>
            }
            <div className="flex gap-10 text-center justify-center">
                {allSubscriptionPlans.map((plan) => (
                    <PlanBlock plan={plan} neverSubscribe={neverSubscribe} reactivate={reactivate} api={api}/>
                ))}
            </div>
            {/* <div className="flex gap-3 mt-5">
                <button className="border-2 border-black px-2 py-1 ml-auto rounded-lg" onClick={() => getPlans(page - 1)}>
                Previous
                </button>
                <button className="border-2 border-black px-2 py-1 mr-auto rounded-lg"  onClick={() => getPlans(page + 1)}> Next </button>
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