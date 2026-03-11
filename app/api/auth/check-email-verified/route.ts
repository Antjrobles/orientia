import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await request.json().catch(() => null);
    return NextResponse.json({
      success: true,
      message:
        "Si existe una cuenta pendiente, enviaremos las instrucciones correspondientes.",
    });
  } catch {
    return NextResponse.json(
      {
        success: true,
        message:
          "Si existe una cuenta pendiente, enviaremos las instrucciones correspondientes.",
      },
      { status: 200 },
    );
  }
}
