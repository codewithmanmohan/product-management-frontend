import { useState, useRef } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { uploadAPI } from "../api/endpoints";

export default function ImageUpload({ onImageUpload, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef();

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadAPI.uploadImage(formData);

      if (response.data?.url) {
        onImageUpload(response.data.url);
        setSuccess("Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to get image URL from response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={uploading}
      />

      <Button
        onClick={handleButtonClick}
        disabled={uploading}
        startIcon={
          uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />
        }
        sx={{
          bgcolor: "#2563eb",
          color: "white",
          borderRadius: 2,
          fontWeight: 600,
          padding: "10px 20px",
          textTransform: "none",
          fontSize: "16px",
          "&:hover": { bgcolor: "#1d4ed8" },
          "&:disabled": { bgcolor: "#93c5fd", color: "white" },
        }}
      >
        {uploading ? "Uploading..." : label}
      </Button>
    </Box>
  );
}
