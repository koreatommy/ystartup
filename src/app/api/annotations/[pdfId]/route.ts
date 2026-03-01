import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ANNOTATIONS_DIR = path.join(process.cwd(), "data", "annotations");

async function ensureAnnotationsDir() {
  try {
    await fs.mkdir(ANNOTATIONS_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating annotations directory:", error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pdfId: string }> }
) {
  try {
    await ensureAnnotationsDir();
    
    const { pdfId } = await params;
    const filePath = path.join(ANNOTATIONS_DIR, `${pdfId}.json`);

    try {
      const data = await fs.readFile(filePath, "utf-8");
      const annotations = JSON.parse(data);
      
      return NextResponse.json({ annotations });
    } catch (error) {
      return NextResponse.json({ annotations: [] });
    }
  } catch (error) {
    console.error("Error reading annotations:", error);
    return NextResponse.json(
      { error: "Failed to read annotations" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ pdfId: string }> }
) {
  try {
    await ensureAnnotationsDir();
    
    const { pdfId } = await params;
    const body = await request.json();
    const { annotations } = body;

    if (!annotations || !Array.isArray(annotations)) {
      return NextResponse.json(
        { error: "Invalid annotations data" },
        { status: 400 }
      );
    }

    const filePath = path.join(ANNOTATIONS_DIR, `${pdfId}.json`);
    await fs.writeFile(filePath, JSON.stringify(annotations, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving annotations:", error);
    return NextResponse.json(
      { error: "Failed to save annotations" },
      { status: 500 }
    );
  }
}
