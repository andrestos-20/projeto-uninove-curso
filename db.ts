Text file: db.ts
Latest content with line numbers:
1	import { eq } from "drizzle-orm";
2	import { drizzle } from "drizzle-orm/mysql2";
3	import { InsertUser, users, modules, InsertModule, Module, admins, students, Student, InsertStudent } from "../drizzle/schema";
4	import { ENV } from './_core/env';
5	
6	let _db: ReturnType<typeof drizzle> | null = null;
7	
8	// Lazily create the drizzle instance so local tooling can run without a DB.
9	export async function getDb() {
10	  if (!_db && process.env.DATABASE_URL) {
11	    try {
12	      _db = drizzle(process.env.DATABASE_URL);
13	    } catch (error) {
14	      console.warn("[Database] Failed to connect:", error);
15	      _db = null;
16	    }
17	  }
18	  return _db;
19	}
20	
21	export async function upsertUser(user: InsertUser): Promise<void> {
22	  if (!user.id) {
23	    throw new Error("User ID is required for upsert");
24	  }
25	
26	  const db = await getDb();
27	  if (!db) {
28	    console.warn("[Database] Cannot upsert user: database not available");
29	    return;
30	  }
31	
32	  try {
33	    const values: InsertUser = {
34	      id: user.id,
35	    };
36	    const updateSet: Record<string, unknown> = {};
37	
38	    const textFields = ["name", "email", "loginMethod"] as const;
39	    type TextField = (typeof textFields)[number];
40	
41	    const assignNullable = (field: TextField) => {
42	      const value = user[field];
43	      if (value === undefined) return;
44	      const normalized = value ?? null;
45	      values[field] = normalized;
46	      updateSet[field] = normalized;
47	    };
48	
49	    textFields.forEach(assignNullable);
50	
51	    if (user.lastSignedIn !== undefined) {
52	      values.lastSignedIn = user.lastSignedIn;
53	      updateSet.lastSignedIn = user.lastSignedIn;
54	    }
55	    if (user.role === undefined) {
56	      if (user.id === ENV.ownerId) {
57	        user.role = 'admin';
58	        values.role = 'admin';
59	        updateSet.role = 'admin';
60	      }
61	    }
62	
63	    if (Object.keys(updateSet).length === 0) {
64	      updateSet.lastSignedIn = new Date();
65	    }
66	
67	    await db.insert(users).values(values).onDuplicateKeyUpdate({
68	      set: updateSet,
69	    });
70	  } catch (error) {
71	    console.error("[Database] Failed to upsert user:", error);
72	    throw error;
73	  }
74	}
75	
76	export async function getUser(id: string) {
77	  const db = await getDb();
78	  if (!db) {
79	    console.warn("[Database] Cannot get user: database not available");
80	    return undefined;
81	  }
82	
83	  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
84	
85	  return result.length > 0 ? result[0] : undefined;
86	}
87	
88	// TODO: add feature queries here as your schema grows.
89	
90	
91	// Module queries
92	export async function getAllModules(): Promise<Module[]> {
93	  const db = await getDb();
94	  if (!db) {
95	    console.warn("[Database] Cannot get modules: database not available");
96	    return [];
97	  }
98	
99	  try {
100	    const result = await db.select().from(modules).orderBy(modules.id);
101	    return result;
102	  } catch (error) {
103	    console.error("[Database] Failed to get modules:", error);
104	    return [];
105	  }
106	}
107	
108	export async function getModuleById(id: number): Promise<Module | undefined> {
109	  const db = await getDb();
110	  if (!db) {
111	    console.warn("[Database] Cannot get module: database not available");
112	    return undefined;
113	  }
114	
115	  try {
116	    const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
117	    return result.length > 0 ? result[0] : undefined;
118	  } catch (error) {
119	    console.error("[Database] Failed to get module:", error);
120	    return undefined;
121	  }
122	}
123	
124	export async function updateModule(id: number, data: Partial<InsertModule>): Promise<Module | undefined> {
125	  const db = await getDb();
126	  if (!db) {
127	    console.warn("[Database] Cannot update module: database not available");
128	    return undefined;
129	  }
130	
131	  try {
132	    await db.update(modules).set(data).where(eq(modules.id, id));
133	    return getModuleById(id);
134	  } catch (error) {
135	    console.error("[Database] Failed to update module:", error);
136	    return undefined;
137	  }
138	}
139	
140	export async function createModule(data: InsertModule): Promise<Module | undefined> {
141	  const db = await getDb();
142	  if (!db) {
143	    console.warn("[Database] Cannot create module: database not available");
144	    return undefined;
145	  }
146	
147	  try {
148	    const result = await db.insert(modules).values(data);
149	    const id = result[0].insertId as number;
150	    return getModuleById(id);
151	  } catch (error) {
152	    console.error("[Database] Failed to create module:", error);
153	    return undefined;
154	  }
155	}
156	
157	
158	
159	// Admin queries
160	export async function verifyAdminCredentials(email: string, ra: string) {
161	  const db = await getDb();
162	  if (!db) {
163	    console.warn("[Database] Cannot verify admin: database not available");
164	    return false;
165	  }
166	
167	  try {
168	    const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
169	    
170	    if (result.length === 0) return false;
171	    
172	    const admin = result[0];
173	    return admin.ra === ra;
174	  } catch (error) {
175	    console.error("[Database] Failed to verify admin:", error);
176	    return false;
177	  }
178	}
179	
180	export async function getAdminByEmail(email: string) {
181	  const db = await getDb();
182	  if (!db) {
183	    console.warn("[Database] Cannot get admin: database not available");
184	    return undefined;
185	  }
186	
187	  try {
188	    const result = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
189	    return result.length > 0 ? result[0] : undefined;
190	  } catch (error) {
191	    console.error("[Database] Failed to get admin:", error);
192	    return undefined;
193	  }
194	}
195	
196	
197	
198	
199	// Student queries
200	export async function getAllStudents(): Promise<Student[]> {
201	  const db = await getDb();
202	  if (!db) {
203	    console.warn("[Database] Cannot get students: database not available");
204	    return [];
205	  }
206	
207	  try {
208	    const result = await db.select().from(students).orderBy(students.id);
209	    return result;
210	  } catch (error) {
211	    console.error("[Database] Failed to get students:", error);
212	    return [];
213	  }
214	}
215	
216	export async function getStudentById(id: number): Promise<Student | undefined> {
217	  const db = await getDb();
218	  if (!db) {
219	    console.warn("[Database] Cannot get student: database not available");
220	    return undefined;
221	  }
222	
223	  try {
224	    const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
225	    return result.length > 0 ? result[0] : undefined;
226	  } catch (error) {
227	    console.error("[Database] Failed to get student:", error);
228	    return undefined;
229	  }
230	}
231	
232	export async function getStudentByEmail(email: string): Promise<Student | undefined> {
233	  const db = await getDb();
234	  if (!db) {
235	    console.warn("[Database] Cannot get student: database not available");
236	    return undefined;
237	  }
238	
239	  try {
240	    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
241	    return result.length > 0 ? result[0] : undefined;
242	  } catch (error) {
243	    console.error("[Database] Failed to get student:", error);
244	    return undefined;
245	  }
246	}
247	
248	export async function createStudent(data: InsertStudent): Promise<Student | undefined> {
249	  const db = await getDb();
250	  if (!db) {
251	    console.warn("[Database] Cannot create student: database not available");
252	    return undefined;
253	  }
254	
255	  try {
256	    const result = await db.insert(students).values(data);
257	    const id = (result as any).insertId || result[0];
258	    return getStudentById(Number(id));
259	  } catch (error) {
260	    console.error("[Database] Failed to create student:", error);
261	    return undefined;
262	  }
263	}
264	
265	export async function updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
266	  const db = await getDb();
267	  if (!db) {
268	    console.warn("[Database] Cannot update student: database not available");
269	    return undefined;
270	  }
271	
272	  try {
273	    await db.update(students).set(data).where(eq(students.id, id));
274	    return getStudentById(id);
275	  } catch (error) {
276	    console.error("[Database] Failed to update student:", error);
277	    return undefined;
278	  }
279	}
280	
281	export async function deleteStudent(id: number): Promise<boolean> {
282	  const db = await getDb();
283	  if (!db) {
284	    console.warn("[Database] Cannot delete student: database not available");
285	    return false;
286	  }
287	
288	  try {
289	    await db.delete(students).where(eq(students.id, id));
290	    return true;
291	  } catch (error) {
292	    console.error("[Database] Failed to delete student:", error);
293	    return false;
294	  }
295	}
296	
297	export async function verifyStudentCredentials(email: string, password: string): Promise<Student | undefined> {
298	  const db = await getDb();
299	  if (!db) {
300	    console.warn("[Database] Cannot verify student: database not available");
301	    return undefined;
302	  }
303	
304	  try {
305	    const result = await db.select().from(students).where(eq(students.email, email)).limit(1);
306	    
307	    if (result.length === 0) return undefined;
308	    
309	    const student = result[0];
310	    // Simple password comparison (in production, use bcrypt or similar)
311	    if (student.password === password && student.isActive === "true") {
312	      return student;
313	    }
314	    return undefined;
315	  } catch (error) {
316	    console.error("[Database] Failed to verify student:", error);
317	    return undefined;
318	  }
319	}
320	
321	