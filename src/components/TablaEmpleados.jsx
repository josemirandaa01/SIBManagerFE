import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/tabla.css";

const formatRD = (n) =>
  `RD$${(n || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

const badgeClass = {
  "Asalariado":         "badge-asalariado",
  "Por Horas":          "badge-horas",
  "PorHoras":           "badge-horas",
  "Comision":           "badge-comision",
  "AsalariadoComision": "badge-asal-com",
};

export function Badge({ tipo }) {
  const label = tipo === "PorHoras" ? "Por Horas" : tipo;
  return <span className={`badge ${badgeClass[tipo] || ""}`}>{label}</span>;
}

export default function TablaEmpleados({ empleados, onEditar, onDesactivar }) {
  const [sorting, setSorting]           = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 8 });
  const { usuario } = useAuth();

  const esAdmin = usuario?.rol === "Admin";

  const columnaBase = [
    {
      accessorKey: "nombreCompleto",
      header: "Nombre",
      cell: info => <span className="td-bold">{info.getValue()}</span>,
    },
    {
      accessorKey: "numeroSeguroSocial",
      header: "Cedula",
      cell: info => <span className="td-muted">{info.getValue()}</span>,
    },
    {
      accessorKey: "tipoEmpleado",
      header: "Tipo",
      cell: info => <Badge tipo={info.getValue()} />,
    },
    {
      accessorKey: "departamento",
      header: "Departamento",
      cell: info => <span className="td-muted">{info.getValue() || "-"}</span>,
    },
    {
      accessorKey: "pagoCalculado",
      header: "Pago semanal",
      cell: info => <span className="td-accent">{formatRD(info.getValue())}</span>,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: info => (
        <span className={`badge ${info.getValue() ? "badge-activo" : "badge-inactivo"}`}>
          {info.getValue() ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const columnaAcciones = {
    id: "acciones",
    header: "Acciones",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="tabla-acciones">
        <button className="action-btn edit"
          onClick={() => onEditar(row.original.empleadoId)}>
          <i className="ti ti-edit" aria-hidden="true" />
        </button>
        <button className="action-btn delete"
          onClick={() => onDesactivar(row.original.empleadoId)}>
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>
    ),
  };

  const columns = useMemo(() =>
    esAdmin ? [...columnaBase, columnaAcciones] : columnaBase,
  [onEditar, onDesactivar, esAdmin]);

  const table = useReactTable({
    data: empleados,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getFilteredRowModel:   getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="tabla-toolbar">
        <input value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Buscar en la tabla..."
          className="tabla-search"
        />
        <span className="tabla-count">
          {table.getFilteredRowModel().rows.length} empleados
        </span>
      </div>

      <div className="tabla-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={header.column.getCanSort() ? "tabla-sortable" : ""}
                  >
                    <div className="tabla-th-inner">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <span className="tabla-sort-icon">
                          {header.column.getIsSorted() === "asc"
                            ? <i className="ti ti-sort-ascending" />
                            : header.column.getIsSorted() === "desc"
                            ? <i className="ti ti-sort-descending" />
                            : <i className="ti ti-arrows-sort" />
                          }
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="tabla-empty">
                  No se encontraron empleados
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="tabla-pagination">
        <div className="tabla-pagination-info">
          Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="tabla-pagination-controls">
          <button className="tabla-page-btn"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            <i className="ti ti-chevrons-left" />
          </button>
          <button className="tabla-page-btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            <i className="ti ti-chevron-left" />
          </button>
          <button className="tabla-page-btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            <i className="ti ti-chevron-right" />
          </button>
          <button className="tabla-page-btn"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            <i className="ti ti-chevrons-right" />
          </button>
        </div>
        <select className="tabla-page-size"
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}>
          {[5, 8, 10, 20].map(size => (
            <option key={size} value={size}>Ver {size}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
