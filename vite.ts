import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Try multiple possible locations for index.html
      const possiblePaths = [
        path.resolve(import.meta.dirname, "../../client/index.html"),
        path.resolve(import.meta.dirname, "../../dist/public/index.html"),
        "/home/ubuntu/powerbi-academy-improved/client/index.html",
        "/home/ubuntu/powerbi-academy-improved/dist/public/index.html",
      ];
      
      let resolvedPath = null;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          resolvedPath = p;
          break;
        }
      }
      
      if (!resolvedPath) {
        console.error(`Could not find index.html in any of these locations: ${possiblePaths.join(", ")}`);
        return res.status(500).send("Could not find index.html");
      }

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(resolvedPath, "utf-8");
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // Try multiple possible locations for dist directory
  const possibleDistPaths = [
    path.resolve(import.meta.dirname, "../../dist/public"),
    "/home/ubuntu/powerbi-academy-improved/dist/public",
  ];
  
  let distPath = null;
  for (const p of possibleDistPaths) {
    if (fs.existsSync(p)) {
      distPath = p;
      break;
    }
  }
  
  if (!distPath) {
    console.error(
      `Could not find the build directory. Tried: ${possibleDistPaths.join(", ")}. Make sure to build the client first.`
    );
    distPath = possibleDistPaths[0]; // Use first path as fallback
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

