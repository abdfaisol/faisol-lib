"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useLocal } from "@/lib/utils/use-local";

export const TabHeaderBetter: React.FC<any> = ({
  name,
  column,
  onLabel,
  onValue,
  onLoad,
  take = 20,
  header,
  tabContent,
  disabledPagination,
  onChange,
}) => {
  const sideRight =
    typeof header?.sideRight === "function" ? header.sideRight : null;
  const local = useLocal({
    data: [] as any[],
    sort: {} as any,
    search: null as any,
    reload: async () => {
      const res: any = onLoad({
        search: local.search,
        sort: local.sort,
        take,
        paging: 1,
      });
      if (res instanceof Promise) {
        res.then((e) => {
          local.data = e;
          local.render();
        });
      } else {
        local.data = res;
        local.render();
      }
    },
  });
  useEffect(() => {
    local.data = onLoad;
    local.render();
  }, []);
  if (!local.data?.length) return <></>;
  return (
    <div className="flex flex-row w-full flex-wrap">
      <Tabs
        className="flex flex-col w-full"
        defaultValue={onValue(local.data?.[0])}
      >
        <TabsList className="flex flex-row relative w-full bg-transparent p-0 rounded-none">
          {Array.isArray(onLoad) &&
            onLoad.map((e, idx) => {
              return (
                <TabsTrigger
                  value={onValue(e)}
                  onClick={() => {
                    if (typeof onChange === "function") {
                      onChange(e);
                    }
                  }}
                  className={cx(
                    "p-1.5 px-4  border text-sm text-gray-500 border-none mr-0 rounded-none focus-visible:ring-0  data-[state=active]:ring-0 transition-none bg-card-layer data-[state=active]:bg-white  data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-none",
                    idx === 0
                      ? "slanted-edge data-[state=active]:pr-8 rounded-tl-sm"
                      : "parallelogram pr-8 data-[state=active]:pl-8",
                    !idx ? "" : idx++ === local.data.length ? "" : ""
                  )}
                  key={onValue(e)}
                >
                  {onLabel(e)}
                  <div className="triangle"></div>
                </TabsTrigger>
              );
            })}
        </TabsList>
        {local.data.map((e) => {
          return (
            <TabsContent value={onValue(e)} key={onValue(e) + "_tabcontent"}>
              <div className="flex flex-row flex-grow w-full h-full">
                {tabContent(e)}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};
