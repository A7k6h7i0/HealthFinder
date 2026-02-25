import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = Number(process.env.PORT) || 5000;
const IS_PROD = process.env.NODE_ENV === "production";

const getPidsUsingPort = (port) => {
  try {
    if (process.platform === "win32") {
      const output = execSync(`netstat -ano | findstr :${port}`, { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim();

      if (!output) return [];

      const pids = output
        .split(/\r?\n/)
        .map((line) => line.trim().split(/\s+/))
        .filter((parts) => parts.length >= 5)
        .filter((parts) => parts[1].endsWith(`:${port}`) && parts[3] === "LISTENING")
        .map((parts) => Number(parts[4]))
        .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);

      return [...new Set(pids)];
    }

    const output = execSync(`lsof -ti tcp:${port}`, { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();

    if (!output) return [];

    return [...new Set(output.split(/\r?\n/).map((pid) => Number(pid)).filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid))];
  } catch {
    return [];
  }
};

const killPid = (pid) => {
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    } else {
      process.kill(pid, "SIGKILL");
    }
    return true;
  } catch {
    return false;
  }
};

const freePort = (port) => {
  const pids = getPidsUsingPort(port);
  if (!pids.length) return false;

  let killedAny = false;
  for (const pid of pids) {
    if (killPid(pid)) killedAny = true;
  }

  return killedAny;
};

const startServer = (hasRetried = false) => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && !IS_PROD && !hasRetried) {
      console.warn(`Port ${PORT} is in use. Attempting to free it and restart server...`);
      const freed = freePort(PORT);

      if (freed) {
        setTimeout(() => startServer(true), 400);
        return;
      }
    }

    console.error(`Failed to start server on port ${PORT}:`, error.message);
    process.exit(1);
  });
};

connectDB();
startServer();
