
function UserHomePage () {
    return (
      <>
        <p> Your Account, </p>
        <div className="flex gap-10 mt-5">
          <a href="/course-management/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Course Management </p>
            <p className="text-sm mt-2"> View enrolled courses </p>
          </a>
          <a href="/studios-list/" className="border-gray-400 border-2 px-5 py-5 hover:bg-gray-100"> 
            <p className="text-xl"> Course Enrolment </p>
            <p className="text-sm mt-2"> Select studios, enroll lectures </p>
          </a>
        </div>
      </>
    )
};

export default UserHomePage;