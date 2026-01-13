import { FieldUploadMulti } from "./TypeUploadMulti";
import { FieldUploadSingle } from "./TypeUploadSingle";

export const TypeUpload: React.FC<any> = ({
  name,
  fm,
  on_change,
  mode,
  type,
  disabled,
  valueKey = "url",
  onDelete,
  isDirectUpload,
}) => {
  if (type === "multi") {
    return (
      <>
        <FieldUploadMulti
          field={{
            name,
            disabled,
          }}
          fm={fm}
          on_change={on_change}
          mode={mode}
          valueKey={valueKey}
          onDelete={onDelete}
        />
      </>
    );
  }
  return (
    <>
      <FieldUploadSingle
        field={{
          name,
          disabled,
        }}
        isDirectUpload={isDirectUpload}
        fm={fm}
        on_change={on_change}
        mode={mode}
      />
    </>
  );
};
