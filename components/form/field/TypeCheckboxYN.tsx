import { useLocal } from "@/lib/utils/use-local";
import { FC, useEffect } from "react";

export const FieldCheckboxYN: FC<any> = ({
  fm,
  name,
  onLoad,
  onChange,
  placeholder,
  disabled,
  className,
  fields,
  labelSingleCheckbox,
}) => {
  const local = useLocal({
    list: [] as any[],
    reload: async () => {
      fm.fields[name] = { ...fields, ...local };
      fm.render();
      const callback = (res: any[]) => {
        if (Array.isArray(res)) {
          local.list = res;
        } else {
          local.list = [];
        }

        local.render();
      };
      const res = onLoad();
      if (res instanceof Promise) res.then(callback);
      else callback(res);
    },
  });
  useEffect(() => {
    fm.fields[name] = { ...fields, ...local };
    const callback = (res: any[]) => {
      if (Array.isArray(res)) {
        local.list = res;
      } else {
        local.list = [];
      }
      local.render();
    };

    if (onLoad) {
      const res = onLoad();
      if (res instanceof Promise) res.then(callback);
      else callback(res);
    } else {
      local.list = [{ label: placeholder || "", value: "Y" }];
      local.render();
    }
  }, []);

  let value = fm.data?.[name] || "Y";

  const applyChanges = (val: string) => {
    fm.data[name] = val;
    fm.render();

    if (typeof onChange === "function") {
      onChange(fm.data[name]);
    }
  };

  return (
    <>
      <div className={cx("flex items-center w-full flex-row")}>
        <div
          className={cx(`flex flex-col p-0.5 flex-1`, "space-y-1 ", className)}
        >
          {local.list.map((item, idx) => {
            let isChecked = value === "Y";

            return (
              <div
                key={idx + "_checkbox_yn"}
                onClick={() => {
                  if (!disabled) {
                    const newValue = isChecked ? "N" : "Y";
                    applyChanges(newValue);
                  }
                }}
                className={cx(
                  "text-sm opt-item flex flex-row space-x-1 cursor-pointer items-center rounded-full p-0.5",
                  isChecked && "active"
                )}
              >
                <div className="text-primary">
                  {isChecked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="fill-sky-500"
                    >
                      <path
                        fill="currentColor"
                        d="m10.6 14.092l-2.496-2.496q-.14-.14-.344-.15q-.204-.01-.364.15t-.16.354q0 .194.16.354l2.639 2.638q.242.243.565.243q.323 0 .565-.243l5.477-5.477q.14-.14.15-.344q.01-.204-.15-.363q-.16-.16-.354-.16q-.194 0-.353.16L10.6 14.092ZM5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H5.615Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M5.615 20q-.69 0-1.152-.462Q4 19.075 4 18.385V5.615q0-.69.463-1.152Q4.925 4 5.615 4h12.77q.69 0 1.152.463q.463.462.463 1.152v12.77q0 .69-.462 1.152q-.463.463-1.153.463H5.615Zm0-1h12.77q.23 0 .423-.192q.192-.193.192-.423V5.615q0-.23-.192-.423Q18.615 5 18.385 5H5.615q-.23 0-.423.192Q5 5.385 5 5.615v12.77q0 .23.192.423q.193.192.423.192Z"
                      />
                    </svg>
                  )}
                </div>

                <div className="">{labelSingleCheckbox}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
