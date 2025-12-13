import React from "react";
import { Routes, Route } from "react-router-dom";

import ManageSlider from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageSlider.jsx";
import ManageWhyChoose from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageWhyChoose.jsx";
import ManageDiscoverFeature from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageDiscoverFeature.jsx";
import ManageExploreCourses from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageExploreCourses.jsx";
import ManageExploreBlogs from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageExploreBlogs.jsx";
import ManageHearStudents from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageHearStudents.jsx";
import ManageHappyStudents from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageHome/ManageHappyStudents.jsx";
import ManageHomeLayout from "../layouts/ManageHomeLayout.jsx";
import ManageContactLayout from "../layouts/ManageContactLayout.jsx";
import ManageContact from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageContact/ManageContact.jsx";
import ManageBlogLayout from "../layouts/ManageBlogLayout.jsx";
import ManageBlog from "../Components/institute-dashboard/ManageInsittuteWebpage/ManageBlog/ManageBlog.jsx";

const ManageHomeWebsiteRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ManageHomeLayout />} >
        <Route path="sliders" element={<ManageSlider />} />
        <Route path="highlights" element={<ManageWhyChoose />} />
        <Route path="discover-features" element={<ManageDiscoverFeature />} />
        <Route path="explore-courses" element={<ManageExploreCourses />} />
        <Route path="explore-blog" element={<ManageExploreBlogs />} />
        <Route path="hear-from-students" element={<ManageHearStudents />} />
        <Route path="happy-students" element={<ManageHappyStudents />} />
      </Route>


      <Route path="/" element={<ManageContactLayout />} >
        <Route path="manage-contact" element={< ManageContact />} />
      </Route>

       <Route path="/" element={<ManageBlogLayout />} >
        <Route path="manage-blog" element={< ManageBlog />} />
      </Route>



    </Routes>
  );
};

export default ManageHomeWebsiteRoute;

