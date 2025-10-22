Text file: routers.ts
Latest content with line numbers:
1	import { COOKIE_NAME } from "@shared/const";
2	import { getSessionCookieOptions } from "./_core/cookies";
3	import { systemRouter } from "./_core/systemRouter";
4	import { publicProcedure, router } from "./_core/trpc";
5	import { z } from "zod";
6	import { getAllModules, getModuleById, updateModule, createModule, verifyAdminCredentials, getAdminByEmail, getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, verifyStudentCredentials } from "./db";
7	import { storagePut } from "./storage";
8	
9	export const appRouter = router({
10	  system: systemRouter,
11	
12	  auth: router({
13	    me: publicProcedure.query(opts => opts.ctx.user),
14	    logout: publicProcedure.mutation(({ ctx }) => {
15	      const cookieOptions = getSessionCookieOptions(ctx.req);
16	      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
17	      return {
18	        success: true,
19	      } as const;
20	    }),
21	  }),
22	
23	  admin: router({
24	    login: publicProcedure
25	      .input(z.object({ email: z.string().email(), ra: z.string() }))
26	      .mutation(async ({ input }) => {
27	        
28	        const isValid = await verifyAdminCredentials(input.email, input.ra);
29	        if (!isValid) {
30	          throw new Error("Email ou RA inválido");
31	        }
32	        const admin = await getAdminByEmail(input.email);
33	        return {
34	          success: true,
35	          admin: admin,
36	        };
37	      }),
38	    students: router({
39	      list: publicProcedure.query(() => getAllStudents()),
40	      getById: publicProcedure
41	        .input(z.object({ id: z.number() }))
42	        .query(({ input }) => getStudentById(input.id)),
43	      create: publicProcedure
44	        .input(z.object({
45	          name: z.string(),
46	          email: z.string().email(),
47	          password: z.string(),
48	          isActive: z.enum(["true", "false"]).optional(),
49	        }))
50	        .mutation(({ input }) => createStudent(input as any)),
51	      update: publicProcedure
52	        .input(z.object({
53	          id: z.number(),
54	          name: z.string().optional(),
55	          email: z.string().email().optional(),
56	          password: z.string().optional(),
57	          isActive: z.enum(["true", "false"]).optional(),
58	        }))
59	        .mutation(({ input }) => {
60	          const { id, ...data } = input;
61	          return updateStudent(id, data as any);
62	        }),
63	      delete: publicProcedure
64	        .input(z.object({ id: z.number() }))
65	        .mutation(({ input }) => deleteStudent(input.id)),
66	    }),
67	  }),
68	
69	  student: router({
70	    login: publicProcedure
71	      .input(z.object({ email: z.string().email(), password: z.string() }))
72	      .mutation(async ({ input }) => {
73	        const student = await verifyStudentCredentials(input.email, input.password);
74	        if (!student) {
75	          throw new Error("Email ou senha inválidos");
76	        }
77	        return {
78	          success: true,
79	          student: student,
80	        };
81	      }),
82	  }),
83	
84	  modules: router({
85	    list: publicProcedure.query(() => getAllModules()),
86	    getById: publicProcedure
87	      .input(z.object({ id: z.number() }))
88	      .query(({ input }) => getModuleById(input.id)),
89	    uploadAudio: publicProcedure
90	      .input(z.object({
91	        fileName: z.string(),
92	        fileData: z.string(), // base64 encoded file data
93	        contentType: z.string().optional(),
94	      }))
95	      .mutation(async ({ input }) => {
96	        try {
97	          // Decode base64 to buffer
98	          const buffer = Buffer.from(input.fileData, 'base64');
99	          
100	          // Upload to storage
101	          const timestamp = Date.now();
102	          const storagePath = `audio/${timestamp}-${input.fileName}`;
103	          const result = await storagePut(storagePath, buffer, input.contentType || 'audio/mpeg');
104	          
105	          return {
106	            success: true,
107	            url: result.url,
108	            key: result.key,
109	          };
110	        } catch (error) {
111	          console.error('Error uploading audio:', error);
112	          throw new Error(`Falha ao fazer upload do arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
113	        }
114	      }),
115	    update: publicProcedure
116	      .input(z.object({
117	        id: z.number(),
118	        title: z.string().optional(),
119	        instructor: z.string().optional(),
120	        duration: z.string().optional(),
121	        format: z.string().optional(),
122	        description: z.string().optional(),
123	        files: z.array(z.object({
124	          id: z.string(),
125	          type: z.enum(["video", "audio", "pdf", "powerpoint", "iframe"]),
126	          name: z.string(),
127	          url: z.string().optional(),
128	          iframeCode: z.string().optional(),
129	          uploadedAt: z.string(),
130	        })).optional(),
131	      }))
132	      .mutation(({ input }) => {
133	        const { id, ...data } = input;
134	        return updateModule(id, data as any);
135	      }),
136	    create: publicProcedure
137	      .input(z.object({
138	        title: z.string(),
139	        instructor: z.string(),
140	        duration: z.string(),
141	        format: z.string(),
142	        description: z.string(),
143	        files: z.array(z.object({
144	          id: z.string(),
145	          type: z.enum(["video", "audio", "pdf", "powerpoint", "iframe"]),
146	          name: z.string(),
147	          url: z.string().optional(),
148	          iframeCode: z.string().optional(),
149	          uploadedAt: z.string(),
150	        })) as any,
151	      }))
152	      .mutation(({ input }) => createModule(input)),
153	  }),
154	});
155	
156	export type AppRouter = typeof appRouter;
157	
158	