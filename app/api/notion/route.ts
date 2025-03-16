import { NextResponse } from "next/server";
import { getArchitectSitesFromNotion } from "@/lib/notion";

// Notionからデータを取得するAPI
export async function GET() {
  try {
    const sites = await getArchitectSitesFromNotion();
    return NextResponse.json({ sites });
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Notion" },
      { status: 500 }
    );
  }
}
