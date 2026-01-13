"use client";
import {
  ColumnDef,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiPlus } from "react-icons/hi";
import { useLocal } from "@/lib/utils/use-local";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import Link from "next/link";
import { init_column } from "./lib/column";
import { toast } from "sonner";
import { Loader2, Sticker } from "lucide-react";
import { InputSearch } from "../ui/input-search";
import get from "lodash.get";
import { Checkbox } from "../ui/checkbox";
import { getNumber } from "@/lib/utils/getNumber";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import { events } from "@/lib/utils/event";
import { Popover } from "../Popover/Popover";
import { ButtonBetter, ButtonContainer } from "../ui/button";
import { Filter } from "@/lib/svg/Filter";
import { Form } from "../form/Form";
import { Field, FieldProps } from "../form/Field";
export interface Column<T = any> {
  name: string; // Tetap string karena ini adalah identifier kolom
  header: (() => JSX.Element) | string;
  filter?: boolean;
  resize?: boolean;
  width?: number;
  type?: "text" | "date" | "time" | "money" | "file";
  nameFilter?: string | string[];
  placeholderFilter?: string | string[];
  onLoadFilter?: (params?: any) => Promise<any> | any;
  labelFilter?: string;
  onLabel?: string | ((item: any) => any);
  onValue?: string | ((item: any) => any);
  pagination?: boolean;
  search?: "api" | "local";
  renderCell: (params: {
    row: T; // row tetap `T` agar lebih fleksibel
    name: string; // name tetap string
    cell: any;
    idx: number;
    tbl: any;
    fm_row?: any;
    onChange?: (data: any) => void;
    render: () => void;
  }) => JSX.Element | any;
  sortable?: boolean;
}
export interface TableListProps<T extends object> {
  autoPagination?: boolean;
  name?: string;
  column: Column<T>[] | (() => Column<T>[]);
  style?: "UI" | "Default";
  align?: "center" | "left" | "right";
  onLoad:
    | ((params: {
        search?: string;
        sort?: SortingState;
        take: number;
        paging: number;
      }) => Promise<any[]>)
    | any[];
  take?: number;
  header?: {
    sideLeft?: (local: any) => React.ReactNode;
    sideRight?: (local: any) => React.ReactNode;
  };
  disabledPagination?: boolean;
  disabledHeader?: boolean;
  disabledHeadTable?: boolean;
  hiddenNoRow?: boolean;
  disabledHoverRow?: boolean;
  onInit?: (local: any) => void;
  onCount?: (
    params?:
      | {
          search?: string;
          take: number;
          paging: number;
        }
      | string
  ) => Promise<number>;
  fm?: any;
  mode?: "form" | "table";
  feature?: string[];
  onChange?: (data: any) => void;
  filter?: boolean;
}

export interface FilterProps<T extends object> {
  nameFilter?: string | string[];
  placeholderFilter?: string | string[];
}
export interface FieldFilterProps
  extends Omit<FieldProps, "fm">,
    FilterProps<object>,
    FilterProps<object> {
  fm?: any; // Membuat `fm` nullable
}

