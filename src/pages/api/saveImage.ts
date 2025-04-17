import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "public", "gallery.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { images } = req.body;
    console.log("Received image URLs:", images);

    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid images array" });
    }

    try {
      let existingImages: string[] = [];

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        existingImages = JSON.parse(fileContent);
      }

      const updatedImages = [...images, ...existingImages];

      fs.writeFileSync(filePath, JSON.stringify(updatedImages, null, 2));

      return res
        .status(200)
        .json({ message: "Images saved", images: updatedImages });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to save images", error: err });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
