import { read, readFile, utils } from "xlsx";

export async function readCSV(filePath: string) {
  try {
    const fileBuffer = await readFile(filePath);
    const workbook = read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error("Error reading CSV file:", error);
    return null;
  }
}
