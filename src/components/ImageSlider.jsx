import { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, ZoomIn } from "@mui/icons-material";

export default function ImageSlider({ images, mainImage, onMainImageChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (mainImage && images && images.length > 0) {
      const index = images.findIndex((img) => (img.url || img) === mainImage);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [mainImage, images]);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const selectedImage = images[newIndex];
    if (selectedImage) {
      const imageUrl = selectedImage.url || selectedImage;
      onMainImageChange?.(imageUrl);
    }
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    const selectedImage = images[newIndex];
    if (selectedImage) {
      const imageUrl = selectedImage.url || selectedImage;
      onMainImageChange?.(imageUrl);
    }
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    const selectedImage = images[index];
    if (selectedImage) {
      const imageUrl = selectedImage.url || selectedImage;
      onMainImageChange?.(imageUrl);
    }
  };

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "#f0f0f0",
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          border: "2px dashed #ccc",
        }}
      >
        <Typography color="textSecondary">No images available</Typography>
      </Box>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <Box>
      {/* Main Image Display */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 400,
          bgcolor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          src={mainImage || currentImage?.url || currentImage}
          alt={currentImage?.alt || "Product image"}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            transition: "transform 0.3s ease",
            transform: isZoomed ? "scale(1.1)" : "scale(1)",
          }}
          onError={(e) => {
            e.target.src = currentImage?.url || currentImage;
          }}
        />

        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              aria-label="previous image"
              sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                width: 45,
                height: 45,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              aria-label="next image"
              sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                width: 45,
                height: 45,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.8)",
                  transform: "translateY(-50%) scale(1.1)",
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              bgcolor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              px: 2,
              py: 1,
              borderRadius: 1,
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>
        )}

        {/* Zoom Icon */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            p: 1,
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: "0.85rem",
          }}
        >
          <ZoomIn sx={{ fontSize: 18 }} />
          Hover to zoom
        </Box>
      </Box>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="body2"
            sx={{ mb: 1, fontWeight: 700, color: "#666" }}
          >
            Gallery ({images.length} images)
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              overflowX: "auto",
              paddingBottom: 1,
              pb: 1.5,
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "#f0f0f0",
                borderRadius: 1,
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#bbb",
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "#999",
                },
              },
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                onClick={() => handleImageClick(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleImageClick(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Select image ${index + 1} of ${images.length}`}
                aria-current={currentIndex === index}
                sx={{
                  cursor: "pointer",
                  flex: "0 0 90px",
                  height: 90,
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    currentIndex === index
                      ? "3px solid #1976d2"
                      : "2px solid #ddd",
                  borderRadius: 1,
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#1976d2",
                    transform: "scale(1.05)",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  },
                  "&:focus": {
                    outline: "2px solid #1976d2",
                    outlineOffset: "2px",
                  },
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Product thumbnail ${index + 1}`}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  loading="lazy"
                />
                {currentIndex === index && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      bgcolor: "rgba(25, 118, 210, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Image Info */}
      {currentImage?.alt && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "#f9f9f9",
            borderRadius: 1,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            <strong>Image:</strong> {currentImage.alt}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
