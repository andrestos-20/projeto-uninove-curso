import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, CheckCircle2, BarChart3, Zap, Users, Award, Settings, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  const modules = [
    {
      id: 1,
      title: "Introdução ao tema: Por que analisar dados?",
      duration: "5 min",
      format: "Vídeo introdutório",
      instructor: "Isabela",
      description: "Entenda a importância fundamental da análise de dados para decisões estratégicas."
    },
    {
      id: 2,
      title: "Conceitos e Fundamentos do Power BI",
      duration: "15 min",
      format: "Slides narrados / e-book",
      instructor: "Julia",
      description: "Aprenda os conceitos essenciais e a interface do Power BI."
    },
    {
      id: 3,
      title: "Aplicações Práticas na Administração e Restaurantes",
      duration: "20 min",
      format: "Estudo de caso",
      instructor: "Melissa, Ellen",
      description: "Veja exemplos reais de como usar Power BI em negócios."
    },
    {
      id: 4,
      title: "Tutorial Passo a Passo no Power BI",
      duration: "30 min",
      format: "Screencast / guia prático",
      instructor: "André, Alexandre",
      description: "Aprenda na prática como criar dashboards e visualizações."
    },
    {
      id: 5,
      title: "Atividade Interativa (Quiz)",
      duration: "10 min",
      format: "Kahoot / Google Forms",
      instructor: "Nathalia",
      description: "Teste seus conhecimentos com perguntas interativas."
    }
  ];

  const benefits = [
    {
      icon: BarChart3,
      title: "Entender a importância da análise de dados",
      description: "Aprenda por que dados são fundamentais para decisões estratégicas"
    },
    {
      icon: Zap,
      title: "Aplicar pensamento analítico",
      description: "Desenvolva a habilidade de transformar informações em insights"
    },
    {
      icon: CheckCircle2,
      title: "Tratar e visualizar dados no Power BI",
      description: "Domine as ferramentas práticas de análise e visualização"
    },
    {
      icon: Award,
      title: "Tomar decisões baseadas em indicadores reais",
      description: "Substitua achismos por dados concretos e mensuráveis"
    },
    {
      icon: Users,
      title: "Transformar negócios com tecnologia",
      description: "Use o poder dos dados para impulsionar resultados"
    }
  ];

  const courseInfo = [
    { label: "Carga horária", value: "1h30" },
    { label: "Modalidade", value: "Online" },
    { label: "Tecnologia", value: "Power BI" },
    { label: "Disciplina", value: "Administração" },
    { label: "Plataforma", value: "Google Classroom" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between"> {/* Reduced py */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center"> {/* Reduced size */}
              <BarChart3 className="w-4 h-4 text-white" /> {/* Reduced size */}
            </div>
            <span className="font-bold text-white text-base">Eduqly Academy</span> {/* Reduced font size */}
          </div>
          <div className="hidden md:flex items-center gap-6"> {/* Reduced gap */}
            <a href="#estrutura" className="text-slate-300 hover:text-white transition text-sm">Estrutura</a> {/* Reduced font size */}
            <a href="#beneficios" className="text-slate-300 hover:text-white transition text-sm">Beneficios</a> {/* Reduced font size */}
            <a href="#inscricao" className="text-slate-300 hover:text-white transition text-sm">Inscricao</a> {/* Reduced font size */}
          </div>
          <div className="flex items-center gap-2"> {/* Reduced gap */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-300 hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="/admin/login">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 flex items-center gap-1 text-xs px-3 py-1"> {/* Reduced padding/font */}
                <Settings className="w-3 h-3" /> {/* Reduced size */}
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </a>
            <a href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs px-3 py-1"> {/* Reduced padding/font */}
                Acessar Curso
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16"> {/* Reduced py */}
        <div className="grid md:grid-cols-2 gap-8 items-center"> {/* Reduced gap */}
          <div className="space-y-4"> {/* Reduced space-y */}
            <div className="inline-block bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1"> {/* Reduced padding */}
              <p className="text-xs text-slate-300"> {/* Reduced font size */}
                Curso criado por alunos da Universidade UNINOVE
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"> {/* Reduced font sizes */}
              Transforme dados em <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">decisões inteligentes</span>
            </h1>
            <p className="text-base text-slate-300"> {/* Reduced font size */}
              Aprenda Power BI aplicado a Restaurantes e Negócios. Do achismo à decisão baseada em dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-3"> {/* Reduced gap */}
            <a href="/login">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"> {/* Reduced size */}
                Quero Aprender Agora
              </Button>
            </a>
              <Button size="sm" variant="outline" className="border-slate-600 text-white hover:bg-slate-800"> {/* Reduced size */}
                Saiba Mais
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-2"> {/* Reduced gap and pt */}
              <div className="flex items-center gap-1"> {/* Reduced gap */}
                <span className="text-xl font-bold text-white">5</span> {/* Reduced font size */}
                <span className="text-slate-400 text-sm">módulos práticos</span> {/* Reduced font size */}
              </div>
              <div className="flex items-center gap-1"> {/* Reduced gap */}
                <span className="text-xl font-bold text-white">1h30</span> {/* Reduced font size */}
                <span className="text-slate-400 text-sm">de conteúdo</span> {/* Reduced font size */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur"> {/* Reduced padding/border-radius */}
              <div className="bg-slate-800 rounded-lg p-4 space-y-3"> {/* Reduced padding/space-y */}
                <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-600 rounded flex items-center justify-center"> {/* Reduced height */}
                  <BarChart3 className="w-12 h-12 text-slate-500" /> {/* Reduced size */}
                </div>
                <div className="space-y-1"> {/* Reduced space-y */}
                  <div className="h-2 bg-slate-700 rounded w-3/4"></div> {/* Reduced height */}
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div> {/* Reduced height */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Info */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-8"> {/* Reduced py */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4"> {/* Reduced gap */}
            {courseInfo.map((info, idx) => (
              <div key={idx} className="text-center">
                <p className="text-slate-400 text-xs mb-1">{info.label}</p> {/* Reduced font size/mb */}
                <p className="text-white font-semibold text-base">{info.value}</p> {/* Reduced font size */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="estrutura" className="container mx-auto px-4 py-16"> {/* Reduced py */}
        <div className="space-y-8"> {/* Reduced space-y */}
          <div className="text-center space-y-3"> {/* Reduced space-y */}
            <h2 className="text-3xl md:text-4xl font-bold text-white">Estrutura do Curso</h2> {/* Reduced font sizes */}
            <p className="text-lg text-slate-400">5 módulos práticos e interativos</p> {/* Reduced font size */}
          </div>

          <div className="space-y-3"> {/* Reduced space-y */}
            {modules.map((module) => (
              <Card
                key={module.id}
                className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition cursor-pointer"
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
              >
                <CardHeader className="py-3 px-4"> {/* Reduced padding */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1"> {/* Reduced space-y */}
                      <div className="flex items-center gap-2"> {/* Reduced gap */}
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> {/* Reduced font size */}
                          Módulo {module.id}
                        </span>
                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full"> {/* Reduced padding/font */}
                          {module.duration}
                        </span>
                      </div>
                      <CardTitle className="text-white text-lg">{module.title}</CardTitle> {/* Reduced font size */}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition ${
                        expandedModule === module.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
                {expandedModule === module.id && (
                  <CardContent className="space-y-3 border-t border-slate-700 pt-3 px-4"> {/* Reduced padding/space-y */}
                    <div className="grid md:grid-cols-2 gap-3"> {/* Reduced gap */}
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Formato</p> {/* Reduced font size/mb */}
                        <p className="text-white text-sm">{module.format}</p> {/* Reduced font size */}
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Instrutor(a)</p> {/* Reduced font size/mb */}
                        <p className="text-white text-sm">{module.instructor}</p> {/* Reduced font size */}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-0.5">Descrição</p> {/* Reduced font size/mb */}
                      <p className="text-slate-300 text-sm">{module.description}</p> {/* Reduced font size */}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="bg-slate-800/50 border-y border-slate-700 py-16"> {/* Reduced py */}
        <div className="container mx-auto px-4 space-y-8"> {/* Reduced space-y */}
          <div className="text-center space-y-3"> {/* Reduced space-y */}
            <h2 className="text-3xl md:text-4xl font-bold text-white">O que você vai aprender</h2> {/* Reduced font sizes */}
            <p className="text-lg text-slate-400">Mais do que aprender Power BI, você vai aprender a enxergar oportunidades nos números</p> {/* Reduced font size */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Reduced gap */}
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="bg-slate-900/50 border-slate-700 p-4"> {/* Reduced padding */}
                  <CardHeader className="flex-row items-center gap-3 p-0 mb-3"> {/* Reduced padding/mb */}
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <Icon className="w-5 h-5 text-purple-400" /> {/* Reduced size */}
                    </div>
                    <CardTitle className="text-white text-lg">{benefit.title}</CardTitle> {/* Reduced font size */}
                  </CardHeader>
                  <CardContent className="p-0">
                    <CardDescription className="text-slate-400 text-sm">{benefit.description}</CardDescription> {/* Reduced font size */}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="inscricao" className="container mx-auto px-4 py-16 text-center"> {/* Reduced py */}
        <div className="space-y-6"> {/* Reduced space-y */}
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Comece sua jornada de <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">dados</span> agora
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Ao final, você fará um quiz de 10 perguntas e enviará seu dashboard criado no Power BI. 70% de acertos = certificado simbólico de conclusão
          </p>
          <div className="flex items-center justify-center gap-6 pt-4"> {/* Reduced gap and pt */}
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">⏱️</span>
              <span className="text-slate-400 text-sm">Duração: 1h30</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">🎓</span>
              <span className="text-slate-400 text-sm">Certificado simbólico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">💰</span>
              <span className="text-slate-400 text-sm">100% Gratuito</span>
            </div>
          </div>
          <a href="/login">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-6"> {/* Reduced mt */}
              Quero Começar Agora
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/95 border-t border-slate-700 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          Eduqly Academy © 2025
        </div>
      </footer>
    </div>
  );
}

