"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Save, Loader2 } from "lucide-react";

const periods = [
  { key: "202510", name: "2025-1" },
  { key: "202520", name: "2025-2" },
  { key: "202530", name: "2025-3" },
  { key: "202610", name: "2026-1" },
  { key: "202620", name: "2026-2" },
];

type StudentMapped = {
  id: number;
  student: string;
  corte1: number | null;
  corte2: number | null;
  corte3: number | null;
  corte4: number | null;
};

function mapStudents(data: any): StudentMapped[] {
  return data.estudiantes.map((est) => {
    const cortes: Record<number, number | null> = {};
    est.calificaciones.forEach((c) => {
      cortes[c.numero_corte] = c.calificacion;
    });

    return {
      id: est.id_estudiante,
      student: `${est.nombre} ${est.apellido}`,
      corte1: cortes[1] ?? null,
      corte2: cortes[2] ?? null,
      corte3: cortes[3] ?? null,
      corte4: cortes[4] ?? null,
    };
  });
}

interface curso {
  id_curso: number;
  nm_curso: string;
}

interface OldFormat {
  periodo: string;
  curso: string;
  grades: {
    studentId: number;
    studentName: string;
    grades: { [key: string]: number | null };
  }[];
}

interface NewFormat {
  curso: number;
  calificaciones: {
    fk_estudiante: number;
    cortes: { corte: number; calificacion: number | null }[];
  }[];
}

class GradesAdapter {
  constructor(private oldData: OldFormat) {}

  public toNewFormat(): NewFormat {
    return {
      curso: this.oldData.curso,
      calificaciones: this.oldData.grades.map((student) => ({
        fk_estudiante: student.studentId,
        cortes: [1, 2, 3, 4].map((corte) => ({
          fk_corte: corte,
          calificacion: student.grades[`corte${corte}`] ?? null,
        })),
      })),
    };
  }
}

