import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { productAPI } from "../api/endpoints";
import ImageSlider from "../components/ImageSlider";
import DOMPurify from "dompurify";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await productAPI.getByUrl(slug);
      setProduct(data);
      setMainImage(data.mainImage);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.productName,
          text: `Check out this product: ${product?.productName}`,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const handleImageChange = (image) => {
    let imageUrl;

    if (typeof image === "string") {
      imageUrl = image;
    } else if (image && typeof image === "object") {
      imageUrl = image.url || image;
    } else {
      return;
    }

    setMainImage(imageUrl);
  };

  const handleAddToCart = () => {
    alert(`${product?.productName} added to cart!`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            mt: 2,
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Product not found</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            mt: 2,
            bgcolor: "#2563eb",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const images = product.gallery || [];
  const finalPrice = product.discountedPrice || product.price;
  const discountPercent = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100,
      )
    : 0;

  return (
    <>
      {/* App Bar */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => navigate("/dashboard")}
            aria-label="go back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Product Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Image Slider */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <ImageSlider
                images={images.map((img) => ({
                  url: img.url || img,
                  alt: img.alt || "Product image",
                }))}
                mainImage={mainImage}
                onMainImageChange={handleImageChange}
              />
            </Paper>
          </Grid>

          {/* Right Column - Product Info */}
          <Grid item xs={12} md={6}>
            {/* Product Name and Status */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "#1a1a1a",
                }}
              >
                {product.productName}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}
              >
                <Chip
                  label={product.status}
                  color={
                    product.status === "active"
                      ? "success"
                      : product.status === "draft"
                        ? "warning"
                        : "error"
                  }
                  variant="filled"
                  size="small"
                />
                <Chip
                  label={product.category}
                  variant="outlined"
                  size="small"
                />
              </Box>

              {/* Rating */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Rating
                  value={4}
                  readOnly
                  size="small"
                  aria-label="product rating"
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  aria-label="number of reviews"
                >
                  (24 reviews)
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Pricing */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#1976d2",
                  }}
                  aria-label="product price"
                >
                  ${finalPrice.toFixed(2)}
                </Typography>
                {product.discountedPrice && (
                  <>
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: "line-through",
                        color: "textSecondary",
                      }}
                      aria-label="original price"
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Chip
                      label={`-${discountPercent}%`}
                      color="error"
                      size="small"
                      sx={{ fontWeight: 700 }}
                      aria-label="discount percentage"
                    />
                  </>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                Meta Title: {product.metaTitle}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                aria-label="add to cart"
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Add to Cart
              </Button>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                aria-label={
                  isFavorite ? "remove from favorites" : "add to favorites"
                }
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <IconButton
                onClick={handleShare}
                aria-label="share product"
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <ShareIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Creator Info */}
            {product.createdBy && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Seller Information
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Name:</strong> {product.createdBy.username}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Email:</strong> {product.createdBy.email}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Description Section */}
        <Paper sx={{ p: 4, mt: 4 }} elevation={1}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Description
          </Typography>
          <Box
            sx={{
              color: "textSecondary",
              lineHeight: 1.6,
              "& img": { maxWidth: "100%", height: "auto" },
              "& p": { mb: 1 },
              "& ul, & ol": { mb: 1, pl: 2 },
              "& li": { mb: 0.5 },
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description),
            }}
            aria-label="product description"
          />
        </Paper>

        {/* Product Details Grid */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "#666" }}
              >
                Product URL
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  color: "#1976d2",
                  fontSize: "0.9rem",
                }}
              >
                {product.productUrl}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "#666" }}
              >
                Category
              </Typography>
              <Chip
                label={product.category}
                color="primary"
                variant="outlined"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "#666" }}
              >
                Status
              </Typography>
              <Chip
                label={product.status}
                color={
                  product.status === "active"
                    ? "success"
                    : product.status === "draft"
                      ? "warning"
                      : "error"
                }
                variant="filled"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "#666" }}
              >
                Original Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#666" }}>
                ${product.price.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>

          {product.discountedPrice && (
            <Grid item xs={12} sm={6} md={4}>
              <Paper sx={{ p: 2, bgcolor: "#e3f2fd" }} elevation={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1, color: "#1976d2" }}
                >
                  Discounted Price
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1976d2" }}
                  >
                    ${product.discountedPrice.toFixed(2)}
                  </Typography>
                  <Chip
                    label={`Save ${discountPercent}%`}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2 }} elevation={1}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "#666" }}
              >
                Gallery Images
              </Typography>
              <Typography variant="body2" sx={{ color: "#1976d2" }}>
                {product.gallery?.length || 0} images available
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Product URL */}
        <Paper sx={{ p: 2, mt: 3, bgcolor: "#f5f5f5" }} elevation={0}>
          <Typography variant="body2" color="textSecondary">
            <strong>Meta Title:</strong> {product.metaTitle}
          </Typography>
        </Paper>
      </Container>
    </>
  );
}
