import React from "react";
import { CreateUser, UserProfile, UserList } from "@screens/User";
import DashboardScreen from "@screens/Dashboard/DashboardScreen";
import PeopleIcon from "@material-ui/icons/People";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import EventIcon from "@material-ui/icons/Event";
import SettingsIcon from "@material-ui/icons/Settings";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import SchoolIcon from "@material-ui/icons/School";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import PageNotFound from "@components/PageNotFound";

import { CreatePayroll, Payroll } from "../../Payroll";
import { AddLeaves, Leave, MonthlyQuota } from "../../Leave";
import { Time, Pay, Security } from "../../Settings";
import { Requests } from "../../Requests";
import { Suggestions } from "../../Suggestions";
import { ViewAttendance } from "../../Attendance";
import { AddEvent, ViewEvent } from "../../Event";
import { AddCourses, ViewCourses } from "../../Courses";

export const dashboardRoutes = [
  { path: "/dashboard", component: DashboardScreen },
  { path: "/404", component: PageNotFound },
  { path: "/employees/create", component: CreateUser },
  { path: "/employees/:id", component: UserProfile },
  { path: "/employees", component: UserList },
  { path: "/", redirect: true, exact: true, to: "/employees" },
  { path: "/payroll/create", component: CreatePayroll },
  { path: "/payroll", component: Payroll },
  { path: "/leave", component: Leave },
  { path: "/leavequota", component: MonthlyQuota },
  { path: "/leave-create", component: AddLeaves },
  { path: "/setting", component: Time, exact: true },
  { path: "/setting/request", component: Requests, exact: true },
  { path: "/setting/suggestion", component: Suggestions, exact: true },
  { path: "/setting/security", component: Security, exact: true },
  { path: "/setting/pay", component: Pay },
  { path: "/attendance/view", exact: true, component: ViewAttendance },
  { path: "/event/view", exact: true, component: ViewEvent },
  { path: "/event-create", exact: true, component: AddEvent },
  { path: "/course/view", exact: true, component: ViewCourses },
  { path: "/course-create", exact: true, component: AddCourses },

  { path: "", to: "/404", exact: true, redirect: true },
];

export const navigatorLinks = [
  {
    label: "Manage",
    children: [
      { path: "/employees", label: "Employees", icon: <PeopleIcon /> },
      { path: "/payroll", label: "Payroll", icon: <FileCopyIcon /> },
      { path: "/leave", label: "Leaves", icon: <EventIcon /> },
      { path: "/setting", label: "Settings", icon: <SettingsIcon /> },
      {
        path: "/attendance/view",
        label: "Attendance",
        icon: <AccessTimeIcon />,
      },
      { path: "/event/view", label: "Event", icon: <EventAvailableIcon /> },
      { path: "/course/view", label: "Courses", icon: <SchoolIcon /> },
    ],
  },
];

export const headerLinks = [
  {
    group: "/dashboard",
    label: "Dashboard",
    children: [],
  },
  {
    group: "/employees",
    label: "Employees",
    children: [
      { path: "/employees", label: "Employees" },
      { path: "/employees/create", label: "Register" },
    ],
  },
  {
    group: "/payroll",
    label: "Payroll",
    children: [
      { path: "/payroll", label: "Payroll" },
      { path: "/payroll/create", label: "Create Payroll" },
    ],
  },
  {
    group: "/leave",
    label: "Leave",
    children: [
      { path: "/leave", label: "Leave" },
      { path: "/leavequota", label: "Leave Quota" },
      { path: "/leave-create", label: "Create Leave" },
    ],
  },
  {
    group: "/setting",
    label: "Settings",
    children: [
      { path: "/setting", label: "Time" },
      { path: "/setting/request", label: "Request" },
      { path: "/setting/suggestion", label: "Suggestion" },
      { path: "/setting/pay", label: "Pay" },
      { path: "/setting/security", label: "Security" },
    ],
  },
  {
    group: "/attendance",
    label: "Attendance",
    children: [{ path: "/attendance/view", label: "View Attendance" }],
  },
  {
    group: "/event",
    label: "Event",
    children: [
      { path: "/event/view", label: "View Event" },
      { path: "/event-create", label: "Create Event" },
    ],
  },
  {
    group: "/course",
    label: "Courses",
    children: [
      { path: "/course/view", label: "View Course" },
      { path: "/course-create", label: "Create Course" },
    ],
  },
];
