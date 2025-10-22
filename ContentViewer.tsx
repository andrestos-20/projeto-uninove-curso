import { useState } from "react";
import { X, Download, ExternalLink, Volume2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Material {
  id: string;
  type: "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage";
  name: string;
  url?: string;
  iframeCode?: string;
  uploadedAt: string;
}

interface ContentViewerProps {
  material: Material | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContentViewer({ material, isOpen, onClose }: ContentViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen || !material) return null;

  const renderContent = () => {
    switch (material.type) {
      case "video":
        if (material.url?.includes("youtube.com") || material.url?.includes("youtu.be")) {
          // Extract YouTube video ID
          const youtubeId = material.url.includes("youtu.be")
            ? material.url.split("/").pop()
            : new URL(material.url).searchParams.get("v");
          return (
            <iframe
              width="100%"
              height="600"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={material.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          );
        } else if (material.url?.endsWith(".mp4") || material.url?.endsWith(".webm")) {
          return (
            <video
              width="100%"
              height="600"
              controls
              className="rounded-lg bg-black"
            >
              <source src={material.url} type={material.url.endsWith(".mp4") ? "video/mp4" : "video/webm"} />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          );
        }
        break;

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 min-h-[300px]">
            <div className="mb-6 p-4 bg-purple-600/20 rounded-full">
              <Volume2 className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{material.name}</h3>
            <audio
              controls
              className="w-full max-w-md mb-6"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={material.url} type="audio/mpeg" />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        );

      case "pdf":
        return (
          <div className="flex flex-col gap-4">
            <iframe
              src={`${material.url}#toolbar=1&navpanes=0&scrollbar=1`}
              width="100%"
              height="600"
              title={material.name}
              className="rounded-lg border border-slate-700"
            ></iframe>
            {material.url && (
              <a
                href={material.url}
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Baixar PDF
              </a>
            )}
          </div>
        );

      case "powerpoint":
        return (
          <div className="flex flex-col gap-4">
            {material.url?.endsWith(".pptx") || material.url?.endsWith(".ppt") ? (
              <>
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.url)}`}
                  width="100%"
                  height="600"
                  title={material.name}
                  className="rounded-lg border border-slate-700"
                ></iframe>
                <a
                  href={material.url}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Baixar PowerPoint
                </a>
              </>
            ) : (
              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-300 mb-4">PowerPoint não pode ser visualizado diretamente</p>
                <a
                  href={material.url}
                  download
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Baixar PowerPoint
                </a>
              </div>
            )}
          </div>
        );

      case "iframe":
        return (
          <div className="flex flex-col gap-4">
            {material.iframeCode ? (
              <div
                className="rounded-lg border border-slate-700 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: material.iframeCode }}
              ></div>
            ) : material.url ? (
              <iframe
                src={material.url}
                width="100%"
                height="600"
                title={material.name}
                className="rounded-lg border border-slate-700"
              ></iframe>
            ) : (
              <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                <p className="text-slate-300">Conteúdo não disponível</p>
              </div>
            )}
          </div>
        );

      case "webpage":
        return (
          <div className="flex flex-col gap-4">
            <iframe
              src={material.url}
              width="100%"
              height="600"
              title={material.name}
              className="rounded-lg border border-slate-700"
            ></iframe>
            {material.url && (
              <a
                href={material.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir em Nova Aba
              </a>
            )}
          </div>
        );

      default:
        return (
          <div className="p-8 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
            <p className="text-slate-300">Tipo de conteúdo não suportado: {material.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold text-white">{material.name}</h2>
            <p className="text-sm text-slate-400 mt-1">Tipo: {material.type}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

