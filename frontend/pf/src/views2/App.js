import React, {useState} from 'react';
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
import UpdateProfilePage from "./views/UpdateProfilePage";
import ViewProfilePage from "./views/ViewProfilePage";
// import ProtectedPage from "./views/ProtectedPage";
import CourseManagementPage from "./views/CourseManagementPage";
import ListStudiosPage from "./views/ListStudiosPage";
import StudioAndCoursePage from "./views/StudioAndCoursePage"
import SubscriptionManagementPage from "./views/SubscriptionManagementPage"
import ClassesPage from "./views/ClassesPage";
// import ListSubscription from "./views/SubscriptionPlanPage";
import ListPaymentHis from "./views/PaymentHistoryPage";
import UpdatePasswordPage from "./views/UpdatePasswordPage"
import PlanSelectionPage from "./views/PlanSelectionPage";
import FillCardInfoPage from "./views/FillCardInfoPage";
import CourseHistoryPage from "./views/CourseHistoryPage";
import Pricing from "./templates/PlanSelectionPageT";
import StudioCard from "./templates/StudioCard";
// import ListStudioSearch from "./views/ListStudioSearchPage";
import {FirstPage} from "./views/SearchField";
import {ListStudioSearch} from "./views/ListStudioSearchPage";

function App() {
  const [searchfield, setsearchfield] = useState(null);
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
            <Route element={<HomePage/>} path="/" />
            <Route element={<LoginPage/>} path="/login/" />
            <Route element={<RegisterPage/>} path="/register/" />
            <Route element={<Pricing />} path="/pricing/"/>
            <Route element={<AuthWrapper />}>
              <Route element={<UserHomePage/>} path="/user-home"/>
              {/* <Route element={<ProtectedPage/>} path="/protected" exact /> */}
              <Route element={<CourseManagementPage/>} path="/course-management"/>
              <Route element={<ListStudiosPage/>} path = "/studios-list"/>
              <Route element={<ViewProfilePage/>} path="/accounts/view_profile" />
              <Route element={<UpdateProfilePage/>} path="/accounts/update_profile" />
              <Route element={<UpdatePasswordPage/>} path="/accounts/change_password/" />
              {/* <Route element={<ListSubscription/>} path="/subscriptions/all_plans/" /> */}
              <Route element={<ListPaymentHis/>} path="/subscriptions/payment_history/" />
              <Route element={<ClassesPage/>} path="/classes/:course_id/"/>
              <Route element={<SubscriptionManagementPage/>} path="/subscription-management/"/>
              <Route element={<StudioAndCoursePage/>} path = "/studio-info/:studio_id/"/>
              <Route element={<PlanSelectionPage/>} path="/plan-selection/"/>
              <Route element={<FillCardInfoPage/>} path="/fill-card-info/"/>
              {/* <Route element={<PaymentHistoryPage/>} path="/payment-history/"/> */}
              <Route element={<CourseHistoryPage/>} path="/course-history/"/>
              <Route element={<StudioCard/>} path="/studio-card/" />
              <Route element={<ListStudioSearch/>} path="/list_studios_search" />
              {/* <Route path = '/search'>
                <FirstPage searchfield = {searchfield} setsearchfield = {setsearchfield}/>
              </Route>
              <Route path = '/list_studios_search'>
                <ListStudioSearch searchfield = {searchfield} />
              </Route> */}
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