import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import { productAPI } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const StatCard = ({ label, value, icon, color }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
        border: `1px solid ${color}40`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 24px ${color}30`,
          border: `1px solid ${color}80`,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 40, opacity: 0.2 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case "draft":
        return <ScheduleIcon sx={{ fontSize: 20 }} />;
      case "inactive":
        return <BlockIcon sx={{ fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const response = await productAPI.getAll(params);
      setProducts(response.data.products);

      const uniqueCategories = [
        ...new Set(response.data.products.map((p) => p.category)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;

    try {
      await productAPI.delete(deleteDialog.id);
      setProducts(products.filter((p) => p._id !== deleteDialog.id));
      setDeleteDialog({ open: false, id: null });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    draft: products.filter((p) => p.status === "draft").length,
    inactive: products.filter((p) => p.status === "inactive").length,
  };

  if (loading && products.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f8f9fa",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="textSecondary">
            Loading your dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Product Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.username}
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => navigate("/product/add")}
              sx={{
                bgcolor: "rgba(255,255,255,0.15)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              }}
            >
              Add Product
            </Button>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        {/* Breadcrumb */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <DashboardIcon sx={{ fontSize: 20, color: "#1976d2" }} />
          <Typography variant="body2" color="textSecondary">
            Dashboard
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Total Products"
              value={stats.total}
              icon="📦"
              color="#1976d2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Active"
              value={stats.active}
              icon={<CheckCircleIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Draft"
              value={stats.draft}
              icon={<ScheduleIcon />}
              color="#ff9800"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              label="Inactive"
              value={stats.inactive}
              icon={<BlockIcon />}
              color="#f44336"
            />
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
            Filters & Search
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#999" }} />
                    </InputAdornment>
                  ),
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    bgcolor: "#f5f5f5",
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 3 }}>
              <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
                <Button
                  fullWidth
                  size="small"
                  variant={viewMode === "grid" ? "contained" : "outlined"}
                  onClick={() => setViewMode("grid")}
                  sx={{ borderRadius: 1.5 }}
                >
                  Grid
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant={viewMode === "table" ? "contained" : "outlined"}
                  onClick={() => setViewMode("table")}
                  sx={{ borderRadius: 1.5 }}
                >
                  Table
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <Grid container spacing={3}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      border: "1px solid #e0e0e0",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                        "& .card-image": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        height: 200,
                        bgcolor: "#f5f5f5",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.mainImage}
                        alt={product.productName}
                        className="card-image"
                        sx={{
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                        }}
                      />
                      <Chip
                        icon={getStatusIcon(product.status)}
                        label={product.status}
                        color={getStatusColor(product.status)}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                        }}
                      />
                      {product.discountedPrice &&
                        Number(product.price) >
                          Number(product.discountedPrice) && (
                          <Chip
                            label={`${Math.floor(
                              ((Number(product.price) -
                                Number(product.discountedPrice)) /
                                Number(product.price)) *
                                100,
                            )}% OFF`}
                            sx={{
                              position: "absolute",
                              bottom: 12,
                              right: 12,
                              bgcolor: "#ff5252",
                              color: "white",
                              fontWeight: 700,
                            }}
                          />
                        )}
                    </Box>
                    <CardContent sx={{ flex: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        {product.productName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 1.5 }}
                      >
                        {product.category}
                      </Typography>
                      <Box sx={{ mb: 1.5 }}>
                        {product.discountedPrice ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "#999",
                              }}
                            >
                              ${product.price.toFixed(2)}
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{ color: "#4caf50", fontWeight: 700 }}
                            >
                              ${product.discountedPrice.toFixed(2)}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography
                            variant="h6"
                            sx={{ color: "#4caf50", fontWeight: 700 }}
                          >
                            ${product.price.toFixed(2)}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ pt: 0, gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() =>
                          navigate(`/product/${product.productUrl}`)
                        }
                        fullWidth
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/product/edit/${product._id}`)}
                        fullWidth
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() =>
                          setDeleteDialog({ open: true, id: product._id })
                        }
                      >
                        <DeleteIcon />
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 6,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No products found
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        ) : (
          /* Table View */
          <Paper
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      color: "white",
                    }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: 700 }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 700 }}>
                      Category
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 700 }}>
                      Status
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "white", fontWeight: 700 }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, idx) => (
                      <TableRow
                        key={product._id}
                        sx={{
                          bgcolor: idx % 2 === 0 ? "#fafafa" : "white",
                          transition: "bgcolor 0.2s ease",
                          "&:hover": {
                            bgcolor: "#f0f7ff",
                          },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                            }}
                          >
                            <CardMedia
                              component="img"
                              src={product.mainImage}
                              alt={product.productName}
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 1,
                                objectFit: "contain",
                                bgcolor: "#f5f5f5",
                              }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 700 }}>
                                {product.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {product.productUrl}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell align="right">
                          <Box>
                            {product.discountedPrice ? (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: "line-through",
                                    color: "#999",
                                  }}
                                >
                                  ${product.price.toFixed(2)}
                                </Typography>
                                <Typography
                                  sx={{ color: "#4caf50", fontWeight: 700 }}
                                >
                                  ${product.discountedPrice.toFixed(2)}
                                </Typography>
                              </>
                            ) : (
                              <Typography sx={{ fontWeight: 700 }}>
                                ${product.price.toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(product.status)}
                            label={product.status}
                            color={getStatusColor(product.status)}
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            onClick={() =>
                              navigate(`/product/${product.productUrl}`)
                            }
                            startIcon={<ViewIcon />}
                            sx={{ mr: 1 }}
                          >
                            View
                          </Button>
                          <Button
                            size="small"
                            color="success"
                            onClick={() =>
                              navigate(`/product/edit/${product._id}`)
                            }
                            startIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteDialog({ open: true, id: product._id })
                            }
                            startIcon={<DeleteIcon />}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="textSecondary">
                          No products found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, id: null })}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
