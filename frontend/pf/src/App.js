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
import StudioAndCoursePage from "./views/StudioAndCoursePage"
import PaymentHistoryPage from "./views/PaymentHistoryPage";
import ClassesPage from "./views/ClassesPage";
import PlansPage from "./views/PlansPage"
import UpdateProfilePage from "./views/UpdateProfilePage";

function App() {
  return (
    <Router>
      <div className="">
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto py-10 px-4">

          <Routes>
            <Route element={<HomePage/>} path="/" />
            <Route element={<LoginPage/>} path="/login/" />
            <Route element={<RegisterPage/>} path="/register/" />
            <Route element={<AuthWrapper />}>
              <Route element={<UserHomePage/>} path="/user-home/"/>
              {/* <Route element={<ProtectedPage/>} path="/protected/" exact /> */}
              <Route element={<CourseManagementPage/>} path="/course-management/"/>
              <Route element={<ListStudiosPage/>} path = "/studios-list/"/>
              <Route element={<StudioAndCoursePage/>} path = "/studio-info/:studio_id/"/>
              <Route element={<PaymentHistoryPage/>} path = "/payment-history/"/>
              <Route element={<ClassesPage/>} path="/classes/:course_id/"/>
              <Route element={<PlansPage/>} path="/subscribe-plan"/>
              <Route element={<UpdateProfilePage/>} path="/update-profile/"/>
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