import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const bloquesDelDia = [
  {
    hora: "08:30 – 12:00",
    label: "Bloque 1",
    color: "bg-blue-300",
    subColor: "bg-blue-100",
    subbloques: [
      { hora: "08:30 – 09:30", tono: "bg-blue-50" },
      { hora: "09:30 – 10:30", tono: "bg-blue-100" },
      { hora: "10:30 – 12:00", tono: "bg-blue-200" }
    ]
  },
  {
    hora: "13:00 – 15:30",
    label: "Bloque 2",
    color: "bg-green-300",
    subColor: "bg-green-100",
    subbloques: [
      { hora: "13:00 – 14:15", tono: "bg-green-50" },
      { hora: "14:15 – 15:30", tono: "bg-green-100" }
    ]
  }
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const moviles = ["Móvil 1", "Móvil 2"];

export default function CalendarioInteractivo() {
  const [bloques, setBloques] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [asignaciones, setAsignaciones] = useState({});
  const [titulos, setTitulos] = useState({});

  const agregarBloque = () => {
    if (nuevoNombre.trim() === "") return;
    setBloques([
      ...bloques,
      { id: Date.now(), nombre: nuevoNombre }
    ]);
    setNuevoNombre("");
  };

  const eliminarBloque = (id) => {
    const bloqueEliminado = bloques.find((b) => b.id === id);
    setBloques(bloques.filter((bloque) => bloque.id !== id));
    if (!bloqueEliminado) return;

    setAsignaciones((prev) => {
      const nuevas = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (value?.id !== bloqueEliminado.id) {
          nuevas[key] = value;
        }
      });
      return nuevas;
    });
  };

  const editarBloque = (id, nuevoTexto) => {
    setBloques((prevBloques) =>
      prevBloques.map((bloque) =>
        bloque.id === id ? { ...bloque, nombre: nuevoTexto } : bloque
      )
    );

    setAsignaciones((prev) => {
      const nuevas = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (value?.id === id) {
          nuevas[key] = { ...value, nombre: nuevoTexto };
        } else {
          nuevas[key] = value;
        }
      });
      return nuevas;
    });
  };

  const asignarBloque = (dia, bloqueLabel, bloque, subHora, movil) => {
    const key = `${dia}-${bloqueLabel}-${subHora}-${movil}`;
    setAsignaciones({
      ...asignaciones,
      [key]: bloque
    });
  };

  const moverBloque = (fromKey, toKey) => {
    const moved = asignaciones[fromKey];
    if (moved) {
      setAsignaciones(prev => {
        const newState = { ...prev };
        newState[toKey] = moved;
        delete newState[fromKey];
        return newState;
      });
    }
  };

  const actualizarTitulo = (dia, label, value) => {
    const key = `${dia}-${label}`;
    setTitulos({
      ...titulos,
      [key]: value
    });
  };

  return (
    <div className="p-8 space-y-6 max-w-screen-xl mx-auto">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Nuevo bloque (Ej: Instalaciones)"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              agregarBloque();
            }
          }}
        />
        <Button onClick={agregarBloque}>Agregar</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {bloques.map((bloque) => (
          <motion.div
            key={bloque.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("bloque", JSON.stringify(bloque))}
            className="cursor-move bg-gray-200 px-3 py-1 rounded shadow flex items-center gap-2 text-base"
            whileHover={{ scale: 1.05 }}
          >
            <input
              value={bloque.nombre}
              onChange={(e) => editarBloque(bloque.id, e.target.value)}
              className="bg-transparent focus:outline-none w-full"
            />
            <button onClick={() => eliminarBloque(bloque.id)} className="text-red-500 text-sm">✕</button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-3 text-base">
        <div className="w-0" />
        {dias.map((dia) => (
          <div key={dia} className="text-center font-bold text-black bg-white rounded py-2 text-lg">
            {dia}
          </div>
        ))}

        {bloquesDelDia.map(({ label, color, subColor, subbloques }) => (
          <React.Fragment key={label}>
            <div className="w-0" />
            {dias.map((dia) => {
              const bloqueKey = `${dia}-${label}`;
              return (
                <div key={bloqueKey} className={`${color} rounded-lg p-2 space-y-2 min-h-[210px]`}>
                  <Input
                    placeholder={`Título del ${label}`}
                    value={titulos[bloqueKey] || ""}
                    onChange={(e) => actualizarTitulo(dia, label, e.target.value)}
                    className="text-xs mb-1"
                  />
                  {subbloques?.map(({ hora: subHora, tono }) => (
                    <div key={`${bloqueKey}-${subHora}`} className={`${tono} rounded p-2 space-y-1`}>
                      <div className="text-xs font-semibold mb-1">{subHora}</div>
                      <div className="grid grid-cols-2 gap-2">
                        {moviles.map((movil) => {
                          const fullKey = `${dia}-${label}-${subHora}-${movil}`;
                          return (
                            <Card
                              key={fullKey}
                              className="h-20 cursor-pointer overflow-hidden"
                              draggable={!!asignaciones[fullKey]}
                              onDragStart={(e) => {
                                if (asignaciones[fullKey]) {
                                  e.dataTransfer.setData("mover-bloque", fullKey);
                                }
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                const tipo = e.dataTransfer.getData("mover-bloque")
                                if (tipo) {
                                  moverBloque(tipo, fullKey);
                                } else {
                                  const data = JSON.parse(e.dataTransfer.getData("bloque"));
                                  asignarBloque(dia, label, data, subHora, movil);
                                }
                              }}
                            >
                              <CardContent className="p-2 text-sm h-full overflow-hidden text-ellipsis whitespace-normal break-words">
                                <div className="font-semibold text-xs mb-1">{movil}</div>
                                {asignaciones[fullKey]?.nombre || ""}
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
