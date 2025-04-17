// export const handleUploadImages = async (
//   files: FileList,
//   setImages: React.Dispatch<React.SetStateAction<string[]>>,
//   setUploading?: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   if (setUploading) setUploading(true);

//   const uploadedImages: string[] = [];

//   for (const file of Array.from(files)) {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append(
//       "upload_preset",
//       process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
//     );

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     const data = await res.json();
//     uploadedImages.push(data.secure_url);
//   }

//   await fetch("/api/saveImage", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ images: uploadedImages }),
//   });

//   setImages((prev) => [...uploadedImages, ...prev]);

//   if (setUploading) setUploading(false);
// };

export const handleUploadImages = async (
  files: FileList,
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  setUploading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setUploading) setUploading(true);

  const uploadedImages: string[] = [];

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Missing Cloudinary credentials");
    if (setUploading) setUploading(false);
    return;
  }

  for (const file of Array.from(files)) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("tags", "gallery");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        uploadedImages.push(data.secure_url);
      } else {
        console.error("Failed upload response:", data);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  // Update UI only
  setImages((prev) => [...uploadedImages, ...prev]);

  if (setUploading) setUploading(false);
};

export const handleDeleteImage = async (
  imageUrl: string,
  setImages: React.Dispatch<React.SetStateAction<string[]>>,
  handleClose: () => void,
  setConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    await fetch("/api/deleteImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    });

    setImages((prev) => prev.filter((img) => img !== imageUrl));
    setConfirmOpen(false);
    handleClose();
  } catch (err) {
    console.error("Failed to delete image:", err);
  }
};
