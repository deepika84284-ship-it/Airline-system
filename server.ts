import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SkyStream Airlines API is running" });
  });

  // Sample data endpoint for flights (could be used for seeding)
  app.get("/api/flights/seed", (req, res) => {
    const sampleFlights = [
      {
        flightNumber: "SS101",
        airline: "SkyStream",
        source: "New York",
        destination: "London",
        departureTime: "2026-04-20T10:00:00Z",
        arrivalTime: "2026-04-20T22:00:00Z",
        price: 450,
        availableSeats: 120,
        totalSeats: 150
      },
      {
        flightNumber: "SS202",
        airline: "SkyStream",
        source: "London",
        destination: "Paris",
        departureTime: "2026-04-21T08:00:00Z",
        arrivalTime: "2026-04-21T09:30:00Z",
        price: 120,
        availableSeats: 80,
        totalSeats: 100
      },
      {
        flightNumber: "SS303",
        airline: "SkyStream",
        source: "Paris",
        destination: "Tokyo",
        departureTime: "2026-04-22T14:00:00Z",
        arrivalTime: "2026-04-23T09:00:00Z",
        price: 850,
        availableSeats: 200,
        totalSeats: 250
      }
    ];
    res.json(sampleFlights);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
