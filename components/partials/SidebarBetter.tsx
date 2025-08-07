"use client";
import React from "react";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { css } from "@emotion/css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { SidebarLinkBetter } from "../ui/link-better";
import { detectCase } from "@/lib/utils/detectCase";
import { useLocal } from "@/lib/utils/use-local";
import { get_user } from "@/lib/utils/get_user";
import { siteurl } from "@/lib/utils/siteurl";
import { ScrollArea } from "../ui/scroll-area";
import { LuChevronsLeftRight } from "react-icons/lu";
import { Popover } from "../Popover/Popover";
import { HiEye } from "react-icons/hi";
import { MdOutlineMoreVert } from "react-icons/md";
import api from "@/lib/utils/axios";
import { PiUserSwitch } from "react-icons/pi";
import { IoIosLogOut } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import ImageBetter from "../ui/Image";
import { ListUI } from "../list/ListUI";
import { apix } from "@/lib/utils/apix";
import { getNumber } from "@/lib/utils/getNumber";
import { events } from "@/lib/utils/event";

interface TreeMenuItem {
  title: string;
  href?: string;
  children?: TreeMenuItem[];
  icon?: any;
}

interface TreeMenuProps {
  data: TreeMenuItem[];
  minimaze: () => void;
  onClick?: () => void;
  mini: boolean;
}

