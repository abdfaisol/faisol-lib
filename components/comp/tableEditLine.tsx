import { Field } from "@/lib/components/form/Field";
import { apix } from "@/lib/utils/apix";
import { events } from "@/lib/utils/event";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { ButtonBetter } from "@/lib/components/ui/button";
import { getNumber } from "@/lib/utils/getNumber";
import { TooltipBetter } from "@/lib/components/ui/tooltip-better";
import { formatMoney } from "@/lib/components/form/field/TypeInput";

// Dummy ButtonBetter

// TableEditBetter component
export function TableEditBetterLine({
  documentLines,
  fm,
  setDocumentLines,
  deletedLineIds,
  setDeletedLineIds,
  disabled,
  status,
}: any) {
  // Add Row
  if (!fm) return <></>;
  const addRow = () => {
    setDocumentLines((prev: any[]) => [
      ...prev,
      { recruit_ph: 0, recruit_mt: 0, promotion: 0 },
    ]);
  };

  // Remove Row
  const removeRow = (idx: number) => {
    setDocumentLines((prev: any[]) => {
      const row = prev[idx];
      if (row.id) {
        setDeletedLineIds((ids: any[]) => [...ids, row.id]);
        // remove duplicate ids
        const uniqueIds = new Set(deletedLineIds);
        uniqueIds.add(row.id);
        setDeletedLineIds(Array.from(uniqueIds));
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  // Update Row
  const updateRow = (idx: number, field: string, value: any) => {
    setDocumentLines((prev: any[]) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  // Total recruit & promote
  const totalRecruit = documentLines.reduce(
    (acc: any, row: any) =>
      acc + getNumber(row.recruit_ph) + getNumber(row.recruit_mt),
    0
  );
  const totalPromote = documentLines.reduce(
    (acc: any, row: any) => acc + getNumber(row.promotion),
    0
  );

  return (
    <div>
      {/* Add Row Button */}
      {["DRAFTED", "REJECTED"].includes(status) && !disabled && (
        <div className="flex flex-row gap-x-2 items-center">
          <div className="flex flex-row flex-grow space-x-2 p-2">
            <ButtonBetter className="bg-primary" onClick={addRow}>
              <div className="flex items-center gap-x-0.5">
                <HiPlus className="text-xl" />
                <span className="capitalize">Add New</span>
              </div>
            </ButtonBetter>
          </div>
          {fm.error?.["document_line"] && (
            <p className="text-red-500 px-2 text-sm">
              {fm.error?.["document_line"]}
            </p>
          )}
        </div>
      )}
      <table border={1} cellPadding={6} width="100%">
        <thead className="rounded-md text-md bg-primary group/head text-md uppercase text-white sticky top-0">
          <tr>
            <th>Job Level</th>
            <th>Job</th>
            <th style={{ width: 50 }}>Existing</th>
            <th style={{ width: 50 }}>Suggested Recruit</th>
            <th style={{ width: 50 }}>Recruit PH</th>
            <th style={{ width: 50 }}>Recruit MT</th>
            <th style={{ width: 50 }}>Promotion</th>
            <th style={{ width: 50 }}>Total</th>
            {["DRAFTED", "REJECTED"].includes(status) && !disabled && <th></th>}
          </tr>
        </thead>
        <tbody>
          {documentLines.map((row: any, idx: number) => {
            // Disabled per row: status + job_level_id (contoh mirip kode aslimu)
            const isDisabled =
              !["DRAFTED", "REJECTED"].includes(status) || !row.job_level_id;
            const isDisabledStatus = !["DRAFTED", "REJECTED"].includes(status);
            // Total tiap baris
            const total =
              getNumber(row.existing) +
              getNumber(row.recruit_ph) +
              getNumber(row.recruit_mt) -
              getNumber(row.promotion);
            return (
              <tr key={row.id ?? idx}>
                <td>
                  <Field
                    tooltip="The job level to be selected"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    hidden_label={true}
                    target="job_level_id"
                    name={"job_level"}
                    label={"Level"}
                    disabled={isDisabledStatus}
                    search="local"
                    pagination={false}
                    onChange={(value: any) => {
                      console.log({ value });
                      updateRow(idx, "job_level_id", value?.id);
                      updateRow(idx, "job_level", value?.data);
                    }}
                    type={"dropdown-async"}
                    onLoad={async (param: any) => {
                      const params = await events("onload-param", param);
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data",
                        path: `/api/job-levels/organization/${fm.data.organization_id}${params}`,
                        validate: "array",
                      });
                      return res;
                    }}
                    onLabel={(item: any) => `${item.level} - ${item.name}`}
                  />
                </td>
                <td>
                  <Field
                    tooltip="The job position to be requested"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    hidden_label={true}
                    target={"job_id"}
                    name={"job"}
                    label={"Job"}
                    autoRefresh={true}
                    disabled={isDisabledStatus ? true : !row?.job_level_id}
                    search="local"
                    pagination={false}
                    type={"dropdown-async"}
                    onChange={(item: any) => {
                      const existing = item.data.existing;
                      updateRow(idx, "existing", existing);
                      updateRow(idx, "job_id", item.id);
                      updateRow(idx, "job", item.data);
                      fm.render();
                      const suggested_recruit =
                        getNumber(item.data.job_plafon) -
                        getNumber(existing) +
                        getNumber(fm.data.turn_over) +
                        getNumber(row.promotion);

                      updateRow(idx, "suggested_recruit", suggested_recruit);
                      updateRow(idx, "job_plafon", item.data.job_plafon);
                      updateRow(idx, "existing", existing);
                      const total =
                        getNumber(row.existing) +
                        getNumber(row.recruit_ph) +
                        getNumber(row.recruit_mt) -
                        getNumber(row.promotion);
                      updateRow(idx, "total", total);
                      fm.render();
                    }}
                    onLoad={async (param: any) => {
                      console.log({ row });
                      if (!row.job_level_id) return [];
                      const params = await events("onload-param", {
                        ...param,
                        organization_id: fm.data.organization_id,
                      });
                      const res: any = await apix({
                        port: "portal",
                        value: "data.data",
                        path: `/api/jobs/job-level/${row.job_level_id}${params}`,
                        validate: "array",
                      });
                      if (documentLines?.length) {
                        let ids = documentLines.map((e: any) => e.job_id);
                        console.log({ ids });
                        ids = ids.filter((e: any) => e !== row?.job_id);
                        const result = res.filter(
                          (e: any) => !ids.includes(e.id)
                        );
                        return result || [];
                      } else {
                        return res;
                      }
                    }}
                    // autoRefresh={true}
                    onLabel={"name"}
                  />
                </td>
                <td>
                  <Field
                    tooltip="The number of remaining employees in this job"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    name={"existing"}
                    label={"Approved by"}
                    type={"money"}
                    disabled={true}
                    hidden_label={true}
                  />
                </td>
                <td>
                  <Field
                    tooltip="The difference between the job ceiling and the existing employees"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    name={"suggested_recruit"}
                    label={"Approved by"}
                    type={"money"}
                    hidden_label={true}
                    disabled={true}
                  />
                </td>

                <td>
                  <Field
                    tooltip="Input the number of hires for Professional Hire"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    name={"recruit_ph"}
                    type={"money"}
                    hidden_label={true}
                    disabled={
                      !(
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                        ? true
                        : !row?.job_level_id
                    }
                    onChange={(item: any) => {
                      const getNumber = (data: any) => {
                        return Number(data) || 0;
                      };
                      updateRow(idx, "recruit_ph", getNumber(item));
                      const total =
                        getNumber(row.existing) +
                        getNumber(row.recruit_ph) +
                        getNumber(row.recruit_mt) -
                        getNumber(row.promotion);

                      const recruit = documentLines
                        .map(
                          (e: any) =>
                            getNumber(e.recruit_ph) + getNumber(e.recruit_mt)
                        )
                        .reduce((a: any, b: any) => a + b, 0);
                      fm.data.total_recruit = recruit;
                      updateRow(idx, "total", total);
                      fm.render();
                    }}
                  />
                </td>
                <td>
                  <Field
                    tooltip="Input the number of hires for Management Trainee"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    name={"recruit_mt"}
                    type={"money"}
                    hidden_label={true}
                    disabled={
                      !(
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                        ? true
                        : !row?.job_level_id
                    }
                    onChange={(e) => {
                      updateRow(idx, "recruit_mt", e);
                      const getNumber = (data: any) => {
                        return Number(data) || 0;
                      };
                      const total =
                        getNumber(row.existing) +
                        getNumber(row.recruit_ph) +
                        getNumber(row.recruit_mt) -
                        getNumber(row.promotion);

                      const recruit = documentLines
                        .map(
                          (e: any) =>
                            getNumber(e.recruit_ph) + getNumber(e.recruit_mt)
                        )
                        .reduce((a: any, b: any) => a + b, 0);
                      fm.data.total_recruit = recruit;
                      row.total = total;
                      updateRow(idx, "total", total);
                      fm.render();
                    }}
                  />
                </td>
                <td>
                  <Field
                    tooltip="The number of employees promoted from this job to another"
                    fm={{
                      data: row,
                      fields: {},
                      render: () => {},
                    }}
                    name={"promotion"}
                    label={"Approved by"}
                    type={"money"}
                    hidden_label={true}
                    disabled={
                      !(
                        fm.data?.status === "DRAFTED" ||
                        fm.data?.status === "REJECTED"
                      )
                        ? true
                        : !row?.job_level_id
                    }
                    onChange={(item: any) => {
                      updateRow(idx, "promotion", item);
                      const getNumber = (data: any) => {
                        return Number(data) || 0;
                      };
                      const total =
                        getNumber(row.existing) +
                        getNumber(row.recruit_ph) +
                        getNumber(row.recruit_mt) -
                        getNumber(row.promotion);
                      const totalPromotion = documentLines
                        .map((e: any) => getNumber(e.promotion))
                        .reduce((a: any, b: any) => a + b, 0);
                      fm.data.total_promote = totalPromotion;
                      row.total = total;
                      updateRow(idx, "total", total);
                      fm.render();

                      const suggested_recruit =
                        getNumber(row.job_plafon) -
                        getNumber(row.existing) +
                        getNumber(fm.data.turn_over) +
                        getNumber(row.promotion);
                      updateRow(idx, "suggested_recruit", suggested_recruit);
                      fm.render();
                    }}
                  />
                </td>
                <td>
                  <TooltipBetter content="(Existing + Recruit PH + Recruit MT) - Promotion">
                    <span
                      style={{
                        background: "#eee",
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      {formatMoney(total)}
                    </span>
                  </TooltipBetter>
                </td>
                {["DRAFTED", "REJECTED"].includes(status) && !disabled && (
                  <td>
                    <div className="flex items-center justify-center">
                      <ButtonBetter
                        className="bg-red-500"
                        onClick={() => removeRow(idx)}
                      >
                        <div className="flex items-center">
                          <MdDelete />
                        </div>
                      </ButtonBetter>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {documentLines.length === 0 && (
            <tr>
              <td colSpan={5} align="center">
                (No data)
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function TableEditBetterDemo() {
  // State pakai any[]
  const [documentLines, setDocumentLines] = useState<any[]>([
    // contoh baris existing (simulate dari backend)
    {
      id: 101,
      recruit_ph: 1,
      recruit_mt: 2,
      promotion: 1,
      job_level_id: 1,
      existing: 2,
    },
    {
      id: 102,
      recruit_ph: 3,
      recruit_mt: 1,
      promotion: 0,
      job_level_id: 2,
      existing: 1,
    },
  ]);
  const [deletedLineIds, setDeletedLineIds] = useState<any[]>([]);
  // Simulasi status
  const [status, setStatus] = useState<"DRAFTED" | "REJECTED" | "APPROVED">(
    "DRAFTED"
  );
  // Simulasi disabled dari props/parent
  const disabled = false;

  // Simulasi submit
  const handleSubmit = () => {
    alert(
      "Kirim ke API:\n" +
        "documentLines:\n" +
        JSON.stringify(documentLines, null, 2) +
        "\ndeletedLineIds:\n" +
        JSON.stringify(deletedLineIds, null, 2)
    );
  };

  return (
    <div style={{ maxWidth: 600, margin: "32px auto" }}>
      <h3>TableEditBetter - Demo State Lokal</h3>
      <div style={{ marginBottom: 8 }}>
        Status:{" "}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="DRAFTED">DRAFTED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="APPROVED">APPROVED</option>
        </select>
      </div>
      <TableEditBetterLine
        documentLines={documentLines}
        setDocumentLines={setDocumentLines}
        deletedLineIds={deletedLineIds}
        setDeletedLineIds={setDeletedLineIds}
        status={status}
        disabled={disabled}
      />
      <button style={{ marginTop: 16 }} onClick={handleSubmit}>
        Submit to API
      </button>
    </div>
  );
}
