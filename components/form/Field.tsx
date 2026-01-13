import { useEffect, useRef } from "react";
import { FieldCheckbox } from "./field/TypeCheckbox";
import { FieldCheckboxYN } from "./field/TypeCheckboxYN";
import { TypeDropdown } from "./field/TypeDropdown";
import { TypeInput } from "./field/TypeInput";
import { TypeUpload } from "./field/TypeUpload";
import { TypeRichText } from "./field/TypeRichText";
import { TypeTag } from "./field/TypeTag";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";
import { useLocal } from "@/lib/utils/use-local";
import { FieldRadio } from "./field/TypeRadio";
import { cn } from "@/lib/utils";
import { TooltipBetter } from "../ui/tooltip-better";
import { TypeDropdownBetter } from "./field/TypeDropdownBetter";
import { TypeAsyncDropdown } from "./field/TypeAsyncDropdown";
export interface FieldProps {
  fm: any;
  label?: string;
  name: string;
  isBetter?: boolean;
  tooltip?: string;
  valueKey?: string;
  target?: string;
  onLoad?: (params?: any) => Promise<any> | any;
  onCount?: (param?: any) => Promise<any> | any;
  onDelete?: (item: any) => Promise<any> | any;
  labelSingleCheckbox?: string;
  type?:
    | "rating"
    | "color"
    | "single-checkbox"
    | "checkbox-yn"
    | "radio"
    | "checkbox"
    | "upload"
    | "multi-upload"
    | "dropdown"
    | "multi-dropdown"
    | "checkbox"
    | "radio"
    | "single-checkbox"
    | "richtext"
    | "tag"
    | "text"
    | "money"
    | "textarea"
    | "time"
    | "date"
    | "password"
    | "email"
    | "multi-dropdown-better"
    | "multi-async"
    | "dropdown-async"
    | "status";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hidden_label?: boolean;
  onChange?: ({ data }: any) => Promise<void> | void;
  className?: string;
  classField?: string;
  style?: string;
  prefix?: string | any | (() => any);
  suffix?: string | any | (() => any);
  allowNew?: boolean;
  unique?: boolean;
  onLabel?: string | ((item: any) => any);
  onValue?: string | ((item: any) => any);
  pagination?: boolean;
  search?: "api" | "local";
  visibleLabel?: boolean;
  autoRefresh?: boolean;
  isDirectUpload?: boolean;
  forceDisabled?: boolean;
  description?: string | (() => any);
  styleField?: string | null;
  isDebounce?: boolean;
  data?: any;
  mode?: string;
  valueChecked?: string[];
}
export const Field: React.FC<FieldProps> = ({
  fm,
  visibleLabel = false,
  label,
  isBetter = false,
  name,
  onLoad,
  type = "text",
  placeholder,
  required,
  disabled,
  hidden_label,
  onChange,
  className,
  classField,
  style,
  prefix,
  suffix,
  allowNew,
  unique = true,
  tooltip,
  valueKey,
  onDelete,
  onCount,
  onLabel,
  onValue = "id",
  target,
  pagination = true,
  search = "api",
  autoRefresh = false,
  forceDisabled,
  description,
  styleField,
  isDebounce = false,
  valueChecked,
  mode,
  labelSingleCheckbox,
  isDirectUpload,
}) => {
  let result = null;
  const field = useLocal({
    focus: false,
  });
  const suffixRef = useRef<HTMLDivElement | null>(null);
  const prefixRef = useRef<HTMLDivElement | null>(null);
  const initField = {
    label,
    isBetter,
    name,
    onLoad,
    type,
    placeholder,
    required,
    disabled,
    hidden_label,
    onChange,
    className,
    classField,
    style,
    prefix,
    suffix,
    allowNew,
    unique,
    tooltip,
    valueKey,
    onDelete,
    onCount,
    onLabel,
    onValue,
    target,
    pagination,
    search,
  };
  const is_disable =
    typeof forceDisabled === "boolean"
      ? forceDisabled
      : fm.mode === "view"
      ? true
      : disabled;
  const error = fm.error?.[name];
  useEffect(() => {
    setTimeout(() => {
      if (typeof fm.fields?.[name] !== "object") {
        const fields = fm.fields?.[name];
        fm.fields[name] = {
          ...fields,
          label,
          name,
          onLoad,
          type,
          placeholder,
          required,
          disabled,
          hidden_label,
          onChange,
          className,
          style,
        };
        fm.render();
      }
    }, 1000);
  }, []);
  const before = typeof prefix === "function" ? prefix() : prefix;
  const after = typeof suffix === "function" ? suffix() : suffix;
  return (
    <>
      <div
        className={cx(
          "flex",
          style === "inline" ? "flex-row gap-x-1" : "flex-col",
          css`
            .field input:focus {
              outline: 0px !important;
              border: 0px !important;
              outline-offset: 0px !important;
              --tw-ring-color: transparent !important;
            }
            .field textarea:focus {
              outline: 0px !important;
              border: 0px !important;
              outline-offset: 0px !important;
              --tw-ring-color: transparent !important;
            }
            .field input {
              border: 0px !important;
              box-shadow: none;
            }
          `,
          style === "gform" &&
            css`
              .field input {
                padding-left: 0px !important;
                padding-right: 0px !important;
              }
              .field textarea {
                padding-left: 0px !important;
                padding-right: 0px !important;
              }
            `
        )}
      >
        {!hidden_label ? (
          <label
            className={cx(
              "block mb-2 text-md font-medium   text-sm flex flex-row",
              style === "inline" ? "w-[100px]" : "",
              visibleLabel ? "text-transparent" : "text-gray-900"
            )}
          >
            {label}
            {required ? (
              <span className="flex flex-row px-0.5 text-red-500">*</span>
            ) : (
              <></>
            )}
          </label>
        ) : (
          <></>
        )}
        <TooltipBetter content={tooltip} side="bottom">
          <div
            className={cn(
              is_disable
                ? "border border-gray-100 bg-gray-100 is_disable"
                : "border border-gray-300 ",
              "relative field",
              !is_disable
                ? style === "underline" || style === "gform"
                  ? "focus-within:border-b focus-within:border-b-primary"
                  : "focus-within:border focus-within:border-primary"
                : "",
              style === "underline" || style === "gform"
                ? "rounded-none border-transparent border-b-gray-300 "
                : "",
              [
                "rating",
                "color",
                "single-checkbox",
                "checkbox-yn",
                "radio",
                "checkbox",
                "multi-upload",
              ].includes(type) &&
                css`
                  border: 0px !important;
                `,
              ["upload"].includes(type) &&
                css`
                  padding: 0px !important;
                `,
              is_disable &&
                ["multi-upload"].includes(type) &&
                css`
                  background: transparent !important;
                `,
              classField,
              error
                ? "flex flex-row rounded-md flex-grow border-red-500 border items-center"
                : style === "underline"
                ? "flex flex-row rounded-none flex-grow  items-center"
                : "flex flex-row rounded-md flex-grow  items-center"
            )}
          >
            {before && (
              <div
                // ref={prefixRef}
                className={cx(
                  "px-1 py-1  items-center flex flex-row flex-grow rounded-l-md h-full prefix",
                  css`
                    height: 2.13rem;
                  `
                  // style === "gform"
                  //   ? ""
                  //   : is_disable
                  //   ? "bg-gray-200/50 "
                  //   : "bg-gray-200/50 "
                )}
              >
                {before}
              </div>
            )}
            {/* "multi-dropdown-better" */}
            {["upload"].includes(type) ? (
              <>
                <TypeUpload
                  fm={fm}
                  isDirectUpload={isDirectUpload}
                  name={name}
                  on_change={onChange}
                  mode={"upload"}
                  disabled={is_disable}
                />
              </>
            ) : ["multi-upload"].includes(type) ? (
              <>
                <TypeUpload
                  fm={fm}
                  name={name}
                  on_change={onChange}
                  mode={"upload"}
                  type="multi"
                  disabled={is_disable}
                  valueKey={valueKey}
                  onDelete={onDelete}
                />
              </>
            ) : ["dropdown"].includes(type) ? (
              <>
                <TypeDropdown
                  fm={fm}
                  fields={initField}
                  required={required}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  onChange={onChange}
                  allowNew={allowNew}
                />
              </>
            ) : ["multi-dropdown"].includes(type) ? (
              <>
                <TypeDropdown
                  fm={fm}
                  fields={initField}
                  required={required}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  onChange={onChange}
                  mode="multi"
                  unique={unique}
                  isBetter={isBetter}
                />
              </>
            ) : ["multi-async"].includes(type) ? (
              <>
                <div className="w-full">
                  <TypeAsyncDropdown
                    fm={fm}
                    fields={initField}
                    label={label}
                    target={target}
                    required={required}
                    name={name}
                    onLoad={onLoad}
                    onLabel={onLabel}
                    onValue={onValue}
                    placeholder={placeholder}
                    disabled={is_disable}
                    onChange={onChange}
                    mode="multi"
                    pagination={pagination}
                    unique={unique}
                    isBetter={isBetter}
                  />
                </div>
              </>
            ) : ["dropdown-async"].includes(type) ? (
              <>
                <div className="w-full">
                  <TypeAsyncDropdown
                    label={label}
                    fm={fm}
                    autoRefresh={autoRefresh}
                    fields={initField}
                    required={required}
                    name={name}
                    target={target}
                    onLoad={onLoad}
                    onLabel={onLabel}
                    onValue={onValue}
                    placeholder={placeholder}
                    disabled={is_disable}
                    onChange={onChange}
                    pagination={pagination}
                    unique={unique}
                    isBetter={isBetter}
                    search={search}
                  />
                </div>
              </>
            ) : ["multi-dropdown-better"].includes(type) ? (
              <>
                <TypeDropdownBetter
                  fm={fm}
                  fields={initField}
                  required={required}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  onChange={onChange}
                  mode="multi"
                  unique={unique}
                  isBetter={isBetter}
                  onCount={onCount}
                  onLabel={onLabel}
                />
              </>
            ) : ["checkbox"].includes(type) ? (
              <>
                <FieldCheckbox
                  fm={fm}
                  fields={initField}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  onChange={onChange}
                  className={className}
                />
              </>
            ) : ["radio"].includes(type) ? (
              <>
                <FieldRadio
                  fields={initField}
                  fm={fm}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  onChange={onChange}
                  className={className}
                />
              </>
            ) : ["single-checkbox"].includes(type) ? (
              <>
                <FieldCheckbox
                  fm={fm}
                  fields={initField}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  className={className}
                  onChange={onChange}
                  mode="single"
                />
              </>
            ) : ["checkbox-yn"].includes(type) ? (
              <>
                <FieldCheckboxYN
                  fm={fm}
                  fields={initField}
                  name={name}
                  onLoad={onLoad}
                  placeholder={placeholder}
                  disabled={is_disable}
                  className={className}
                  onChange={onChange}
                  labelSingleCheckbox={labelSingleCheckbox || "Active"}
                />
              </>
            ) : ["richtext"].includes(type) ? (
              <>
                <TypeRichText
                  fm={fm}
                  fields={initField}
                  name={name}
                  disabled={is_disable}
                  className={className}
                  onChange={onChange}
                />
              </>
            ) : ["tag"].includes(type) ? (
              <>
                <TypeTag
                  styleField={styleField}
                  fm={fm}
                  fields={initField}
                  name={name}
                  valueChecked={valueChecked}
                  disabled={is_disable}
                  className={className}
                  onChange={onChange}
                  mode={mode}
                />
              </>
            ) : (
              <>
                <TypeInput
                  fm={fm}
                  fields={initField}
                  name={name}
                  isDebounce={isDebounce}
                  placeholder={placeholder}
                  required={required}
                  type={type}
                  disabled={is_disable}
                  onChange={onChange}
                  onFocus={() => {
                    field.focus = true;
                    field.render();
                  }}
                  className={cx(
                    before &&
                      css`
                        padding-left: ${getNumber(
                          get(prefixRef, "current.clientWidth")
                        ) + 10}px;
                      `,
                    after &&
                      css`
                        padding-right: ${getNumber(
                          get(suffixRef, "current.clientWidth")
                        ) + 10}px;
                      `,
                    className
                  )}
                />
              </>
            )}
            {after && (
              <div
                // ref={suffixRef}
                className={cx(
                  "px-1 py-1  items-center flex flex-row flex-grow rounded-r-md h-full suffix",
                  css`
                    height: 2.13rem;
                  `,
                  is_disable ? "bg-gray-200/50 " : "bg-gray-200/50 "
                )}
              >
                {after}
              </div>
            )}
          </div>
        </TooltipBetter>
        {description ? (
          <div className="text-xs text-gray-500 py-1">
            {typeof description === "function" ? description() : description}
          </div>
        ) : (
          <></>
        )}
        {error ? (
          <div className="text-sm text-red-500 py-1">{error}</div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
