import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "public", "gallery.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ message: "Invalid image URL" });
    }

    try {
      let images: string[] = [];

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        images = JSON.parse(content);
      }

      const updatedImages = images.filter((img) => img !== image);

      fs.writeFileSync(filePath, JSON.stringify(updatedImages, null, 2));

      return res
        .status(200)
        .json({ message: "Image deleted", images: updatedImages });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to delete image", error: err });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
