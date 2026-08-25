export type ReportForm = {
  type: "Lost" | "Found";
  itemName: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
};

export function validateReport(f: ReportForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!f.itemName.trim()) errors.itemName = "Item name is required";
  if (!f.category) errors.category = "Pick a category";
  if (!f.location.trim()) errors.location = "Location is required";
  if (!f.date) errors.date = "Date is required";
  else if (new Date(f.date) > new Date()) errors.date = "Date cannot be in the future";
  if (!f.description.trim()) errors.description = "Description is required";
  if (!f.contactInfo.trim()) errors.contactInfo = "Contact info is required";
  return errors;
}
