"use client";
import React, { FC, useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useLocal } from "@/lib/utils/use-local";
import { init_column } from "./lib/column";
import { toast } from "sonner";
import { Loader2, Sticker } from "lucide-react";
import { getNumber } from "@/lib/utils/getNumber";
import { formatMoney } from "@/lib/components/form/field/TypeInput";
import get from "lodash.get";
export const TableEditBetter: React.FC<any> = ({
  name,
  column,
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
  mode,
  feature,
  onChange,
  delete_name,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState([] as any[]);
  const sideLeft =
    typeof header?.sideLeft === "function" ? header.sideLeft : null;
  const sideRight =
    typeof header?.sideRight === "function" ? header.sideRight : null;
  const checkbox =
    Array.isArray(feature) && feature?.length
      ? feature.includes("checkbox")
      : false;
  const local = useLocal({
    table: null as any,
    data: [] as any[],
    dataForm: [] as any[],
    listData: [] as any[],
    sort: {} as any,
    search: null as any,
    count: 0 as any,
    addRow: (row: any) => {
      const data = fm.data?.[name] || [];
      data.push(row);
      fm.data[name] = data;
      fm.render();
      local.data = fm.data[name];
      local.render();
    },
    selection: {
      all: false,
      partial: [] as any[],
    },
    renderRow: (row: any) => {
      setData((prev) => [...prev, row]);
      local.data = data;
      local.render();
    },
    removeRow: (row: any) => {
      const data = fm.data?.[name] || [];
      if (delete_name) {
        const ids: any[] = Array.isArray(fm.data?.[delete_name])
          ? fm.data?.deleted_line_ids
          : [];
        if (row?.id) {
          ids.push(row.id);
        }
        fm.data[delete_name] = ids;
      }
      fm.data[name] = data.filter((item: any) => item !== row);
      fm.render();
      local.data = fm.data[name];
      local.render();
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
      try {
        if (Array.isArray(onLoad)) {
          local.data = onLoad;
          local.render();
          setData(onLoad);
        } else {
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
              setData(e);
              setTimeout(() => {
                toast.dismiss();
              }, 100);
            });
          } else {
            local.data = res;
            local.render();
            setData(res);
          }
        }
      } catch (ex: any) {
        console.error(get(ex, "response.data.meta.message") || ex.message);
      }
      setTimeout(() => {
        toast.dismiss();
      }, 100);
    },
  });
  // const cloneListFM = (data: any[]) => {
  //   if (mode === "form") {
  //     local.dataForm = data.map((e: any) => cloneFM(fm, e));
  //     local.render();
  //   }
  // };
  useEffect(() => {
    const defaultColumns: any[] = init_column(column);
    const col = defaultColumns?.length
      ? defaultColumns.map((e: any) => {
          return {
            ...e,
            width: e?.width || 150,
          };
        })
      : ([] as any[]);
    setColumns(col);
    local.data = fm?.data[name] || [];
    local.render();
    fm.fields[name] = {
      name: name,
      type: "table",
      fields: [],
    };
    fm.render();
  }, []);

  const handleResize = (index: any, width: any) => {
    setColumns((prevColumns: any) => {
      const updatedColumns = [...prevColumns];
      updatedColumns[index].width = width;
      return updatedColumns;
    });
  };
  return (
    <>
      <div className="tbl-wrapper flex flex-grow flex-col">
        {!disabledHeader ? (
          <div className="px-2 head-tbl-list block items-start justify-between  bg-white px-0 py-4 sm:flex">
            <div className="flex flex-row h-full">
              <div className="sm:flex flex flex-col space-y-2 flex-grow">
                <div className="flex flex-grow flex-row">
                  {sideLeft ? sideLeft(local) : <></>}
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center flex-row">
              <div className="flex">{sideRight ? sideRight(local) : <></>}</div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col flex-grow">
          <div className="overflow-auto relative flex-grow flex-row">
            <div className="tbl absolute top-0 left-0 inline-block flex-grow w-full h-full align-middle">
              <div className="relative">
                <table
                  className={cx(
                    "min-w-full divide-y divide-gray-200 text-black",
                    css`
                      thead th:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      thead th:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                      tbody td:first-child {
                        overflow: hidden;
                        border-top-left-radius: 10px; /* Sudut kiri atas */
                        border-bottom-left-radius: 10px;
                      }
                      tbody td:last-child {
                        overflow: hidden;
                        border-top-right-radius: 10px; /* Sudut kiri atas */
                        border-bottom-right-radius: 10px;
                      }
                    `,
                    checkbox &&
                      css`
                        .table-header-tbl > th:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                        .table-row-element > td:first-child {
                          width: 20px !important; /* Atur lebar sesuai kebutuhan */
                          text-align: center;
                        }
                      `
                  )}
                >
                  {!disabledHeadTable ? (
                    <thead
                      className={cx(
                        "rounded-md overflow-hidden text-md bg-primary group/head text-md uppercase text-white sticky top-0",
                        css`
                          z-index: 1;
                        `
                      )}
                    >
                      <tr className={"table-header-tbl"}>
                        {columns.map((col, idx) => {
                          return (
                            <HeaderColumn
                              col={col}
                              key={`${col?.accessorKey}_${idx}`}
                              width={col.width}
                              height={0}
                              onResize={(e: any, { size }: any) =>
                                handleResize(idx, size.width)
                              }
                            >
                              <div className="flex items-center h-full flex-grow p-2">
                                <span>
                                  {typeof col?.header === "function"
                                    ? col?.header()
                                    : col.header}
                                </span>
                              </div>
                            </HeaderColumn>
                          );
                        })}
                      </tr>
                    </thead>
                  ) : (
                    <></>
                  )}
                  <tbody>
                    {local.data.map((row: any, index: any) => {
                      if (
                        typeof fm.fields?.[name]?.fields?.[index]?.fields !==
                        "object"
                      ) {
                        fm.fields[name].fields[index] = {
                          fields: {},
                        };
                      }
                      const fm_row = {
                        ...fm,
                        name: name,
                        type: "table",
                        data: row,
                        error: fm.fields?.[name]?.fields?.[index]?.error,
                        fields: fm.fields?.[name]?.fields?.[index]?.fields,
                        render: () => {
                          local.render();
                          fm.data[name] = local.data;
                          fm.render();
                        },
                      };
                      return (
                        <tr
                          key={`row_${name}_${index}`}
                          className={cx(css`
                            td {
                              vertical-align: ${align};
                            }
                          `)}
                        >
                          {columns.map((col, idx) => {
                            const param = {
                              row: row,
                              name: col?.name,
                              idx,
                              tbl: local,
                              fm_row: fm_row,
                              onChange,
                            };
                            const renderData =
                              typeof col?.renderCell === "function" ? (
                                col.renderCell(param)
                              ) : (
                                <>No Column</>
                              );
                            return (
                              <td
                                key={`row_${name}_${index}_${col?.accessorKey}_${idx}`}
                                className={
                                  "table-header-tbl align-top capitalize"
                                }
                              >
                                <div className="p-1">{renderData}</div>
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
            {!local?.data?.length && (
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
      </div>
    </>
  );
};
const HeaderColumn: FC<any> = ({ children, width, height, onResize, col }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = currentWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setCurrentWidth(newWidth);
      onResize(e, { size: { width: newWidth, height } });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <th
      className="table-header-tbl capitalize relative"
      style={{ width: currentWidth }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={cx(
          css`
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: 5px;
            background: transparent;
            cursor: e-resize;
            transition: background 0.2s ease;

            &:hover {
              background: #4a90e2; /* Warna biru saat hover */
            }

            &:active {
              background: #357abd; /* Warna biru lebih gelap saat di-resize */
            }

            ${isResizing &&
            css`
              background: #357abd; /* Warna biru lebih gelap saat resize aktif */
              opacity: 0.8;
            `}
          `
        )}
      ></div>
    </th>
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
    <div className=" border-t border-gray-300 tbl-pagination sticky text-sm bottom-0 right-0 w-full grid grid-cols-3 gap-4 justify-end text-sm  bg-white pt-2">
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
                      onChangePage(local.page - 1);
                      setPage(local.page - 1);
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
            <span>Previous</span>
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
            <span>Next</span>
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
    <div className=" tbl-pagination  text-sm bottom-0 right-0 w-full grid grid-cols-1 gap-4 justify-center text-sm  bg-white pt-2">
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
                          onChangePage(local.page - 1);
                          setPage(local.page - 1);
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
