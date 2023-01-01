import React, { useContext } from "react";
// import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
// import { Link } from "react-router-dom"
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import AppAppBar from "../home_template/modules/views/AppAppBar";
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Dropdown, Stack } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
// const rightLink = {
//   fontSize: 16,
//   color: 'common.white',
//   ml: 3,
// };
import SimpleListMenu from "./DropDown";


const MyNavbar = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate()

  const [show, setShow] = React.useState(false);
  const toggleShow = () => setShow((prev) => setShow(!prev));

  let login = false;
  try {
    const user = jwt_decode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (isExpired) {
      login = false;
    } else {
      login = true;
    }
  } catch {
    login = false;
  }
  // console.log(login)

//   console.log(login)
  
  if (!login) {
    return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            T-Fitness
          </Typography>
          <nav>
            <Link
              // to="/"
              variant="button"
              color="text.primary"
              href="/"
              sx={{ my: 1, mx: 1.5 }}
            >
              Home
            </Link>
            {/* <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Enterprise
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link> */}
          </nav>
          <Button href="/login/" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
          <Button href="/register/" variant="outlined">
            Register
          </Button>
        </Toolbar>
      </AppBar>
    )
  } else {
    return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            T-Fitness
          </Typography>
          <SimpleListMenu/>
          <nav>
            <Link
              // to="/"
              variant="button"
              color="text.primary"
              href="/user-home/"
              sx={{ my: 1, mx: 1 }}
            >
              User Home
            </Link>
            {/* <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Enterprise
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link> */}
          </nav>
          <Button onClick={logoutUser} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
  
  // return (
  //   <nav>
  //     <div>
  //       {/* <h1>App Name</h1> */}
  //       <div className="flex items-center gap-2 bg-background-nav px-3 py-2">
  //         {login ? (
  //           <>
  //             {/* <Link className="text-white ml-1 px-2 py-1" to="/user-home/">User Home</Link>
  //             <button className="text-white ml-auto px-2 py-1 hover:underline hover:bg-gray-400" onClick={logoutUser}>Logout</button> */}
  //             <Dropdown show={show} onToggle={(isOpen) => setShow(isOpen)}>
  //             <Dropdown.Toggle variant="link">Dropdown Button</Dropdown.Toggle>
  //             <Dropdown.Menu style={{ width: 200 }}>
  //               <Dropdown.Header>
  //                 <Stack direction="horizontal" className="justify-content-between">
  //                   <h4 className="mb-0">Menu Title</h4>
  //                   <X
  //                     width={20}
  //                     height={20}
  //                     style={{ cursor: "pointer" }}
  //                     onClick={toggleShow}
  //                   />
  //                 </Stack>
  //               </Dropdown.Header>
  //               <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
  //               <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
  //               <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
  //             </Dropdown.Menu>
  //           </Dropdown>
  //           </>
  //         ) : (
  //           <>
  //             <Link className="px-2 py-1 ml-1 text-lg text-white" to="/">T-Fitness</Link>
  //             <Link className="ml-auto hover:bg-gray-400 hover:underline px-2 py-1 mr-1 text-white text-md" to="/register/">Register</Link>
  //             <Link className=" hover:bg-gray-400 hover:underline px-2 py-1 mr-1 text-white text-md" to="/login/">Login</Link>
  //             {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/register">Register</Link> */}
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </nav>
  // );
};

export default MyNavbar;