Text file: schema.ts
Latest content with line numbers:
1	import { mysqlEnum, mysqlTable, text, timestamp, varchar, json, int } from "drizzle-orm/mysql-core";
2	
3	/**
4	 * Core user table backing auth flow.
5	 * Extend this file with additional tables as your product grows.
6	 * Columns use camelCase to match both database fields and generated types.
7	 */
8	export const users = mysqlTable("users", {
9	  id: varchar("id", { length: 64 }).primaryKey(),
10	  name: text("name"),
11	  email: varchar("email", { length: 320 }),
12	  loginMethod: varchar("loginMethod", { length: 64 }),
13	  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
14	  createdAt: timestamp("createdAt").defaultNow(),
15	  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
16	});
17	
18	export type User = typeof users.$inferSelect;
19	export type InsertUser = typeof users.$inferInsert;
20	
21	/**
22	 * Modules table for storing course module information
23	 */
24	export const modules = mysqlTable("modules", {
25	  id: int("id").primaryKey().autoincrement(),
26	  title: varchar("title", { length: 255 }).notNull(),
27	  instructor: varchar("instructor", { length: 255 }).notNull(),
28	  duration: varchar("duration", { length: 50 }).notNull(),
29	  format: varchar("format", { length: 255 }).notNull(),
30	  description: text("description").notNull(),
31	  files: json("files").$type<Array<{
32	    id: string;
33	    type: "video" | "audio" | "pdf" | "powerpoint" | "iframe";
34	    name: string;
35	    url?: string;
36	    iframeCode?: string;
37	    uploadedAt: string;
38	  }>>().notNull(),
39	  createdAt: timestamp("createdAt").defaultNow(),
40	  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
41	});
42	
43	export type Module = typeof modules.$inferSelect;
44	export type InsertModule = typeof modules.$inferInsert;
45	
46	/**
47	 * Admin users table for course management
48	 */
49	export const admins = mysqlTable("admins", {
50	  id: int("id").primaryKey().autoincrement(),
51	  name: varchar("name", { length: 255 }).notNull(),
52	  email: varchar("email", { length: 320 }).notNull().unique(),
53	  ra: varchar("ra", { length: 20 }).notNull().unique(),
54	  createdAt: timestamp("createdAt").defaultNow(),
55	});
56	
57	export type Admin = typeof admins.$inferSelect;
58	export type InsertAdmin = typeof admins.$inferInsert;
59	
60	/**
61	 * Students table for course access
62	 */
63	export const students = mysqlTable("students", {
64	  id: int("id").primaryKey().autoincrement(),
65	  name: varchar("name", { length: 255 }).notNull(),
66	  email: varchar("email", { length: 320 }).notNull().unique(),
67	  password: varchar("password", { length: 255 }).notNull(),
68	  isActive: mysqlEnum("isActive", ["true", "false"]).default("true").notNull(),
69	  createdAt: timestamp("createdAt").defaultNow(),
70	  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
71	});
72	
73	export type Student = typeof students.$inferSelect;
74	export type InsertStudent = typeof students.$inferInsert;
75	