
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import TestSidebar from "../Components/institute-dashboard/Test/TestSidebar/TestSidebar";
import TestAddSidebar from "../Components/institute-dashboard/Test/TestAddSideabr/TestAddSideabr";
import TestQuestionAddSidebar from "../Components/institute-dashboard/Test/TestQuestionAdd/TestQuestionAddSidebar";
import { TestProvider } from "../Components/institute-dashboard/Test/context/TestContext";
import "./Layout.css";
import Header from "../Components/header/header";

const TestLayout = () => {
  const location = useLocation();
  const isTestAdd = location.pathname.includes("/movetest");
  const isTestQuestionAdd = location.pathname.includes("/testquestionadd");

  return (
    <TestProvider>
      <Header />
      <div className="layout-container">
        <div className="layout-main">
          {/* {isTestQuestionAdd ? (  
            <TestQuestionAddSidebar />
          ) : isTestAdd ? (
            <TestAddSidebar />
          ) : (
            <TestSidebar />
          )} */}
          <main className="layout-content">
            <Outlet />
          </main>
        </div>
      </div>
    </TestProvider>
  );
};

export default TestLayout;
