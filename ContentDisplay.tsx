Text file: ContentDisplay.tsx
Latest content with line numbers:
1	import { Download, ExternalLink, Volume2 } from "lucide-react";
2	
3	interface Material {
4	  id: string;
5	  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage";
6	  name: string;
7	  url?: string;
8	  iframeCode?: string;
9	  uploadedAt: string;
10	}
11	
12	interface ContentDisplayProps {
13	  material: Material | null;
14	}
15	
16	export function ContentDisplay({ material }: ContentDisplayProps) {
17	  if (!material) {
18	    return (
19	      <div className="flex items-center justify-center h-[400px] text-slate-400">
20	        <p>Selecione um material para visualizar</p>
21	      </div>
22	    );
23	  }
24	
25	  const renderContent = () => {
26	    switch (material.type) {
27	      case "video":
28	        if (material.url?.includes("youtube.com") || material.url?.includes("youtu.be")) {
29	          // Extract YouTube video ID
30	          const youtubeId = material.url.includes("youtu.be")
31	            ? material.url.split("/").pop()
32	            : new URL(material.url).searchParams.get("v");
33	          return (
34	            <iframe
35	              width="100%"
36	              height="400"
37	              src={`https://www.youtube.com/embed/${youtubeId}`}
38	              title={material.name}
39	              frameBorder="0"
40	              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
41	              allowFullScreen
42	              className="rounded-lg"
43	            ></iframe>
44	          );
45	        } else if (material.url?.endsWith(".mp4") || material.url?.endsWith(".webm") || material.url?.endsWith(".mov") || material.url?.endsWith(".avi")) {
46	          return (
47	            <video
48	              width="100%"
49	              height="400"
50	              controls
51	              className="rounded-lg bg-black"
52	            >
53	              <source src={material.url} type={material.url.endsWith(".mp4") ? "video/mp4" : material.url.endsWith(".webm") ? "video/webm" : material.url.endsWith(".mov") ? "video/quicktime" : "video/x-msvideo"} />
54	              Seu navegador não suporta o elemento de vídeo.
55	            </video>
56	          );
57	        }
58	        break;
59	
60	      case "audio":
61	        // Support both audio files (mp3, wav) and video files with audio (mp4, webm)
62	        const isAudioFile = material.url?.endsWith(".mp3") || material.url?.endsWith(".wav") || material.url?.endsWith(".m4a");
63	        const isVideoWithAudio = material.url?.endsWith(".mp4") || material.url?.endsWith(".webm") || material.url?.endsWith(".mov");
64	        
65	        if (isVideoWithAudio) {
66	          // If it's a video file, render as video player (which can play audio-only videos)
67	          return (
68	            <video
69	              width="100%"
70	              height="400"
71	              controls
72	              className="rounded-lg bg-black"
73	            >
74	              <source src={material.url || ""} type={material.url?.endsWith(".mp4") ? "video/mp4" : material.url?.endsWith(".webm") ? "video/webm" : "video/quicktime"} />
75	              Seu navegador não suporta o elemento de vídeo.
76	            </video>
77	          );
78	        }
79	        
80	        // Otherwise render as audio player
81	        return (
82	          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 h-[400px]">
83	            <div className="mb-6 p-4 bg-purple-600/20 rounded-full">
84	              <Volume2 className="w-12 h-12 text-purple-400" />
85	            </div>
86	            <h3 className="text-xl font-semibold text-white mb-4">{material.name}</h3>
87	            <audio
88	              controls
89	              className="w-full max-w-md"
90	            >
91	              <source src={material.url} type={material.url?.endsWith(".wav") ? "audio/wav" : material.url?.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg"} />
92	              Seu navegador não suporta o elemento de áudio.
93	            </audio>
94	          </div>
95	        );
96	
97	      case "pdf":
98	        return (
99	          <div className="flex flex-col gap-4">
100	            <iframe
101	              src={`${material.url}#toolbar=1&navpanes=0&scrollbar=1`}
102	              width="100%"
103	              height="400"
104	              title={material.name}
105	              className="rounded-lg border border-slate-700"
106	            ></iframe>
107	            {material.url && (
108	              <a
109	                href={material.url}
110	                download
111	                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
112	              >
113	                <Download className="w-4 h-4" />
114	                Baixar PDF
115	              </a>
116	            )}
117	          </div>
118	        );
119	
120	      case "powerpoint":
121	        return (
122	          <div className="flex flex-col gap-4">
123	            {material.url?.endsWith(".pptx") || material.url?.endsWith(".ppt") ? (
124	              <>
125	                <iframe
126	                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.url)}`}
127	                  width="100%"
128	                  height="400"
129	                  title={material.name}
130	                  className="rounded-lg border border-slate-700"
131	                ></iframe>
132	                <a
133	                  href={material.url}
134	                  download
135	                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
136	                >
137	                  <Download className="w-4 h-4" />
138	                  Baixar PowerPoint
139	                </a>
140	              </>
141	            ) : (
142	              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
143	                <div>
144	                  <p className="text-slate-300 mb-4">PowerPoint não pode ser visualizado diretamente</p>
145	                  <a
146	                    href={material.url}
147	                    download
148	                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
149	                  >
150	                    <Download className="w-4 h-4" />
151	                    Baixar PowerPoint
152	                  </a>
153	                </div>
154	              </div>
155	            )}
156	          </div>
157	        );
158	
159	      case "iframe":
160	        return (
161	          <div className="flex flex-col gap-4">
162	            {material.iframeCode ? (
163	              <div
164	                className="rounded-lg border border-slate-700 overflow-hidden h-[400px]"
165	                dangerouslySetInnerHTML={{ __html: material.iframeCode }}
166	              ></div>
167	            ) : material.url ? (
168	              <iframe
169	                src={material.url}
170	                width="100%"
171	                height="400"
172	                title={material.name}
173	                className="rounded-lg border border-slate-700"
174	              ></iframe>
175	            ) : (
176	              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
177	                <p className="text-slate-300">Conteúdo não disponível</p>
178	              </div>
179	            )}
180	          </div>
181	        );
182	
183	      case "webpage":
184	        return (
185	          <div className="flex flex-col gap-4">
186	            <iframe
187	              src={material.url}
188	              width="100%"
189	              height="400"
190	              title={material.name}
191	              className="rounded-lg border border-slate-700"
192	            ></iframe>
193	            {material.url && (
194	              <a
195	                href={material.url}
196	                target="_blank"
197	                rel="noopener noreferrer"
198	                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition w-full"
199	              >
200	                <ExternalLink className="w-4 h-4" />
201	                Abrir em Nova Aba
202	              </a>
203	            )}
204	          </div>
205	        );
206	
207	      default:
208	        return (
209	          <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center h-[400px] flex items-center justify-center">
210	            <p className="text-slate-300">Tipo de conteúdo não suportado: {material.type}</p>
211	          </div>
212	        );
213	    }
214	  };
215	
216	  return (
217	    <div className="w-full">
218	      {renderContent()}
219	    </div>
220	  );
221	}
222	
223	