export const TableList = <T extends object>({
  autoPagination = true,
  name = "table",
  column,
  style = "UI",
  align = "center",
  onLoad,
  take = 20,
  header,
  disabledPagination,
  disabledHeader,
  disabledHeadTable,
  hiddenNoRow,
  disabledHoverRow,
  onInit,
  onCount,
  fm,
  mode = "table",
  feature,
  onChange,
  filter = true,
}: TableListProps<T>) => {
  const [show, setShow] = useState(false as boolean);
  const [data, setData] = useState<any[]>([]);
  const sideLeft =
    typeof header?.sideLeft === "function" ? header.sideLeft : null;
  const sideRight =
    typeof header?.sideRight === "function" ? header.sideRight : null;
  type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
  };
  const checkbox =
    Array.isArray(feature) && feature?.length
      ? feature.includes("checkbox")
      : false;

  const local = useLocal({
    fieldFilter: [] as FieldFilterProps[],
    fieldResultFilter: {} as any,
    table: null as any,
    data: [] as any[],
    dataForm: [] as any[],
    listData: [] as any[],
    sort: {} as any,
    filter: {} as any,
    search: null as any,
    paging: 1,
    count: 0 as any,
    addRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data.push(row);
      local.render();
    },
    selection: {
      all: false,
      partial: [] as any[],
      data: [] as any[],
    },
    renderRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data = data;
      local.render();
    },
    removeRow: (row: any) => {
      setData((prev) => prev.filter((item) => item !== row)); // Update state lokal
      local.data = local.data.filter((item: any) => item !== row); // Hapus row dari local.data
      local.render(); // Panggil render untuk memperbarui UI
    },
    refresh: async () => {
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Loading..."}
        </>,
        {
          duration: Infinity,
        }
      );
      if (typeof onCount === "function") {
        const params = await events("onload-param", {
          take: 1,
          paging: 1,
          search: local.search,
          ...local.filter,
          ...local.fieldResultFilter,
        });
        const res = await onCount(params);
        local.count = res;
        local.render();
      }
      if (Array.isArray(onLoad)) {
        let res = onLoad;
        if (!autoPagination) {
          res = paginateArray(res, take, 1);
        }
        local.data = res;
        local.render();
        setData(res);
      } else {
        let res: any = await onLoad({
          search: local.search,
          sort: local.sort,
          take,
          paging: 1,
          ...local.fieldResultFilter,
        });
        if (!autoPagination) {
          res = paginateArray(res, take, 1);
        }
        local.data = res;
        cloneListFM(res);
        local.render();
        setData(res);
        setTimeout(() => {
          toast.dismiss();
        }, 100);
      }
    },
    reload: async () => {
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Loading..."}
        </>,
        {
          duration: Infinity,
        }
      );
      if (Array.isArray(onLoad)) {
        let res = onLoad;
        if (!autoPagination) {
          res = paginateArray(res, take, local.paging);
        }
        local.data = res;
        local.render();
        setData(res);
      } else {
        let res: any = await onLoad({
          search: local.search,
          sort: local.sort,
          take,
          paging: local.paging,
          ...local.filter,
          ...local.fieldResultFilter,
        });
        if (!autoPagination) {
          res = paginateArray(res, take, local.paging);
        }
        local.data = res;
        cloneListFM(res);
        local.render();
        setData(res);
        setTimeout(() => {
          toast.dismiss();
        }, 100);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    },
  });
  const cloneListFM = (data: any[]) => {
    if (mode === "form") {
      local.dataForm = data.map((e: any) => {
        return {
          ...fm,
          data: e,
          render: () => {
            local.render();
            fm.data[name] = local.data;
            fm.render();
          },
        };
      });
      local.render();
    }
  };
  useEffect(() => {
    try {
      const col = typeof column === "function" ? column() : column;
      if (Array.isArray(col) && col?.length) {
        const dateIndices = Array.isArray(col)
          ? col
              .map((e, index) => (e.type === "date" ? index : -1))
              .filter((index) => index !== -1)
          : [];
        const result: FieldFilterProps[] = col
          .filter(
            (e, index) =>
              e.filter !== false &&
              (e.type !== "date" || dateIndices.includes(index))
          ) // Hapus jika `false`
          .map((e) => ({
            nameFilter: e?.nameFilter,
            placeholderFilter: e?.placeholderFilter,
            name:
              Array.isArray(e?.nameFilter) && e?.nameFilter?.length
                ? e.nameFilter[0]
                : typeof e?.nameFilter === "string"
                ? e.nameFilter
                : e?.name,
            label:
              e?.labelFilter && typeof e?.labelFilter === "string"
                ? e.labelFilter // Default null jika tidak ada label
                : e?.header && typeof e?.header === "string"
                ? e.header
                : "", // Default null jika tidak ada label
            type:
              typeof e.onLoadFilter === "function"
                ? "dropdown-async"
                : e.type === "file"
                ? "text"
                : e.type ?? "text", // Default null jika tidak ada type
            onLoad: e.onLoadFilter, // Jika `undefined`, `null`, atau bukan boolean, default `true`
            onValue: e?.onValue,
            onLabel: e?.onLabel,
            pagination: e?.pagination,
            search: e?.search,
          }));
        local.fieldFilter = result;
        local.render();
      }
    } catch (ex) {}
    const run = async () => {
      toast.info(
        <>
          <Loader2
            className={cx(
              "h-4 w-4 animate-spin-important",
              css`
                animation: spin 1s linear infinite !important;
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `
            )}
          />
          {"Loading..."}
        </>,
        {
          duration: Infinity,
        }
      );
      try {
        try {
          if (typeof onCount === "function") {
            const params = await events("onload-param", {
              take: 1,
              paging: 1,
              search: local.search,
              ...local.filter,
              ...local.fieldResultFilter,
            });
            const res = await onCount(params);
            local.count = res;
            local.render();
          }
        } catch (ex) {}
        if (mode === "form") {
          local.data = fm.data?.[name] || [];
          cloneListFM(fm.data?.[name] || []);
          local.render();
          setData(fm.data?.[name] || []);
        } else {
          if (Array.isArray(onLoad)) {
            local.data = onLoad;
            cloneListFM(onLoad);
            local.render();
            setData(onLoad);
          } else if (typeof onLoad === "function") {
            let res: any = await onLoad({
              search: local.search,
              sort: local.sort,
              take,
              paging: 1,
              ...local.filter,
              ...local.fieldResultFilter,
            });
            if (!autoPagination) {
              res = paginateArray(res, take, 1);
            }
            if (!local.count) {
              local.count = res?.length;
            }
            local.data = res;
            local.render();
            setData(local.data);
          } else {
            let res: any[] = onLoad;
            if (!autoPagination) {
              res = paginateArray(res, take, 1);
            }
            local.data = res;
            local.render();
            setData(local.data);
          }
        }
      } catch (ex) {}
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    };
    if (typeof onInit === "function") {
      onInit(local);
    }
    run();
  }, []);
  const cols = typeof column === "function" ? column() : column;
  const defaultColumns: ColumnDef<Person>[] = init_column(cols);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columns] = React.useState<typeof defaultColumns>(() =>
    checkbox
      ? [
          {
            id: "select",
            width: 10,
            header: ({ table }) => {
              return (
                <Checkbox
                  id="terms"
                  className="text-primary bg-white data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  checked={table.getIsAllRowsSelected()}
                  onClick={(e) => {
                    table.getToggleAllRowsSelectedHandler();
                    const handler = table.getToggleAllRowsSelectedHandler();
                    handler(e); // Pastikan ini memanggil fungsi handler yang benar
                    local.selection.all = !local.selection.all;
                    local.render();
                    setTimeout(() => {
                      if (!table.getIsAllRowsSelected()) {
                        local.selection.all = false;
                        local.selection.partial = [];
                        local.selection.data = [];
                        local.render();
                      } else {
                        local.selection.partial = local.data.map((e) => e?.id);
                        local.selection.data = local.data;
                        local.render();
                      }
                    }, 25);
                  }}
                />
              );
            },
            cell: ({ row }) => {
              const findCheck = (row: any) => {
                if (row.getIsSelected()) return true;
                const data: any = row.original;
                const res = local.selection.partial.find((e) => e === data?.id);
                return res ? true : false;
              };
              return (
                <div className="px-0.5 items-center justify-center flex flex-row">
                  <Checkbox
                    id="terms"
                    className="border border-primary"
                    checked={findCheck(row)}
                    onClick={(e) => {
                      const handler = row.getToggleSelectedHandler();
                      handler(e); // Pastikan ini memanggil fungsi handler yang benar
                      const data: any = row.original;
                      const checked = local.selection.all
                        ? true
                        : local.selection.partial.find((e) => e === data?.id);
                      if (!checked) {
                        local.selection.partial.push(data?.id);
                        local.selection.data.push(data);
                      } else {
                        if (
                          local.selection.partial.find((e) => e === data?.id)
                        ) {
                          local.selection.partial =
                            local.selection.partial.filter(
                              (e: any) => e !== data?.id
                            );
                          local.selection.data = local.selection.data.filter(
                            (e: any) => e?.id !== data?.id
                          );
                        }
                        local.selection.all = false;
                      }
                      local.render();
                    }}
                  />
                </div>
              );
            },
            sortable: false,
          },
          ...defaultColumns,
        ]
      : [...defaultColumns]
  );

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  const [columnResizeDirection, setColumnResizeDirection] =
    React.useState<ColumnResizeDirection>("ltr");
  // Create the table and pass your options
  useEffect(() => {
    setData(local.data);
  }, [local.data.length]);
  const paginationConfig = disabledPagination
    ? {}
    : {
        getPaginationRowModel: getPaginationRowModel(),
      };
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: take,
  });
  const table = useReactTable({
    data: data,
    columnResizeMode,
    pageCount: Math.ceil(local.count / take),
    manualPagination: true,
    columnResizeDirection,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: take, //custom default page size
      },
    },
    state: {
      pagination,
      sorting,
    },
    ...paginationConfig,
  });
  local.table = table;

  // Manage your own state
  const [state, setState] = React.useState(table.initialState);

  // Override the state managers for the table to your own
  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: setState,
    debugTable: state.pagination.pageIndex > 2,
  }));
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        {!disabledHeader ? (
          <div className="head-tbl-list block items-start justify-between  flex-col gap-y-2 md:flex-row px-4 py-4 sm:flex">
            <div className="flex flex-row items-end">
              <div className="sm:flex flex flex-col space-y-2">
                <div className="flex">
                  {sideLeft ? (
                    sideLeft(local)
                  ) : (
                    <>
                      <Link href={"/new"}>
                        <button className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors">
                          <div className="flex items-center gap-x-0.5">
                            <HiPlus className="text-xl" />
                            <span className="capitalize">Add {name}</span>
                          </div>
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 md:pt-0 ml-auto flex items-center flex-row gap-x-1">
              <div className="tbl-search  items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 flex-grow md:flex-grow-0">
                <div
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await local.reload();
                  }}
                >
                  <div className="relative  lg:w-56">
                    <InputSearch
                      id="users-search"
                      delay={1000}
                      name="users-search"
                      placeholder={`Search`}
                      onChange={(e) => {
                        const value = e.target.value;
                        local.search = value;
                        local.render();
                        local.refresh();
                      }}
                    />
                  </div>
                </div>
              </div>
              {mode === "table" && filter && local?.fieldFilter?.length ? (
                <div className="flex flex-row items-center">
                  <Popover
                    classNameTrigger={""}
                    arrow={show}
                    className="rounded-md"
                    onOpenChange={(open: any) => {
                      setShow(open);
                    }}
                    open={show}
                    content={
                      <div className="flex flex-col p-4 w-80 gap-y-1 overflow-y-scroll max-h-96">
                        {/* <div className="text-md font-semibold">Filter</div> */}

                        <Form
                          toastMessage="Filter"
                          onSubmit={async (fm: any) => {
                            local.fieldResultFilter = fm?.data;
                            local.render();
                            local.refresh();
                            setShow(false);
                          }}
                          onLoad={async () => {
                            return { ...local.fieldResultFilter };
                          }}
                          showResize={false}
                          header={(fm: any) => {
                            return <></>;
                          }}
                          children={(fm: any) => {
                            return (
                              <>
                                <div
                                  className={cx(
                                    "flex flex-col flex-wrap  rounded-sm"
                                  )}
                                >
                                  <div className="flex-grow grid gap-y-2">
                                    {local.fieldFilter?.map((e, idx) => {
                                      if (e?.type === "date") {
                                        const fm_row = {
                                          data: fm?.data?.[e?.name],
                                          ...fm,
                                          render: () => {
                                            fm.render();
                                            fm.data[e?.name] = fm_row.data;
                                            fm.render();
                                          },
                                        };
                                        return (
                                          <div
                                            key={`field-filter-${idx}`}
                                            className=" grid grid-cols-2 gap-2"
                                          >
                                            <Field
                                              fm={fm}
                                              name={
                                                e?.nameFilter?.[0] ||
                                                "start_date"
                                              }
                                              label={e?.label}
                                              type={"date"}
                                              placeholder={
                                                e?.placeholderFilter?.[0] ||
                                                "Form"
                                              }
                                            />
                                            <Field
                                              fm={fm}
                                              name={
                                                e?.nameFilter?.[1] || "end_date"
                                              }
                                              label={e?.label}
                                              type={"date"}
                                              placeholder={
                                                e?.placeholderFilter?.[1] ||
                                                "To"
                                              }
                                              visibleLabel={true}
                                            />
                                          </div>
                                        );
                                      }
                                      return (
                                        <div key={`field-filter-${idx}`}>
                                          <Field
                                            fm={fm}
                                            label={e?.label}
                                            type={e?.type}
                                            placeholder={`Search${
                                              e?.label ? ` ${e?.label}` : "..."
                                            }`}
                                            {...e}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="flex flex-row items-center justify-end py-2 w-full gap-x-2">
                                    <ButtonBetter
                                      className="rounded-full w-full px-6 "
                                      variant={"outline"}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        fm.data = {};
                                        fm.render();
                                        fm.submit();
                                      }}
                                    >
                                      Clear
                                    </ButtonBetter>
                                    <ButtonBetter className="rounded-full w-full px-6 ">
                                      Apply
                                    </ButtonBetter>
                                  </div>
                                </div>
                              </>
                            );
                          }}
                        />
                      </div>
                    }
                  >
                    <ButtonContainer
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      <Filter />
                    </ButtonContainer>
                  </Popover>
                </div>
              ) : (
                <></>
              )}

              <div className="flex">{sideRight ? sideRight(local) : <></>}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col flex-grow">
          <div className="overflow-auto relative flex-grow flex-row">
            <div className="tablelist absolute top-0 left-0 inline-block flex-grow w-full h-full align-middle">
              <div className="relative">
                <table
                  className={cx(
                    "min-w-full divide-y divide-gray-200 table-bg",
                    css`
                      // thead th:first-child {
                      //   overflow: hidden;
                      //   border-top-left-radius: 10px; /* Sudut kiri atas */
                      //   border-bottom-left-radius: 10px;
                      // }
                      // thead th:last-child {
                      //   overflow: hidden;
                      //   border-top-right-radius: 10px; /* Sudut kiri atas */
                      //   border-bottom-right-radius: 10px;
                      // }
                      // tbody td:first-child {
                      //   overflow: hidden;
                      //   border-top-left-radius: 10px; /* Sudut kiri atas */
                      //   border-bottom-left-radius: 10px;
                      // }
                      // tbody td:last-child {
                      //   overflow: hidden;
                      //   border-top-right-radius: 10px; /* Sudut kiri atas */
                      //   border-bottom-right-radius: 10px;
                      // }
                    `,
                    checkbox &&
                      css`
                        .table-header-tbl > th:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                          min-width: 40px;
                          max-width: 40px;
                        }
                        .table-row-element > td:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                          min-width: 40px;
                          max-width: 40px;
                        }
                      `
                  )}
                >
                  {!disabledHeadTable ? (
                    <thead
                      className={cx(
                        "table-head-list  overflow-hidden text-md bg-primary text-white group/head text-md uppercase sticky top-0",
                        css`
                          z-index: 1;
                        `
                      )}
                    >
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                          key={`${headerGroup.id}`}
                          className={"table-header-tbl"}
                        >
                          {headerGroup.headers.map((header, index) => {
                            const name = header.column.id;
                            const col = cols.find((e: any) => e?.name === name);
                            const isSort =
                              name === "select"
                                ? false
                                : typeof col?.sortable === "boolean"
                                ? col.sortable
                                : true;
                            const resize =
                              name === "select"
                                ? false
                                : typeof col?.resize === "boolean"
                                ? col.resize
                                : true;
                            return (
                              <th
                                {...{
                                  style: {
                                    width: !resize
                                      ? `${col?.width}px`
                                      : name === "select"
                                      ? `${5}px`
                                      : col?.width
                                      ? header.getSize() < col?.width
                                        ? `${col.width}px`
                                        : header.getSize()
                                      : header.getSize(),
                                  },
                                }}
                                key={header.id}
                                colSpan={header.colSpan}
                                className={cx(
                                  "relative px-2 py-2 text-sm py-1 uppercase",
                                  name === "select" &&
                                    css`
                                      max-width: 5px;
                                    `
                                )}
                              >
                                <div
                                  key={`${header.id}-label`}
                                  {...{
                                    style: col?.width
                                      ? {
                                          minWidth: `${col.width}px`,
                                        }
                                      : {},
                                  }}
                                  onClick={() => {
                                    if (isSort) {
                                      const sort = local?.sort?.[name];
                                      const mode =
                                        sort === "desc"
                                          ? null
                                          : sort === "asc"
                                          ? "desc"
                                          : "asc";
                                      local.sort = mode
                                        ? {
                                            [name]: mode,
                                          }
                                        : {};
                                      local.render();

                                      local.reload();
                                    }
                                  }}
                                  className={cx(
                                    "flex flex-grow flex-row  flex-grow select-none items-center flex-row text-base text-nowrap",
                                    isSort ? " cursor-pointer" : ""
                                  )}
                                >
                                  <div
                                    className={cx(
                                      "flex flex-row items-center flex-grow text-sm  capitalize",
                                      name === "select" ? "justify-center" : ""
                                    )}
                                  >
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </div>
                                  {isSort ? (
                                    <div className="flex flex-col items-center">
                                      {local?.sort?.[name] ? (
                                        <>
                                          {local?.sort?.[name] === "asc" ? (
                                            <FaSortUp
                                              className={cx(
                                                "text-xs",
                                                local?.sort?.[name] === "asc"
                                                  ? "text-white"
                                                  : "text-primary"
                                              )}
                                            />
                                          ) : (
                                            <FaSortDown
                                              className={cx(
                                                "text-xs",
                                                local?.sort?.[name] === "desc"
                                                  ? "text-white"
                                                  : "text-primary"
                                              )}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <FaSort className=" text-xs text-white" />
                                      )}
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                                {resize &&
                                headerGroup.headers.length !== index + 1 ? (
                                  <div
                                    key={`${header.id}-resizer`} // Tambahkan key unik
                                    {...{
                                      onDoubleClick: () =>
                                        header.column.resetSize(),
                                      onMouseDown: header.getResizeHandler(),
                                      onTouchStart: header.getResizeHandler(),
                                      className: cx(
                                        `resizer hover:bg-second cursor-e-resize	 ${
                                          table.options.columnResizeDirection
                                        } ${
                                          header.column.getIsResizing()
                                            ? "isResizing bg-second"
                                            : "  bg-primary"
                                        }`,
                                        css`
                                          width: 5px;
                                          cursor: e-resize !important;
                                        `
                                      ),
                                      style: {
                                        transform:
                                          columnResizeMode === "onEnd" &&
                                          header.column.getIsResizing()
                                            ? `translateX(${
                                                (table.options
                                                  .columnResizeDirection ===
                                                "rtl"
                                                  ? -1
                                                  : 1) *
                                                (table.getState()
                                                  .columnSizingInfo
                                                  .deltaOffset ?? 0)
                                              }px)`
                                            : "",
                                      },
                                    }}
                                  ></div>
                                ) : null}
                              </th>
                            );
                          })}
                        </tr>
                      ))}
                    </thead>
                  ) : (
                    <></>
                  )}

                  <tbody className="divide-y border-none ">
                    {table.getRowModel().rows.map((row, idx) => {
                      const fm_row =
                        mode === "form" ? local.dataForm?.[idx] : null;
                      return (
                        <tr
                          key={row.id}
                          className={cx(
                            disabledHoverRow ? "" : "hover:bg-gray-100",
                            css`
                              height: 44px;
                              > td {
                                vertical-align: ${align};
                              }
                            `,
                            "border-none ",
                            style === "UI" ? "even:bg-linear-blue " : ""
                          )}
                        >
                          {row.getVisibleCells().map((cell: any) => {
                            const ctx = cell.getContext();
                            const param = {
                              row: row.original,
                              name: get(ctx, "column.columnDef.accessorKey"),
                              cell,
                              idx,
                              tbl: local,
                              fm_row: fm_row,
                              onChange,
                              render: () => {
                                local.render();
                                setData(local.data);
                              },
                            };
                            const head = cols.find(
                              (e: any) =>
                                e?.name ===
                                get(ctx, "column.columnDef.accessorKey")
                            );
                            const renderData =
                              typeof head?.renderCell === "function"
                                ? head.renderCell(param)
                                : flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  );
                            return (
                              <td
                                className={cx(
                                  "text-md px-2  py-1  whitespace-nowrap text-gray-900 items-start",
                                  name === "select"
                                    ? css`
                                        width: 5px;
                                      `
                                    : ``
                                )}
                                key={cell.id}
                              >
                                {renderData}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {!hiddenNoRow && !table.getRowModel().rows?.length && (
              <div
                className={cx(
                  "flex-1 w-full absolute inset-0 flex flex-col items-center justify-center",
                  css`
                    top: 50%;
                    transform: translateY(-50%);
                  `
                )}
              >
                <div className="max-w-[15%] flex flex-col items-center">
                  <Sticker size={35} strokeWidth={1} />
                  <div className="pt-1 text-center">No&nbsp;Data</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Pagination
          list={local}
          count={local.count}
          onNextPage={() => {
            table.nextPage();
            local.paging = local.paging + 1;
            local.render();
            local.reload();
          }}
          onPrevPage={() => {
            table.previousPage();
            local.paging = local.paging - 1;
            local.render();
            local.reload();
          }}
          disabledNextPage={!table.getCanNextPage()}
          disabledPrevPage={!table.getCanPreviousPage()}
          page={local.paging}
          setPage={(page: any) => {
            setPagination({
              pageIndex: page,
              pageSize: take,
            });
            local.paging = page;
            local.render();
            local.reload();
          }}
          countPage={table.getPageCount()}
          countData={local.data.length}
          take={take}
          onChangePage={(page: number) => {
            table.setPageIndex(page);
          }}
        />
      </div>
    </>
  );
};

export const Pagination: React.FC<any> = ({
  onNextPage,
  onPrevPage,
  disabledNextPage,
  disabledPrevPage,
  page,
  count,
  list,
  setPage,
  onChangePage,
}) => {
  const local = useLocal({
    page: 1 as any,
    pagination: [] as any,
  });
  useEffect(() => {
    local.page = page;
    local.pagination = getPagination(page, Math.ceil(count / 20));
    local.render();
  }, [page, count]);
  return (
    <div className=" border-t border-gray-300 p-2 tbl-pagination sticky text-sm bottom-0 right-0 w-full grid grid-cols-3 gap-4 justify-end text-sm ">
      <div className="flex flex-row items-center text-gray-600">
        Showing {local.page * 20 - 19} to{" "}
        {list.data?.length >= 20
          ? local.page * 20
          : local.page === 1 && Math.ceil(count / 20) === 1
          ? list.data?.length
          : local.page * 20 - 19 + list.data?.length}{" "}
        of {formatMoney(getNumber(count))} results
      </div>
      <div className="flex flex-row justify-center">
        <div>
          <nav
            className="isolate inline-flex -space-x-px flex flex-row items-center gap-x-2"
            aria-label="Pagination"
          >
            {local.pagination.map((e: any, idx: number) => {
              return (
                <div
                  key={"page_" + idx}
                  onClick={() => {
                    if (e?.label !== "...") {
                      local.page = getNumber(e?.label);
                      local.render();
                      onChangePage(local.page);
                      setPage(local.page);
                      list.reload();
                    }
                  }}
                  className={cx(
                    "text-sm px-2 py-1",
                    e.active
                      ? "relative z-10 inline-flex items-center bg-primary font-semibold text-white rounded-md"
                      : e?.label === "..."
                      ? "relative z-10 inline-flex items-center  font-semibold text-gray-800 rounded-md"
                      : "cursor-pointer relative z-10 inline-flex items-center hover:bg-gray-100 font-semibold text-gray-800 rounded-md"
                  )}
                >
                  {e?.label}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex flex-row items-center justify-end">
        <div className="flex items-center  flex-row gap-x-2 sm:mb-0 text-sm">
          <div
            onClick={() => {
              if (!disabledPrevPage) {
                onPrevPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded p-1 ",
              disabledPrevPage
                ? "text-gray-200 border-gray-200 border px-2"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border px-2"
            )}
          >
            <HiChevronLeft className="text-sm" />
            {/* <span>Previous</span> */}
          </div>
          <div
            onClick={() => {
              if (!disabledNextPage) {
                onNextPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded p-1 ",
              disabledNextPage
                ? "text-gray-200 border-gray-200 border px-2"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border px-2"
            )}
          >
            {/* <span>Next</span> */}
            <HiChevronRight className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
export const PaginationPage: React.FC<any> = ({
  onNextPage,
  onPrevPage,
  disabledNextPage,
  disabledPrevPage,
  page,
  count,
  list,
  take,
  setPage,
  onChangePage,
}) => {
  const local = useLocal({
    page: 1 as any,
    pagination: [] as any,
  });
  useEffect(() => {
    local.page = page;
    local.pagination = getPagination(page, Math.ceil(count / take));
    local.render();
  }, [page, count]);
  return (
    <div className=" tbl-pagination  text-sm bottom-0 right-0 w-full grid grid-cols-1 gap-4 justify-center text-sm   pt-2">
      <div className="flex flex-row items-center justify-center">
        <div className="flex items-center  flex-row gap-x-2 sm:mb-0 text-sm">
          <div
            onClick={() => {
              if (!disabledPrevPage) {
                onPrevPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2  justify-center rounded-full p-2 text-md",
              disabledPrevPage
                ? "text-gray-200 border-gray-200 border "
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border "
            )}
          >
            <HiChevronLeft />
          </div>
          <div className="flex flex-row justify-center">
            <div>
              <nav
                className="isolate inline-flex -space-x-px flex flex-row items-center gap-x-2"
                aria-label="Pagination"
              >
                {local.pagination.map((e: any, idx: number) => {
                  return (
                    <div
                      key={"page_" + idx}
                      onClick={() => {
                        if (e?.label !== "...") {
                          local.page = getNumber(e?.label);
                          local.render();
                          onChangePage(local.page);
                          setPage(local.page);
                        }
                      }}
                      className={cx(
                        "text-md px-2.5 py-1",
                        e.active
                          ? "relative z-10 inline-flex items-center bg-primary font-semibold text-white rounded-full"
                          : e?.label === "..."
                          ? "relative z-10 inline-flex items-center  font-semibold text-gray-800 rounded-full"
                          : "cursor-pointer relative z-10 inline-flex items-center hover:bg-gray-100 font-semibold text-gray-800 rounded-full"
                      )}
                    >
                      {e?.label}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
          <div
            onClick={() => {
              if (!disabledNextPage) {
                onNextPage();
              }
            }}
            className={cx(
              "flex flex-row items-center gap-x-2   justify-center rounded-full p-2 ",
              disabledNextPage
                ? "text-gray-200 border-gray-200 border"
                : "cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900  border-gray-500 border "
            )}
          >
            <HiChevronRight className="text-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

const getPagination = (currentPage: number, totalPages: number) => {
  const pagination: { label: string; active: boolean }[] = [];
  const maxVisible = 5; // Jumlah maksimal elemen yang ditampilkan
  const halfRange = Math.floor((maxVisible - 3) / 2);

  if (totalPages <= maxVisible) {
    // Jika total halaman lebih kecil dari batas, tampilkan semua halaman
    for (let i = 1; i <= totalPages; i++) {
      pagination.push({ label: i.toString(), active: i === currentPage });
    }
  } else {
    pagination.push({ label: "1", active: currentPage === 1 }); // Halaman pertama selalu ada

    if (currentPage > halfRange + 2) {
      pagination.push({ label: "...", active: false }); // Awal titik-titik
    }

    const startPage = Math.max(2, currentPage - halfRange);
    const endPage = Math.min(totalPages - 1, currentPage + halfRange);

    for (let i = startPage; i <= endPage; i++) {
      pagination.push({ label: i.toString(), active: i === currentPage });
    }

    if (currentPage < totalPages - halfRange - 1) {
      pagination.push({ label: "...", active: false }); // Akhir titik-titik
    }

    pagination.push({
      label: totalPages.toString(),
      active: currentPage === totalPages,
    }); // Halaman terakhir selalu ada
  }

  return pagination;
};

function paginateArray(array: any[], take: number, paging: number) {
  if (!Array.isArray(array) || !array?.length) {
    return [];
  }
  const startIndex = (paging - 1) * take;
  const endIndex = startIndex + take;
  return array.slice(startIndex, endIndex);
}
