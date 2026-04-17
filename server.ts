import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  try {
    const app = express();
    const PORT = 3000;

    app.use(express.json());

    // Database Pool (Neon) - Guarded initialization
    let pool: pg.Pool | null = null;
    if (process.env.DATABASE_URL) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    }

    // Database initialization (Optional/Demo)
    const initDb = async () => {
      if (!pool || !process.env.DATABASE_URL) {
        console.log("Database not configured. Operating in local-only mode.");
        return;
      }
      try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password TEXT NOT NULL DEFAULT 'password',
            role VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);
        console.log("Database synchronized successfully.");
        client.release();
      } catch (err) {
        console.warn("Database connection failed. Switching to mock mode.", err);
      }
    };
    initDb();

    // Mock database / state for simulation
    let simulationState = {
      isRunning: false,
      surgeIntensity: 0.5,
      hubs: [
        { id: 'CHD-SEC17', name: 'Sector 17 Hub', location: 'City Center', capacity: 10000, currentLoad: 3500, incomingRate: 15, processingRate: 18, status: 'green' },
        { id: 'CHD-IND1', name: 'Industrial Phase 1', location: 'Commercial Zone', capacity: 15000, currentLoad: 8500, incomingRate: 28, processingRate: 20, status: 'yellow' },
        { id: 'CHD-ITP', name: 'IT Park Node', location: 'Tech Corridor', capacity: 12000, currentLoad: 11000, incomingRate: 45, processingRate: 22, status: 'red' },
      ],
      warehouses: [
        { id: "wh-1", name: "Zirakpur Buffer A", location: "Zirakpur HW", capacity: 5000, price: 450, city: "Chandigarh", available: true },
        { id: "wh-2", name: "Mohali Logistics Hub", location: "Sector 62", capacity: 8000, price: 620, city: "Mohali", available: true },
        { id: "wh-3", name: "Panchkula Overflow", location: "Industrial Phase 2", capacity: 12000, price: 380, city: "Panchkula", available: false },
      ],
      logs: [
        { timestamp: new Date(), message: "System Initialized: Supply AI Intelligence Online", type: "info" }
      ]
    };

  // Simulation Loop
  const simulationInterval = setInterval(() => {
    if (!simulationState.isRunning) return;

    const baseSurge = simulationState.surgeIntensity * 2;
    
    simulationState.hubs = simulationState.hubs.map(hub => {
      // Logic for changing loads
      const flowIn = (hub.incomingRate * (1 + baseSurge)) + (Math.random() * 20);
      const flowOut = hub.processingRate + (Math.random() * 10);
      
      const nextLoad = Math.max(0, Math.min(hub.capacity * 1.5, hub.currentLoad + (flowIn - flowOut)));
      
      // Determine Status
      const loadRatio = nextLoad / hub.capacity;
      let nextStatus: 'green' | 'yellow' | 'red' = 'green';
      if (loadRatio > 0.9) nextStatus = 'red';
      else if (loadRatio > 0.7) nextStatus = 'yellow';

      // Logging alerts
      if (nextStatus === 'red' && hub.status !== 'red') {
        simulationState.logs.unshift({ 
          timestamp: new Date(), 
          message: `CRITICAL: ${hub.name} exceeded 90% capacity. Activating overflow protocols.`, 
          type: "error" 
        });
      } else if (nextStatus === 'yellow' && hub.status === 'green') {
        simulationState.logs.unshift({ 
          timestamp: new Date(), 
          message: `WARNING: ${hub.name} entering high-load state (>70%).`, 
          type: "warning" 
        });
      }

      return { 
        ...hub, 
        currentLoad: nextLoad, 
        status: nextStatus as any,
        incomingRate: Math.round(flowIn),
        processingRate: Math.round(flowOut)
      };
    });

    // Limit logs
    if (simulationState.logs.length > 50) simulationState.logs = simulationState.logs.slice(0, 50);

  }, 2000);

  // API Routes
  app.get("/api/state", (req, res) => {
    res.json(simulationState);
  });

  app.post("/api/simulation/toggle", (req, res) => {
    simulationState.isRunning = !simulationState.isRunning;
    simulationState.logs.unshift({ timestamp: new Date(), message: `Simulation ${simulationState.isRunning ? 'started' : 'stopped'}`, type: "info" });
    res.json({ success: true, isRunning: simulationState.isRunning });
  });

  app.post("/api/simulation/surge", (req, res) => {
    const { intensity } = req.body;
    simulationState.surgeIntensity = intensity;
    simulationState.logs.unshift({ timestamp: new Date(), message: `Global surge intensity adjusted to ${intensity * 100}%`, type: "warning" });
    res.json({ success: true });
  });

  // SQL Query Endpoint (Neon Management)
  // SQL Query Endpoint (Neon Management)
  app.post("/api/auth/signup", async (req, res) => {
    const { email, password, role } = req.body;
    if (!pool || !process.env.DATABASE_URL) {
      return res.status(500).json({ error: "DB not connected" });
    }
    try {
      await pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [email, password, role] // In production, hash this password!
      );
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message.includes('unique') ? 'Email already registered' : err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!pool || !process.env.DATABASE_URL) {
      return res.status(500).json({ error: "DB not connected" });
    }
    try {
      const result = await pool.query(
        'SELECT email, role FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );
      if (result.rows.length > 0) {
        res.json({ success: true, user: result.rows[0] });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/query", async (req, res) => {
    const { sql } = req.body;
    if (!pool || !process.env.DATABASE_URL) {
      return res.status(500).json({ error: "DATABASE_URL not configured. Please add it to your environment variables." });
    }
    
    try {
      const result = await pool.query(sql);
      res.json({ 
        rows: result.rows, 
        fields: result.fields?.map(f => f.name) || [],
        rowCount: result.rowCount 
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
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
  } catch (error) {
    console.error("CRITICAL: Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch(err => {
  console.error("FATAL: Unhandled rejection during startup:", err);
  process.exit(1);
});
