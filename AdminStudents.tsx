import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Plus, Trash2, Edit, Check, X, Eye, EyeOff } from "lucide-react";

export default function AdminStudents() {
  const [, setLocation] = useLocation();
  const [students, setStudents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: "true",
  });

  const studentsQuery = trpc.admin.students.list.useQuery();
  const createMutation = trpc.admin.students.create.useMutation();
  const updateMutation = trpc.admin.students.update.useMutation();
  const deleteMutation = trpc.admin.students.delete.useMutation();

  useEffect(() => {
    if (studentsQuery.data) {
      setStudents(studentsQuery.data);
    }
  }, [studentsQuery.data]);

  const handleAddStudent = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const newStudent = await createMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isActive: formData.isActive as "true" | "false",
      });

      if (newStudent) {
        setStudents([...students, newStudent]);
        setFormData({ name: "", email: "", password: "", isActive: "true" });
      }
    } catch (error: any) {
      alert("Erro ao criar aluno: " + error.message);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este aluno?")) return;

    try {
      const success = await deleteMutation.mutateAsync({ id });
      if (success) {
        setStudents(students.filter((s) => s.id !== id));
      }
    } catch (error: any) {
      alert("Erro ao deletar aluno: " + error.message);
    }
  };

  const handleUpdateStudent = async (id: number) => {
    const student = students.find((s) => s.id === id);
    if (!student) return;

    try {
      const updated = await updateMutation.mutateAsync({
        id,
        name: student.name,
        email: student.email,
        password: student.password,
        isActive: student.isActive,
      });

      if (updated) {
        setStudents(students.map((s) => (s.id === id ? updated : s)));
        setEditingId(null);
      }
    } catch (error: any) {
      alert("Erro ao atualizar aluno: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Gerenciar Alunos</h1>
            <p className="text-slate-400 mt-2">Adicione, edite ou remova alunos do curso</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setLocation("/admin/modulos")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              📚 Módulos
            </Button>
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              ← Voltar
            </Button>
          </div>
        </div>

        {/* Add Student Form */}
        <Card className="bg-slate-800/50 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Novo Aluno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <select
                value={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-white rounded px-3 py-2"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
            <Button
              onClick={handleAddStudent}
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Aluno
            </Button>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Alunos Cadastrados ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Nome</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Senha</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">
                        {editingId === student.id ? (
                          <Input
                            value={student.name}
                            onChange={(e) =>
                              setStudents(
                                students.map((s) =>
                                  s.id === student.id ? { ...s, name: e.target.value } : s
                                )
                              )
                            }
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        ) : (
                          student.name
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {editingId === student.id ? (
                          <Input
                            type="email"
                            value={student.email}
                            onChange={(e) =>
                              setStudents(
                                students.map((s) =>
                                  s.id === student.id ? { ...s, email: e.target.value } : s
                                )
                              )
                            }
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        ) : (
                          student.email
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          {editingId === student.id ? (
                            <Input
                              type={showPassword[student.id] ? "text" : "password"}
                              value={student.password}
                              onChange={(e) =>
                                setStudents(
                                  students.map((s) =>
                                    s.id === student.id ? { ...s, password: e.target.value } : s
                                  )
                                )
                              }
                              className="bg-slate-900 border-slate-700 text-white"
                            />
                          ) : (
                            <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded">
                              {student.password}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setShowPassword({
                                ...showPassword,
                                [student.id]: !showPassword[student.id],
                              })
                            }
                            className="text-slate-400 hover:text-white"
                          >
                            {showPassword[student.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            student.isActive === "true"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {student.isActive === "true" ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {editingId === student.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateStudent(student.id)}
                                className="p-1 bg-green-600 hover:bg-green-700 rounded text-white"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 bg-slate-600 hover:bg-slate-700 rounded text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingId(student.id)}
                                className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="p-1 bg-red-600 hover:bg-red-700 rounded text-white"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  Nenhum aluno cadastrado ainda. Adicione um novo aluno acima!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
