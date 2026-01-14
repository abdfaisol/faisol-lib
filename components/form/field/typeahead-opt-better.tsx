import { FC, useCallback } from "react";
import { useLocal } from "@/lib/utils/use-local";
import { Popover } from "../../Popover/Popover";
import { ButtonBetter } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { IoCheckmark, IoSearchOutline } from "react-icons/io5";
import { ListUIClean } from "../../list/ListUIClean";
import { debouncedHandler } from "@/lib/utils/debounceHandler";

export type OptionItem = { value: string; label: string };
export const TypeaheadOptionsBetter: FC<{
  popup?: boolean;
  onLabel?: string | ((item: any) => string);
  onRemove?: (data: any) => void;
  onSelectAll?: (data: boolean) => void;
  init?: any;
  loading?: boolean;
  open?: boolean;
  children: any;
  onOpenChange?: (open: boolean) => void;
  options: OptionItem[];
  className?: string;
  showEmpty: boolean;
  selected?: (arg: {
    item: OptionItem;
    options: OptionItem[];
    idx: number;
  }) => boolean;
  onSelect?: (value: string) => void;
  searching?: boolean;
  searchText?: string;
  width?: number;
  isMulti?: boolean;
  fitur?: "search-add";
  isBetter?: boolean;
  onSearch?: (event: any) => void;
  search?: boolean;
  onLoad?: any[] | ((param: any) => Promise<any[]> | any[]);
  onCount?: any | ((param: any) => Promise<any> | any);
}> = ({
  popup,
  loading,
  children,
  onLabel,
  open,
  onOpenChange,
  className,
  options,
  selected,
  onSelect,
  searching,
  searchText,
  showEmpty,
  width,
  isMulti,
  fitur,
  isBetter,
  init,
  onSearch,
  search,
  onRemove,
  onSelectAll,
  onLoad,
  onCount,
}) => {
  if (!popup) return children;
  const local = useLocal({
    selectedIdx: 0,
    selected: [] as any[],
    search: "",
    list: null as any,
  });

  const handleSearch = useCallback(
    debouncedHandler(() => {
      // local.refresh();
    }, 1000),
    []
  );
  let content = (
    <div
      className={cx(
        className,
        "flex flex-col",
        isBetter
          ? css`
              min-width: 350px;
              height: 450px;
            `
          : width
          ? css`
              min-width: ${width}px;
            `
          : css`
              min-width: 150px;
            `,
        css`
          max-height: 400px;
          overflow: auto;
        `
      )}
    >
      {isBetter ? (
        <>
          <div className="flex flex-row w-full p-1">
            <div className="flex-grow flex flex-row relative">
              <div
                className={cx(
                  "absolute left-0 px-1.5",
                  css`
                    top: 50%;
                    transform: translateY(-50%);
                  `
                )}
              >
                <IoSearchOutline />
              </div>

              <input
                placeholder={"Search"}
                type="text"
                spellCheck={false}
                onChange={(e) => {
                  const value = e.target.value;
                  local.search = value;
                  local.render();
                  handleSearch();
                }}
                className={cx(
                  "pl-6 pr-3 py-1 rounded-md text-black flex h-9 flex-grow border border-gray-200 bg-white  text-base  shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground md:text-sm focus:outline-none focus:ring-0"
                )}
              />
            </div>
          </div>
          {init.search.input === "" || !init.search.input ? (
            <div className="flex flex-row px-3 py-1 gap-x-2 items-center cursor-pointer">
              <Checkbox
                id="terms"
                className="border border-primary"
                checked={init?.selectBetter?.all ? true : false}
                onClick={(e) => {
                  init.selectBetter.all = !init.selectBetter.all;
                  init.render();
                  if (typeof onSelectAll === "function")
                    onSelectAll(init.selectBetter.all);
                }}
              />
              Select All
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      {loading || searching ? (
        <div
          className={cx(
            isBetter && "flex-grow flex flex-row items-center justify-center",
            "px-4 w-full text-slate-400 text-sm py-2"
          )}
        >
          Loading...
        </div>
      ) : (
        <>
          {options.length === 0 ? (
            <div
              className={cx(
                isBetter &&
                  "flex-grow flex flex-row items-center justify-center",
                "p-4 w-full text-center text-md text-slate-400"
              )}
            >
              {fitur === "search-add" ? (
                <ButtonBetter
                  variant={"outline"}
                  className="flex flex-row gap-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit={10}
                      strokeWidth={1.5}
                      d="M6 12h12m-6 6V6"
                    ></path>
                  </svg>{" "}
                  <span>
                    Add{" "}
                    <span
                      className={css`
                        font-style: italic;
                      `}
                    >
                      "{searchText}"
                    </span>
                  </span>
                </ButtonBetter>
              ) : (
                <>
                  {!searchText ? (
                    <>&mdash; Empty &mdash;</>
                  ) : (
                    <>
                      Search
                      <span
                        className={css`
                          font-style: italic;
                          padding: 0px 5px;
                        `}
                      >
                        "{searchText}"
                      </span>
                      not found
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <ListUIClean
              onInit={(e: any) => {
                local.list = e;
                local.render();
              }}
              classContainer={"border-none p-0"}
              name="themes"
              content={({ item }: any) => {
                const label =
                  typeof onLabel === "function"
                    ? onLabel(item)
                    : typeof onLabel === "string"
                    ? item[onLabel]
                    : "";
                return (
                  <>
                    <div className="flex flex-row  gap-x-2 items-center cursor-pointer">
                      <Checkbox
                        id="terms"
                        className="border border-primary"
                        checked={true}
                        onClick={() => {
                          // if (is_selected) {
                          //   if (typeof onRemove === "function") onRemove(item);
                          // } else {
                          //   onSelect?.(item.value);
                          // }
                        }}
                      />
                      {label}
                    </div>
                  </>
                );
              }}
              onLoad={async (param: any) => {
                const result: any =
                  typeof onLoad === "function"
                    ? await onLoad({ ...param, search: local.search })
                    : onLoad;
                return result;
              }}
              onCount={async (params: any) => {
                const result: any =
                  typeof onCount === "function"
                    ? await onCount({
                        take: 1,
                        paging: 1,
                        search: local.search,
                      })
                    : onCount;
                return result;
              }}
            />
          )}
        </>
      )}
      {false ? (
        <div className="w-full flex flex-row items-center justify-end p-1 border-t border-gray-200">
          <ButtonBetter className="rounded-md text-xs flex flex-row items-center gap-x-1">
            <IoCheckmark />
            OK
          </ButtonBetter>
        </div>
      ) : (
        <></>
      )}
    </div>
  );

  if (!showEmpty && options.length === 0) content = <></>;

  return (
    <Popover
      open={open}
      arrow={false}
      onOpenChange={onOpenChange}
      backdrop={false}
      classNameTrigger={!isMulti ? "w-full" : "flex-grow"}
      placement="bottom-start"
      className="flex-1 rounded-md overflow-hidden"
      content={content}
    >
      {children}
    </Popover>
  );
};
