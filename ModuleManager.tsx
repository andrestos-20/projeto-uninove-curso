import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Trash2, Eye, Plus, Loader, X, Globe, Youtube, FileText, Music, Film, Presentation } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";

export default function ModuleManager() {
  const utils = trpc.useUtils();
  const { data: modules = [], isLoading } = trpc.modules.list.useQuery();
  const updateModuleMutation = trpc.modules.update.useMutation({
    onSuccess: () => {
      utils.modules.list.invalidate();
    },
  });
  
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [newMaterialType, setNewMaterialType] = useState("");
  const [newMaterialData, setNewMaterialData] = useState({ 
    name: "", 
    url: "", 
    file: null as File | null,
    iframeCode: ""
  });
  const [materialError, setMaterialError] = useState("");
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);

  // Estados para edição de informações do módulo
  const [editData, setEditData] = useState({
    title: "",
    instructor: "",
    duration: "",
    format: "",
    description: ""
  });

  const uploadAudioMutation = trpc.modules.uploadAudio.useMutation();

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  // Inicializar editData quando o módulo selecionado muda
  useEffect(() => {
    if (selectedModule) {
      setEditData({
        title: selectedModule.title || "",
        instructor: selectedModule.instructor || "",
        duration: selectedModule.duration || "",
        format: selectedModule.format || "",
        description: selectedModule.description || ""
      });
      setIsEditing(false);
    }
  }, [selectedModule]);

  const handleSaveModule = async () => {
    if (!selectedModule) return;
    
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        title: editData.title,
        instructor: editData.instructor,
        duration: editData.duration,
        format: editData.format,
        description: editData.description,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!selectedModule) return;
    
    const updatedFiles = selectedModule.files.filter(f => f.id !== fileId);
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        files: updatedFiles as any,
      });
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
    }
  };

  const handleUploadAudio = async (file: File) => {
    if (!file) return;
    
    setIsUploadingAudio(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = (e.target?.result as string).split(',')[1];
        const contentType = file.type || 'audio/mpeg';
        
        try {
          const result = await uploadAudioMutation.mutateAsync({
            fileName: file.name,
            fileData: base64Data,
            contentType,
          });
          
          // Update the URL with the uploaded file URL
          setNewMaterialData({ ...newMaterialData, url: result.url, file: null });
          setMaterialError("");
        } catch (error) {
          setMaterialError(`Erro ao fazer upload do áudio: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
          setIsUploadingAudio(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMaterialError("Erro ao processar arquivo");
      setIsUploadingAudio(false);
    }
  };

  const handleAddMaterial = async () => {
    setMaterialError("");
    
    if (!selectedModule || !newMaterialType || !newMaterialData.name) {
      setMaterialError("Por favor, preencha o nome do material");
      return;
    }
    
    // Validar URL para tipos que requerem URL
    if ((newMaterialType === "webpage" || newMaterialType === "youtube" || newMaterialType === "pdf" || newMaterialType === "powerpoint" || newMaterialType === "video" || newMaterialType === "audio") && !newMaterialData.url) {
      setMaterialError(`Por favor, preencha a URL do material`);
      return;
    }

    // Validar código iframe para tipo iframe
    if (newMaterialType === "iframe" && !newMaterialData.iframeCode && !newMaterialData.url) {
      setMaterialError("Por favor, preencha o código iframe ou a URL");
      return;
    }
    
    // Validar arquivo para tipos que requerem arquivo
    if (newMaterialType === "file" && !newMaterialData.file) {
      setMaterialError(`Por favor, selecione um arquivo`);
      return;
    }
    
    // Map frontend types to database types
    const typeMap: Record<string, "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage"> = {
      "youtube": "video",
      "video": "video",
      "webpage": "webpage",
      "pdf": "pdf",
      "powerpoint": "powerpoint",
      "file": "pdf",
      "audio": "audio",
      "iframe": "iframe"
    };
    
    const newMaterial = {
      id: `material-${Date.now()}`,
      type: (typeMap[newMaterialType] || "video") as "video" | "audio" | "pdf" | "powerpoint" | "iframe" | "webpage",
      name: newMaterialData.name,
      url: newMaterialData.url || undefined,
      iframeCode: newMaterialType === "iframe" ? newMaterialData.iframeCode : undefined,
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedFiles = [...(selectedModule.files || []), newMaterial];
    try {
      await updateModuleMutation.mutateAsync({
        id: selectedModule.id,
        files: updatedFiles as any,
      });
      
      setNewMaterialType("");
      setNewMaterialData({ name: "", url: "", file: null, iframeCode: "" });
      setShowAddMaterial(false);
      setMaterialError("");
    } catch (error) {
      setMaterialError("Erro ao adicionar material. Tente novamente.");
      console.error("Erro ao adicionar material:", error);
    }
  };

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case "webpage": return <Globe className="w-4 h-4" />;
      case "video": return <Youtube className="w-4 h-4" />;
      case "pdf": return <FileText className="w-4 h-4" />;
      case "audio": return <Music className="w-4 h-4" />;
      case "powerpoint": return <Presentation className="w-4 h-4" />;
      case "iframe": return <Film className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      webpage: "Página Web",
      video: "Vídeo",
      pdf: "PDF",
      audio: "Áudio",
      powerpoint: "PowerPoint",
      iframe: "Conteúdo Embutido"
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-slate-300">Carregando módulos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">Eduqly Academy</span>
            </a>
          </div>
          <div className="flex gap-2">
            <a href="/admin/alunos">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700">
                👥 Alunos
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Voltar
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Module List */}
          <div className="md:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Módulos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedModuleId === module.id
                        ? "bg-purple-600/20 border-purple-500"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">Módulo {module.id}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{module.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{module.files.length} material(is)</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Module Details */}
          <div className="md:col-span-3 space-y-6">
            {selectedModule && (
              <>
                {/* Module Header */}
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-white">Módulo {selectedModule.id}: {selectedModule.title}</h1>
                  <div className="flex gap-2">
                    {isEditing && (
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          // Revert changes
                          setEditData({
                            title: selectedModule.title || "",
                            instructor: selectedModule.instructor || "",
                            duration: selectedModule.duration || "",
                            format: selectedModule.format || "",
                            description: selectedModule.description || ""
                          });
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        if (isEditing) {
                          handleSaveModule();
                        } else {
                          setIsEditing(true);
                        }
                      }}
                      className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}
                    >
                      {isEditing ? "Salvar Alterações" : "Editar Módulo"}
                    </Button>
                  </div>
                </div>

                {/* Module Info */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Informações do Módulo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Título</label>
                      <Input
                        disabled={!isEditing}
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Instrutor(a)</label>
                      <Input
                        disabled={!isEditing}
                        value={editData.instructor}
                        onChange={(e) => setEditData({ ...editData, instructor: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Duração</label>
                        <Input
                          disabled={!isEditing}
                          value={editData.duration}
                          onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Formato</label>
                        <Input
                          disabled={!isEditing}
                          value={editData.format}
                          onChange={(e) => setEditData({ ...editData, format: e.target.value })}
                          className="bg-slate-900 border-slate-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Descrição "Sobre esta aula"</label>
                      <Textarea
                        disabled={!isEditing}
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="bg-slate-900 border-slate-700 text-white min-h-24"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Materials Section */}
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Materiais e Recursos ({selectedModule.files.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Material List */}
                    {selectedModule.files.length > 0 && (
                      <div className="space-y-2">
                        {selectedModule.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-700 hover:border-slate-600 transition">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-purple-400">
                                {getMaterialIcon(file.type)}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{file.name}</p>
                                <p className="text-slate-500 text-xs">{getMaterialTypeLabel(file.type)}</p>
                                {file.url && <p className="text-slate-600 text-xs truncate">{file.url}</p>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setPreviewFile(file)}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {isEditing && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Material Button */}
                    {isEditing && !showAddMaterial && (
                      <Button
                        onClick={() => setShowAddMaterial(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                      </Button>
                    )}

                    {/* Add Material Form */}
                    {isEditing && showAddMaterial && (
                      <div className="p-4 bg-slate-900 rounded border border-slate-700 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Tipo de Material</label>
                          <select
                            value={newMaterialType}
                            onChange={(e) => setNewMaterialType(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
                          >
                            <option value="">Selecione um tipo</option>
                            <option value="youtube">YouTube</option>
                            <option value="video">Vídeo (MP4)</option>
                            <option value="audio">Áudio</option>
                            <option value="pdf">PDF</option>
                            <option value="powerpoint">PowerPoint</option>
                            <option value="webpage">Página Web</option>
                            <option value="iframe">Conteúdo Embutido (iframe)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Material</label>
                          <Input
                            value={newMaterialData.name}
                            onChange={(e) => setNewMaterialData({ ...newMaterialData, name: e.target.value })}
                            placeholder="Ex: Aula 1 - Introdução"
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>

                        {newMaterialType === "audio" && (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Upload de Áudio</label>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleUploadAudio(e.target.files[0]);
                                }
                              }}
                              disabled={isUploadingAudio}
                              className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2"
                            />
                            {isUploadingAudio && <p className="text-sm text-slate-400 mt-2">Enviando...</p>}
                          </div>
                        )}

                        {newMaterialType && newMaterialType !== "audio" && (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                              {newMaterialType === "iframe" ? "Código iframe ou URL" : "URL do Material"}
                            </label>
                            <Input
                              value={newMaterialData.url}
                              onChange={(e) => setNewMaterialData({ ...newMaterialData, url: e.target.value })}
                              placeholder={newMaterialType === "iframe" ? "Cole o código iframe ou URL" : "https://..."}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                        )}

                        {newMaterialType === "iframe" && (
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Código iframe</label>
                            <Textarea
                              value={newMaterialData.iframeCode}
                              onChange={(e) => setNewMaterialData({ ...newMaterialData, iframeCode: e.target.value })}
                              placeholder="<iframe src='...' ...></iframe>"
                              className="bg-slate-800 border-slate-700 text-white min-h-20"
                            />
                          </div>
                        )}

                        {materialError && (
                          <p className="text-sm text-red-400">{materialError}</p>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddMaterial}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            Adicionar
                          </Button>
                          <Button
                            onClick={() => {
                              setShowAddMaterial(false);
                              setNewMaterialType("");
                              setNewMaterialData({ name: "", url: "", file: null, iframeCode: "" });
                              setMaterialError("");
                            }}
                            className="flex-1 bg-slate-700 hover:bg-slate-600"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">{previewFile.name}</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {previewFile.type === "video" && previewFile.url && (
                <video controls className="w-full rounded">
                  <source src={previewFile.url} type="video/mp4" />
                </video>
              )}
              {previewFile.type === "audio" && previewFile.url && (
                <audio controls className="w-full">
                  <source src={previewFile.url} />
                </audio>
              )}
              {previewFile.type === "pdf" && previewFile.url && (
                <iframe src={previewFile.url} className="w-full h-96 rounded" />
              )}
              {previewFile.type === "webpage" && previewFile.url && (
                <iframe src={previewFile.url} className="w-full h-96 rounded" />
              )}
              {previewFile.type === "iframe" && previewFile.iframeCode && (
                <div dangerouslySetInnerHTML={{ __html: previewFile.iframeCode }} />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

