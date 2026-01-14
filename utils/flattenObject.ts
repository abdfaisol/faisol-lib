import { normalDate } from "./date";

export const flattenObject = (
  obj: any,
  parentKey: string = "",
  result: any = {},
  idx: any = ""
): any => {
  for (const [key, value] of Object.entries(obj)) {
    // Buat key baru
    const newKey = parentKey
      ? `${parentKey}.${key}${idx ? `[${idx}]` : ``}`
      : key;
    if (Array.isArray(value)) {
      // Jika value adalah array, loop dan tambahkan indeks
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          // Rekursi jika elemen adalah object
          flattenObject(item, `${newKey}`, result, `${index}`);
        } else {
          // Simpan value langsung jika elemen bukan object
          result[`${newKey}.${key}[${index}]`] = item;
        }
      });
    } else {
      // Simpan value langsung jika bukan array atau object
      if (["end_date", "birth_date"].includes(key)) {
        result[newKey] = normalDate(value as any);
      } else {
        if (["ktp", "certificate", "curriculum_vitae"].includes(key)) {
          if (typeof value !== "string" && value) result[newKey] = value;
        } else {
          result[newKey] = value;
        }
      }
    }
  }
  return result;
};
