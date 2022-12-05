import AuthContext from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        T-Fitness
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact us', 'Locations'],
  },
  {
    title: 'Features',
    description: [
      'Cool stuff',
      'Random feature',
      'Team feature',
      'Developer stuff',
      'Another one',
    ],
  },
  {
    title: 'Resources',
    description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use'],
  },
];

const Footer = () => {
  // const { authTokens, logoutUser } = useContext(AuthContext);
  // let login = false;
  // try {
  //   const user = jwt_decode(authTokens.access);
  //   const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
  //   if (isExpired) {
  //     login = false;
  //   } else {
  //     login = true;
  //   }
  // } catch {
  //   login = false;
  // }
  let login = false;

  if (!login) {
    return (
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          // borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 3,
          py: [1, 3],
        }}
      >
        <Copyright sx={{ mt: 5 }} />
      </Container>
    )
  }
};
  
  export default Footer;