import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { imageUrl } = await request.json();

  const binId = process.env.JSON_BIN_ID!;
  const masterKey = process.env.JSON_BIN_MASTER_KEY!;

  try {
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: {
        "X-Master-Key": masterKey,
      },
    });

    const binData = await getRes.json();
    const currentImages = binData.record.images || [];

    // Step 2: Add new image to array
    const updatedImages = [...currentImages, imageUrl];

    // Step 3: Save back to JSONBin
    const putRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": masterKey,
      },
      body: JSON.stringify({ images: updatedImages }),
    });

    if (!putRes.ok) {
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
