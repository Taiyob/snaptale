"use client";

import { CldUploadButton } from "next-cloudinary";

export default function UploadClient() {
  const handleUpload = async (result: any) => {
    const imageUrl = result?.info?.secure_url;

    if (!imageUrl) return;

    // ✅ Send image URL to save API
    fetch("/api/saveImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl:
          "https://res.cloudinary.com/dxvxccb0y/image/upload/v1744994750/onncrxg3f2hg4uf3xz7z.webp",
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <h3>Upload Image</h3>
      <CldUploadButton
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleUpload}
      />
    </div>
  );
}
