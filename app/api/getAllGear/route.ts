import { readCSV } from "@/app/_utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { read, readFile, utils } from "xlsx";

export default async function handler(req: NextRequest, res: any) {
  if (req.method === "GET") {
    try {
      const filePath = path.join(process.cwd(), "public", "gear.csv");
      const fileBuffer = await readFile(filePath);
      const workbook = read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(worksheet);

      res.status(200).json(data);
    } catch (error) {
      console.error("Error reading CSV file:", error);
      res.status(500).json({ error: "Error reading CSV file" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
