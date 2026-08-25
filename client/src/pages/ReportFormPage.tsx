import { useState, type FormEvent, type ChangeEvent } from "react";
import { validateReport, type ReportForm } from "../utils/validation";
import { createReport, ApiError } from "../api/reports";

const CATEGORIES = [
  "Electronics",
  "ID & Cards",
  "Books & Stationery",
  "Clothing",
  "Bags",
  "Keys",
  "Accessories",
  "Other",
];

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; itemName: string }
  | { kind: "error"; message: string };

export default function ReportFormPage() {
  const [form, setForm] = useState<ReportForm>({
    type: "Lost",
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    contactInfo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });

  const update =
    (k: keyof ReportForm) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>
      setForm({ ...form, [k]: e.target.value });

  const resetForm = () => {
    setForm({
      type: "Lost",
      itemName: "",
      category: "",
      location: "",
      date: "",
      description: "",
      contactInfo: "",
    });
    setErrors({});
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateReport(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmit({ kind: "submitting" });
    try {
      const created = await createReport(form);
      setSubmit({ kind: "success", itemName: created.itemName });
      resetForm();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Could not reach the server. Is the backend running on port 5000?";
      setSubmit({ kind: "error", message });
    }
  };

  const errStyle = { color: "#c00", fontSize: 13, margin: "4px 0 0" };
  const labelStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  };
  const inputStyle = {
    padding: 8,
    fontSize: 15,
    border: "1px solid #ccc",
    borderRadius: 4,
  };
  const banner = (bg: string, color: string, text: string) => (
    <p
      style={{
        background: bg,
        color,
        padding: 12,
        margin: 0,
        borderRadius: 4,
      }}
    >
      {text}
    </p>
  );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 560,
        margin: "40px auto",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "system-ui, sans-serif",
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h1 style={{ margin: 0 }}>Report a Lost or Found Item</h1>

      {submit.kind === "success" &&
        banner("#e6f4ea", "#0b6b2a", `Reported "${submit.itemName}" — saved to the database.`)}
      {submit.kind === "error" &&
        banner("#fdecea", "#a11", submit.message)}

      <label style={labelStyle}>
        Type
        <select value={form.type} onChange={update("type")} style={inputStyle}>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
      </label>

      <label style={labelStyle}>
        Item name
        <input
          value={form.itemName}
          onChange={update("itemName")}
          style={inputStyle}
        />
        {errors.itemName && <p style={errStyle}>{errors.itemName}</p>}
      </label>

      <label style={labelStyle}>
        Category
        <select
          value={form.category}
          onChange={update("category")}
          style={inputStyle}
        >
          <option value="">— pick one —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p style={errStyle}>{errors.category}</p>}
      </label>

      <label style={labelStyle}>
        Location
        <input
          value={form.location}
          onChange={update("location")}
          style={inputStyle}
        />
        {errors.location && <p style={errStyle}>{errors.location}</p>}
      </label>

      <label style={labelStyle}>
        Date
        <input
          type="date"
          value={form.date}
          onChange={update("date")}
          style={inputStyle}
        />
        {errors.date && <p style={errStyle}>{errors.date}</p>}
      </label>

      <label style={labelStyle}>
        Description
        <textarea
          value={form.description}
          onChange={update("description")}
          rows={4}
          style={inputStyle}
        />
        {errors.description && <p style={errStyle}>{errors.description}</p>}
      </label>

      <label style={labelStyle}>
        Contact info
        <input
          value={form.contactInfo}
          onChange={update("contactInfo")}
          placeholder="email or phone"
          style={inputStyle}
        />
        {errors.contactInfo && <p style={errStyle}>{errors.contactInfo}</p>}
      </label>

      <button
        type="submit"
        disabled={submit.kind === "submitting"}
        style={{
          padding: "10px 16px",
          fontSize: 16,
          cursor: submit.kind === "submitting" ? "not-allowed" : "pointer",
          background: submit.kind === "submitting" ? "#888" : "#14707b",
          color: "white",
          border: "none",
          borderRadius: 4,
        }}
      >
        {submit.kind === "submitting" ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
