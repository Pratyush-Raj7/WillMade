const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
const analyzeRoute = require("./routes/analyze");
app.use("/api", analyzeRoute);

const { router: schemesRouter } = require("./routes/schemes"); // ✅ fixed
app.use("/api/schemes", schemesRouter);

const propertyRoute = require("./routes/property");
app.use("/api", propertyRoute);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "Nyaya Mitra API is running",
    version: "1.0.0",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
