import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  try {
    // Step 1: body থেকে imageUrl নিচ্ছি
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL missing" }, { status: 400 });
    }

    console.log("✅ Got image URL:", imageUrl);

    // Step 2: JSONBin থেকে আগের images আনছি
    const binId = process.env.JSON_BIN_ID!;
    const masterKey = process.env.JSON_BIN_MASTER_KEY!;

    const fetchRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      headers: {
        "X-Master-Key": masterKey,
      },
    });

    const binData = await fetchRes.json();
    const currentImages = binData?.record?.images ?? [];

    console.log("🗃️ Fetched JSONBin. Total images:", currentImages.length);

    // Step 3: নতুন image push করলাম
    const updatedImages = [...currentImages, imageUrl];

    const saveRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": masterKey,
      },
      body: JSON.stringify({ images: updatedImages }),
    });

    if (!saveRes.ok) {
      console.error("❌ JSONBin update failed");
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    console.log("✅ Image URL saved to JSONBin");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Server Error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
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
