import type { NextApiRequest, NextApiResponse } from "next";

type CloudinaryImage = {
  secure_url: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({ message: "Cloudinary credentials missing" });
  }

  const basicAuth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

  try {
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/tags/gallery?max_results=100`,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    const data = await cloudinaryRes.json();

    const images = (data.resources as CloudinaryImage[]).map(
      (img) => img.secure_url
    );

    res.status(200).json({ images: images.reverse() });
  } catch (err) {
    console.error("Cloudinary fetch failed", err);
    res.status(500).json({ message: "Cloudinary fetch failed", error: err });
  }
}
