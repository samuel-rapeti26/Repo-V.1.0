import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IdleTimerProvider } from "react-idle-timer";
import {
  IconButton,
  Button,
  Backdrop,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import Cookies from "js-cookie";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import AccountCircle from "@mui/icons-material/AccountCircle";

import InputComponent from "./components/inputComponent";
import OutputComponent from "./components/outputComponent";
import DictionarieComponent from "./components/dictionarieComponent";
import { Modal } from "./components/common/modal";
import { SetCorrectionTable } from "./reducers/correctionTable/CorrectionTableActions";
import ManualPdf from "./assets/Smart Error Detector Tool_User Manual_V1.0.0.pdf";
import "./style.css";

function App() {
  const docs = [
    { uri: require("./assets/1.docx") }
  ];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarItems, setSidebarItems] = useState({
    input: true,
    output: false,
    rules: false,
    userManual: false,
    sampleTemplates: false,
  });
  const [parasContent, setParasContent] = useState([]);
  const [noErrorModal, setNoErrorModal] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const key1 = Cookies.get("access_token_cookie");
  const key2 = Cookies.get("csrf_access_token");
  const [loading, setLoading] = useState(false);
  axios.defaults.withCredentials = true;
  const headers1 = {
    // "Accept": "application/json",
    // "Content-Type": "application/json",
    "X-CSRF-TOKEN": key2,
    access_token_cookie: key1,
    Accept: "*/*",
  };

  const { user } = useSelector((state) => state.userReducer);

  const getCorrectionTable = (data) => {
    // console.log("datasplitt", data);
    const payload = { data };
    try {
      setLoading(true);
      axios
        .post("http://localhost:2000/summary", payload, { headers: headers1 })
        .then((response) => {
          // console.log("response", response);
          const rowdata = response.data.output.Category
            ? Object.keys(response.data.output.Category).map((key) => ({
                id: parseInt(key) + 1,
                error: response.data.output.Error[key],
                suggestion: response.data.output.Suggestion[key],
                errorType: response.data.output.ErrorType[key],
                category: response.data.output.Category[key],
                StartPos: response.data.output.StartPos[key],
                EndPos: response.data.output.EndPos[key],
                Operation: response.data.output.Operation[key],
                FrontendAction: response.data.output.FrontendAction[key],
                ParagraphNum: response.data.output.ParagraphNum[key],
              }))
            : [];
          const noErrorsFound =
            response &&
            response.data &&
            response.data.output &&
            response.data.output === "No Errors Found.";
          if (noErrorsFound) {
            setNoErrorModal(noErrorsFound);
          } else {
            setParasContent(data);
            dispatch(SetCorrectionTable(rowdata));
            setSidebarItems({
              ...sidebarItems,
              output: true,
              input: false,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const Proceed = (narrativeFieldValue) => {
    console.log("narrative", narrativeFieldValue);
    setParagraph(narrativeFieldValue);
    const temp = narrativeFieldValue
      .split("\n")
      .map((text) => text)
      .filter((text) => text !== "\n" && text.trim() !== "");
    getCorrectionTable(temp);
  };

  // console.log("fromapp.js", data);

  const RevertBack = () => {
    setSidebarItems({
      output: false,
      input: true,
      rules: false,
      userManual: false,
      sampleTemplates: false,
    });
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!user) {
      handleLogout();
    }
  }, []);
  return (
    <div className="">
      <IdleTimerProvider timeout={1000 * 3600} onIdle={handleLogout} />
      <header className="py-3 bg-skyblue">
        <div className="px-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="flex items-center gap-4">
                <h1
                  className="logo font-bold text-white text-2xl text-start text-uppercase cursor-pointer"
                  onClick={RevertBack}
                >
                  Scribe Assist
                </h1>
                <div className="flex p-4 gap-4">
                  {/* <div
                    className={`text-lg text-white cursor-pointer px-2 py-1 rounded-md  ${
                      sidebarItems.input
                        ? "bg-gray-400"
                        : "hover:bg-teal-600 hover:animate-pulse"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: true,
                        output: false,
                        rules: false,
                        userManual: false,
                      })
                    }
                  >
                    Input
                  </div>
                  <div
                    className={`text-lg text-white cursor-pointer px-2 py-1 rounded-md  ${
                      sidebarItems.output
                        ? "bg-gray-400"
                        : "hover:bg-teal-600 hover:animate-pulse"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: true,
                        rules: false,
                        userManual: false,
                      })
                    }
                  >
                    Output
                  </div> */}
                  <div
                    className={`text-lg text-white cursor-pointer py-1 ${
                      sidebarItems.rules
                        ? "bg-gray-400 px-2 border-b-2 border-white "
                        : "hover:bg-teal-600 hover:animate-pulse px-2"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: false,
                        rules: true,
                        userManual: false,
                        sampleTemplates: false,
                      })
                    }
                  >
                    Dictionaries & Rule
                  </div>
                  <div
                    className={`text-lg text-white cursor-pointer py-1 ${
                      sidebarItems.userManual
                        ? "bg-gray-400 px-2 border-b-2 border-white "
                        : "hover:bg-teal-600 hover:animate-pulse px-2"
                    }`}
                    onClick={() =>
                      setSidebarItems({
                        input: false,
                        output: false,
                        rules: false,
                        userManual: true,
                        sampleTemplates: false,
                      })
                    }
                  >
                    User manual
                  </div>
                  <div
                      className={`text-lg text-white cursor-pointer py-1 ${
                        sidebarItems.sampleTemplates
                          && "bg-gray-400 px-2 border-b-2 border-white "
                      }`}
                  >
                    <div className="group custom-dropdown">
                      <button className="outline-none focus:outline-none flex items-center">
                        <span className="pr-1 font-semibold flex-1">
                          Sample Template
                        </span>
                        <span>
                          <svg
                            className="fill-current h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </span>
                      </button>
                      <ul
                        className="bg-gray-400 px-2  scale-0 group-hover:scale-100 absolute"
                      >
                        {/* <li className="rounded-sm px-3 py-1 hover:bg-gray-800">
                          Ortho
                        </li> */}
                        <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                        <button className="w-full text-left flex items-center outline-none focus:outline-none">
                            <span className="pr-1 flex-1">Opthamology</span>
                            <span className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </span>
                          </button>
                          <ul
                            className="bg-gray-400 absolute top-0 right-0 "
                          >
                            {/* <li className="px-3 py-1 hover:bg-gray-800">
                              Javascript
                            </li> */}
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">HPI</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">ROS</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">Cief Complaint</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">PE</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                Template-2
                                </li>
                              </ul>
                            </li>
                            {/* <li className="px-3 py-1 hover:bg-gray-800">Go</li>
                            <li className="px-3 py-1 hover:bg-gray-800">
                              Rust
                            </li> */}
                          </ul>
                        </li>
                        <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                        <button className="w-full text-left flex items-center outline-none focus:outline-none">
                            <span className="pr-1 flex-1">Orthopedic</span>
                            <span className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </span>
                          </button>
                          <ul
                            className="bg-gray-400 absolute top-0 right-0 "
                          >
                            {/* <li className="px-3 py-1 hover:bg-gray-800">
                              Javascript
                            </li> */}
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">HPI</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">ROS</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">Cief Complaint</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">PE</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                Template-2
                                </li>
                              </ul>
                            </li>
                            {/* <li className="px-3 py-1 hover:bg-gray-800">Go</li>
                            <li className="px-3 py-1 hover:bg-gray-800">
                              Rust
                            </li> */}
                          </ul>
                        </li>
                        <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                        <button className="w-full text-left flex items-center outline-none focus:outline-none">
                            <span className="pr-1 flex-1">Pediatric</span>
                            <span className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </span>
                          </button>
                          <ul
                            className="bg-gray-400 absolute top-0 right-0 "
                          >
                            {/* <li className="px-3 py-1 hover:bg-gray-800">
                              Javascript
                            </li> */}
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">HPI</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">ROS</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">Cief Complaint</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">PE</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                Template-2
                                </li>
                              </ul>
                            </li>
                            {/* <li className="px-3 py-1 hover:bg-gray-800">Go</li>
                            <li className="px-3 py-1 hover:bg-gray-800">
                              Rust
                            </li> */}
                          </ul>
                        </li>
                        <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                        <button className="w-full text-left flex items-center outline-none focus:outline-none">
                            <span className="pr-1 flex-1">Gynaecology</span>
                            <span className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </span>
                          </button>
                          <ul
                            className="bg-gray-400 absolute top-0 right-0 "
                          >
                            {/* <li className="px-3 py-1 hover:bg-gray-800">
                              Javascript
                            </li> */}
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">HPI</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">ROS</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">Cief Complaint</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template-2
                                </li>
                              </ul>
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">PE</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800"
                                 onClick={() =>
                                  setSidebarItems({
                                    input: false,
                                    output: false,
                                    rules: false,
                                    userManual: false,
                                    sampleTemplates: true,
                                  })
                                }>
                                  Template-1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                Template-2
                                </li>
                              </ul>
                            </li>
                            {/* <li className="px-3 py-1 hover:bg-gray-800">Go</li>
                            <li className="px-3 py-1 hover:bg-gray-800">
                              Rust
                            </li> */}
                          </ul>
                        </li>
                        {/* <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                         
                         <button className="w-full text-left flex items-center outline-none focus:outline-none">
                            <span className="pr-1 flex-1">Pediatric</span>
                            <span className="mr-auto">
                              <svg
                                className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </span>
                          </button>
                          <ul
                            className="bg-gray-400 absolute top-0 right-0 "
                          >
                            <li className="px-3 py-1 hover:bg-gray-800">
                              HPI
                            </li>
                            <li className="rounded-sm relative px-3 py-1 hover:bg-gray-800">
                              <button className="w-full text-left flex items-center outline-none focus:outline-none">
                                <span className="pr-1 flex-1">ROS</span>
                                <span className="mr-auto">
                                  <svg
                                    className="fill-current h-4 w-4 transition duration-150 ease-in-out"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </span>
                              </button>
                              <ul
                                className="bg-gray-400 absolute top-0 right-0 "
                              >
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template1
                                </li>
                                <li className="px-3 py-1 hover:bg-gray-800">
                                  Template2
                                </li>
                              </ul>
                            </li>
                            <li className="px-3 py-1 hover:bg-gray-800">Cief complaint</li>
                            <li className="px-3 py-1 hover:bg-gray-800">
                              
                            </li>
                          </ul>
                        </li> */}
                        {/* <li className="rounded-sm px-3 py-1 hover:bg-gray-800">
                          Gynaecology
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-white capitalize">{user}</h4>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    className="text-white"
                  >
                    <AccountCircle className="text-white" />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="">
        <div className="flex h-full">
          <div className="w-full px-8 py-4">
            {sidebarItems.input && (
              <InputComponent
                clickProceed={(narrativeFieldValue) =>
                  Proceed(narrativeFieldValue)
                }
              />
            )}
            {sidebarItems.output && (
              <OutputComponent
                clickRevertBack={() => RevertBack()}
                inputData={paragraph}
                parasContent={parasContent}
              />
            )}
            {sidebarItems.rules && (
              <DictionarieComponent clickRevertBack={() => RevertBack()} />
            )}
            {sidebarItems.userManual && (
              <div className="h-screen">
                <object
                  data={ManualPdf}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p>
                    Alternative text - include a link{" "}
                    <a href={ManualPdf}>to the PDF!</a>
                  </p>
                </object>
              </div>
            )}
            {
              sidebarItems.sampleTemplates && (
                <div className="h-screen">
                  <DocViewer
                  pluginRenderers={DocViewerRenderers}
                    documents={docs}
                  />
              </div>
              )
            }
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => {
          console.log("test98");
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        modalId=""
        open={noErrorModal}
        setOpen={() => setNoErrorModal(false)}
        title={""}
        size="sm"
        escape
        content={
          <div className="flex flex-col gap-4 items-center justify-center">
            <h2 className="text-4xl font-semibold text-gray-500 text-uppercase">
              No Errors found
            </h2>

            <div className="flex justify-end gap-2">
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => setNoErrorModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default App;
