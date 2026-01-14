import { AsyncPaginate } from "react-select-async-paginate";
import { components } from "react-select";
import { useLocal } from "@/lib/utils/use-local";
import { empty } from "@/lib/utils/isStringEmpty";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import get from "lodash.get";
import { Popover } from "../../Popover/Popover";

export const TypeAsyncDropdown: React.FC<any> = ({
  name,
  fm,
  onChange,
  label,
  disabled,
  onValue,
  onLabel,
  onLoad,
  fields,
  target,
  mode = "dropdown",
  placeholder,
  pagination = true,
  search = "api",
  required = false,
  autoRefresh = true,
}) => {
  const [cacheUniq, setCacheUniq] = useState(0);
  const [open, setOpen] = useState(false as boolean);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const selectRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const getValue =
    typeof onValue === "string"
      ? (e: any) => {
          if (typeof e !== "object" && !Array.isArray(e)) {
            return e;
          }
          return get(e, onValue);
        }
      : onValue;
  const getLabel =
    typeof onLabel === "string"
      ? (e: any) => {
          if (typeof e !== "object" && !Array.isArray(e)) {
            return e;
          }
          return get(e, onLabel);
        }
      : onLabel;
  let placeholderField =
    mode === "multi"
      ? placeholder || `Add ${label}`
      : placeholder || `Select ${label}`;
  const field = useLocal({
    data: [] as any[],
    reload: async () => {
      setRefreshKey(Date.now());
    },
  });
  const debouncedLoadOptions = useMemo(
    () =>
      debounce(async (searchQuery: string, page: number, resolve: any) => {
        let paging = page;
        if (pagination === false && paging > 1) {
          resolve({
            options: [],
            hasMore: false,
            additional: {
              page: searchQuery ? 2 : page + 1,
            },
          });
        } else {
          let result: any = await onLoad(
            search === "local"
              ? {
                  paging: page,
                  take: 10,
                }
              : {
                  paging: page,
                  take: 10,
                  search: searchQuery,
                }
          );
          if (Array.isArray(result) && result.length) {
            result = result.map((e) => {
              return {
                ...e,
                label: getLabel(e),
                value: getValue(e),
              };
            });
          }
          const respon = result;
          if (
            pagination === false &&
            Array.isArray(respon) &&
            !empty(searchQuery) &&
            search === "local"
          ) {
            let filter = respon?.length
              ? respon.filter((e: any) => {
                  const label = getLabel(e) || "";
                  return label
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
                })
              : [];
            resolve({
              options: filter,
              hasMore: filter.length >= 1,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          } else {
            resolve({
              options: respon,
              hasMore: respon.length >= 1,
              additional: {
                page: searchQuery ? 2 : page + 1,
              },
            });
          }
        }
      }, 200),
    [onLoad, pagination, search, getLabel, getValue]
  );
  const loadOptions: any = async (
    searchQuery: any,
    loadedOptions: any,
    { page }: any
  ) => {
    return new Promise((resolve) => {
      debouncedLoadOptions(searchQuery, page, resolve);
    });
  };
  useEffect(() => {
    if (!fm?.fields?.[name]) {
      fm.fields[name] = { ...fields, ...field };
      fm.render();
    }
  }, []);
  const MultiValue = (props: any) => {
    return (
      <components.MultiValue
        {...props}
        className={cx(
          "selected-multi-value rounded-lg  bg-gray-200 ",
          css`
            border-radius: 6px !important;
          `
        )}
      >
        {props.children}
      </components.MultiValue>
    );
  };
  const Option = (props: any) => {
    const { data, isSelected, isFocused } = props;
    return (
      <components.Option
        {...props}
        className={cx(
          css`
            cursor: pointer !important;
            padding: 0px !important;
            background: transparent !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !imporatnt;
          `
        )}
      >
        <div
          className={cx(
            `pointer-events-auto opt-item px-3 py-1 cursor-pointer option-item text-sm  ${
              isSelected
                ? "selected bg-primary text-white"
                : " hover:bg-blue-50"
            } ${isFocused ? "focused" : ""}`,
            "border-t"
          )}
        >
          {getLabel(data)}
        </div>
      </components.Option>
    );
  };
  const clearable =
    mode === "dropdown" && required ? false : mode === "multi" ? true : true;
  let value = fm.data[name];
  if (value) {
    if (mode === "multi") {
      if (Array.isArray(value) && value?.length) {
        value = value.map((e) => {
          return {
            ...e,
            value: getValue(e),
            label: getLabel(e),
          };
        });
      } else {
        value = [];
      }
    } else if (typeof value === "object") {
      value = value
        ? {
            value: getValue(value),
            label: getLabel(value),
          }
        : null;
    } else if (
      !target &&
      typeof value !== "object" &&
      typeof value === "string" &&
      value
    ) {
      value = value
        ? onValue === onLabel
          ? {
              value: value,
              label: value,
            }
          : {
              value: value,
              label: getLabel(value),
            }
        : null;
    } else if (typeof value === "string") {
      value =
        onValue === onLabel
          ? {
              value: value,
              label: value,
            }
          : {
              value: value,
              label: typeof onLabel === "string" ? value : getLabel(value),
            };
    } else if (Array.isArray(value) && value?.length) {
      value = value.map((e) => {
        return {
          ...e,
          value: getValue(e),
          label: getLabel(e),
        };
      });
    } else if (typeof value === "object" && value) {
      value = value
        ? {
            ...value,
            value: getValue(value),
            label: getLabel(value),
          }
        : value;
    }
  }
  const CustomMenu = (props: any) => {
    return (
      <Popover
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        classNameTrigger={""}
        arrow={false}
        className="rounded-md"
        onOpenChange={(open: any) => {
          setOpen(open);
        }}
        open={true}
        content={
          <div
            className={cx(
              "flex flex-col flex-grow",
              css`
                width: ${width}px;
              `
            )}
          >
            {props.children}
          </div>
        }
      >
        <></>
      </Popover>
    );
  };
  useEffect(() => {
    if (selectRef.current) {
      setWidth(selectRef.current.offsetWidth);
    }
  }, [selectRef]);
  const customFilterOption = (option: any, rawInput: any) => {
    // option.data berisi data opsi, misalnya label dan value
    // rawInput adalah string yang diketik pengguna
    return true;
  };
  const increaseUniq = (uniq: number) => uniq + 1;
  return (
    <div ref={selectRef} className="w-full">
      <AsyncPaginate
        menuIsOpen={open}
        key={refreshKey}
        placeholder={disabled ? "" : placeholderField}
        isDisabled={disabled}
        className={cx(
          "rounded-md border-none text-sm w-full",
          css`
            [role="listbox"] {
              padding: 0px !important;
              z-index: 5;
            }
            input:focus {
              outline: 0px !important;
              border: 0px !important;
              outline-offset: 0px !important;
              --tw-ring-color: transparent !important;
            }
            .css-13cymwt-control {
              border-color: transparent;
              border-width: 0px;
              border-radius: 6px;
            }
            .css-t3ipsp-control {
              border-color: transparent;
              border-width: 0px;
              box-shadow: none;
              border-radius: 6px;
            }
            > :nth-child(4) {
              z-index: 4 !important;
            }
          `,
          disabled
            ? css`
                > div {
                  border-width: 0px !important;
                  background: transparent !important;
                }
                > div > div:last-child {
                  display: none !important;
                }
                > div > div:first-child > div {
                  color: black !important;
                }
              `
            : ``
        )}
        isClearable={clearable}
        onMenuOpen={() => {
          if (autoRefresh) setCacheUniq(increaseUniq);
          setOpen(true);
        }}
        onMenuClose={() => {
          setOpen(false);
        }}
        closeMenuOnSelect={mode === "dropdown" ? true : false}
        // closeMenuOnSelect={false}
        cacheUniqs={[cacheUniq]}
        getOptionValue={(item) => item.value}
        getOptionLabel={(item) => item.label}
        value={value}
        components={{ MultiValue, Option, Menu: CustomMenu }}
        loadOptions={loadOptions}
        isSearchable={true}
        // filterOption={customFilterOption}
        isMulti={mode === "multi"}
        onChange={(e) => {
          setOpen(mode === "dropdown" ? false : true);
          if (target) {
            fm.data[target] = getValue(e);
          }
          if (mode === "dropdown" && !target) {
            fm.data[name] = getValue(e);
          } else {
            fm.data[name] = e;
          }
          fm.render();
          if (typeof onChange === "function") {
            onChange({ ...e, data: e });
          }
        }}
        additional={{
          page: 1,
        }}
      />
    </div>
  );
};
