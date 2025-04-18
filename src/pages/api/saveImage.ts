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

// import fs from "fs";
// import path from "path";
// import { NextApiRequest, NextApiResponse } from "next";

// const filePath = path.join(process.cwd(), "public", "gallery.json");

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { images } = req.body;
//     console.log("Received image URLs:", images);

//     if (!Array.isArray(images)) {
//       return res.status(400).json({ message: "Invalid images array" });
//     }

//     try {
//       let existingImages: string[] = [];

//       if (fs.existsSync(filePath)) {
//         const fileContent = fs.readFileSync(filePath, "utf-8");
//         existingImages = JSON.parse(fileContent);
//       }

//       const updatedImages = [...images, ...existingImages];

//       fs.writeFileSync(filePath, JSON.stringify(updatedImages, null, 2));

//       return res
//         .status(200)
//         .json({ message: "Images saved", images: updatedImages });
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ message: "Failed to save images", error: err });
//     }
//   }

//   return res.status(405).json({ message: "Method not allowed" });
// }
