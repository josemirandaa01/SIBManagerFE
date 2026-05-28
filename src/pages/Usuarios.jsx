import { useEffect, useState, useMemo } from "react";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender
} from "@tanstack/react-table";
import api from "../services/api";
import Modal from "../components/Modal";
import "../styles/pages.css";
import "../styles/tabla.css";
import "../styles/forms.css";

export default function Usuarios() {
  const [usuarios, setUsuarios]         = useState([]);
  const [roles, setRoles]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sorting, setSorting]           = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination]     = useState({ pageIndex: 0, pageSize: 8 });
  const [modal, setModal]               = useState(false);
  const [editando, setEditando]         = useState(null);
  const [form, setForm]                 = useState({ nombreUsuario: "", email: "", password: "", rolId: 1 });
  const [error, setError]               = useState("");
  const [loadingForm, setLoadingForm]   = useState(false);

  const cargar = () => {
    setLoading(true);
    Promise.all([
      api.get("/usuarios"),
      api.get("/usuarios/roles"),
    ]).then(([u, r]) => {
      setUsuarios(u);
      setRoles(r);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const rolNombreAId = (nombre) => {
    const rol = roles.find(r => r.nombre === nombre);
    return rol?.rolId || 1;
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({ nombreUsuario: "", email: "", password: "", rolId: roles[0]?.rolId || 1 });
    setError("");
    setModal(true);
  };

  const abrirEditar = (u) => {
    setEditando(u);
    setForm({
      nombreUsuario: u.nombreUsuario,
      email:         u.email,
      password:      "",
      rolId:         rolNombreAId(u.rol)
    });
    setError("");
    setModal(true);
  };

  const cerrarModal = () => setModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true); setError("");
    try {
      if (editando) {
        await api.put(`/usuarios/${editando.usuarioId}`, form);
      } else {
        await api.post("/usuarios", form);
      }
      cerrarModal();
      cargar();
    } catch {
      setError("Error al guardar el usuario. Verifica los datos.");
    } finally { setLoadingForm(false); }
  };

  const handleDesactivar = async (id) => {
    if (!confirm("Desactivar este usuario?")) return;
    await api.delete(`/usuarios/${id}`);
    cargar();
  };

  const handleActivar = async (id) => {
    await api.put(`/usuarios/${id}/activar`);
    cargar();
  };

  const columns = useMemo(() => [
    {
      accessorKey: "nombreUsuario",
      header: "Usuario",
      cell: info => <span className="td-bold">{info.getValue()}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: info => <span className="td-muted">{info.getValue()}</span>,
    },
    {
      accessorKey: "rol",
      header: "Rol",
      cell: info => {
        const rol = info.getValue();
        const color = rol === "Admin" ? "badge-asalariado"
                    : rol === "RRHH"  ? "badge-horas"
                    : "badge-comision";
        return <span className={`badge ${color}`}>{rol}</span>;
      },
    },
    {
      accessorKey: "fechaRegistro",
      header: "Fecha registro",
      cell: info => (
        <span className="td-muted">
          {new Date(info.getValue()).toLocaleDateString("es-DO")}
        </span>
      ),
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: info => (
        <span className={`badge ${info.getValue() ? "badge-activo" : "badge-inactivo"}`}>
          {info.getValue() ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="tabla-acciones">
          <button className="action-btn edit" onClick={() => abrirEditar(row.original)}>
            <i className="ti ti-edit" aria-hidden="true" />
          </button>
          {row.original.activo ? (
            <button className="action-btn delete" onClick={() => handleDesactivar(row.original.usuarioId)}>
              <i className="ti ti-trash" aria-hidden="true" />
            </button>
          ) : (
            <button className="action-btn edit" onClick={() => handleActivar(row.original.usuarioId)}>
              <i className="ti ti-user-check" aria-hidden="true" />
            </button>
          )}
        </div>
      ),
    },
  ], [roles]);

  const table = useReactTable({
    data: usuarios,
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
      <div className="filters-bar">
        <button className="btn btn-primary" onClick={abrirCrear}>
          + Nuevo usuario
        </button>
      </div>

      <div className="table-card">
        <div className="tabla-toolbar">
          <input value={globalFilter} onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar usuario..." className="tabla-search" />
          <span className="tabla-count">{table.getFilteredRowModel().rows.length} usuarios</span>
        </div>

        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <>
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
                        No se encontraron usuarios
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
          </>
        )}
      </div>

      <Modal
        isOpen={modal}
        titulo={editando ? "Editar usuario" : "Nuevo usuario"}
        onClose={cerrarModal}
      >
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label>Nombre de usuario</label>
            <input value={form.nombreUsuario} required placeholder="jose.miranda"
              onChange={e => setForm({...form, nombreUsuario: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} required placeholder="jose@empresa.com"
              onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>{editando ? "Nueva contrasena (dejar vacio para no cambiar)" : "Contrasena"}</label>
            <input type="password" value={form.password} required={!editando} placeholder="..."
              onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={form.rolId} onChange={e => setForm({...form, rolId: parseInt(e.target.value)})}>
              {roles.map(r => (
                <option key={r.rolId} value={r.rolId}>{r.nombre}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loadingForm}>
              {loadingForm ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
