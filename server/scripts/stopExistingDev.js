import { execSync } from "node:child_process";
import path from "node:path";

const port = Number(process.env.PORT) || 5000;
const cwd = process.cwd();

const safeExec = (cmd) => {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();
  } catch {
    return "";
  }
};

const getProjectNodemonPids = () => {
  try {
    if (process.platform === "win32") {
      const output = safeExec("wmic process where \"name='node.exe'\" get ProcessId,CommandLine /FORMAT:CSV");
      if (!output) return [];

      const projectToken = path.resolve(cwd).toLowerCase().replaceAll("/", "\\");

      const pids = output
        .split(/\r?\n/)
        .slice(1)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(","))
        .filter((parts) => parts.length >= 3)
        .map((parts) => ({
          commandLine: (parts[1] || "").toLowerCase(),
          pid: Number(parts[2])
        }))
        .filter((entry) => Number.isInteger(entry.pid) && entry.pid > 0 && entry.pid !== process.pid)
        .filter((entry) => entry.commandLine.includes("nodemon") && entry.commandLine.includes("server.js"))
        .filter((entry) => entry.commandLine.includes(projectToken))
        .map((entry) => entry.pid);

      return [...new Set(pids)];
    }

    const output = safeExec("pgrep -af nodemon");
    if (!output) return [];

    const projectToken = path.resolve(cwd);
    return [
      ...new Set(
        output
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [pidRaw, ...cmdParts] = line.split(" ");
            return { pid: Number(pidRaw), commandLine: cmdParts.join(" ") };
          })
          .filter((entry) => Number.isInteger(entry.pid) && entry.pid > 0 && entry.pid !== process.pid)
          .filter((entry) => entry.commandLine.includes("server.js") && entry.commandLine.includes(projectToken))
          .map((entry) => entry.pid)
      )
    ];
  } catch {
    return [];
  }
};

const getPidsUsingPort = (targetPort) => {
  try {
    if (process.platform === "win32") {
      const output = safeExec(`netstat -ano | findstr :${targetPort}`).trim();
      if (!output) return [];

      return [
        ...new Set(
          output
            .split(/\r?\n/)
            .map((line) => line.trim().split(/\s+/))
            .filter((parts) => parts.length >= 5)
            .filter((parts) => parts[1].endsWith(`:${targetPort}`) && parts[3] === "LISTENING")
            .map((parts) => Number(parts[4]))
            .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)
        )
      ];
    }

    const output = safeExec(`lsof -ti tcp:${targetPort}`).trim();
    if (!output) return [];

    return [
      ...new Set(
        output
          .split(/\r?\n/)
          .map((pid) => Number(pid))
          .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid)
      )
    ];
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

const staleNodemonPids = getProjectNodemonPids();
let killedNodemon = 0;
for (const pid of staleNodemonPids) {
  if (killPid(pid)) killedNodemon += 1;
}

const portPids = getPidsUsingPort(port);
let killedPortOwners = 0;
for (const pid of portPids) {
  if (killPid(pid)) killedPortOwners += 1;
}

if (killedNodemon > 0 || killedPortOwners > 0) {
  console.log(
    `Cleanup complete: killed ${killedNodemon} stale nodemon process(es), ${killedPortOwners} process(es) on port ${port}.`
  );
}
