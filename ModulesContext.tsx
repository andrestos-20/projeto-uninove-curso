import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ModuleFile {
  id: string;
  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe";
  name: string;
  url?: string;
  iframeCode?: string;
  uploadedAt: string;
}

export interface Module {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  format: string;
  description: string;
  files: ModuleFile[];
}

interface ModulesContextType {
  modules: Module[];
  updateModule: (module: Module) => void;
  getModule: (id: number) => Module | undefined;
  addFileToModule: (moduleId: number, file: ModuleFile) => void;
  removeFileFromModule: (moduleId: number, fileId: string) => void;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

const initialModules: Module[] = [
  {
    id: 1,
    title: "Introdução ao tema: Por que analisar dados?",
    instructor: "Isabela",
    duration: "5 min",
    format: "Vídeo introdutório",
    description:
      "Entenda a importância fundamental da análise de dados para decisões estratégicas.",
    files: [
      {
        id: "1-1",
        type: "video",
        name: "introducao.mp4",
        url: "https://example.com/videos/introducao.mp4",
        uploadedAt: "2025-01-15",
      },
      {
        id: "1-2",
        type: "audio",
        name: "aula_audio.mp3",
        url: "https://example.com/audios/aula.mp3",
        uploadedAt: "2025-01-15",
      },
    ],
  },
  {
    id: 2,
    title: "Conceitos e Fundamentos do Power BI",
    instructor: "Julia",
    duration: "15 min",
    format: "Slides narrados / e-book",
    description: "Aprenda os conceitos essenciais do Power BI.",
    files: [
      {
        id: "2-1",
        type: "powerpoint",
        name: "slides_powerbi.pptx",
        url: "https://example.com/slides/powerbi.pptx",
        uploadedAt: "2025-01-16",
      },
      {
        id: "2-2",
        type: "pdf",
        name: "ebook_powerbi.pdf",
        url: "https://example.com/pdfs/ebook.pdf",
        uploadedAt: "2025-01-16",
      },
    ],
  },
  {
    id: 3,
    title: "Aplicações Práticas na Administração e Restaurantes",
    instructor: "Melissa, Ellen",
    duration: "20 min",
    format: "Estudo de caso",
    description: "Veja exemplos reais de como usar Power BI em negócios.",
    files: [
      {
        id: "3-1",
        type: "pdf",
        name: "caso_estudo.pdf",
        url: "https://example.com/pdfs/caso.pdf",
        uploadedAt: "2025-01-17",
      },
    ],
  },
  {
    id: 4,
    title: "Tutorial Passo a Passo no Power BI",
    instructor: "André, Alexandre",
    duration: "30 min",
    format: "Screencast / guia prático",
    description: "Aprenda na prática como criar dashboards.",
    files: [
      {
        id: "4-1",
        type: "video",
        name: "tutorial_screencast.mp4",
        url: "https://example.com/videos/tutorial.mp4",
        uploadedAt: "2025-01-18",
      },
    ],
  },
  {
    id: 5,
    title: "Atividade Interativa (Quiz)",
    instructor: "Nathalia",
    duration: "10 min",
    format: "Kahoot / Google Forms",
    description: "Teste seus conhecimentos com perguntas interativas.",
    files: [
      {
        id: "5-1",
        type: "iframe",
        name: "Kahoot Quiz",
        iframeCode: '<iframe src="https://kahoot.it/quiz" width="100%" height="600"></iframe>',
        uploadedAt: "2025-01-19",
      },
    ],
  },
];

export function ModulesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>(initialModules);

  const updateModule = (updatedModule: Module) => {
    setModules((prevModules) =>
      prevModules.map((m) => (m.id === updatedModule.id ? updatedModule : m))
    );
  };

  const getModule = (id: number) => {
    return modules.find((m) => m.id === id);
  };

  const addFileToModule = (moduleId: number, file: ModuleFile) => {
    setModules((prevModules) =>
      prevModules.map((m) =>
        m.id === moduleId ? { ...m, files: [...m.files, file] } : m
      )
    );
  };

  const removeFileFromModule = (moduleId: number, fileId: string) => {
    setModules((prevModules) =>
      prevModules.map((m) =>
        m.id === moduleId
          ? { ...m, files: m.files.filter((f) => f.id !== fileId) }
          : m
      )
    );
  };

  return (
    <ModulesContext.Provider
      value={{
        modules,
        updateModule,
        getModule,
        addFileToModule,
        removeFileFromModule,
      }}
    >
      {children}
    </ModulesContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModulesContext);
  if (context === undefined) {
    throw new Error("useModules must be used within a ModulesProvider");
  }
  return context;
}

