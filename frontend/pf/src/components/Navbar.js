import { useContext } from "react";
// import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import AppAppBar from "../home_template/modules/views/AppAppBar";
import Box from '@mui/material/Box';

const rightLink = {
  fontSize: 16,
  color: 'common.white',
  ml: 3,
};


const Navbar = () => {
  const { authTokens, logoutUser } = useContext(AuthContext);
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
          <nav>
            <Link
              // to="/"
              variant="button"
              color="text.primary"
              href="/user-home/"
              sx={{ my: 1, mx: 1.5 }}
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
          <Button href="/login/" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
  
  return (
    <nav>
      <div>
        {/* <h1>App Name</h1> */}
        <div className="flex items-center gap-2 bg-gray-300 px-3 py-2">
          {login ? (
            <>
              {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/protected/">Protected Page</Link> */}
              {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/course-management/">Course Management</Link> */}
              {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/studios-list/">Studios Overview</Link> */}
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/user-home/">User Home</Link>
              <button className="ml-auto px-2 py-1 border-gray-800 border-2 rounded-md hover:shadow-lg hover:bg-gray-400" onClick={logoutUser}>Logout</button>
            </>
          ) : (
            <>
              <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/">Home</Link>
              <Link className="ml-auto hover:bg-gray-400 hover:underline px-2 py-1" to="/login/">Login</Link>
              {/* <Link className="hover:bg-gray-400 hover:underline px-2 py-1" to="/register">Register</Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;