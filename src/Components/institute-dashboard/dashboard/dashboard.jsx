import React from 'react';
import { VscTriangleDown } from "react-icons/vsc";
import TestStatusBar from './teststaus/teststatus';

import {
    Users,
    GraduationCap,
    BookOpen,
    FileText,
    Bookmark,
    ClipboardList,
    Home,
    PieChart
} from 'lucide-react';
import './dashboard.css';
import Header from '../../header/header';
import SidebarMenu from './sidebar/sidemenu';
import { useState, useRef, useEffect } from "react";

const DashBoard = () => {
    const statsData = [
        {
            title: "Teachers",
            value: "12/20",
            icon: <Users size={24} />,
            label: "Teachers",
            color: "#3B82F6" // blue
        },
        {
            title: "Students",
            value: "135/500",
            icon: <GraduationCap size={24} />,
            label: "Students",
            color: "#3B82F6" // emerald
        },
        {
            title: "Question Banks",
            value: "56/100",
            icon: <BookOpen size={24} />,
            label: "QB",
            color: "#3B82F6" // amber
        },
        {
            title: "Tests Count",
            value: "154/220",
            icon: <FileText size={24} />,
            label: "Tests",
            color: "#3B82F6" // violet
        },
        {
            title: "Classes",
            value: "12/20",
            icon: <Bookmark size={24} />,
            label: "Classes",
            color: "#3B82F6" // pink
        },
        {
            title: "Questions",
            value: "1356/3000",
            icon: <ClipboardList size={24} />,
            label: "Questions",
            color: "#3B82F6" // indigo
        }
    ];
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
    

    return (
        <>
            {/* <Header /> */}
            <div className="div" style={{position:"relative"}}>
                <div ref={sidebarRef} className='header-moblile-sideBar' style={{marginTop:"0px"}}>
                    <SidebarMenu
                        isMobileOpen={isMobileOpen}
                        setIsMobileOpen={setIsMobileOpen}
                        sideBarTop={true}
                    />
                </div>

                <section className="dashboard-content">
                    <div className='dashboardheading'>
                        <h3 >Institute Dashboard</h3>
                        <div className="test-index-header-moblie">
                            <VscTriangleDown onClick={toggleMobileSidebar} ref={toggleRef} className='dashboard-TriangleDown' />
                        </div>
                    </div>

                    <div className="dashboard-stats-grid">

                        {statsData.map((stat, index) => (
                            <div className="dashboard-stat-card" key={index}>
                                <div className="dashboard-stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <div className="stat-content">
                                    <p className="stat-title">{stat.title}</p>
                                    <h3 className="dashboard-stat-value">{stat.value} {stat.label}</h3>
                                    {/* <span className="dashboard-stat-label"></span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                <TestStatusBar />
            </div>
        </>
    );
};

export default DashBoard;