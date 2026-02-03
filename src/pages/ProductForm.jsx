import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { productAPI } from "../api/endpoints";
import ImageUpload from "../components/ImageUpload";

const CATEGORY_OPTIONS = [
  "mobile",
  "electronics",
  "fashion",
  "home",
  "books",
  "other",
];

const STATUS_OPTIONS = ["draft", "active", "inactive"];

const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    productName: "",
    metaTitle: "",
    productUrl: "",
    price: "",
    discountedPrice: "",
    description: "",
    mainImage: "",
    category: "",
    gallery: [],
    status: "",
  });

  const [galleryInputs, setGalleryInputs] = useState([""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await productAPI.getById(id);
      setFormData({
        ...data,
        discountedPrice: data.discountedPrice || "",
      });
      setGalleryInputs(data.gallery?.map((g) => g.url) || [""]);
    } catch {
      setError("Failed to fetch product");
    } finally {
      setFetchLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "productName" && !isEdit) {
      const generatedSlug = generateSlug(value);
      setFormData({
        ...formData,
        [name]: value,
        productUrl: generatedSlug,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      formData.discountedPrice &&
      Number(formData.discountedPrice) >= Number(formData.price)
    ) {
      return setError("Discounted price must be less than the original price");
    }

    if (!isValidUrl(formData.mainImage)) {
      return setError("Main image must be a valid URL");
    }

    if (galleryInputs.filter(Boolean).length === 0) {
      return setError("At least one gallery image is required");
    }

    const gallery = galleryInputs.filter(Boolean).map((url) => ({ url }));

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountedPrice: formData.discountedPrice
          ? Number(formData.discountedPrice)
          : null,
        gallery,
        status: formData.status || "draft",
      };

      isEdit
        ? await productAPI.update(id, payload)
        : await productAPI.create(payload);

      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Failed to save product";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        if (Array.isArray(err.response.data.errors)) {
          errorMessage = err.response.data.errors
            .map((e) => e.msg || e.message || String(e))
            .join(", ");
        } else {
          errorMessage = err.response.data.errors;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            onClick={() => navigate("/dashboard")}
            sx={{
              mr: 2,
              bgcolor: "#2563eb",
              color: "white",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            ← Dashboard
          </Button>
          <Typography variant="h4" sx={{ flex: 1 }}>
            {isEdit ? "Edit Product" : "Add Product"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product URL Slug"
                name="productUrl"
                value={formData.productUrl}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                  displayEmpty
                >
                  <MenuItem value="" disabled></MenuItem>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                  displayEmpty
                >
                  <MenuItem value="" disabled></MenuItem>
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Discounted Price"
                type="number"
                name="discountedPrice"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                error={
                  formData.discountedPrice &&
                  Number(formData.discountedPrice) >= Number(formData.price)
                }
                helperText={
                  formData.discountedPrice &&
                  Number(formData.discountedPrice) >= Number(formData.price)
                    ? "Must be less than original price"
                    : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Main Product Image
              </Typography>
              <Box sx={{ mb: 2 }}>
                <ImageUpload
                  onImageUpload={(url) =>
                    setFormData({ ...formData, mainImage: url })
                  }
                  label="Upload Main Image"
                />
              </Box>
              {formData.mainImage && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Preview:
                  </Typography>
                  <Box
                    component="img"
                    src={formData.mainImage}
                    alt="Main Image Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                </Box>
              )}
              <TextField
                fullWidth
                label="Or paste image URL"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleInputChange}
                size="small"
                helperText="You can paste a direct image URL as alternative"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Description (Rich Text Editor)
              </Typography>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  "& .ck-editor__main": {
                    minHeight: "300px",
                  },
                }}
              >
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.description}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFormData({ ...formData, description: data });
                  }}
                  config={{
                    toolbar: {
                      items: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "|",
                        "undo",
                        "redo",
                      ],
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Gallery Images
              </Typography>
              {galleryInputs.map((url, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Gallery Image {i + 1}
                    </Typography>
                    {i > 0 && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setGalleryInputs(
                            galleryInputs.filter((_, idx) => idx !== i),
                          );
                        }}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <ImageUpload
                      onImageUpload={(imageUrl) => {
                        const copy = [...galleryInputs];
                        copy[i] = imageUrl;
                        setGalleryInputs(copy);
                      }}
                      label="Upload Gallery Image"
                    />
                  </Box>

                  {url && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{ display: "block", mb: 1 }}
                      >
                        Preview:
                      </Typography>
                      <Box
                        component="img"
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          borderRadius: 1,
                          border: "1px solid #e0e0e0",
                        }}
                      />
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    value={url}
                    label="Or paste image URL"
                    placeholder="Enter image URL"
                    onChange={(e) => {
                      const copy = [...galleryInputs];
                      copy[i] = e.target.value;
                      setGalleryInputs(copy);
                    }}
                    size="small"
                  />
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={() => setGalleryInputs([...galleryInputs, ""])}
                sx={{
                  mt: 1,
                  bgcolor: "#2563eb",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                Add Image
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    flex: 1,
                    bgcolor: "#2563eb",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Save Product"
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    py: 1.5,
                    borderColor: "#2563eb",
                    color: "#2563eb",
                    "&:hover": {
                      bgcolor: "#eff6ff",
                      borderColor: "#1d4ed8",
                      color: "#1d4ed8",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
