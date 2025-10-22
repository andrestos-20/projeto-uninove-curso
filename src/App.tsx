// src/App.tsx
import { useEffect, useState } from "react";

/** Mini roteador sem dependências (history API) */
function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function navigate(to: string) {
    if (to !== path) {
      window.history.pushState({}, "", to);
      setPath(to);
    }
  }

  return { path, navigate };
}

/** Layout simples */
function Page({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <div>{children}</div>
    </div>
  );
}

/** Páginas (troque o conteúdo pelo seu) */
function Home() {
  return (
    <Page title="Início">
      <p>Bem-vindo! Edite este texto com o conteúdo da sua Home.</p>
    </Page>
  );
}

function Course() {
  return (
    <Page title="Curso">
      <p>Descrição do curso, módulos, links…</p>
    </Page>
  );
}

function AdminLogin() {
  return (
    <Page title="Login do Admin">
      <p>Formulário de login do administrador (conteúdo ilustrativo).</p>
    </Page>
  );
}

function ModuleManager() {
  return (
    <Page title="Gerenciar Módulos">
      <p>Tela de gerenciamento de módulos (conteúdo ilustrativo).</p>
    </Page>
  );
}

function StudentLogin() {
  return (
    <Page title="Login do Aluno">
      <p>Formulário de login do aluno (conteúdo ilustrativo).</p>
    </Page>
  );
}

function AdminStudents() {
  return (
    <Page title="Alunos (Admin)">
      <p>Lista/gestão de alunos (conteúdo ilustrativo).</p>
    </Page>
  );
}

function NotFound() {
  return (
    <Page title="404 — Página não encontrada">
      <p>O endereço acessado não existe.</p>
    </Page>
  );
}

/** Navbar simples */
function Nav({ go }: { go: (to: string) => void }) {
  const Link = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a
      href={to}
      onClick={(e) => {
        e.preventDefault();
        go(to);
      }}
      style={{ marginRight: 12 }}
    >
      {children}
    </a>
  );
  return (
    <div style={{ padding: "12px 20px", borderBottom: "1px solid #eee", fontFamily: "system-ui, Arial" }}>
      <Link to="/">Início</Link>
      <Link to="/curso">Curso</Link>
      <Link to="/login">Login Aluno</Link>
      <Link to="/admin/login">Login Admin</Link>
      <Link to="/admin/modulos">Módulos</Link>
      <Link to="/admin/alunos">Alunos</Link>
    </div>
  );
}

/** App com rotas */
export default function App() {
  const { path, navigate } = useRoute();

  let screen: JSX.Element;
  switch (path) {
    case "/":
      screen = <Home />;
      break;
    case "/curso":
      screen = <Course />;
      break;
    case "/admin/login":
      screen = <AdminLogin />;
      break;
    case "/admin/modulos":
      screen = <ModuleManager />;
      break;
    case "/login":
      screen = <StudentLogin />;
      break;
    case "/admin/alunos":
      screen = <AdminStudents />;
      break;
    default:
      screen = <NotFound />;
  }

  return (
    <>
      <Nav go={navigate} />
      {screen}
    </>
  );
}
