"use client";

import { CldUploadButton } from "next-cloudinary";

export default function UploadClient() {
  const handleUpload = async (result: any) => {
    const imageUrl = result?.info?.secure_url;
    if (!imageUrl) return;

    const res = await fetch("/api/saveImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }), // ✅ correct key
    });

    const data = await res.json();
    console.log("✅ JSONBin response:", data);
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
