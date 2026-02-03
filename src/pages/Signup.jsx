import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  InputAdornment,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/endpoints";

const getPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return strength;
};

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateUsername = (value) => {
    if (!value) {
      setUsernameError("Username is required");
      return false;
    } else if (value.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    } else if (!/[a-z]/.test(value)) {
      setPasswordError("Password must contain lowercase letters");
      return false;
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Password must contain uppercase letters");
      return false;
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Password must contain numbers");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !validateUsername(username) ||
      !validateEmail(email) ||
      !validatePassword(password) ||
      !validateConfirmPassword(confirmPassword)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({ username, email, password });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        setError(errors.map((e) => e.msg).join(", "));
      } else {
        setError(
          err.response?.data?.message || "Signup failed. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = [
    "Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];
  const strengthColors = [
    "#ff6b6b",
    "#ff6b6b",
    "#ffa94d",
    "#4dabf7",
    "#51cf66",
    "#37b24d",
  ];

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /[0-9]/.test(password) },
    { label: "Contains special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        padding: "20px",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={20}
          sx={{
            borderRadius: "24px",
            padding: { xs: "24px", sm: "40px", md: "48px" },
            background: "#ffffff",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                mb: 2,
              }}
            >
              <Person sx={{ color: "white", fontSize: "32px" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: { xs: "28px", sm: "32px" },
              }}
            >
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontSize: { xs: "14px", sm: "16px" },
              }}
            >
              Join our product management system
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                border: "1px solid #ffebee",
                backgroundColor: "#ffebee",
                color: "#c62828",
                "& .MuiAlert-icon": {
                  color: "#c62828",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Username
              </Typography>
              <TextField
                fullWidth
                placeholder="Choose a username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsername(e.target.value);
                }}
                onBlur={() => validateUsername(username)}
                disabled={isLoading}
                error={!!usernameError}
                helperText={usernameError}
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#1976d2", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f7ff",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f0f2ff",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                      borderColor: "#1976d2",
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b6b",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Email Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="your.email@example.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                disabled={isLoading}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#1976d2", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f7ff",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f0f2ff",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                      borderColor: "#1976d2",
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b6b",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                disabled={isLoading}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#1976d2", mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ mr: -1 }}
                      >
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color: "#1976d2", fontSize: "20px" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ color: "#1976d2", fontSize: "20px" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f7ff",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f0f2ff",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                      borderColor: "#1976d2",
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b6b",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Password Strength Indicator */}
            {password && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "#f9fafb",
                  borderRadius: "12px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: "#666" }}
                  >
                    Password Strength
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: strengthColors[passwordStrength - 1] || "#ff6b6b",
                    }}
                  >
                    {strengthLabels[passwordStrength - 1]}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength / 5) * 100}
                  sx={{
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        strengthColors[passwordStrength - 1] || "#ff6b6b",
                      borderRadius: "3px",
                    },
                  }}
                />
                <Box sx={{ mt: 2 }}>
                  {passwordRequirements.map((req, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: "12px",
                        color: req.met ? "#51cf66" : "#999",
                        mb: 0.5,
                      }}
                    >
                      <CheckCircle sx={{ fontSize: "14px" }} />
                      {req.label}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Confirm Password Field */}
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1976d2",
                  mb: 1,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                disabled={isLoading}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                autoComplete="new-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#1976d2", mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ mr: -1 }}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff
                            sx={{ color: "#1976d2", fontSize: "20px" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ color: "#1976d2", fontSize: "20px" }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f5f7ff",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f0f2ff",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#fff",
                      borderColor: "#1976d2",
                      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b6b",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "#999",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* Create Account Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                py: 1.5,
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                textTransform: "none",
                mb: 2,
                transition: "all 0.3s ease",
                "&:hover:not(:disabled)": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                },
                "&:active:not(:disabled)": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            <Divider
              sx={{ my: 2, "&::before, &::after": { borderColor: "#e0e0e0" } }}
            >
              <Typography variant="caption" sx={{ color: "#999" }}>
                OR
              </Typography>
            </Divider>

            {/* Sign In Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                Already have an account?
              </Typography>
              <Link
                to="/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#1565c0")}
                onMouseLeave={(e) => (e.target.style.color = "#1976d2")}
              >
                Sign in here →
              </Link>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
