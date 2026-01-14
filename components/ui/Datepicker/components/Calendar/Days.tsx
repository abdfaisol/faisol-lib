import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { BG_COLOR, TEXT_COLOR } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import {
  formatDate,
  nextMonth,
  previousMonth,
  classNames as cn,
} from "../../helpers";
import { Period } from "../../types";
import get from "lodash.get";
import { getNumber } from "@/lib/utils/getNumber";

dayjs.extend(isBetween);

interface Props {
  calendarData: {
    date: dayjs.Dayjs;
    days: {
      previous: number[];
      current: number[];
      next: number[];
    };
  };
  onClickPreviousDays: (day: number) => void;
  onClickDay: (day: number) => void;
  onClickNextDays: (day: number) => void;
  onIcon?: (day: number, date: Date, data?: any) => any;
  style?: string;
}
const Days: React.FC<Props> = ({
  calendarData,
  onClickPreviousDays,
  onClickDay,
  onClickNextDays,
  onIcon,
  style,
}) => {
  // Ref
  const calendarRef = useRef(null);
  const markRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [heightItem, setHeightItem] = useState(0);
  const [maxItem, setMaxItem] = useState(0);
  const [width, setWidth] = useState(0);
  // Contexts
  const {
    primaryColor,
    period,
    changePeriod,
    dayHover,
    changeDayHover,
    minDate,
    maxDate,
    disabledDates,
  } = useContext(DatepickerContext);

  // Functions
  const currentDateClass = useCallback(
    (item: number) => {
      const itemDate = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${item >= 10 ? item : "0" + item}`;
      if (formatDate(dayjs()) === formatDate(dayjs(itemDate)))
        return TEXT_COLOR["500"][
          primaryColor as keyof (typeof TEXT_COLOR)["500"]
        ];
      return "";
    },
    [calendarData.date, primaryColor]
  );

  const activeDateData = useCallback(
    (day: number) => {
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day}`;
      let className = "";

      if (
        dayjs(fullDay).isSame(period.start) &&
        dayjs(fullDay).isSame(period.end)
      ) {
        className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium rounded-full`;
      } else if (dayjs(fullDay).isSame(period.start)) {
        className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium ${
          dayjs(fullDay).isSame(dayHover) && !period.end
            ? "rounded-full"
            : "rounded-l-full"
        }`;
      } else if (dayjs(fullDay).isSame(period.end)) {
        className = ` ${BG_COLOR["500"][primaryColor]} text-white font-medium ${
          dayjs(fullDay).isSame(dayHover) && !period.start
            ? "rounded-full"
            : "rounded-r-full"
        }`;
      }

      return {
        active:
          dayjs(fullDay).isSame(period.start) ||
          dayjs(fullDay).isSame(period.end),
        className: className,
      };
    },
    [calendarData.date, dayHover, period.end, period.start, primaryColor]
  );

  const hoverClassByDay = useCallback(
    (day: number) => {
      let className = currentDateClass(day);
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day >= 10 ? day : "0" + day}`;

      if (period.start && period.end) {
        if (dayjs(fullDay).isBetween(period.start, period.end, "day", "[)")) {
          return ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
            day
          )} dark:bg-white/10`;
        }
      }

      if (!dayHover) {
        return className;
      }

      if (
        period.start &&
        dayjs(fullDay).isBetween(period.start, dayHover, "day", "[)")
      ) {
        className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
          day
        )} dark:bg-white/10`;
      }

      if (
        period.end &&
        dayjs(fullDay).isBetween(dayHover, period.end, "day", "[)")
      ) {
        className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
          day
        )} dark:bg-white/10`;
      }

      if (dayHover === fullDay) {
        const bgColor = BG_COLOR["500"][primaryColor];
        className = ` transition-all duration-500 text-white font-medium ${bgColor} ${
          period.start ? "rounded-r-full" : "rounded-l-full"
        }`;
      }

      return className;
    },
    [
      calendarData.date,
      currentDateClass,
      dayHover,
      period.end,
      period.start,
      primaryColor,
    ]
  );

  const isDateTooEarly = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (!minDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = newDate.set("date", day);
      return dayjs(formattedDate).isSame(dayjs(minDate), "day")
        ? false
        : dayjs(formattedDate).isBefore(dayjs(minDate));
    },
    [calendarData.date, minDate]
  );

  const isDateTooLate = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (!maxDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = newDate.set("date", day);
      return dayjs(formattedDate).isSame(dayjs(maxDate), "day")
        ? false
        : dayjs(formattedDate).isAfter(dayjs(maxDate));
    },
    [calendarData.date, maxDate]
  );

  const isDateDisabled = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (isDateTooEarly(day, type) || isDateTooLate(day, type)) {
        return true;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;

      if (
        !disabledDates ||
        (Array.isArray(disabledDates) && !disabledDates.length)
      ) {
        return false;
      }

      let matchingCount = 0;
      disabledDates?.forEach((dateRange) => {
        if (
          dayjs(formattedDate).isAfter(dateRange.startDate) &&
          dayjs(formattedDate).isBefore(dateRange.endDate)
        ) {
          matchingCount++;
        }
        if (
          dayjs(formattedDate).isSame(dateRange.startDate) ||
          dayjs(formattedDate).isSame(dateRange.endDate)
        ) {
          matchingCount++;
        }
      });
      return matchingCount > 0;
    },
    [calendarData.date, isDateTooEarly, isDateTooLate, disabledDates]
  );

  const buttonClass = useCallback(
    (day: number, type: "current" | "next" | "previous") => {
      let baseClass = `calender-day flex items-center justify-center ${
        style === "custom" ? " w-6 h-6 m-1" : "w-12 h-12 lg:w-10 lg:h-10"
      } relative`;
      if (type === "current") {
        return cn(
          baseClass,
          !activeDateData(day).active
            ? hoverClassByDay(day)
            : style === "custom"
            ? ""
            : activeDateData(day).className,
          isDateDisabled(day, type) && "text-gray-400 cursor-not-allowed"
        );
      }
      return cn(
        baseClass,
        isDateDisabled(day, type) && "cursor-not-allowed",
        "text-gray-400"
      );
    },
    [activeDateData, hoverClassByDay, isDateDisabled]
  );

  const checkIfHoverPeriodContainsDisabledPeriod = useCallback(
    (hoverPeriod: Period) => {
      if (!Array.isArray(disabledDates)) {
        return false;
      }
      for (let i = 0; i < disabledDates.length; i++) {
        if (
          dayjs(hoverPeriod.start).isBefore(disabledDates[i].startDate) &&
          dayjs(hoverPeriod.end).isAfter(disabledDates[i].endDate)
        ) {
          return true;
        }
      }
      return false;
    },
    [disabledDates]
  );

  const getMetaData = useCallback(() => {
    return {
      previous: previousMonth(calendarData.date),
      current: calendarData.date,
      next: nextMonth(calendarData.date),
    };
  }, [calendarData.date]);

  const hoverDay = useCallback(
    (day: number, type: string) => {
      const object = getMetaData();
      const newDate = object[type as keyof typeof object];
      const newHover = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;

      if (period.start && !period.end) {
        const hoverPeriod = { ...period, end: newHover };
        if (dayjs(newHover).isBefore(dayjs(period.start))) {
          hoverPeriod.start = newHover;
          hoverPeriod.end = period.start;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: null,
              end: period.start,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }

      if (!period.start && period.end) {
        const hoverPeriod = { ...period, start: newHover };
        if (dayjs(newHover).isAfter(dayjs(period.end))) {
          hoverPeriod.start = period.end;
          hoverPeriod.end = newHover;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: period.end,
              end: null,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }
    },
    [
      changeDayHover,
      changePeriod,
      checkIfHoverPeriodContainsDisabledPeriod,
      getMetaData,
      period,
    ]
  );

  const handleClickDay = useCallback(
    (day: number, type: "previous" | "current" | "next") => {
      function continueClick() {
        if (type === "previous") {
          onClickPreviousDays(day);
        }

        if (type === "current") {
          onClickDay(day);
        }

        if (type === "next") {
          onClickNextDays(day);
        }
      }

      if (disabledDates?.length) {
        const object = getMetaData();
        const newDate = object[type as keyof typeof object];
        const clickDay = `${newDate.year()}-${newDate.month() + 1}-${
          day >= 10 ? day : "0" + day
        }`;

        if (period.start && !period.end) {
          dayjs(clickDay).isSame(dayHover) && continueClick();
        } else if (!period.start && period.end) {
          dayjs(clickDay).isSame(dayHover) && continueClick();
        } else {
          continueClick();
        }
      } else {
        continueClick();
      }
    },
    [
      dayHover,
      disabledDates?.length,
      getMetaData,
      onClickDay,
      onClickNextDays,
      onClickPreviousDays,
      period.end,
      period.start,
    ]
  );
  const load_marker = (day: number, type: string) => {
    let fullDay = `${calendarData.date.year()}-${
      calendarData.date.month() + 1
    }-${day >= 10 ? day : "0" + day}`;
    if (type === "previous") {
      const newDate = previousMonth(calendarData.date);
      fullDay = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;
    }
    if (type === "next") {
      const newDate = nextMonth(calendarData.date);
      fullDay = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;
    }
    const res = new Date(fullDay);
    return typeof onIcon === "function"
      ? onIcon(day, res, {
          ref: calendarRef,
          height,
          maxItem,
          width,
          heightItem,
        })
      : null;
  };
  useEffect(() => {
    if (calendarRef?.current && markRef?.current) {
      // const card = getNumber(get(calendarRef, "current.clientWidth"));
      const cardDay = calendarRef.current as any;
      const rect = cardDay.getBoundingClientRect();
      const card = getNumber(rect?.width);
      const cardHeight = getNumber(get(markRef, "current.clientHeight"));
      const heightItem = 20; // perkiraan
      setWidth(card);
      setHeight(cardHeight);
      setMaxItem(Math.floor(cardHeight / heightItem));
      setHeightItem(20);
      // setMaxItem
      const day = 3;
      const fullwidth = card * 7;
      const percent = (7 / 3) * 100;
    }
  }, [calendarRef.current, markRef.current]);
  return (
    <div
      className={cx(
        "calender-days grid grid-cols-7 ",
        style === "custom" ? "" : "  my-1 gap-y-0.5",
        css`
          z-index: 0;
          .calender-grid {
            // aspect-ratio: 1 / 1;
          }
        `
      )}
    >
      {calendarData.days.previous.map((item, index) => (
        <div
          key={"prev_" + index}
          className={cx(
            "calender-grid flex flex-row",
            style === "custom"
              ? "border-gray-200 hover:bg-gray-100  cursor-pointer"
              : ""
          )}
          onClick={() => {
            if (style === "custom") handleClickDay(item, "previous");
          }}
        >
          <div className="flex flex-col flex-grow calender-day-wrap">
            {style === "custom" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "previous")}
                  className={`${buttonClass(item, "previous")}`}
                  onMouseOver={() => {
                    hoverDay(item, "previous");
                  }}
                >
                  <span className="relative">{item}</span>
                </button>
                <div className="flex flex-grow  relative">
                  {load_marker(item, "previous")}
                  {/*
                  {index === 1 && (
                    <div
                      className={cx(
                        "hover:bg-gray-200 font-bold text-sm text-black px-2 absolute top-[27px] left-0 w-[196px] rounded-md",
                        css`
                          z-index: 1;
                        `
                      )}
                    >
                      1 more
                    </div>
                  )} */}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "previous")}
                  className={`${buttonClass(item, "previous")}`}
                  onClick={() => handleClickDay(item, "previous")}
                  onMouseOver={() => {
                    hoverDay(item, "previous");
                  }}
                >
                  <span className="relative">
                    {item}
                    {load_marker(item, "previous")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {calendarData.days.current.map((item, index) => (
        <div
          key={"current_" + index}
          ref={index === 0 ? calendarRef : null}
          className={cx(
            "calender-grid flex flex-row",
            style === "custom"
              ? activeDateData(item).active
                ? "bg-blue-200/75 ring-1  cursor-pointer border-gray-200"
                : "hover:bg-gray-50  cursor-pointer border-gray-200 bg-white"
              : ""
          )}
          onClick={() => {
            if (style === "custom") handleClickDay(item, "current");
          }}
        >
          <div className="flex flex-col flex-grow calender-day-wrap">
            {style === "custom" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "current")}
                  className={`${buttonClass(item, "current")}`}
                  // onClick={() => handleClickDay(item, "current")}
                  onMouseOver={() => {
                    hoverDay(item, "current");
                  }}
                >
                  <span className="relative">{item}</span>
                </button>
                <div
                  className="flex flex-grow  relative "
                  ref={index === 0 ? markRef : null}
                >
                  {load_marker(item, "current")}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "current")}
                  className={`${buttonClass(item, "current")}`}
                  onClick={() => handleClickDay(item, "current")}
                  onMouseOver={() => {
                    hoverDay(item, "current");
                  }}
                >
                  <span className="relative">
                    {item}
                    {load_marker(item, "current")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {calendarData.days.next.map((item, index) => (
        <div
          key={"next_" + index}
          className={cx(
            "calender-grid flex flex-row ",
            style === "custom"
              ? "hover:bg-gray-100  cursor-pointer border-gray-200"
              : ""
          )}
          onClick={() => {
            if (style === "custom") handleClickDay(item, "next");
          }}
        >
          <div className="flex flex-col flex-grow calender-day-wrap">
            {style === "custom" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "next")}
                  className={`${buttonClass(item, "next")}`}
                  onMouseOver={() => {
                    hoverDay(item, "next");
                  }}
                >
                  <span className="relative">{item}</span>
                </button>
                <div className="flex flex-grow  relative ">
                  {load_marker(item, "next")}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "next")}
                  className={`${buttonClass(item, "next")}`}
                  onClick={() => handleClickDay(item, "next")}
                  onMouseOver={() => {
                    hoverDay(item, "next");
                  }}
                >
                  <span className="relative">
                    {item}
                    {load_marker(item, "next")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Days;