export function EditableGradesTable() {
  const [selectedPeriod, setSelectedPeriod] = useState("202510");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [availableCourses, setAvailableCourses] = useState<curso[]>([]);
  const [currentCourseData, setCurrentCourseData] = useState({
    cortes: 4,
    percentages: [25, 25, 25, 25],
  });

  const [studentsData, setStudentsData] = useState<StudentMapped[]>([]);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const periodo = Number(selectedPeriod);
        const response = await fetch(
          `http://localhost:3000/grades/cursos?periodo=${periodo}`
        );
        if (!response.ok) {
          throw new Error("Error al cargar cursos");
        }

        const data = await response.json();
        const availableCourses: curso[] = data.cursos; // asegúrate que la respuesta tenga esta estructura
        // console.log("Cursos disponibles:", availableCourses);
        setAvailableCourses(availableCourses);

        if (availableCourses.length > 0) {
          const firstCourse = availableCourses[0];
          setSelectedCourse(firstCourse.nm_curso);
        } else {
          setSelectedCourse(""); // limpiar si no hay cursos
        }
      } catch (error) {
        console.error("Error cargando cursos:", error);
      }
    };

    loadCourses();
  }, [selectedPeriod]);

  useEffect(() => {
    const loadStudentsAndGrades = async () => {
      try {
        if (!selectedCourse) return; // evitar fetch si no hay curso seleccionado

        // buscar el curso completo en base al nombre
        const selected = availableCourses.find(
          (c) => c.nm_curso === selectedCourse
        );

        if (!selected) {
          console.warn("No se encontró el curso seleccionado");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/grades/estudiantes?id_curso=${selected.id_curso}`
        );

        if (!response.ok) {
          throw new Error("Error al cargar estudiantes y notas");
        }

        const data = await response.json();

        console.log("Estudiantes y notas cargados:", data);
        const mapped = mapStudents(data);
        console.log("Datos mapeados:", mapped);
        setStudentsData(mapped);
        const cortes =
          data.estudiantes && data.estudiantes.length > 0
            ? data.estudiantes[0].calificaciones.length
            : 0;
        const percentages =
          data.estudiantes && data.estudiantes.length > 0
            ? data.estudiantes[0].calificaciones.map((c) => c.porcentaje)
            : [];
        setCurrentCourseData({
          cortes,
          percentages,
        });
      } catch (error) {
        console.error("Error cargando estudiantes y notas:", error);
      }
    };

    loadStudentsAndGrades();
  }, [selectedCourse, availableCourses]);

  const handlePeriodChange = (periodKey: string) => {
    setSelectedPeriod(periodKey);
    setEditingCell(null);
  };

  const handleCourseChange = (courseKey: string) => {
    setSelectedCourse(courseKey);
    setEditingCell(null);
  };

  const handleCellClick = (
    studentId: number,
    corte: string,
    currentValue: number | null
  ) => {
    const cellKey = `${studentId}-${corte}`;
    setEditingCell(cellKey);
    setTempValue(currentValue?.toString() || "");
  };

  const handleSaveGrade = (studentId: number, corte: string) => {
    const newGrade = tempValue === "" ? null : Number.parseFloat(tempValue);
    if (newGrade === null || (newGrade >= 0 && newGrade <= 5)) {
      setStudentsData((prev) =>
        prev.map((student) =>
          student.id === studentId ? { ...student, [corte]: newGrade } : student
        )
      );
    }
    setEditingCell(null);
    setTempValue("");
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    studentId: number,
    corte: string
  ) => {
    if (e.key === "Enter") {
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, "down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, e.shiftKey ? "up" : "down");
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setTempValue("");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, "down");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, "up");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, "right");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSaveGrade(studentId, corte);
      moveToNextCell(studentId, corte, "left");
    }
  };

  const moveToNextCell = (
    currentStudentId: number,
    currentCorte: string,
    direction: "up" | "down" | "left" | "right"
  ) => {
    const cortes = getDynamicCortes();
    const currentStudentIndex = studentsData.findIndex(
      (s) => s.id === currentStudentId
    );
    const currentCorteIndex = cortes.findIndex((c) => c.key === currentCorte);

    let nextStudentIndex = currentStudentIndex;
    let nextCorteIndex = currentCorteIndex;

    switch (direction) {
      case "down":
        nextStudentIndex = Math.min(
          currentStudentIndex + 1,
          studentsData.length - 1
        );
        break;
      case "up":
        nextStudentIndex = Math.max(currentStudentIndex - 1, 0);
        break;
      case "right":
        if (currentCorteIndex < cortes.length - 1) {
          nextCorteIndex = currentCorteIndex + 1;
        } else if (currentStudentIndex < studentsData.length - 1) {
          nextStudentIndex = currentStudentIndex + 1;
          nextCorteIndex = 0;
        }
        break;
      case "left":
        if (currentCorteIndex > 0) {
          nextCorteIndex = currentCorteIndex - 1;
        } else if (currentStudentIndex > 0) {
          nextStudentIndex = currentStudentIndex - 1;
          nextCorteIndex = cortes.length - 1;
        }
        break;
    }

    if (
      nextStudentIndex !== currentStudentIndex ||
      nextCorteIndex !== currentCorteIndex
    ) {
      const nextStudent = studentsData[nextStudentIndex];
      const nextCorte = cortes[nextCorteIndex];
      setTimeout(() => {
        handleCellClick(
          nextStudent.id,
          nextCorte.key,
          nextStudent[nextCorte.key as keyof typeof nextStudent] as
            | number
            | null
        );
      }, 50);
    }
  };

  const handleInputChange = (value: string) => {
    setTempValue(value);
  };

  const handleBlur = (studentId: number, corte: string) => {
    handleSaveGrade(studentId, corte);
  };

  const calculateDefinitiva = (student: any) => {
    const numCortes = currentCourseData?.cortes || 4;
    const percentages = currentCourseData?.percentages || [];
    let definitiva = 0;

    for (let i = 1; i <= numCortes; i++) {
      const grade = student[`corte${i}`];
      const percentage = percentages[i - 1] || 0;

      // Si la nota es null o undefined, usar 0
      const gradeValue = grade !== null && grade !== undefined ? grade : 0;
      definitiva += gradeValue * (percentage / 100);
    }

    // Si no hay ninguna nota ingresada, mostrar "-"
    const hasAnyGrade = Array.from(
      { length: numCortes },
      (_, i) => student[`corte${i + 1}`]
    ).some((grade) => grade !== null && grade !== undefined);

    if (!hasAnyGrade) return "-";

    return definitiva.toFixed(1);
  };

  const getDynamicCortes = () => {
    const numCortes = currentCourseData?.cortes || 4;
    const percentages = currentCourseData?.percentages || [];

    return Array.from({ length: numCortes }, (_, i) => ({
      key: `corte${i + 1}`,
      name: `Corte ${i + 1}`,
      percentage: percentages[i] || 0,
    }));
  };

  const handleSaveAllGrades = async () => {
    setIsSaving(true);

    // Filtrar solo las calificaciones que no están vacías
    const gradesToSave = studentsData.reduce((acc, student) => {
      const studentGrades: any = {
        studentId: student.id,
        studentName: student.student,
        grades: {},
      };

      const cortes = getDynamicCortes();
      cortes.forEach((corte) => {
        const grade = student[corte.key as keyof typeof student];
        if (grade !== null && grade !== undefined) {
          studentGrades.grades[corte.key] = grade;
        }
      });

      // Solo incluir estudiantes que tengan al menos una calificación
      if (Object.keys(studentGrades.grades).length > 0) {
        acc.push(studentGrades);
      }
      return acc;
    }, [] as any[]);

    // envío al backend

    const oldJson: OldFormat = {
      periodo: selectedPeriod,
      curso: availableCourses.find(
        (course) => course.nm_curso === selectedCourse
      )?.id_curso,
      grades: gradesToSave,
    };

    const adapter = new GradesAdapter(oldJson);
    const newJson = adapter.toNewFormat();
    console.log("Nuevo formato de calificaciones:", newJson);

    try {
      const response = await fetch("http://localhost:3000/grades/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJson),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      console.log("Calificaciones guardadas exitosamente:", data);
    } catch (error) {
      console.error("Error al guardar calificaciones:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFilledGradesCount = () => {
    return studentsData.reduce((count, student) => {
      const cortes = getDynamicCortes();
      return (
        count +
        cortes.filter((corte) => {
          const grade = student[corte.key as keyof typeof student];
          return grade !== null && grade !== undefined;
        }).length
      );
    }, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-foreground">
          Registro de Calificaciones
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Haz clic para editar • Enter/Tab para siguiente • Flechas para
            navegar
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Período:</span>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.key} value={period.key}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Materia:</span>
              <Select value={selectedCourse} onValueChange={handleCourseChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id_curso} value={course.nm_curso}>
                      {course.nm_curso}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Estudiante</TableHead>
                {getDynamicCortes().map((corte) => (
                  <TableHead
                    key={corte.key}
                    className="font-semibold text-center"
                  >
                    <div className="flex flex-col">
                      <span>{corte.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        ({corte.percentage}%)
                      </span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="font-semibold text-center">
                  Definitiva
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData.map((student) => {
                const definitiva = calculateDefinitiva(student);

                return (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {student.student}
                    </TableCell>
                    {getDynamicCortes().map((corte) => {
                      const cellKey = `${student.id}-${corte.key}`;
                      const isEditing = editingCell === cellKey;
                      const grade = student[
                        corte.key as keyof typeof student
                      ] as number | null;

                      return (
                        <TableCell key={corte.key} className="text-center">
                          {isEditing ? (
                            <Input
                              ref={inputRef}
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={tempValue}
                              onChange={(e) =>
                                handleInputChange(e.target.value)
                              }
                              onKeyDown={(e) =>
                                handleKeyPress(e, student.id, corte.key)
                              }
                              onBlur={() => handleBlur(student.id, corte.key)}
                              className="w-16 text-center [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                              autoFocus
                              placeholder="0.0"
                            />
                          ) : (
                            <div
                              className={`cursor-pointer hover:bg-muted/50 rounded px-2 py-1 font-semibold text-lg transition-colors ${
                                grade !== null
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() =>
                                handleCellClick(student.id, corte.key, grade)
                              }
                            >
                              {grade !== null ? grade.toFixed(1) : "-"}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <span className="font-bold text-lg text-primary">
                        {definitiva}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSaveAllGrades}
            disabled={isSaving || getFilledGradesCount() === 0}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
