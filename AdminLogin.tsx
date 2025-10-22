Text file: AdminLogin.tsx
Latest content with line numbers:
1	import { Button } from "@/components/ui/button";
2	import { Input } from "@/components/ui/input";
3	import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
4	import { useState } from "react";
5	import { useLocation } from "wouter";
6	import { trpc } from "@/lib/trpc";
7	import { Lock, Mail, AlertCircle, Loader } from "lucide-react";
8	
9	export default function AdminLogin() {
10	  const [, setLocation] = useLocation();
11	  const [email, setEmail] = useState("");
12	  const [ra, setRa] = useState("");
13	  const [error, setError] = useState("");
14	  const [isLoading, setIsLoading] = useState(false);
15	
16	  const loginMutation = trpc.admin.login.useMutation();
17	
18	  const handleLogin = async (e: React.FormEvent) => {
19	    e.preventDefault();
20	    setError("");
21	    setIsLoading(true);
22	
23	    try {
24	      const result = await loginMutation.mutateAsync({ email, ra });
25	      
26	      if (result.success) {
27	        // Salvar informações do admin no localStorage
28	        localStorage.setItem("adminLogged", JSON.stringify(result.admin));
29	        // Redirecionar para a página de admin
30	        setLocation("/admin/modulos");
31	      }
32	    } catch (err: any) {
33	      setError(err.message || "Erro ao fazer login. Verifique suas credenciais.");
34	    } finally {
35	      setIsLoading(false);
36	    }
37	  };
38	
39	  return (
40	    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
41	      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
42	        <CardHeader className="text-center space-y-2">
43	          <div className="flex justify-center mb-4">
44	            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
45	              <Lock className="w-6 h-6 text-white" />
46	            </div>
47	          </div>
48	          <CardTitle className="text-2xl text-white">Acesso Admin</CardTitle>
49	          <p className="text-slate-400 text-sm">PowerBI Academy - Gerenciamento de Módulos</p>
50	        </CardHeader>
51	
52	        <CardContent>
53	          <form onSubmit={handleLogin} className="space-y-4">
54	            {/* Email Input */}
55	            <div className="space-y-2">
56	              <label className="block text-sm font-medium text-slate-300">Email</label>
57	              <div className="relative">
58	                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
59	                <Input
60	                  type="email"
61	                  placeholder="seu.email@uni9.edu.br"
62	                  value={email}
63	                  onChange={(e) => setEmail(e.target.value)}
64	                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
65	                  disabled={isLoading}
66	                  required
67	                />
68	              </div>
69	            </div>
70	
71	            {/* Password Input */}
72	            <div className="space-y-2">
73	              <label className="block text-sm font-medium text-slate-300">Senha</label>
74	              <div className="relative">
75	                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
76	                <Input
77	                  type="password"
78	                  placeholder="Digite sua senha"
79	                  value={ra}
80	                  onChange={(e) => setRa(e.target.value)}
81	                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
82	                  disabled={isLoading}
83	                  required
84	                />
85	              </div>
86	            </div>
87	
88	            {/* Error Message */}
89	            {error && (
90	              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
91	                <AlertCircle className="w-4 h-4 flex-shrink-0" />
92	                <span>{error}</span>
93	              </div>
94	            )}
95	
96	            {/* Login Button */}
97	            <Button
98	              type="submit"
99	              disabled={isLoading || !email || !ra}
100	              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2"
101	            >
102	              {isLoading ? (
103	                <>
104	                  <Loader className="w-4 h-4 mr-2 animate-spin" />
105	                  Autenticando...
106	                </>
107	              ) : (
108	                "Entrar"
109	              )}
110	            </Button>
111	          </form>
112	        </CardContent>
113	      </Card>
114	
115	      {/* Footer */}
116	      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center text-slate-500 text-xs">
117	        <a href="/" className="hover:text-slate-400 transition">
118	          ← Voltar para Home
119	        </a>
120	        <span>PowerBI Academy © 2025</span>
121	      </div>
122	    </div>
123	  );
124	}
125	