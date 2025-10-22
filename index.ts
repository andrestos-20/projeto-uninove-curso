Text file: index.ts
Latest content with line numbers:
1	import express from "express";
2	import { createServer } from "http";
3	import path from "path";
4	import { fileURLToPath } from "url";
5	
6	const __filename = fileURLToPath(import.meta.url);
7	const __dirname = path.dirname(__filename);
8	
9	async function startServer() {
10	  const app = express();
11	  const server = createServer(app);
12	
13	  // Serve static files from dist/public in production
14	  const staticPath =
15	    process.env.NODE_ENV === "production"
16	      ? path.resolve(__dirname, "public")
17	      : path.resolve(__dirname, "..", "dist", "public");
18	
19	  app.use(express.static(staticPath));
20	
21	  // Handle client-side routing - serve index.html for all routes
22	  app.get("*", (_req, res) => {
23	    res.sendFile(path.join(staticPath, "index.html"));
24	  });
25	
26	  const port = process.env.PORT || 3000;
27	
28	  server.listen(port, () => {
29	    console.log(`Server running on http://localhost:${port}/`);
30	  });
31	}
32	
33	startServer().catch(console.error);
34	