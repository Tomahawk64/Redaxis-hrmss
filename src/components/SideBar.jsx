import React, { useState } from "react";
import {
  FaComments,
  FaUsers,
  FaNewspaper,
  FaAward,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaUmbrellaBeach,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { BiSolidInbox } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Logo.png";
import userImg from "../assets/client.jpg";
import { authAPI, getUser } from "../services/api";
import "/src/App.css";

const navItems = [
  { name: "Dashboard", icon: <MdSpaceDashboard />, path: "/" },
  { name: "Employees", icon: <FaUsers />, path: "/employees" },
  { name: "Departments", icon: <FaBuilding />, path: "/departments", roles: ['admin', 'hr'] },
  { name: "Attendance", icon: <FaClipboardCheck />, path: "/attendance" },
  { name: "Leaves", icon: <FaUmbrellaBeach />, path: "/leaves" },
  { name: "Payroll", icon: <FaMoneyBillWave />, path: "/payroll" },
  { 
    name: "Engage", 
    icon: <HiSparkles />, 
    isDropdown: true,
    subItems: [
      { name: "Event", icon: <FaCalendarAlt />, path: "/event" },
      { name: "Feed", icon: <FaNewspaper />, path: "/feed" },
      { name: "Recognition", icon: <FaAward />, path: "/recognition" },
    ]
  },
  { name: "Inbox", icon: <BiSolidInbox />, path: "/chat" },
  { name: "Me", icon: <FaUser />, path: "/profile" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="user-info">
        <img src={user?.profileImage || userImg} alt="User" className="avatar" />
        <div>
          <div className="user-name">{user?.firstName || 'User'}</div>
          <div className="user-role">{user?.position || user?.role || 'Employee'}</div>
        </div>
      </div>

      <ul className="nav-list">
        {navItems.map((item) => {
          // Filter menu items by role if roles are specified
          if (item.roles && !item.roles.includes(user?.role)) {
            return null;
          }
          
          // Handle dropdown items
          if (item.isDropdown) {
            const isDropdownOpen = openDropdown === item.name;
            const isAnySubItemActive = item.subItems?.some(subItem => location.pathname === subItem.path);
            
            return (
              <li key={item.name}>
                <div
                  onClick={() => setOpenDropdown(isDropdownOpen ? null : item.name)}
                  className={`dropdown-parent ${isAnySubItemActive ? "active" : ""}`}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="dropdown-chevron">
                    {isDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </span>
                </div>
                {isDropdownOpen && (
                  <ul className="dropdown-list">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      return (
                        <li
                          key={subItem.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(subItem.path);
                          }}
                          className={`nav-item ${isSubActive ? "active" : ""}`}
                        >
                          <span className="icon">{subItem.icon}</span>
                          <span>{subItem.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          }
          
          // Regular menu items
          const isActive = location.pathname === item.path;
          return (
            <li
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto p-3">
        <button 
          onClick={handleLogout}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