const SidebarBetterTree: React.FC<TreeMenuProps> = ({
  data,
  minimaze,
  mini,
  onClick,
}) => {
  const [currentPage, setCurrentPage] = useState("");
  const [notification, setNotification] = useState(false as boolean);
  const [profile, setProfile] = useState(false as boolean);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const local = useLocal({
    data: data,
    ready: false as boolean,
  });
  /// ws//julong-notification.avolut.com/ws

  useEffect(() => {
    if (typeof location === "object") {
      const newPage = window.location.pathname;
      setCurrentPage(newPage);
    }
    const run = async () => {
      local.ready = false;
      local.render();

      setTimeout(() => {
        local.ready = true;
        local.render();
      }, 1000);
    };
    if (typeof window === "object") {
      run();
    }
  }, []);
  useEffect(() => {
    const run = async () => {
      console.log("NOTIFICATION COUNT");
      const count: any = await apix({
        port: "notification",
        value: "data.data",
        path: `/api/v1/notifications/unread/count?user_id=${get_user(
          "id"
        )}&application=${process.env.NEXT_PUBLIC_NOTIFICATION_TYPE}`,
        method: "get",
      });
      console.log(count);
      setNotificationCount(count);
      const wsCount = new WebSocket(
        `wss://${
          process.env.NEXT_PUBLIC_API_NOTIFICATION
        }/ws?user_id=${get_user("id")}&app_type=${
          process.env.NEXT_PUBLIC_NOTIFICATION_TYPE
        }`
      );
      wsCount.onopen = () => {
        console.log("WebSocket (count) connection established");
      };
      wsCount.onmessage = (event) => {
        console.log(event);
        const data = JSON.parse(event.data);
        console.log("WebSocket (count) message received:", data);
        setNotificationCount(data?.unread_count);
        // setNotifications((prev) => [data.notification, ...prev]);
      };
      wsCount.onerror = (error) => {
        console.error("WebSocket (count) error:", error);
      };
      wsCount.onclose = () => {
        console.log("WebSocket (count) connection closed");
      };
      return () => {
        if (wsCount.readyState === WebSocket.OPEN) {
          wsCount.close();
        }
      };
    };
    run();
  }, []);
  const isChildActive = (items: TreeMenuItem[]): boolean => {
    return items.some((item) => {
      if (item.href && currentPage.startsWith(item.href)) return true;
      if (item.children) return isChildActive(item.children); // Rekursif
      return false;
    });
  };
  const renderTree = (items: TreeMenuItem[], depth: number = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      let isActive = item.href && detectCase(currentPage, item.href);
      let isParentActive = hasChildren && isChildActive(item.children!);
      const [isOpen, setIsOpen] = useState(isParentActive);
      useEffect(() => {
        if (isParentActive) {
          setIsOpen(true);
        }
      }, [isParentActive]);
      const itemStyle = {
        paddingLeft:
          mini && !depth
            ? "10px"
            : !hasChildren && !depth
            ? "13px"
            : !mini
            ? `${depth * 16}px`
            : "0px",
      };
      return (
        <React.Fragment key={item.href || item.title || index}>
          {hasChildren ? (
            <li className="relative ">
              <div className="w-full flex flex-row items-center justify-center">
                <div
                  className={cx(
                    mini ? "flex flex-row" : "flex flex-row flex-grow"
                  )}
                >
                  {mini && !depth ? (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={classNames(
                                "transition-all font-bold text-sidebar-label relative flex-row flex items-center cursor-pointer items-center   text-base  flex flex-row  ",
                                isActive
                                  ? " text-base"
                                  : " hover:bg-card-layer hover:shadow-md hover:text-primary",
                                mini
                                  ? "transition-all duration-200 justify-center ml-0 rounded-lg"
                                  : "py-2.5 px-4  rounded-md flex-grow mx-2 pr-0",
                                !depth && !hasChildren ? "px-2" : "",
                                css`
                                  & > span {
                                    white-space: wrap !important;
                                  }
                                `,
                                mini
                                  ? isParentActive
                                    ? "bg-linear-sidebar-active text-white  font-normal  p-1 shadow-md w-[50px]"
                                    : isActive
                                    ? !depth
                                      ? "bg-linear-sidebar-active text-white  font-normal  p-1 shadow-md"
                                      : " bg-layer text-primary font-bold  p-1 "
                                    : "text-primary bg-transparent  p-1 hover:bg-card-layer hover:shadow-md w-[50px]"
                                  : isActive
                                  ? !depth
                                    ? " bg-linear-sidebar-active font-bold text-white shadow-md "
                                    : " bg-layer  text-primary font-bold  "
                                  : "text-white"
                              )}
                              onClick={() => {
                                if (mini) {
                                  minimaze();
                                }
                                setIsOpen(!isOpen);
                              }}
                              style={mini ? {} : itemStyle}
                            >
                              <div
                                className={cx(
                                  "flex flex-row items-center flex-grow",
                                  mini
                                    ? " justify-center  rounded-md "
                                    : " px-3",
                                  mini
                                    ? isParentActive
                                      ? "bg-linear-sidebar-active text-white font-bold "
                                      : "text-primary"
                                    : isActive
                                    ? "font-bold "
                                    : ""
                                )}
                              >
                                {!depth ? (
                                  <div
                                    className={classNames(
                                      " w-8 h-8  text-center flex flex-row items-center justify-center",
                                      !mini ? "mr-1  p-2 " : " text-lg ",
                                      mini
                                        ? css`
                                            background: transparent !important;
                                          `
                                        : ``
                                    )}
                                  >
                                    {item.icon}
                                  </div>
                                ) : (
                                  <></>
                                )}

                                {!mini ? (
                                  <>
                                    <div className="pl-2 flex-grow   text-xs line-clamp-2">
                                      {item.title}
                                    </div>
                                    <div className="text-md px-1">
                                      {isOpen ? (
                                        <FaChevronUp />
                                      ) : (
                                        <FaChevronDown />
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="bg-linear-sidebar-active text-white  border border-primary shadow-md transition-all "
                            side="right"
                          >
                            <p>{item.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  ) : (
                    <>
                      <div
                        className={classNames(
                          "transition-all font-bold text-sidebar-label relative flex-row flex items-center cursor-pointer items-center   text-base  flex flex-row  ",
                          isActive
                            ? " text-base"
                            : " hover:bg-card-layer hover:shadow-md hover:text-primary",
                          mini
                            ? "transition-all duration-200 justify-center ml-0 rounded-lg"
                            : "py-2.5 px-4  rounded-md flex-grow mx-2 pr-0",
                          !depth && !hasChildren ? "px-2" : "",
                          css`
                            & > span {
                              white-space: wrap !important;
                            }
                          `,
                          mini
                            ? isActive
                              ? !depth
                                ? "bg-linear-sidebar-active text-white  font-normal  p-1 shadow-md"
                                : " bg-layer text-primary font-bold  p-1 "
                              : "text-primary bg-transparent  p-1 hover:bg-card-layer hover:shadow-md w-[50px]"
                            : isActive
                            ? !depth
                              ? " bg-linear-sidebar-active font-bold text-white shadow-md "
                              : " bg-layer  text-primary font-bold  "
                            : "text-sidebar-label"
                        )}
                        onClick={() => {
                          if (mini) {
                            minimaze();
                          }
                          setIsOpen(!isOpen);
                        }}
                        style={mini ? {} : itemStyle}
                      >
                        <div
                          className={cx(
                            "flex flex-row items-center flex-grow",
                            mini ? " justify-center  rounded-md " : " px-3",
                            mini
                              ? isParentActive
                                ? "bg-linear-sidebar-active text-white font-bold "
                                : "text-primary"
                              : isActive
                              ? "font-bold "
                              : ""
                          )}
                        >
                          {!depth ? (
                            <div
                              className={classNames(
                                " w-8 h-8  text-center flex flex-row items-center justify-center",
                                !mini ? "mr-1  p-2 " : " text-lg ",
                                mini
                                  ? css`
                                      background: transparent !important;
                                    `
                                  : ``
                              )}
                            >
                              {item.icon}
                            </div>
                          ) : (
                            <></>
                          )}

                          {!mini ? (
                            <>
                              <div className="pl-2 flex-grow   text-xs line-clamp-2">
                                {item.title}
                              </div>
                              <div className="text-md px-1">
                                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Sidebar.ItemGroup
                className={classNames(
                  "border-none mt-0",
                  isOpen ? "" : "hidden",
                  mini ? "hidden" : ""
                )}
              >
                {renderTree(item.children!, depth + 1)}
              </Sidebar.ItemGroup>
            </li>
          ) : (
            <li className="relative">
              <div className="w-full flex flex-row items-center justify-center">
                <div
                  className={cx(
                    mini ? "flex flex-row" : "flex flex-row w-full"
                  )}
                >
                  {mini ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <SidebarLinkBetter
                              href={item.href}
                              onClick={() => {
                                if (item?.href) setCurrentPage(item.href);
                                if (typeof onClick === "function") {
                                  onClick();
                                }
                              }}
                              className={classNames(
                                "transition-all  font-bold relative flex-row flex items-center cursor-pointer items-center   text-base flex flex-row  ",
                                isActive
                                  ? " text-base"
                                  : "hover:bg-card-layer hover:shadow-md hover:text-primary",
                                mini
                                  ? "transition-all duration-200 justify-center ml-0 rounded-lg"
                                  : "py-2.5 px-4  rounded-md flex-grow mx-2",
                                !depth && !hasChildren ? "px-2" : "",
                                css`
                                  & > span {
                                    white-space: wrap !important;
                                  }
                                `,
                                mini
                                  ? isActive
                                    ? !depth
                                      ? "bg-linear-sidebar-active text-white  font-normal  p-1 shadow-md"
                                      : " bg-layer text-primary font-bold  p-1 "
                                    : "text-primary bg-transparent  p-1 hover:bg-card-layer hover:shadow-md"
                                  : isActive
                                  ? !depth
                                    ? " bg-linear-sidebar-active font-bold text-white shadow-md"
                                    : " bg-linear-sidebar-active text-white font-bold  "
                                  : "text-sidebar-label"
                              )}
                              style={mini ? {} : itemStyle} // Terapkan gaya berdasarkan depth
                            >
                              <div className="flex flex-row items-center">
                                {!depth ? (
                                  <div
                                    className={classNames(
                                      "  text-dark-700 w-8 h-8  rounded-lg text-center flex flex-row items-center justify-center",
                                      !mini ? "mr-1  p-2" : " text-lg"
                                    )}
                                  >
                                    {item.icon}
                                  </div>
                                ) : (
                                  <></>
                                )}
                                {!mini ? (
                                  <>
                                    <div className="pl-2 text-xs  line-clamp-1">
                                      {item.title}
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </SidebarLinkBetter>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          className="bg-linear-sidebar-active text-white  border border-primary shadow-md transition-all "
                          side="right"
                        >
                          <p>{item.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <SidebarLinkBetter
                      href={item.href}
                      onClick={() => {
                        if (item?.href) setCurrentPage(item.href);
                        if (typeof onClick === "function") {
                          onClick();
                        }
                      }}
                      className={classNames(
                        "transition-all  font-bold relative flex-row flex items-center cursor-pointer items-center   text-base flex flex-row  ",
                        isActive
                          ? " text-base"
                          : "hover:bg-card-layer hover:shadow-md hover:text-primary",
                        mini
                          ? "transition-all duration-200 justify-center ml-0 rounded-lg"
                          : "py-2.5 px-4  rounded-md flex-grow mx-2",
                        !depth && !hasChildren ? "px-2" : "",
                        css`
                          & > span {
                            white-space: wrap !important;
                          }
                        `,
                        mini
                          ? isActive
                            ? !depth
                              ? "bg-linear-sidebar-active text-white  font-normal  p-1 shadow-md"
                              : " bg-layer text-primary font-bold  p-1 "
                            : "text-primary bg-transparent  p-1 hover:bg-card-layer hover:shadow-md"
                          : isActive
                          ? !depth
                            ? " bg-linear-sidebar-active font-bold text-white shadow-md"
                            : " bg-linear-sidebar-active text-white font-bold  "
                          : "text-sidebar-label"
                      )}
                      style={mini ? {} : itemStyle} // Terapkan gaya berdasarkan depth
                    >
                      <div className="flex flex-row items-center">
                        {!depth ? (
                          <div
                            className={classNames(
                              "  text-dark-700 w-8 h-8  rounded-lg text-center flex flex-row items-center justify-center",
                              !mini ? "mr-1  p-2" : " text-lg"
                            )}
                          >
                            {item.icon}
                          </div>
                        ) : (
                          <></>
                        )}
                        {!mini ? (
                          <>
                            <div className="pl-2 text-xs  line-clamp-1">
                              {item.title}
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </SidebarLinkBetter>
                  )}
                </div>
              </div>
            </li>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="flex flex-col  flex-grow bg-white  relative rounded-b-2xl">
      <div
        className={cx(
          "hidden md:flex bg-linear-sidebar-active text-white p-1  md:absolute top-0 right-[-13px] cursor-pointer rounded-lg shadow-md",
          css`
            z-index: 1;
          `
        )}
        onClick={() => {
          minimaze();
          localStorage.setItem("mini", !mini ? "true" : "false");
        }}
      >
        <LuChevronsLeftRight />
      </div>
      <div className={classNames("flex flex-grow lg:!block ", {})}>
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          className={classNames(
            "relative pt-0 rounded-none  w-full",
            mini ? "w-20" : "md:w-64",
            css`
              > div {
                border-radius: 0px;
                background: transparent;
                padding-top: 0;
                padding-right: 0;
                padding-left: 0;
                padding-bottom: 0;
              }
            `
          )}
        >
          <ScrollArea className="w-full h-full">
            <div className="w-full h-full relative ">
              <div className="flex h-full flex-col w-full">
                <Sidebar.Items>
                  <Sidebar.ItemGroup
                    className={cx(
                      "border-none mt-0 pt-0 md:pt-4",
                      mini ? "flex flex-col gap-y-2" : ""
                    )}
                  >
                    {renderTree(data)}
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </ScrollArea>
        </Sidebar>
      </div>
      <div className="flex flex-col gap-y-4">
        <div
          className={cx(
            "flex flex-col flex-grow gap-y-2",
            mini ? "justify-center" : "px-4"
          )}
        >
          <div className="hidden md:flex flex-row justify-center flex-grow">
            <Popover
              classNameTrigger={cx("flex flex-row justify-center flex-grow")}
              popoverClassName={cx(
                "w-[24rem] h-[32rem] bg-white shadow-lg rounded-lg"
              )}
              placement={"right-start"}
              arrow={false}
              className="rounded-md w-full "
              onOpenChange={(open: any) => {
                setNotification(open);
              }}
              open={notification}
              content={
                <div className="flex-grow w-full h-full flex flex-col">
                  <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700">
                    Notifications
                  </div>
                  <div className="flex flex-col flex-grow">
                    <ListUI
                      className={"border-none py-0"}
                      classNameContainer={"gap-y-0"}
                      classNameScrollArea={"p-0"}
                      name="todo"
                      content={({ item }: any) => {
                        return (
                          <>
                            <a
                              href="#"
                              className="flex border-y py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                              <div className="w-full pl-3">
                                <div className="mb-1.5 text-md font-normal text-gray-500 ">
                                  New message from&nbsp;
                                  <span className="font-semibold text-gray-900 ">
                                    Bonnie Green
                                  </span>
                                  : "Hey, what's up? All set for the
                                  presentation?"
                                </div>
                                <div className="text-md font-medium text-primary-700 ">
                                  a few moments ago
                                </div>
                              </div>
                            </a>
                          </>
                        );
                      }}
                      onLoad={async (param: any) => {
                        return notifications;
                        const params = await events("onload-param", {
                          ...param,
                        });
                        const result: any = await apix({
                          port: "recruitment",
                          value: "data.data.job_postings",
                          path: `/api/job-postings${params}`,
                          validate: "array",
                        });
                        return result;
                      }}
                      onCount={async () => {
                        const result: any = await apix({
                          port: "recruitment",
                          value: "data.data.total",
                          path: `/api/job-postings?page=1&page_size=1`,
                          validate: "object",
                        });
                        return getNumber(result);
                      }}
                    />
                  </div>
                  <a
                    href="#"
                    className="block rounded-b-xl bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:hover:underline"
                  >
                    <div className="inline-flex items-center gap-x-2">
                      <HiEye className="h-6 w-6" />
                      <span>View all</span>
                    </div>
                  </a>
                </div>
              }
            >
              <div
                className={cx(
                  "flex flex-row  items-center gap-x-2 items-center  text-sm rounded-md font-bold",
                  mini
                    ? "justify-center text-primary w-50 p-1 px-2"
                    : "text-sidebar-label w-full  p-2",
                  false ? "" : "hover:bg-card-layer hover:shadow-md"
                )}
              >
                <div
                  className={classNames(
                    " w-8 h-8  text-center flex flex-row items-center justify-center ",
                    !mini ? "mr-1  p-2 " : " text-lg ",
                    mini
                      ? css`
                          background: transparent !important;
                        `
                      : ``
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                  >
                    <g fill="none" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 19v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v9M6 19h12M6 19H4m14 0h2m-9 3h2"
                      ></path>
                      <circle cx={12} cy={3} r={1}></circle>
                      {mini && notificationCount > 0 ? (
                        <circle
                          cx="18"
                          cy="6"
                          r="4"
                          fill="red"
                          stroke="white"
                        />
                      ) : (
                        <></>
                      )}
                    </g>
                  </svg>
                </div>
                {!mini && (
                  <div className="flex flex-row gap-x-2 items-center">
                    Notifications{" "}
                    <div className="p-0.5 text-2xs rounded-full bg-red-500 text-white min-w-6 h-6 flex flex-row items-center justify-center">
                      {notificationCount}
                    </div>
                  </div>
                )}
              </div>
            </Popover>
          </div>

          <div
            className={cx(
              "flex flex-row w-full p-2 items-center gap-x-2 items-center text-white text-sm hidden",
              mini ? "justify-center" : ""
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
            >
              <g fill="currentColor">
                <path d="M6.5 3.75c-.526 0-1.25.63-1.25 1.821V18.43c0 1.192.724 1.821 1.25 1.821h6.996a.75.75 0 1 1 0 1.5H6.5c-1.683 0-2.75-1.673-2.75-3.321V5.57c0-1.648 1.067-3.321 2.75-3.321h7a.75.75 0 0 1 0 1.5z"></path>
                <path d="M16.53 7.97a.75.75 0 0 0-1.06 0v3.276H9.5a.75.75 0 0 0 0 1.5h5.97v3.284a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0 .22-.532v-.002a.75.75 0 0 0-.269-.575z"></path>
              </g>
            </svg>
            {!mini && "Sign Out"}
          </div>
        </div>

        <div className="flex flex-row w-full p-4 pt-0">
          <div
            className={cx(
              "flex flex-row justify-center flex-grow  rounded-lg",
              mini ? "py-4" : "p-4  bg-primary "
            )}
          >
            <ImageBetter
              src={siteurl(
                get_user("profile.avatar")
                  ? get_user("profile.avatar")
                  : get_user("photo")
              )}
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
              defaultSrc={siteurl("/404-img.jpg")}
            />
            {!mini && (
              <div className="flex flex-row items-center flex-grow font-bold text-white">
                <div className=" px-2 h-full flex  flex-col text-xs flex-grow">
                  <div>
                    {get_user("employee.name")
                      ? get_user("employee.name")
                      : "-"}
                  </div>
                  <div className="font-normal">
                    {get_user("email") ? get_user("email") : "-"}
                  </div>
                </div>

                <Popover
                  classNameTrigger={cx("flex flex-row justify-center")}
                  popoverClassName={cx(
                    "max-w-[24rem]  bg-white shadow-lg rounded-lg"
                  )}
                  placement={"right-start"}
                  arrow={false}
                  className="rounded-md w-full "
                  onOpenChange={(open: any) => {
                    setProfile(open);
                  }}
                  open={profile}
                  content={
                    <div className="max-w-[24rem] rounded-xl overflow-hidden">
                      <div className="block  bg-gray-50 py-2 px-4 text-sm font-medium text-gray-700">
                        Profile
                      </div>
                      <div className="flex flex-col">
                        <div
                          onClick={async () => {
                            if (typeof window === "object")
                              navigate(
                                `${process.env.NEXT_PUBLIC_API_PORTAL}/choose-roles?state=${process.env.NEXT_PUBLIC_NAME}`
                              );
                          }}
                          className="cursor-pointer px-4 py-2 flex border-y hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                          <div className="w-full">
                            <div className="text-sm items-center font-normal text-primary-700 flex flex-row gap-x-2">
                              <PiUserSwitch />
                              Switch Role
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={async () => {
                            await api.delete(
                              process.env.NEXT_PUBLIC_BASE_URL +
                                "/api/destroy-cookies"
                            );
                            localStorage.removeItem("user");
                            if (typeof window === "object")
                              navigate(
                                `${process.env.NEXT_PUBLIC_API_PORTAL}/logout`
                              );
                          }}
                          className="cursor-pointer px-4 py-2 flex hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                          <div className="w-full">
                            <div className="text-sm items-center font-normal text-primary-700 flex flex-row gap-x-2">
                              <IoIosLogOut />
                              Sign Out
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="text-white cursor-pointer h-full flex flex-row items-center">
                    <MdOutlineMoreVert />
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarBetterTree;
