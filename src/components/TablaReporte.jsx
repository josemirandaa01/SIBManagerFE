import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Badge } from "./TablaEmpleados";
import "../styles/tabla.css";

const formatRD = (n) =>
  `RD$${(n || 0).toLocaleString("es-DO", { minimumFractionDigits: 2 })}`;

const detalleTexto = (emp) => {
  const d = emp.detalle;
  switch (emp.tipoEmpleado) {
    case "Asalariado":         return `Salario fijo: ${formatRD(d.salarioSemanal)}`;
    case "PorHoras":
    case "Por Horas":          return `${d.horasNormales}h normales + ${d.horasExtra}h extra x1.5`;
    case "Comision":           return `${formatRD(d.ventasBrutas)} x ${d.tarifaPorcentaje}`;
    case "AsalariadoComision": return `Base ${formatRD(d.salarioBase)} + comision + bonif. 10%`;
    default: return "-";
  }
};

export default function TablaReporte({ empleados }) {
  const [sorting, setSorting]       = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });

  const columns = useMemo(() => [
    {
      accessorKey: "nombre",
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
      id: "detalle",
      header: "Detalle calculo",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="td-muted">{detalleTexto(row.original)}</span>
      ),
    },
    {
      accessorKey: "pagoSemanal",
      header: "Pago semanal",
      cell: info => <span className="td-accent">{formatRD(info.getValue())}</span>,
    },
  ], []);

  const table = useReactTable({
    data: empleados,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel:       getCoreRowModel(),
    getSortedRowModel:     getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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
