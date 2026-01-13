import get from "lodash.get";
import { Loader2, Paperclip, Trash2, Upload } from "lucide-react";
import { ChangeEvent, FC, useEffect } from "react";
import * as XLSX from "xlsx";
import { useLocal } from "@/lib/utils/use-local";
import { apix } from "@/lib/utils/apix";
import { FilePreview } from "./FilePreview";

export const FieldUploadSingle: FC<{
  field: any;
  fm: any;
  on_change: (e: any) => void | Promise<void>;
  isDirectUpload?: boolean;
  mode?: "upload" | "import";
}> = ({ field, fm, on_change, mode, isDirectUpload }) => {
  const styling = "mini";
  const disabled = field?.disabled || false;
  let value: any = fm.data?.[field.name];
  // let type_upload =
  const input = useLocal({
    value: 0 as any,
    display: false as any,
    ref: null as any,
    drop: false as boolean,
    fase: value ? "preview" : ("start" as "start" | "upload" | "preview"),
    style: "inline" as "inline" | "full",
    preview: null as any,
    isLocal: false,
  });
  useEffect(() => {
    if (value instanceof File) {
      input.preview = `${URL.createObjectURL(value)}.${value.name
        .split(".")
        .pop()}`;
      input.isLocal = true;
      input.render();
    }
  }, []);

  const on_upload = async (event: ChangeEvent<HTMLInputElement>) => {
    let file = null;
    try {
      file = event.target?.files?.[0];
    } catch (ex) {}
    if (mode === "import") {
      const reader = new FileReader();

      function arrayBufferToBinaryString(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        return String.fromCharCode.apply(null, Array.from(bytes));
      }

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          const binaryStr =
            typeof e.target.result === "string"
              ? e.target.result
              : arrayBufferToBinaryString(e.target.result);
          const workbook = XLSX.read(binaryStr, { type: "binary" });

          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          if (typeof on_change === "function") {
            on_change({
              value: jsonData,
              file: file,
              binnary: e.target.result,
            });
          }
        }
      };
      if (file) {
        if (typeof reader.readAsArrayBuffer === "function") {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsBinaryString(file);
        }
      }
    } else if (file) {
      if (isDirectUpload) {
        input.fase = "upload";
        input.render();
        try {
          const result = await apix({
            port: "recruitment",
            value: "data.data.path",
            path: "/api/uploads/file",
            method: "post",
            type: "form",
            data: {
              file: file,
            },
          });
          console.log("Upload result", result);

          // Normalize result into a usable value for fm.data[field.name]
          if (result && typeof result === "object" && !Array.isArray(result)) {
            // prefer API shape: { url, filename, size }
            const urlVal =
              get(result, "url") ||
              get(result, "path") ||
              get(result, "file") ||
              get(result, "filename");
            if (urlVal) {
              fm.data[field.name] = urlVal;
              input.fase = "preview";
              input.preview = urlVal;
              input.isLocal = false;
            } else {
              // fallback to storing the whole object and show local preview
              fm.data[field.name] = result;
              input.fase = "preview";
              input.preview = `${URL.createObjectURL(file)}.${file.name
                .split(".")
                .pop()}`;
              input.isLocal = true;
            }
          } else if (typeof result === "string") {
            // server returned a string (likely a URL)
            fm.data[field.name] = result;
            input.fase = "preview";
            input.preview = result;
            input.isLocal = false;
          } else if (Array.isArray(result) && result.length > 0) {
            // older behavior: server returned an array with path fragments
            fm.data[field.name] = `_file${get(result, "[0]")}`;
            input.fase = "preview";
            input.preview = `${URL.createObjectURL(file)}.${file.name
              .split(".")
              .pop()}`;
            input.isLocal = true;
          } else {
            // unknown shape: store raw result and show local preview
            fm.data[field.name] = result;
            input.fase = "preview";
            input.preview = `${URL.createObjectURL(file)}.${file.name
              .split(".")
              .pop()}`;
            input.isLocal = true;
          }

          fm.render();
          input.render();

          if (typeof on_change === "function") await on_change({});
        } catch (err: any) {
          console.error("Upload error", err);
          alert(`Upload failed: ${String(err?.message || err)}`);
        }
      } else {
        fm.data[field.name] = file;
        fm.render();
        input.fase = "preview";
        input.preview = `${URL.createObjectURL(file)}.${file.name
          .split(".")
          .pop()}`;
        input.isLocal = true;
        input.render();
        if (typeof on_change === "function") {
          await on_change({});
        }
        return;
      }
    }
    if (input.ref) {
      input.ref.value = null;
    }
  };

  return (
    <div className="flex-grow flex-row flex w-full h-full items-stretch relative">
      {input.fase === "start" ? (
        <>
          <div
            className={cx(
              "hover:bg-gray-50 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 ",
              css`
                input[type="file"],
                input[type="file"]::-webkit-file-upload-button {
                  cursor: pointer;
                }
              `,
              disabled && "bg-gray-50"
            )}
          >
            {!disabled && (
              <input
                ref={(ref) => {
                  if (ref) input.ref = ref;
                }}
                type="file"
                multiple={false}
                // accept={field.prop.upload?.accept}
                accept={"file/**"}
                onChange={on_upload}
                className={cx(
                  "absolute w-full h-full cursor-pointer top-0 left-0 opacity-0"
                )}
              />
            )}
            {!disabled ? (
              <div
                onClick={() => {
                  if (input.ref) {
                    input.ref.click();
                  }
                }}
                className="items-center flex text-base px-1 outline-none rounded cursor-pointer flex-row justify-center"
              >
                <div className="flex flex-row items-center px-2">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="flex flex-row items-center  text-sm">
                  Add File
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center px-1.5 text-sm">-</div>
            )}
          </div>
        </>
      ) : input.fase === "upload" ? (
        <div className="flex items-center">
          <div className="px-2">
            <Loader2 className={cx("h-5 w-5 animate-spin")} />
          </div>
          <div className="">Uploading</div>
        </div>
      ) : input.fase === "preview" ? (
        <div className="flex flex-row gap-x-1 justify-between flex-1 p-1">
          <FilePreview
            url={input.isLocal ? input.preview : value || ""}
            disabled={disabled}
          />
          {!disabled ? (
            <>
              <div
                onClick={(e) => {
                  if (!disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm("Clear this file ?")) {
                      input.fase = "start";
                      fm.data[field.name] = null;
                      fm.render();
                    }
                  }
                }}
                className={cx(
                  "flex flex-row items-center border px-2 rounded cursor-pointer hover:bg-red-100"
                )}
              >
                <Trash2 className="text-red-500 h-4 w-4" />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

const IconFile: FC<{ type: string }> = ({ type }) => {
  if (["xlsx"].includes(type)) {
    return (
      <div className="flex flex-row text-[#2a801d]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m2.859 2.877l12.57-1.795a.5.5 0 0 1 .571.494v20.848a.5.5 0 0 1-.57.494L2.858 21.123a1 1 0 0 1-.859-.99V3.867a1 1 0 0 1 .859-.99M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4zm-6.8 9L13 8h-2.4L9 10.286L7.4 8H5l2.8 4L5 16h2.4L9 13.714L10.6 16H13z"
          />
        </svg>
      </div>
    );
  } else {
    return (
      <div className="flex flex-row ">
        <Paperclip className="h-5 w-5" />
      </div>
    );
  }
};
