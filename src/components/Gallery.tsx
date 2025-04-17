"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import styles from "../app/page.module.css";
import { Button } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { handleUploadImages, handleDeleteImage } from "@/utils/galleryHandlers";
import ImageModal from "@/components/ImageModal";
import DeleteDialog from "@/components/DeleteDialog";

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = (src: string) => {
    setSelectedImage(src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleUploadImages(files, setImages, setUploading);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedImage) {
      handleDeleteImage(selectedImage, setImages, handleClose, setConfirmOpen);
    }
  };

  // useEffect(() => {
  //   const fetchImages = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/gallery.json");
  //       if (!res.ok) {
  //         console.warn("Failed to load gallery.json");
  //         return;
  //       }
  //       const data = await res.json();
  //       setImages(data.reverse());
  //     } catch (error) {
  //       console.error("Error reading gallery.json:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchImages();
  // }, []);
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/getImages");
        const data = await res.json();
        setImages(data.images);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className={styles.page}>
      <main>
        <div className={styles.navbar}>
          <Navbar />
        </div>

        <div className={styles.background}>
          <div className={styles.home}>
            <FileUploadOutlinedIcon className={styles.upload} />

            {uploading ? (
              <>
                <h2>Uploading Images...</h2>
                <div className={styles.spinner}></div>
              </>
            ) : (
              <>
                <h2>Give your mindfreshing image to Upload</h2>
                <h3></h3>
                <Button variant="contained" component="label">
                  Select Images to Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleUpload}
                  />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className={styles.galleryWrapper}>
          <div className={styles.galleryImage}>
            {loading ? (
              <div className={styles.loaderContainer}>
                <h3>Loading gallery...</h3>
                <div className={styles.spinner}></div>
              </div>
            ) : images.length === 0 ? (
              <p style={{ textAlign: "center" }}>No images found.</p>
            ) : (
              images.map((src, index) => (
                <div
                  key={index}
                  onClick={() => handleOpen(src)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    className={styles.image}
                    src={src}
                    alt={`Gallery image ${index}`}
                    width={390}
                    height={380}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <ImageModal
        open={open}
        onClose={handleClose}
        selectedImage={selectedImage}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteDialog
        open={confirmOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <Footer />
    </div>
  );
}
