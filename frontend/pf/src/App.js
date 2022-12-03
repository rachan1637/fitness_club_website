import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { AuthWrapper } from "./context/AuthWrapper";
import UserHomePage from "./views/UserHomePage"
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ProtectedPage from "./views/ProtectedPage";
import CourseManagementPage from "./views/CourseManagementPage";
import ListStudiosPage from "./views/ListStudiosPage";

function App() {
  return (
    <Router>
      <div className="">
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto py-10 px-4">

          <Routes>
            <Route element={<HomePage/>} path="/" />
            <Route element={<LoginPage/>} path="/login" />
            <Route element={<RegisterPage/>} path="/register" />
            <Route element={<AuthWrapper />}>
              <Route element={<UserHomePage/>} path="/user-home"/>
              <Route element={<ProtectedPage/>} path="/protected" exact />
              <Route element={<CourseManagementPage/>} path="/course-management"/>
              <Route element={<ListStudiosPage/>} path = "/studios-list"/>
            </Route>
          </Routes>
          </div>
        </AuthProvider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;