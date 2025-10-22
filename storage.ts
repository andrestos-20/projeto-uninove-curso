Text file: storage.ts
Latest content with line numbers:
1	// Preconfigured storage helpers for Manus WebDev templates
2	// Uses the Biz-provided storage proxy (Authorization: Bearer <token>)
3	
4	import { ENV } from './_core/env';
5	
6	type StorageConfig = { baseUrl: string; apiKey: string };
7	
8	function getStorageConfig(): StorageConfig {
9	  const baseUrl = ENV.forgeApiUrl;
10	  const apiKey = ENV.forgeApiKey;
11	
12	  if (!baseUrl || !apiKey) {
13	    throw new Error(
14	      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
15	    );
16	  }
17	
18	  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
19	}
20	
21	function buildUploadUrl(baseUrl: string, relKey: string): URL {
22	  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
23	  url.searchParams.set("path", normalizeKey(relKey));
24	  return url;
25	}
26	
27	async function buildDownloadUrl(
28	  baseUrl: string,
29	  relKey: string,
30	  apiKey: string
31	): Promise<string> {
32	  const downloadApiUrl = new URL(
33	    "v1/storage/downloadUrl",
34	    ensureTrailingSlash(baseUrl)
35	  );
36	  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
37	  const response = await fetch(downloadApiUrl, {
38	    method: "GET",
39	    headers: buildAuthHeaders(apiKey),
40	  });
41	  return (await response.json()).url;
42	}
43	
44	function ensureTrailingSlash(value: string): string {
45	  return value.endsWith("/") ? value : `${value}/`;
46	}
47	
48	function normalizeKey(relKey: string): string {
49	  return relKey.replace(/^\/+/, "");
50	}
51	
52	function toFormData(
53	  data: Buffer | Uint8Array | string,
54	  contentType: string,
55	  fileName: string
56	): FormData {
57	  const blob =
58	    typeof data === "string"
59	      ? new Blob([data], { type: contentType })
60	      : new Blob([data as any], { type: contentType });
61	  const form = new FormData();
62	  form.append("file", blob, fileName || "file");
63	  return form;
64	}
65	
66	function buildAuthHeaders(apiKey: string): HeadersInit {
67	  return { Authorization: `Bearer ${apiKey}` };
68	}
69	
70	export async function storagePut(
71	  relKey: string,
72	  data: Buffer | Uint8Array | string,
73	  contentType = "application/octet-stream"
74	): Promise<{ key: string; url: string }> {
75	  const { baseUrl, apiKey } = getStorageConfig();
76	  const key = normalizeKey(relKey);
77	  const uploadUrl = buildUploadUrl(baseUrl, key);
78	  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
79	  const response = await fetch(uploadUrl, {
80	    method: "POST",
81	    headers: buildAuthHeaders(apiKey),
82	    body: formData,
83	  });
84	
85	  if (!response.ok) {
86	    const message = await response.text().catch(() => response.statusText);
87	    throw new Error(
88	      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
89	    );
90	  }
91	  const url = (await response.json()).url;
92	  return { key, url };
93	}
94	
95	export async function storageGet(
96	  relKey: string,
97	  _expiresIn = 300
98	): Promise<{ key: string; url: string; }> {
99	  const { baseUrl, apiKey } = getStorageConfig();
100	  const key = normalizeKey(relKey);
101	  return {
102	    key,
103	    url: await buildDownloadUrl(baseUrl, key, apiKey),
104	  };
105	}
106	