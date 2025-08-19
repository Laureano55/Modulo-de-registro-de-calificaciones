import { EditableGradesTable } from "./components/EditableGradesTable";
import { Header } from "./components/Header";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
              Módulo de Registro de Calificaciones
            </h2>
            <p className="text-muted-foreground text-base">
              Haz clic en cualquier calificación para editarla directamente en
              la tabla
            </p>
          </div>
          <EditableGradesTable />
        </div>
      </main>
    </div>
  );
}

export default App;
