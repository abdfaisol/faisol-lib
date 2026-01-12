"use client";
import React from "react";
import { TableList, TableListProps } from "./TableList";
import { useLocal } from "@/lib/utils/use-local";
import get from "lodash.get";
import { TabHeaderBetter } from "../tablist/TabHeaderBetter";
import { getNumber } from "@/lib/utils/getNumber";
import { BreadcrumbBetterLink } from "../ui/breadcrumb-link";
import { SiGooglegemini } from "react-icons/si";
import { IoIosArrowBack } from "react-icons/io";
import { get_user } from "@/lib/utils/get_user";
export interface TableUIProps<T extends object> extends TableListProps<T> {
  tabHeader?: ((local: any) => React.ReactNode) | React.ReactNode;
  modeTab?: "default" | "only-title";
  tab?: { id: string; name: string; count?: number | null }[]; // ✅ Update count menjadi nullable
  onTab?: (tabId: any) => void;
  breadcrumb?: { title?: string; label?: string; url?: string }[];
  title?: string;
  ready?: boolean;
  ai?: boolean;
  aiProjectId?: string;
  aiEmbedToken?: string;
  aiUserId?: string;
}

export const TableUI = <T extends object>({
  tabHeader,
  name,
  modeTab,
  column,
  onLoad,
  header,
  onInit,
  onCount,
  mode = "table",
  tab,
  onTab,
  breadcrumb,
  title,
  ready = true,
  filter = true,
  ai = false,
  aiProjectId,
  aiEmbedToken,
  aiUserId,
}: TableUIProps<T>) => {
  const local = useLocal({
    tab: get(tab, "[0].id"),
    table: null as any,
    show: true as boolean,
    mode: mode as "table" | "chat",
  });
  if (!ready) {
    return (
      <div className="flex-grow flex-grow flex flex-row items-center justify-center">
        <div className="spinner-better"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-grow">
      <div className="w-full p-4 md:py-6 pr-6 pl-3 ">
        <div className="flex flex-row gap-x-2 items-center">
          <div className="flex flex-row  text-xl md:text-2xl font-bold">
            {title}
          </div>{" "}
          {ai && (
            <div
              onClick={() => {
                local.mode = local.mode === "chat" ? "table" : "chat";
                local.render();
              }}
              className={`flex items-center gap-x-2 hover:opacity-80 transition-all cursor-pointer active:scale-90 px-3 py-1 rounded-full ${
                local.mode === "chat"
                  ? "bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 shadow-inner ring-1 ring-purple-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-x-1.5 bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] bg-clip-text text-transparent transition-all">
                <SiGooglegemini
                  className={`text-xl mb-0.5 transition-all duration-700 ${
                    local.mode === "chat" ? "rotate-[360deg] scale-110" : ""
                  }`}
                  style={{ fill: "url(#ai-gradient)" }}
                />
                <svg width="0" height="0" className="absolute">
                  <linearGradient
                    id="ai-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4285F4" />
                    <stop offset="50%" stopColor="#9B72CB" />
                    <stop offset="100%" stopColor="#D96570" />
                  </linearGradient>
                </svg>
                <span className="font-bold text-lg tracking-tight transition-all">
                  AI Assistant
                </span>
              </div>
            </div>
          )}
        </div>

        {breadcrumb?.length ? (
          <BreadcrumbBetterLink data={breadcrumb} />
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-col flex-grow  bg-card-layer rounded-lg border border-gray-300 shadow-md shadow-gray-300 overflow-hidden">
        <div className="flex flex-col flex-grow">
          {tab?.length && (
            <div className="flex flex-row justify-start">
              <div className="flex flex-row">
                <TabHeaderBetter
                  disabledPagination={true}
                  onLabel={(row: any) => {
                    return (
                      <div className="flex flex-row items-center gap-x-2  font-bold">
                        {modeTab !== "only-title" ? (
                          <div className="text-3xl">
                            {getNumber(row?.count) > 999
                              ? "99+"
                              : getNumber(row?.count)}
                          </div>
                        ) : (
                          <></>
                        )}

                        <div className="flex flex-col justify-start ">
                          {modeTab !== "only-title" ? (
                            <div className="text-start">Total</div>
                          ) : (
                            <></>
                          )}

                          <div>{row.name}</div>
                        </div>
                      </div>
                    );
                  }}
                  onValue={(row: any) => {
                    return row.id;
                  }}
                  onLoad={tab}
                  onChange={(tab: any) => {
                    local.tab = tab?.id;
                    local.render();
                    if (typeof onTab === "function") {
                      onTab(local.tab);
                    }
                    local.show = false;
                    local.render();
                    setTimeout(() => {
                      local.show = true;
                      local.render();
                    }, 100);
                    if (typeof local?.table?.refresh === "function") {
                      {
                        local.table.refresh();
                      }
                    }
                  }}
                  tabContent={(data: any) => {
                    return <></>;
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col  bg-white mt-[-1px] flex-grow">
            <div className="flex flex-col w-full">
              {tab?.length ? (
                typeof tabHeader === "function" ? (
                  tabHeader(local)
                ) : (
                  tabHeader
                )
              ) : (
                <></>
              )}
            </div>

            <div className="w-full flex flex-row flex-grow  overflow-hidden ">
              {local.mode === "chat" ? (
                <div className="flex flex-col w-full h-full animate-in fade-in zoom-in duration-300">
                  <div className="p-3 border-b bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm flex flex-row items-center justify-between shadow-sm px-4">
                    <div
                      onClick={() => {
                        local.mode = "table";
                        local.render();
                      }}
                      className="cursor-pointer flex flex-row items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white/80 border border-purple-100 rounded-full hover:bg-white hover:shadow-md transition-all active:scale-95"
                    >
                      <IoIosArrowBack className="text-purple-600" />
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Back to Table
                      </span>
                    </div>
                    <div className="flex items-center gap-2 italic text-xs font-medium text-purple-400">
                      {/* <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                      Powered by AI Assistant */}
                    </div>
                  </div>
                  <iframe
                    src={`https://ai.avolut.com/embed?projectId=${
                      aiProjectId || ""
                    }&embedToken=${aiEmbedToken || ""}${`&uid=${get_user(
                      "app_key"
                    )}`}`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="microphone"
                  ></iframe>
                </div>
              ) : local.show ? (
                <div className="w-full h-full relative flex">
                  <TableList
                    filter={filter}
                    name={name}
                    header={header}
                    column={column}
                    onLoad={onLoad}
                    onCount={onCount}
                    onInit={(e: any) => {
                      local.table = e;
                      local.render();
                      if (typeof onInit === "function") {
                        onInit(e);
                      }
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
