Text file: App.tsx
Latest content with line numbers:
1	import { Toaster } from "@/components/ui/sonner";
2	import { TooltipProvider } from "@/components/ui/tooltip";
3	import NotFound from "@/pages/NotFound";
4	import { Route, Switch } from "wouter";
5	import ErrorBoundary from "./components/ErrorBoundary";
6	import { ThemeProvider } from "./contexts/ThemeContext";
7	import { ModulesProvider } from "./contexts/ModulesContext";
8	import Home from "./pages/Home";
9	import Course from "./pages/Course";
10	import ModuleManager from "./pages/ModuleManager";
11	import AdminLogin from "./pages/AdminLogin";
12	import StudentLogin from "./pages/StudentLogin";
13	import AdminStudents from "./pages/AdminStudents";
14	
15	function Router() {
16	  // make sure to consider if you need authentication for certain routes
17	  return (
18	    <Switch>
19	      <Route path={"/"} component={Home} />
20	      <Route path={"/curso"} component={Course} />
21	      <Route path={"/admin/login"} component={AdminLogin} />
22	      <Route path={"/admin/modulos"} component={ModuleManager} />
23	      <Route path={"/login"} component={StudentLogin} />
24	      <Route path={"/admin/alunos"} component={AdminStudents} />
25	      <Route path={"/404"} component={NotFound} />
26	      {/* Final fallback route */}
27	      <Route component={NotFound} />
28	    </Switch>
29	  );
30	}
31	
32	function App() {
33	  return (
34	    <ErrorBoundary>
35	        <ThemeProvider defaultTheme="dark" switchable={true}>
36	        <ModulesProvider>
37	          <TooltipProvider>
38	            <Toaster />
39	            <Router />
40	          </TooltipProvider>
41	        </ModulesProvider>
42	      </ThemeProvider>
43	    </ErrorBoundary>
44	  );
45	}
46	
47	export default App;
48	
49	