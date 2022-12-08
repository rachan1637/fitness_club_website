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
import SubscriptionManagementPage from "./views/SubscriptionManagementPage"
// import UpdateProfilePage from "./views/UpdateProfilePage";
import PlanSelectionPage from "./views/PlanSelectionPage";
import FillCardInfoPage from "./views/FillCardInfoPage";
import CourseHistoryPage from "./views/CourseHistoryPage";
import Pricing from "./templates/PlanPricingHome";
// import StudioCardT from "./templates/StudioCardT";
import Home from "./home_template/Home"
import UpdateProfilePage from "./views/UpdateProfilePage";
import ViewProfilePage from "./views/ViewProfilePage";
import UpdatePasswordPage from "./views/UpdatePasswordPage"
// import UserProfileCard from "./templates/UserProfileCard";
// import PaymentHistory from "./templates/PaymentHistoryT";
import EnrolledClasses from "./templates/EnrollClasses";
import ListStudiosPageSearch from "./views/ListStudiosPageSearch";
import ClassListSearchPage from "./views/ClassListSearchPage";
import UserProfileCard from "./templates/UserProfileCard";
import SubscriptionProfileCard from "./templates/SubscriptionProfileCard";



function App() {
  return (
    <Router>
      <div className="">
        <AuthProvider>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
          <Navbar />
          <div className="container mx-auto py-10 px-4">

          <Routes>
            <Route element={<Home/>} path="/" />
            {/* <Route element={<HomePage/>} path="/" /> */}
            <Route element={<LoginPage/>} path="/login/" />
            <Route element={<RegisterPage/>} path="/register/" />
            <Route element={<Pricing />} path="/pricing/"/>
            <Route element={<AuthWrapper />}>
              <Route element={<UserHomePage/>} path="/user-home/"/>
              {/* <Route element={<ProtectedPage/>} path="/protected/" exact /> */}
              <Route element={<CourseManagementPage/>} path="/course-management/"/>
              <Route element={<ListStudiosPageSearch/>} path = "/studios-list/"/>
              <Route element={<StudioAndCoursePage/>} path = "/studio-info/:studio_id/"/>
              <Route element={<PaymentHistoryPage/>} path = "/payment-history/"/>
              <Route element={<ClassesPage/>} path="/classes/:course_id/"/>
              <Route element={<SubscriptionManagementPage/>} path="/subscription-management/"/>
              <Route element={<UpdateProfilePage/>} path="/update-profile/"/>
              <Route element={<PlanSelectionPage/>} path="/plan-selection/"/>
              <Route element={<FillCardInfoPage/>} path="/fill-card-info/"/>
              <Route element={<PaymentHistoryPage/>} path="/payment-history/"/>
              <Route element={<CourseHistoryPage/>} path="/course-history/"/>

              {/* <Route element={<ViewProfilePage/>} path="/user-profile/" /> */}
              <Route element={<UpdateProfilePage/>} path="/update-profile/" />
              <Route element={<UpdatePasswordPage/>} path="/change-password/" />
              {/* <Route element={<StudioCard/>} path="/studio-card/" /> */}

              <Route element={<ClassListSearchPage/>} path="/studio-class-info/:studio_id/search/" />
              <Route element={<UserProfileCard/>} path="/user-profile/"/>
              <Route element={<SubscriptionProfileCard/>} path="/subscription-profile/"/>
              {/* <Route element={<ListStudiosPageSearch/>} path="/studios-list/search/" /> */}

              {/* <Route element={<UserProfileCard/>} path="/card-test/"/> */}
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