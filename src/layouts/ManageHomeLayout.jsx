import React from 'react'
import { Outlet } from "react-router-dom";
import Header from '../Components/header/header';
import SidebarMenu from '../Components/institute-dashboard/dashboard/sidebar/sidemenu';


const ManageHomeLayout = () => {
  return (
      <div className="layout-container">
      

      <Header /> 
    
   
      <div className="layout-main">
        <SidebarMenu />

        <main className="layout-content">
          <Outlet /> {/* Pass state as context */}
        </main>
      </div>
    </div>
  )
}

export default ManageHomeLayout
