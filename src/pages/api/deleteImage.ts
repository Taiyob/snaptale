import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { image } = req.body;

  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({ message: "Missing Cloudinary credentials" });
  }

  try {
    const url = new URL(image);
    const publicId = url.pathname
      .split("/")
      .slice(3)
      .join("/")
      .replace(/\.[^/.]+$/, ""); // removes extension

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`,
      {
        method: "DELETE",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_ids: [publicId] }),
      }
    );

    const data = await cloudinaryRes.json();

    return res.status(200).json({ message: "Image deleted", result: data });
  } catch (err) {
    console.error("Delete failed", err);
    return res
      .status(500)
      .json({ message: "Failed to delete image", error: err });
  }
}

// import fs from "fs";
// import path from "path";
// import { NextApiRequest, NextApiResponse } from "next";

// const filePath = path.join(process.cwd(), "public", "gallery.json");

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { image } = req.body;

//     if (!image || typeof image !== "string") {
//       return res.status(400).json({ message: "Invalid image URL" });
//     }

//     try {
//       let images: string[] = [];

//       if (fs.existsSync(filePath)) {
//         const content = fs.readFileSync(filePath, "utf-8");
//         images = JSON.parse(content);
//       }

//       const updatedImages = images.filter((img) => img !== image);

//       fs.writeFileSync(filePath, JSON.stringify(updatedImages, null, 2));

//       return res
//         .status(200)
//         .json({ message: "Image deleted", images: updatedImages });
//     } catch (err) {
//       return res
//         .status(500)
//         .json({ message: "Failed to delete image", error: err });
//     }
//   }

//   return res.status(405).json({ message: "Method not allowed" });
// }
