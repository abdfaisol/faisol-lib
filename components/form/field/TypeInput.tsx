import { useLocal } from "@/lib/utils/use-local";
import Datepicker from "../../ui/Datepicker";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/text-area";
import { useEffect, useRef, useState } from "react";
import tinycolor from "tinycolor2";
import { FieldColorPicker } from "../../ui/FieldColorPopover";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Rating } from "../../ui/ratings";
import { getNumber } from "@/lib/utils/getNumber";
import MaskedInput from "../../ui/MaskedInput";
import { cn } from "@/lib/utils";
import { getLabel } from "@/lib/utils/getLabel";
import { time } from "@/lib/utils/date";
import React from "react";
import debounce from "lodash.debounce";

export const TypeInput: React.FC<any> = ({
  name,
  fm,
  placeholder,
  disabled = false,
  required,
  type,
  field,
  onChange,
  className,
  placeholderDate,
  isDebounce = false,
}) => {
  const [inputValue, setInputValue] = useState(null as any);

  const [hover, setHover] = useState(0); // State untuk menyimpan nilai hover
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  let value: any = fm.data?.[name] || "";

  const [rating, setRating] = useState(value); // State untuk menyimpan nilai rating
  const handleClick = (index: number) => {
    setRating(index); // Update nilai rating
    fm.data[name] = rating + 1;
    fm.render();
  };
  const input = useLocal({
    value: 0 as any,
    ref: null as any,
    show_pass: false as boolean,
    open: false,
  });
  const meta = useLocal({
    originalValue: "",
    inputValue: value,
    rgbValue: "",
    selectedEd: "" as string,
  });
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate new height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height based on content
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.stopPropagation();
      event.preventDefault();
    }
  };
  useEffect(() => {
    if (type === "color") {
      meta.inputValue = value || "";
      const convertColor = tinycolor(meta.inputValue);
      meta.rgbValue = convertColor.toRgbString();
      meta.render();
    } else {
      setRating(value ? value - 1 : value);
    }
  }, [value]);
  useEffect(() => {
    if (type === "money") {
      input.value =
        typeof fm.data?.[name] === "number" && fm.data?.[name] === 0
          ? "0"
          : formatCurrency(value);
      input.render();
    }
  }, [fm.data?.[name]]);
  const error = fm.error?.[name];
  switch (type) {
    case "textarea":
      return (
        <>
          <Textarea
            ref={textareaRef}
            id={name}
            onInput={handleInput}
            name={name}
            disabled={disabled}
            required={required}
            className={cx(
              "text-sm border-none",
              css`
                background-color: ${disabled
                    ? "rgb(243 244 246)"
                    : "transparant"}
                  ? "";
              `
            )}
            placeholder={placeholder || ""}
            value={value}
            onChange={(ev) => {
              fm.data[name] = ev.currentTarget.value;
              fm.render();

              if (typeof onChange === "function") {
                onChange(ev.currentTarget.value);
              }
            }}
          />
        </>
      );
      break;

    case "time":
      return (
        <>
          <MaskedInput
            value={time(value) || ""}
            disabled={disabled}
            className={cx(
              css`
                background-color: ${disabled
                  ? "rgb(243 244 246)"
                  : "transparant"};
              `,
              className
            )}
            onChange={(value) => {
              if (disabled) return;
              fm.data[name] = value;
              fm.render();
              if (typeof onChange === "function") {
                onChange(value);
              }
            }}
          />
        </>
      );
      break;

    case "rating":
      return (
        <div className="flex">
          <Rating
            rating={getNumber(fm.data?.[name])}
            totalStars={5}
            size={24}
            variant="yellow"
            disabled={disabled}
            className="h-1"
            showText={false}
            onRatingChange={(e) => {
              fm.data[name] = getNumber(e);
              fm.render();
              if (typeof onChange === "function") {
                onChange(getNumber(e));
              }
            }}
          />
        </div>
      );
      break;
    case "color":
      return (
        <div className="flex flex-row items-center">
          <div className="border border-gray-300 p-0.5 rounded-sm">
            <FieldColorPicker
              value={fm.data?.[name]}
              update={(val) => {
                fm.data[name] = val;
                fm.render();
                if (typeof onChange === "function") {
                  onChange(val);
                }
              }}
              onOpen={() => {
                input.open = true;
                input.render();
              }}
              onClose={() => {
                input.open = false;
                input.render();
              }}
              open={input.open}
              showHistory={false}
            >
              <div
                className={cx(
                  css`
                    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>');
                  `,
                  "cursor-pointer  rounded-md"
                )}
              >
                <div
                  className={cx(
                    "rounded-sm h-8 w-8",
                    css`
                      background: ${fm?.data?.[name]};
                    `,
                    "color-box"
                  )}
                ></div>
              </div>
            </FieldColorPicker>
          </div>
        </div>
      );
      break;

    case "date":
      return (
        <>
          <Datepicker
            value={{ startDate: value, endDate: value }}
            disabled={disabled}
            displayFormat="DD MMM YYYY"
            placeholder={placeholder || "DD MMM YYYY"}
            mode={"daily"}
            maxDate={field?.max_date instanceof Date ? field.max_date : null}
            minDate={field?.min_date instanceof Date ? field.min_date : null}
            asSingle={true}
            useRange={false}
            onChange={(value) => {
              fm.data[name] = value?.startDate
                ? new Date(value?.startDate)
                : null;
              fm.render();
              if (typeof onChange === "function") {
                onChange(value?.startDate ? new Date(value?.startDate) : null);
              }
            }}
          />
        </>
      );
      break;
    case "money":
      return (
        <>
          <Input
            id={name}
            name={name}
            disabled={disabled}
            className={cn(
              "text-sm text-right	",
              error
                ? css`
                    border-color: red !important;
                  `
                : ``,
              css`
                background-color: ${disabled
                    ? "rgb(243 244 246)"
                    : "transparant"}
                  ? "";
              `,
              className
            )}
            required={required}
            placeholder={placeholder || ""}
            value={formatCurrency(input.value)}
            type={"text"}
            onKeyDown={handleKeyDown}
            onChange={(ev) => {
              const rawValue = ev.currentTarget.value
                .replace(/[^0-9,-]/g, "")
                .toString();
              if (rawValue === "0") {
                input.value = "0";
                input.render();
              }
              if (
                (!rawValue.startsWith(",") || !rawValue.endsWith(",")) &&
                !rawValue.endsWith("-") &&
                convertionCurrencyNumber(rawValue) !==
                  convertionCurrencyNumber(input.value)
              ) {
                fm.data[name] = convertionCurrencyNumber(
                  formatCurrency(rawValue)
                );
                fm.render();
                if (typeof onChange === "function") {
                  onChange(convertionCurrencyNumber(formatCurrency(rawValue)));
                }
                input.value = formatCurrency(fm.data[name]);
                input.render();
              } else {
                input.value = rawValue;
                input.render();
              }
            }}
          />
        </>
      );
      break;
  }
  let type_field = type;
  if (input.show_pass) {
    type_field = "text";
  }
  if (type === "status") {
    if (disabled) {
      return (
        <>
          <Input
            id={name}
            onKeyDown={handleKeyDown}
            name={name}
            className={cx(
              "text-sm",
              error
                ? css`
                    border-color: red !important;
                  `
                : ``,
              css`
                background-color: ${disabled
                    ? "rgb(243 244 246)"
                    : "transparant"}
                  ? "";
              `,
              className
            )}
            disabled={disabled}
            required={required}
            placeholder={placeholder || ""}
            value={getLabel(value)}
            type={!type ? "text" : type_field}
            onChange={(ev) => {
              fm.data[name] = ev.currentTarget.value;
              fm.render();
              if (typeof onChange === "function") {
                onChange(ev.currentTarget.value);
              }
            }}
          />

          {type === "password" && (
            <div
              className=" right-0 h-full flex items-center cursor-pointer px-2"
              onClick={() => {
                input.show_pass = !input.show_pass;
                input.render();
              }}
            >
              <div className="">
                {input.show_pass ? (
                  <FaRegEyeSlash className="h-4" />
                ) : (
                  <FaRegEye className="h-4" />
                )}
              </div>
            </div>
          )}
        </>
      );
    } else {
      type = "text";
    }
  }

  const latestValueRef = React.useRef<string | null>(null);

  const debouncedOnChange = React.useMemo(
    () =>
      debounce(() => {
        if (typeof onChange === "function" && latestValueRef.current !== null) {
          onChange(latestValueRef.current);
        }
      }, 1000),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    latestValueRef.current = event.currentTarget.value; // Simpan nilai terbaru
    debouncedOnChange(); // Panggil fungsi debounce
  };

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel(); // Bersihkan debounce saat komponen unmount
    };
  }, [debouncedOnChange]);
  return (
    <>
      <Input
        id={name}
        onKeyDown={handleKeyDown}
        name={name}
        className={cx(
          "text-sm",
          error
            ? css`
                border-color: red !important;
              `
            : ``,
          css`
            background-color: ${disabled ? "rgb(243 244 246)" : "transparant"} ?
              "";
          `,
          className
        )}
        disabled={disabled}
        required={required}
        placeholder={placeholder || ""}
        value={value}
        type={!type ? "text" : type_field}
        onChange={(ev) => {
          setInputValue(ev.currentTarget.value);
          fm.data[name] = ev.currentTarget.value;
          fm.render();
          if (!isDebounce) {
            if (typeof onChange === "function") {
              onChange(ev.currentTarget.value);
            }
          } else {
            handleInputChange(ev);
          }
        }}
      />

      {type === "password" && (
        <div
          className=" right-0 h-full flex items-center cursor-pointer px-2"
          onClick={() => {
            input.show_pass = !input.show_pass;
            input.render();
          }}
        >
          <div className="">
            {input.show_pass ? (
              <FaRegEyeSlash className="h-4" />
            ) : (
              <FaRegEye className="h-4" />
            )}
          </div>
        </div>
      )}
    </>
  );
};
const convertionCurrencyNumber = (value: string) => {
  if (!value) return null;
  let numberString = value.toString().replace(/[^0-9,-]/g, "");
  if (numberString.endsWith(",")) {
    return Number(numberString.replace(",", "")) || 0;
  }
  if (numberString.endsWith("-")) {
    return Number(numberString.replace("-", "")) || 0;
  }
  const rawValue = numberString.replace(/[^0-9,-]/g, "").replace(",", ".");
  return parseFloat(rawValue) || 0;
};
const formatCurrency = (value: any) => {
  // Menghapus semua karakter kecuali angka, koma, dan tanda minusif (value === null || value === undefined) return '';
  if (typeof value === "number" && value === 0) return "0";
  if (typeof value === "string" && value === "0") return "0";
  if (!value) return "";
  let numberString = "";
  if (typeof value === "number") {
    numberString = formatMoney(value);
  } else {
    numberString = value.toString().replace(/[^0-9,-]/g, "");
  }
  if (numberString.endsWith("-") && numberString.startsWith("-")) {
    return "-";
  } else if (numberString.endsWith(",")) {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  } else {
    const isNegative = numberString.startsWith("-");
    numberString = numberString.replace("-", "");
    const split = numberString.split(",");
    if (isNumberOrCurrency(split[0]) === "Number") {
      split[0] = formatMoney(Number(split[0]));
    }
    let rupiah = split[0];
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return (isNegative ? "-" : "") + rupiah;
  }
};
export const formatMoney = (res: any) => {
  if (typeof res === "string" && res.startsWith("BigInt::")) {
    res = res.substring(`BigInt::`.length);
  }

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  }).format(res);
  return formattedAmount;
};
const isNumberOrCurrency = (input: any) => {
  // Pengecekan apakah input adalah angka biasa

  if (typeof input === "string") {
    let rs = input;
    if (input.startsWith("-")) {
      rs = rs.replace("-", "");
    }
    const dots = rs.match(/\./g);
    if (dots && dots.length > 1) {
      return "Currency";
    } else if (dots && dots.length === 1) {
      if (!hasNonZeroDigitAfterDecimal(rs)) {
        return "Currency";
      }
      return "Currency";
    }
  }
  if (!isNaN(input)) {
    return "Number";
  }
  // Pengecekan apakah input adalah format mata uang dengan pemisah ribuan
  const currencyRegex = /^-?Rp?\s?\d{1,3}(\.\d{3})*$/;
  if (currencyRegex.test(input)) {
    return "Currency";
  }

  // Jika tidak terdeteksi sebagai angka atau format mata uang, kembalikan null atau sesuai kebutuhan
  return null;
};
const hasNonZeroDigitAfterDecimal = (input: string) => {
  // Ekspresi reguler untuk mencocokkan angka 1-9 setelah koma atau titik
  const regex = /[.,]\d*[1-9]\d*/;
  return regex.test(input);
};
export const convertToTimeOnly = (isoString: any) => {
  if (!isoString || isoString === "") return null;
  const isoRegex = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}):\d{2}Z$/;

  const match = isoString.match(isoRegex);
  if (match) {
    return match[1];
  }
  return isoString;
};
