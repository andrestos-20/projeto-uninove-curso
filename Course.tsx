Text file: Course.tsx
Latest content with line numbers:
1	import { Button } from "@/components/ui/button";
2	import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
3	import { Progress } from "@/components/ui/progress";
4	import { ChevronRight, Play, CheckCircle2, Circle, Clock, User, Loader, Globe, Youtube, FileText, Music, BookOpen, MessageCircle } from "lucide-react";
5	import { useState, useEffect } from "react";
6	import { trpc } from "@/lib/trpc";
7	import { ContentDisplay } from "@/components/ContentDisplay";
8	
9	interface Material {
10	  id: string;
11	  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage";
12	  name: string;
13	  url?: string;
14	  iframeCode?: string;
15	  uploadedAt: string;
16	}
17	
18	export default function Course() {
19	  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
20	  const [currentModuleId, setCurrentModuleId] = useState(1);
21	  const [completedModules, setCompletedModules] = useState<number[]>([]);
22	  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
23	
24	  const currentModule = modules.find(m => m.id === currentModuleId);
25	  const totalDuration = modules.reduce((acc, m) => {
26	    const minutes = parseInt(m.duration);
27	    return acc + minutes;
28	  }, 0);
29	  const completedMinutes = completedModules.reduce((acc, id) => {
30	    const module = modules.find(m => m.id === id);
31	    return acc + (module ? parseInt(module.duration) : 0);
32	  }, 0);
33	  const progressPercentage = totalDuration > 0 ? Math.round((completedMinutes / totalDuration) * 100) : 0;
34	
35	  useEffect(() => {
36	    if (modules.length > 0 && !currentModule) {
37	      setCurrentModuleId(modules[0].id);
38	    }
39	    // Set first material as selected by default
40	    if (currentModule && currentModule.files && currentModule.files.length > 0 && !selectedMaterial) {
41	      setSelectedMaterial(currentModule.files[0]);
42	    }
43	  }, [modules, currentModule, selectedMaterial]);
44	
45	  const toggleModuleCompletion = (moduleId: number) => {
46	    setCompletedModules(prev =>
47	      prev.includes(moduleId)
48	        ? prev.filter(id => id !== moduleId)
49	        : [...prev, moduleId]
50	    );
51	  };
52	
53	  const handleNextModule = () => {
54	    if (currentModuleId < modules.length) {
55	      setCurrentModuleId(currentModuleId + 1);
56	      setSelectedMaterial(null);
57	    }
58	  };
59	
60	  const getMaterialIcon = (type: string) => {
61	    switch(type) {
62	      case "webpage": return <Globe className="w-5 h-5" />;
63	      case "video": return <Youtube className="w-5 h-5" />;
64	      case "pdf": return <FileText className="w-5 h-5" />;
65	      case "audio": return <Music className="w-5 h-5" />;
66	      case "powerpoint": return <FileText className="w-5 h-5" />;
67	      case "iframe": return <BookOpen className="w-5 h-5" />;
68	      default: return <FileText className="w-5 h-5" />;
69	    }
70	  };
71	
72	  const getMaterialTypeLabel = (type: string) => {
73	    const labels: Record<string, string> = {
74	      webpage: "Página Web",
75	      video: "Vídeo",
76	      pdf: "PDF",
77	      audio: "Áudio",
78	      powerpoint: "PowerPoint",
79	      iframe: "Conteúdo Embutido"
80	    };
81	    return labels[type] || type;
82	  };
83	
84	  if (isLoading) {
85	    return (
86	      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
87	        <div className="flex flex-col items-center gap-4">
88	          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
89	          <p className="text-slate-300">Carregando módulos...</p>
90	        </div>
91	      </div>
92	    );
93	  }
94	
95	  return (
96	    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
97	      {/* Navigation */}
98	      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">
99	        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
100	          <div className="flex items-center gap-4">
101	            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
102	              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
103	                <ChevronRight className="w-5 h-5 text-white" />
104	              </div>
105	              <span className="font-bold text-white">PowerBI Academy</span>
106	            </a>
107	          </div>
108	          <a href="/">
109	            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
110	              Voltar
111	            </Button>
112	          </a>
113	        </div>
114	      </nav>
115	
116	      {/* Main Content */}
117	      <div className="container mx-auto px-4 py-8">
118	        <div className="grid md:grid-cols-3 gap-8">
119	          {/* Main Content Area */}
120	          <div className="md:col-span-2 space-y-6">
121	            {currentModule && (
122	              <>
123	                {/* Module Title */}
124	                <div className="space-y-2">
125	                  <h1 className="text-3xl font-bold text-white">{currentModule.title}</h1>
126	                  <div className="flex items-center gap-4 text-slate-400">
127	                    <div className="flex items-center gap-2">
128	                      <User className="w-4 h-4" />
129	                      <span>{currentModule.instructor}</span>
130	                    </div>
131	                    <div className="flex items-center gap-2">
132	                      <Clock className="w-4 h-4" />
133	                      <span>{currentModule.duration}</span>
134	                    </div>
135	                  </div>
136	                </div>
137	
138	                {/* Content Display Area */}
139	                <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
140	                  <CardContent className="p-0">
141	                    <ContentDisplay material={selectedMaterial} />
142	                  </CardContent>
143	                </Card>
144	
145	                {/* Description */}
146	                <Card className="bg-slate-800/50 border-slate-700">
147	                  <CardHeader>
148	                    <CardTitle className="text-white">Sobre esta aula</CardTitle>
149	                  </CardHeader>
150	                  <CardContent>
151	                    <p className="text-slate-300 leading-relaxed">{currentModule.description}</p>
152	                  </CardContent>
153	                </Card>
154	
155	                {/* Materials Section */}
156	                {currentModule.files && currentModule.files.length > 0 && (
157	                  <Card className="bg-slate-800/50 border-slate-700">
158	                    <CardHeader>
159	                      <CardTitle className="text-white">Materiais e Recursos</CardTitle>
160	                    </CardHeader>
161	                    <CardContent className="space-y-3">
162	                      {currentModule.files.map((material: Material) => (
163	                        <div
164	                          key={material.id}
165	                          onClick={() => setSelectedMaterial(material)}
166	                          className={`flex items-center justify-between p-4 rounded-lg border transition group cursor-pointer ${
167	                            selectedMaterial?.id === material.id
168	                              ? "bg-purple-600/20 border-purple-500"
169	                              : "bg-slate-900/50 border-slate-700 hover:border-purple-500"
170	                          }`}
171	                        >
172	                          <div className="flex items-center gap-3 flex-1">
173	                            <div className="text-purple-400 bg-slate-800 p-2 rounded">
174	                              {getMaterialIcon(material.type)}
175	                            </div>
176	                            <div className="flex-1">
177	                              <p className="text-white font-medium">{material.name}</p>
178	                              <p className="text-slate-500 text-sm">{getMaterialTypeLabel(material.type)}</p>
179	                            </div>
180	                          </div>
181	                          <div className="flex items-center gap-2">
182	                            <div className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded text-sm transition opacity-0 group-hover:opacity-100 flex items-center gap-2">
183	                              <Play className="w-4 h-4" />
184	                              Visualizar
185	                            </div>
186	                          </div>
187	                        </div>
188	                      ))}
189	                    </CardContent>
190	                  </Card>
191	                )}
192	
193	                {/* Action Buttons */}
194	                <div className="flex gap-3">
195	                  <Button
196	                    onClick={() => toggleModuleCompletion(currentModule.id)}
197	                    className={completedModules.includes(currentModule.id) ? "bg-green-600 hover:bg-green-700 flex-1" : "bg-purple-600 hover:bg-purple-700 flex-1"}
198	                  >
199	                    {completedModules.includes(currentModule.id) ? (
200	                      <>
201	                        <CheckCircle2 className="w-4 h-4 mr-2" />
202	                        Concluído
203	                      </>
204	                    ) : (
205	                      <>
206	                        <Circle className="w-4 h-4 mr-2" />
207	                        Marcar como Concluído
208	                      </>
209	                    )}
210	                  </Button>
211	                  {currentModuleId < modules.length && (
212	                    <Button
213	                      onClick={handleNextModule}
214	                      className="bg-slate-700 hover:bg-slate-600 flex-1"
215	                    >
216	                      Próximo Módulo
217	                      <ChevronRight className="w-4 h-4 ml-2" />
218	                    </Button>
219	                  )}
220	                </div>
221	              </>
222	            )}
223	          </div>
224	
225	          {/* Sidebar */}
226	          <div className="md:col-span-1">
227	            {/* Progress Card (moved and resized) */}
228	            <Card className="bg-slate-800/50 border-slate-700 mb-6">
229	              <CardHeader className="pb-2">
230	                <CardTitle className="text-white flex items-center justify-between text-lg">
231	                  <span>Seu Progresso</span>
232	                  <span className="text-xl font-bold text-purple-400">{progressPercentage}%</span>
233	                </CardTitle>
234	              </CardHeader>
235	              <CardContent className="pt-2 pb-4">
236	                <Progress value={progressPercentage} className="h-1.5" />
237	                <div className="flex justify-between text-xs text-slate-400 mt-2">
238	                  <span>{completedMinutes} de {totalDuration} minutos concluídos</span>
239	                </div>
240	              </CardContent>
241	            </Card>
242	
243	            {/* Modules List (moved up) */}
244	            <Card className="bg-slate-800/50 border-slate-700">
245	              <CardHeader>
246	                <CardTitle className="text-white">Módulos</CardTitle>
247	              </CardHeader>
248	              <CardContent className="space-y-2">
249	                {modules.map((module: any) => (
250	                  <button
251	                    key={module.id}
252	                    onClick={() => {
253	                      setCurrentModuleId(module.id);
254	                      setSelectedMaterial(null);
255	                    }}
256	                    className={`w-full text-left p-3 rounded border transition ${
257	                      currentModuleId === module.id
258	                        ? "bg-purple-600/20 border-purple-500"
259	                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
260	                    }`}
261	                  >
262	                    <div className="flex items-start gap-2">
263	                      {completedModules.includes(module.id) ? (
264	                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
265	                      ) : (
266	                        <Circle className="w-4 h-4 text-slate-500 mt-1 flex-shrink-0" />
267	                      )}
268	                      <div className="flex-1 min-w-0">
269	                        <p className="text-sm font-semibold text-white">Módulo {module.id}</p>
270	                        <p className="text-xs text-slate-400 line-clamp-2">{module.title}</p>
271	                        <p className="text-xs text-slate-500 mt-1">{module.duration}</p>
272	                      </div>
273	                    </div>
274	                  </button>
275	                ))}
276	              </CardContent>
277	            </Card>
278	
279	            {/* Support Section */}
280	            <Card className="bg-slate-800/50 border-slate-700 mt-6">
281	              <CardHeader>
282	                <CardTitle className="text-white text-base">Precisa de ajuda?</CardTitle>
283	              </CardHeader>
284	              <CardContent className="space-y-3">
285	                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-800">
286	                  <MessageCircle className="w-4 h-4 mr-2" />
287	                  Contato
288	                </Button>
289	              </CardContent>
290	            </Card>
291	          </div>
292	        </div>
293	      </div>
294	    </div>
295	  );
296	}
297	
298	