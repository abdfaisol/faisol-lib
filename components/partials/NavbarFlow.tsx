"use client";
import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  HiArchive,
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiOutlineTicket,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
} from "react-icons/hi";
import { siteurl } from "@/lib/utils/siteurl";
import { get_user } from "@/lib/utils/get_user";
import api from "@/lib/utils/axios";
const NavFlow: React.FC<any> = ({ minimaze }) => {
  return (
    <nav className="bg-transparent pt-0 pr-6 pb-0 flex flex-wrap items-center justify-between mx-auto px-4 py-2.5">
      <div className="w-full p-1 lg:px-5 lg:pl-3  rounded rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center"></div>
          <div className="flex flex-row gap-x-3  justify-center ">
            <div className="flex flex-row items-center flex-grow">
              <NotificationBellDropdown />
            </div>

            <div className="hidden lg:flex flex-row justify-center">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NotificationBellDropdown: FC = function () {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-2 hover:bg-gray-100 flex items-center justify-center">
          <span className="sr-only">Notifications</span>
          <HiBell className="text-2xl text-gray-500 hover:text-gray-900" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[24rem] p-0 overflow-hidden"
        align="end"
      >
        <div className="block rounded-t-xl bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700">
          Notifications
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <a
            href="#"
            className="flex border-y py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src={siteurl("/dog.jpg")}
                className="h-11 w-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-primary dark:border-gray-700">
                <NewMessageIcon />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-md font-normal text-gray-500 ">
                New message from&nbsp;
                <span className="font-semibold text-gray-900 ">
                  Bonnie Green
                </span>
                : "Hey, what's up? All set for the presentation?"
              </div>
              <div className="text-md font-medium text-primary-700 ">
                a few moments ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src={siteurl("/dog.jpg")}
                className="h-11 w-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-gray-900 dark:border-gray-700">
                <NewFollowIcon />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-md font-normal text-gray-500 ">
                <span className="font-semibold text-gray-900 ">Jese Leos</span>
                &nbsp;and&nbsp;
                <span className="font-medium text-gray-900 ">5 others</span>
                &nbsp;started following you.
              </div>
              <div className="text-md font-medium text-primary-700 ">
                10 minutes ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src={siteurl("/dog.jpg")}
                className="h-11 w-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-600 dark:border-gray-700">
                <NewLoveIcon />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-md font-normal text-gray-500 ">
                <span className="font-semibold text-gray-900 ">
                  Joseph Mcfall
                </span>
                &nbsp;and&nbsp;
                <span className="font-medium text-gray-900 ">141 others</span>
                &nbsp;love your story. See it and view more stories.
              </div>
              <div className="text-md font-medium text-primary-700 ">
                44 minutes ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex border-b py-3 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src={siteurl("/dog.jpg")}
                className="h-11 w-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-green-400 dark:border-gray-700">
                <NewMentionIcon />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-md font-normal text-gray-500 ">
                <span className="font-semibold text-gray-900 ">
                  Leslie Livingston
                </span>
                &nbsp;mentioned you in a comment:&nbsp;
                <span className="font-medium text-primary-700 ">
                  @bonnie.green
                </span>
                &nbsp;what do you say?
              </div>
              <div className="text-md font-medium text-primary-700 ">
                1 hour ago
              </div>
            </div>
          </a>
          <a
            href="#"
            className="flex py-3 px-4 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <img
                alt=""
                src={siteurl("/dog.jpg")}
                className="h-11 w-11 rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-purple-500 dark:border-gray-700">
                <NewVideoIcon />
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-md font-normal text-gray-500 ">
                <span className="font-semibold text-gray-900 ">
                  Robert Brown
                </span>
                &nbsp;posted a new video: Glassmorphism - learn how to implement
                the new design trend.
              </div>
              <div className="text-md font-medium text-primary-700 ">
                3 hours ago
              </div>
            </div>
          </a>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NewMessageIcon: FC = function () {
  return (
    <svg
      className="h-3 w-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
      <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
    </svg>
  );
};

const NewFollowIcon: FC = function () {
  return (
    <svg
      className="h-3 w-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
    </svg>
  );
};

const NewLoveIcon: FC = function () {
  return (
    <svg
      className="h-3 w-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewMentionIcon: FC = function () {
  return (
    <svg
      className="h-3 w-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

const NewVideoIcon: FC = function () {
  return (
    <svg
      className="h-3 w-3 text-white"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
    </svg>
  );
};

const AppDrawerDropdown: FC = function () {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="text-2xl text-gray-500 hover:text-gray-900 dark:hover:text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end">
        <div className="block rounded-t-lg border-b bg-gray-50 py-2 px-4 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700">
          Apps
        </div>
        <div className="grid grid-cols-3 gap-4 p-4">
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiShoppingBag className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Sales</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiUsers className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Users</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiInbox className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Inbox</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiUserCircle className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Profile</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiCog className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Settings</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiArchive className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Products</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiCurrencyDollar className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Pricing</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiOutlineTicket className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Billing</div>
          </a>
          <a
            href="#"
            className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            <HiLogout className="mx-auto mb-1 h-7 w-7 text-gray-500" />
            <div className="text-md font-medium text-gray-900">Logout</div>
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserDropdown: FC = function () {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-row justify-center items-center gap-x-2 focus:outline-none">
          <div className="flex flex-row items-center flex-grow">
            <div className="border-l border-gray-200 px-2 h-full flex items-end justify-center flex-col text-xs max-w-[100px]">
              <div className="text-gray-900">
                {get_user("employee.name") ? get_user("employee.name") : "-"}
              </div>
            </div>
          </div>
          <img
            src={siteurl("/dog.jpg")}
            alt="User"
            className="w-8 h-8 rounded-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <span className="block text-sm font-semibold text-gray-900">
            {get_user("employee.name") ? get_user("employee.name") : "-"}
          </span>
          <span className="block truncate text-xs text-gray-500">
            {get_user("employee.email") ? get_user("employee.email") : "-"}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            if (typeof window === "object")
              navigate(
                `${process.env.NEXT_PUBLIC_API_PORTAL}/choose-roles?state=${process.env.NEXT_PUBLIC_NAME}`
              );
          }}
        >
          Switch Role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={async () => {
            await api.delete(
              process.env.NEXT_PUBLIC_BASE_URL + "/api/destroy-cookies"
            );
            localStorage.removeItem("user");
            if (typeof window === "object")
              navigate(`${process.env.NEXT_PUBLIC_API_PORTAL}/logout`);
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavFlow;
