import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Sheduled.css";
import { VscTriangleDown } from "react-icons/vsc";


import { Helmet } from "react-helmet";
import CurrentRunningTest from "../../../ThreeTests/CurrentRunningTest/CurrentRunningTest";
import UpcomingTest from "../../../ThreeTests/UpcommingTest/UpcommingTest";
import CompletedTest from "../../../ThreeTests/Completed-Test/CompletedTest";
import SidebarMenu from "../../sidebar/sidemenu";

const Scheduled = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Add refs at the top of your component
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only handle clicks when sidebar is open
      if (!isMobileOpen) return;

      const sidebar = sidebarRef.current;
      const toggle = toggleRef.current;

      // If we don't have refs, don't do anything
      if (!sidebar || !toggle) return;

      // Check if click is outside both sidebar and toggle button
      const isOutsideSidebar = !sidebar.contains(e.target);
      const isOutsideToggle = !toggle.contains(e.target);

      if (isOutsideSidebar && isOutsideToggle) {
        console.log('Closing sidebar - click was outside');
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Mobile toggle function
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }
  // Function to navigate to the test details page with the test ID
  const handleViewDetails = (id) => {
    navigate(`/maindashboard/scheduled/current-running-test-details/${id}`);

  };
  // Function to navigate to the upcoming test details
  const handleUpcomingTestDetails = (id) => {
    navigate(`/maindashboard/scheduled/upcoming-test-details/${id}`);
  };
  const handleCompletedTestDetails = (id) => {
    navigate(`/maindashboard/completed-test-details/${id}`);
  };
  const viewstudenttestoverview = (id) => {
    navigate(`/maindashboard/completed-test-details/${id}`);
  };
  // Updated navigation function
  const viewStudentTestOverview = (id) => {
    navigate(`/maindashboard/teststudent-overview/${id}`);
  };
  return (
    <div className="scheduled-container">
      <Helmet>
        <title> Scheduled Tests Ongoing, Upcomming, Completed</title>
        <meta name="description" content="Scheduld Test , Ongoing,Upcomming , Completed" />
      </Helmet>
      <div className="test-index-header-moblie">
        <h1 className="breadcrumb">Scheduled Tests</h1>
        <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className="TriagbleDown" />
      </div>

      <div ref={sidebarRef}>
        <SidebarMenu
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>
      {/* Pass the function as a prop */}
      <CurrentRunningTest onViewDetails={handleViewDetails} />
      <UpcomingTest onViewDetails={handleUpcomingTestDetails} />
      <CompletedTest onViewDetails={handleCompletedTestDetails} />
    </div>
  );
};


export default Scheduled;
