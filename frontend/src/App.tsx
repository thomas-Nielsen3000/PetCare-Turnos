import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

type Usuario = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  rol: "cliente" | "admin";
};

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
  raza?: string | null;
  fecha_nacimiento?: string | null;
  observaciones?: string | null;
};

type Servicio = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number | string;
  duracion_minutos: number;
  activo: boolean;
};

type Turno = {
  id: number;
  mascota_id: number;
  servicio_id: number;
  nombre_mascota: string;
  nombre_servicio: string;
  fecha_inicio: string;
  fecha_fin: string;
  precio: number | string;
  estado: "pendiente" | "confirmado" | "cancelado" | "finalizado";
};

type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string | null;
  total_mascotas: number;
  total_turnos: number;
};

type Horario = {
  id: number;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
  activo: boolean;
};

type Respuesta<T> = T & { status?: string; message?: string };

const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function formatoFecha(fecha: string) {
  if (!fecha) return "—";
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime())
    ? fecha
    : valor.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });
}

function moneda(valor: number | string) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("petcare_token") || "");
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const guardado = localStorage.getItem("petcare_usuario");
      return guardado ? JSON.parse(guardado) as Usuario : null;
    } catch {
      return null;
    }
  });

  const [vista, setVista] = useState("inicio");
  const [modoAuth, setModoAuth] = useState<"login" | "registro">("login");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mascotasAdmin, setMascotasAdmin] = useState<Mascota[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);

  const [mascotaEditando, setMascotaEditando] = useState<number | null>(null);
  const [servicioEditando, setServicioEditando] = useState<number | null>(null);
  const [horarioEditando, setHorarioEditando] = useState<number | null>(null);

  const [formMascota, setFormMascota] = useState({
    nombre: "", especie: "Perro", raza: "", fecha_nacimiento: "", observaciones: "",
  });
  const [formTurno, setFormTurno] = useState({ mascota_id: "", servicio_id: "", fecha_inicio: "" });
  const [formServicio, setFormServicio] = useState({
    nombre: "", descripcion: "", precio: "", duracion_minutos: "",
  });
  const [formHorario, setFormHorario] = useState({
    dia_semana: "1", hora_apertura: "09:00", hora_cierre: "18:00",
  });

  const api = useCallback(async <T,>(ruta: string, opciones: RequestInit = {}): Promise<Respuesta<T>> => {
    const encabezados = new Headers(opciones.headers);
    if (token) encabezados.set("Authorization", `Bearer ${token}`);
    if (opciones.body && !encabezados.has("Content-Type")) {
      encabezados.set("Content-Type", "application/json");
    }

    const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers: encabezados });
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        cerrarSesion();
      }
      throw new Error(datos.message || `Error HTTP ${respuesta.status}`);
    }
    return datos as Respuesta<T>;
  }, [token]);

  const limpiarAvisos = () => {
    setError("");
    setMensaje("");
  };

  const cerrarSesion = () => {
    localStorage.removeItem("petcare_token");
    localStorage.removeItem("petcare_usuario");
    setToken("");
    setUsuario(null);
    setMascotas([]);
    setServicios([]);
    setTurnos([]);
    setVista("inicio");
  };

  const cargarDatos = useCallback(async () => {
    if (!token || !usuario) return;
    setCargando(true);
    setError("");
    try {
      const [resMascotas, resServicios, resTurnos] = await Promise.all([
        api<{ mascotas: Mascota[] }>("/mascotas"),
        api<{ servicios: Servicio[] }>(usuario.rol === "admin" ? "/servicios/admin/todos" : "/servicios"),
        api<{ turnos: Turno[] }>("/turnos"),
      ]);
      setMascotas(resMascotas.mascotas || []);
      setServicios(resServicios.servicios || []);
      setTurnos(resTurnos.turnos || []);

      if (usuario.rol === "admin") {
        const [resClientes, resMascotasAdmin, resHorarios] = await Promise.all([
          api<{ clientes: Cliente[] }>("/admin/clientes"),
          api<{ mascotas: Mascota[] }>("/admin/mascotas"),
          api<{ horarios: Horario[] }>("/admin/horarios"),
        ]);
        setClientes(resClientes.clientes || []);
        setMascotasAdmin(resMascotasAdmin.mascotas || []);
        setHorarios(resHorarios.horarios || []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar los datos.");
    } finally {
      setCargando(false);
    }
  }, [api, token, usuario]);

  useEffect(() => {
    if (token && usuario) void cargarDatos();
  }, [token, usuario, cargarDatos]);

  async function enviarAuth(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    limpiarAvisos();
    setCargando(true);
    const datos = new FormData(evento.currentTarget);
    const email = String(datos.get("email") || "").trim();
    const password = String(datos.get("password") || "");

    try {
      if (modoAuth === "registro") {
        const registro = {
          nombre: String(datos.get("nombre") || "").trim(),
          email,
          password,
          telefono: String(datos.get("telefono") || "").trim() || undefined,
        };
        await fetch(`${API_URL}/auth/registro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registro),
        }).then(async (r) => {
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(d.message || "No se pudo crear la cuenta.");
        });
        setModoAuth("login");
        setMensaje("Cuenta creada correctamente. Ahora podés iniciar sesión.");
      } else {
        const respuesta = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const datosLogin = await respuesta.json();
        if (!respuesta.ok) throw new Error(datosLogin.message || "No se pudo iniciar sesión.");
        localStorage.setItem("petcare_token", datosLogin.token);
        localStorage.setItem("petcare_usuario", JSON.stringify(datosLogin.usuario));
        setToken(datosLogin.token);
        setUsuario(datosLogin.usuario);
        setVista("inicio");
        setMensaje(`¡Hola, ${datosLogin.usuario.nombre}!`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error.");
    } finally {
      setCargando(false);
    }
  }

  async function guardarMascota(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    limpiarAvisos();
    try {
      const cuerpo = {
        ...formMascota,
        raza: formMascota.raza || null,
        fecha_nacimiento: formMascota.fecha_nacimiento || null,
        observaciones: formMascota.observaciones || null,
      };
      await api(mascotaEditando ? `/mascotas/${mascotaEditando}` : "/mascotas", {
        method: mascotaEditando ? "PUT" : "POST",
        body: JSON.stringify(cuerpo),
      });
      setFormMascota({ nombre: "", especie: "Perro", raza: "", fecha_nacimiento: "", observaciones: "" });
      setMascotaEditando(null);
      setMensaje(mascotaEditando ? "Mascota actualizada." : "Mascota registrada.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la mascota.");
    }
  }

  function editarMascota(mascota: Mascota) {
    setMascotaEditando(mascota.id);
    setFormMascota({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza || "",
      fecha_nacimiento: mascota.fecha_nacimiento ? mascota.fecha_nacimiento.slice(0, 10) : "",
      observaciones: mascota.observaciones || "",
    });
    setVista("mascotas");
    limpiarAvisos();
  }

  async function eliminarMascota(id: number) {
    if (!window.confirm("¿Seguro que querés eliminar esta mascota?")) return;
    limpiarAvisos();
    try {
      await api(`/mascotas/${id}`, { method: "DELETE" });
      setMensaje("Mascota eliminada.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la mascota.");
    }
  }

  async function reservarTurno(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    limpiarAvisos();
    try {
      await api("/turnos", {
        method: "POST",
        body: JSON.stringify({
          mascota_id: Number(formTurno.mascota_id),
          servicio_id: Number(formTurno.servicio_id),
          fecha_inicio: formTurno.fecha_inicio,
        }),
      });
      setFormTurno({ mascota_id: "", servicio_id: "", fecha_inicio: "" });
      setMensaje("Solicitud de turno creada. Quedó pendiente de confirmación.");
      await cargarDatos();
      setVista("turnos");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo reservar el turno.");
    }
  }

  async function cancelarTurno(id: number) {
    if (!window.confirm("¿Querés cancelar este turno?")) return;
    limpiarAvisos();
    try {
      await api(`/turnos/${id}/cancelar`, { method: "PATCH" });
      setMensaje("Turno cancelado.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cancelar el turno.");
    }
  }

  async function modificarTurno(id: number) {
    const nuevaFecha = window.prompt("Ingresá la nueva fecha y hora (AAAA-MM-DDTHH:mm):");
    if (!nuevaFecha) return;
    limpiarAvisos();
    try {
      await api(`/turnos/${id}`, {
        method: "PUT",
        body: JSON.stringify({ fecha_inicio: nuevaFecha }),
      });
      setMensaje("Turno modificado.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo modificar el turno.");
    }
  }

  async function guardarServicio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    limpiarAvisos();
    try {
      const cuerpo = {
        nombre: formServicio.nombre,
        descripcion: formServicio.descripcion || null,
        precio: Number(formServicio.precio),
        duracion_minutos: Number(formServicio.duracion_minutos),
      };
      await api(servicioEditando ? `/servicios/${servicioEditando}` : "/servicios", {
        method: servicioEditando ? "PUT" : "POST",
        body: JSON.stringify(cuerpo),
      });
      setFormServicio({ nombre: "", descripcion: "", precio: "", duracion_minutos: "" });
      setServicioEditando(null);
      setMensaje("Servicio guardado correctamente.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el servicio.");
    }
  }

  async function cambiarEstadoServicio(servicio: Servicio) {
    limpiarAvisos();
    try {
      await api(`/servicios/${servicio.id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !servicio.activo }),
      });
      setMensaje("Estado del servicio actualizado.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el estado.");
    }
  }

  function editarServicio(servicio: Servicio) {
    setServicioEditando(servicio.id);
    setFormServicio({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || "",
      precio: String(servicio.precio),
      duracion_minutos: String(servicio.duracion_minutos),
    });
  }

  async function guardarHorario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    limpiarAvisos();
    try {
      const cuerpo = {
        dia_semana: Number(formHorario.dia_semana),
        hora_apertura: formHorario.hora_apertura,
        hora_cierre: formHorario.hora_cierre,
      };
      await api(horarioEditando ? `/admin/horarios/${horarioEditando}` : "/admin/horarios", {
        method: horarioEditando ? "PUT" : "POST",
        body: JSON.stringify(cuerpo),
      });
      setFormHorario({ dia_semana: "1", hora_apertura: "09:00", hora_cierre: "18:00" });
      setHorarioEditando(null);
      setMensaje("Horario guardado correctamente.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el horario.");
    }
  }

  async function cambiarEstadoHorario(horario: Horario) {
    limpiarAvisos();
    try {
      await api(`/admin/horarios/${horario.id}/estado`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !horario.activo }),
      });
      setMensaje("Estado del horario actualizado.");
      await cargarDatos();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el horario.");
    }
  }

  const esAdmin = usuario?.rol === "admin";
  const turnosActivos = turnos.filter((t) => ["pendiente", "confirmado"].includes(t.estado));
  const menu = [
    { id: "inicio", label: "Resumen", icon: "⌂" },
    { id: "mascotas", label: "Mis mascotas", icon: "♡" },
    { id: "servicios", label: "Servicios", icon: "✦" },
    { id: "reservar", label: "Reservar turno", icon: "+" },
    { id: "turnos", label: "Mis turnos", icon: "▤" },
    ...(esAdmin ? [
      { id: "clientes", label: "Clientes", icon: "♙" },
      { id: "mascotas-admin", label: "Todas las mascotas", icon: "♧" },
      { id: "horarios", label: "Horarios", icon: "◷" },
    ] : []),
  ];

  if (!token || !usuario) {
    return (
      <div className="auth-layout">
        <section className="auth-visual">
          <div className="brand brand-light"><span className="brand-mark">✿</span> PetCare</div>
          <div className="auth-visual-copy">
            <span className="eyebrow">CUIDAMOS A QUIENES MÁS QUERÉS</span>
            <h1>Su bienestar<br />es nuestra prioridad.</h1>
            <p>Gestioná las visitas, encontrá servicios y organizá los cuidados de tus mascotas en un solo lugar.</p>
          </div>
          <div className="visual-paw">🐾</div>
          <span className="visual-note">Un espacio pensado para ellos.</span>
        </section>
        <section className="auth-panel">
          <div className="auth-card">
            <div className="brand brand-dark"><span className="brand-mark">✿</span> PetCare</div>
            <span className="eyebrow">{modoAuth === "login" ? "QUÉ BUENO VERTE" : "EMPEZÁ HOY"}</span>
            <h2>{modoAuth === "login" ? "Ingresá a tu cuenta" : "Creá tu cuenta"}</h2>
            <p className="muted">{modoAuth === "login" ? "Accedé para administrar los cuidados de tus mascotas." : "Completá tus datos para empezar a reservar turnos."}</p>
            {error && <div className="alert alert-error">{error}</div>}
            {mensaje && <div className="alert alert-success">{mensaje}</div>}
            <form className="form-stack" onSubmit={enviarAuth}>
              {modoAuth === "registro" && <>
                <label>Nombre completo<input name="nombre" required minLength={2} placeholder="Tu nombre" /></label>
                <label>Teléfono <span className="optional">(opcional)</span><input name="telefono" placeholder="11 1234 5678" /></label>
              </>}
              <label>Correo electrónico<input name="email" type="email" required placeholder="nombre@correo.com" /></label>
              <label>Contraseña<input name="password" type="password" required minLength={6} placeholder="Tu contraseña" /></label>
              <button className="button button-primary button-wide" disabled={cargando}>
                {cargando ? "Un momento..." : modoAuth === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            </form>
            <p className="auth-switch">
              {modoAuth === "login" ? "¿Todavía no tenés cuenta?" : "¿Ya tenés una cuenta?"}
              <button className="text-button" onClick={() => { setModoAuth(modoAuth === "login" ? "registro" : "login"); limpiarAvisos(); }}>
                {modoAuth === "login" ? "Registrate" : "Iniciá sesión"}
              </button>
            </p>
            <p className="auth-footnote">PetCare Turnos · Atención organizada, mascotas felices.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand brand-dark"><span className="brand-mark">✿</span> PetCare</div>
        <div className="side-caption">MENÚ PRINCIPAL</div>
        <nav className="side-nav">
          {menu.map((item) => (
            <button key={item.id} className={`nav-item ${vista === item.id ? "selected" : ""}`} onClick={() => { setVista(item.id); limpiarAvisos(); }}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span>¿Necesitás ayuda?</span><p>Estamos para acompañarte.</p></div>
          <button className="nav-item logout" onClick={cerrarSesion}><span className="nav-icon">↪</span>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div><span className="topbar-kicker">PANEL {esAdmin ? "ADMINISTRATIVO" : "DE CLIENTE"}</span><strong>Hola, {usuario.nombre.split(" ")[0]} 👋</strong></div>
          <div className="profile-chip"><span className="avatar">{usuario.nombre.charAt(0).toUpperCase()}</span><span><b>{usuario.nombre}</b><small>{esAdmin ? "Administrador" : "Cliente"}</small></span></div>
        </header>

        <div className="page-content">
          {error && <div className="alert alert-error">{error}<button onClick={() => setError("")}>×</button></div>}
          {mensaje && <div className="alert alert-success">{mensaje}<button onClick={() => setMensaje("")}>×</button></div>}
          {cargando && <div className="loading-line">Actualizando información...</div>}

          {vista === "inicio" && <>
            <div className="page-heading"><div><span className="eyebrow">TU ESPACIO PETCARE</span><h1>Resumen general</h1><p>Acá tenés toda la información importante de un vistazo.</p></div><button className="button button-primary" onClick={() => setVista("reservar")}>＋ Reservar turno</button></div>
            <div className="stats-grid">
              <article className="stat-card"><span className="stat-icon lilac">♡</span><span className="stat-label">Mis mascotas</span><strong>{mascotas.length}</strong><small>Registradas en tu cuenta</small></article>
              <article className="stat-card"><span className="stat-icon peach">◷</span><span className="stat-label">Turnos activos</span><strong>{turnosActivos.length}</strong><small>Pendientes o confirmados</small></article>
              <article className="stat-card"><span className="stat-icon mint">✦</span><span className="stat-label">Servicios disponibles</span><strong>{servicios.filter(s => s.activo).length}</strong><small>Para el cuidado de tu mascota</small></article>
            </div>
            <section className="content-card welcome-card"><div><span className="eyebrow">BIENVENIDO A PETCARE</span><h2>Todo el cuidado, en un mismo lugar.</h2><p>Registrá a tus mascotas, conocé nuestros servicios y solicitá turnos de manera simple.</p><button className="button button-primary" onClick={() => setVista("mascotas")}>Ver mis mascotas</button></div><div className="welcome-illustration">🐶<span>🐾</span></div></section>
            <section className="content-card"><div className="section-title"><div><h2>Próximos turnos</h2><p>Las próximas visitas agendadas.</p></div><button className="text-button" onClick={() => setVista("turnos")}>Ver todos</button></div>
              {turnosActivos.length ? <div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Servicio</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>{turnosActivos.slice(0, 4).map(t => <tr key={t.id}><td>{t.nombre_mascota || `Mascota #${t.mascota_id}`}</td><td>{t.nombre_servicio}</td><td>{formatoFecha(t.fecha_inicio)}</td><td><span className={`status status-${t.estado}`}>{t.estado}</span></td></tr>)}</tbody></table></div> : <p className="empty-state">Todavía no tenés turnos activos.</p>}
            </section>
          </>}

          {vista === "mascotas" && <>
            <div className="page-heading"><div><span className="eyebrow">SUS COMPAÑEROS</span><h1>Mis mascotas</h1><p>Administrá la información de tus amigos peludos.</p></div></div>
            <div className="two-column">
              <section className="content-card"><div className="section-title"><div><h2>{mascotaEditando ? "Editar mascota" : "Registrar mascota"}</h2><p>Completá los datos de tu mascota.</p></div></div>
                <form className="form-stack" onSubmit={guardarMascota}>
                  <label>Nombre<input required minLength={2} value={formMascota.nombre} onChange={e => setFormMascota({...formMascota, nombre:e.target.value})} placeholder="Ej. Luna" /></label>
                  <div className="form-row"><label>Especie<select value={formMascota.especie} onChange={e => setFormMascota({...formMascota, especie:e.target.value})}><option>Perro</option><option>Gato</option><option>Ave</option><option>Roedor</option><option>Otro</option></select></label><label>Raza<input value={formMascota.raza} onChange={e => setFormMascota({...formMascota, raza:e.target.value})} placeholder="Raza" /></label></div>
                  <label>Fecha de nacimiento<input type="date" value={formMascota.fecha_nacimiento} onChange={e => setFormMascota({...formMascota, fecha_nacimiento:e.target.value})} /></label>
                  <label>Observaciones<textarea rows={3} value={formMascota.observaciones} onChange={e => setFormMascota({...formMascota, observaciones:e.target.value})} placeholder="Alergias, cuidados especiales..." /></label>
                  <div className="form-actions"><button className="button button-primary">{mascotaEditando ? "Guardar cambios" : "Registrar mascota"}</button>{mascotaEditando && <button type="button" className="button button-outline" onClick={() => {setMascotaEditando(null);setFormMascota({nombre:"",especie:"Perro",raza:"",fecha_nacimiento:"",observaciones:""});}}>Cancelar</button>}</div>
                </form>
              </section>
              <section className="content-card"><div className="section-title"><div><h2>Mascotas registradas</h2><p>{mascotas.length} en total</p></div></div>
                {mascotas.length ? <div className="pet-list">{mascotas.map(m => <article className="pet-item" key={m.id}><div className="pet-avatar">{m.especie.toLowerCase().includes("gato") ? "🐱" : "🐶"}</div><div className="pet-info"><strong>{m.nombre}</strong><span>{m.especie}{m.raza ? ` · ${m.raza}` : ""}</span></div><div className="item-actions"><button className="icon-button" title="Editar" onClick={() => editarMascota(m)}>✎</button><button className="icon-button danger-text" title="Eliminar" onClick={() => eliminarMascota(m.id)}>×</button></div></article>)}</div> : <p className="empty-state">Todavía no registraste mascotas.</p>}
              </section>
            </div>
          </>}

          {vista === "servicios" && <>
            <div className="page-heading"><div><span className="eyebrow">CUIDADO Y BIENESTAR</span><h1>{esAdmin ? "Gestión de servicios" : "Nuestros servicios"}</h1><p>{esAdmin ? "Administrá los servicios ofrecidos por PetCare." : "Conocé las opciones disponibles para tu mascota."}</p></div></div>
            {esAdmin && <section className="content-card admin-form-card"><div className="section-title"><div><h2>{servicioEditando ? "Editar servicio" : "Agregar servicio"}</h2><p>Definí el nombre, precio y duración.</p></div></div><form className="form-stack" onSubmit={guardarServicio}><div className="form-row"><label>Nombre<input required value={formServicio.nombre} onChange={e=>setFormServicio({...formServicio,nombre:e.target.value})}/></label><label>Precio (ARS)<input required type="number" min="1" value={formServicio.precio} onChange={e=>setFormServicio({...formServicio,precio:e.target.value})}/></label><label>Duración (minutos)<input required type="number" min="1" value={formServicio.duracion_minutos} onChange={e=>setFormServicio({...formServicio,duracion_minutos:e.target.value})}/></label></div><label>Descripción<textarea rows={2} value={formServicio.descripcion} onChange={e=>setFormServicio({...formServicio,descripcion:e.target.value})}/></label><div className="form-actions"><button className="button button-primary">{servicioEditando ? "Guardar cambios" : "Crear servicio"}</button>{servicioEditando && <button type="button" className="button button-outline" onClick={()=>{setServicioEditando(null);setFormServicio({nombre:"",descripcion:"",precio:"",duracion_minutos:""});}}>Cancelar</button>}</div></form></section>}
            <div className="service-grid">{servicios.map(s=><article className="service-card" key={s.id}><div className="service-symbol">✦</div><div className="service-card-top"><span className={`status ${s.activo ? "status-confirmado" : "status-cancelado"}`}>{s.activo ? "Activo" : "Inactivo"}</span><span className="service-duration">◷ {s.duracion_minutos} min</span></div><h3>{s.nombre}</h3><p>{s.descripcion || "Servicio de cuidado para tu mascota."}</p><div className="service-bottom"><strong>{moneda(s.precio)}</strong>{esAdmin && <div className="item-actions"><button className="icon-button" onClick={()=>editarServicio(s)} title="Editar">✎</button><button className="button button-small button-outline" onClick={()=>cambiarEstadoServicio(s)}>{s.activo ? "Desactivar" : "Activar"}</button></div>}</div></article>)}</div>
            {!servicios.length && <p className="empty-state">No hay servicios para mostrar.</p>}
          </>}

          {vista === "reservar" && <>
            <div className="page-heading"><div><span className="eyebrow">RESERVA ONLINE</span><h1>Solicitar un turno</h1><p>Elegí tu mascota, el servicio y el horario que prefieras.</p></div></div>
            <section className="content-card booking-card"><div className="booking-intro"><span className="booking-icon">◷</span><h2>Agendá una visita</h2><p>Las solicitudes se crean pendientes de confirmación. Recordá reservar con al menos 3 horas de anticipación.</p></div>
              <form className="form-stack booking-form" onSubmit={reservarTurno}>
                <label>¿A quién vamos a atender?<select required value={formTurno.mascota_id} onChange={e=>setFormTurno({...formTurno,mascota_id:e.target.value})}><option value="">Seleccioná una mascota</option>{mascotas.map(m=><option key={m.id} value={m.id}>{m.nombre} · {m.especie}</option>)}</select></label>
                <label>Elegí un servicio<select required value={formTurno.servicio_id} onChange={e=>setFormTurno({...formTurno,servicio_id:e.target.value})}><option value="">Seleccioná un servicio</option>{servicios.filter(s=>s.activo).map(s=><option key={s.id} value={s.id}>{s.nombre} · {moneda(s.precio)} · {s.duracion_minutos} min</option>)}</select></label>
                <label>Fecha y hora<input required type="datetime-local" value={formTurno.fecha_inicio} onChange={e=>setFormTurno({...formTurno,fecha_inicio:e.target.value})}/></label>
                <button className="button button-primary button-wide" disabled={!mascotas.length || !servicios.some(s=>s.activo)}>Solicitar turno</button>
                {!mascotas.length && <p className="form-hint">Primero necesitás registrar una mascota.</p>}
              </form>
            </section>
          </>}

          {vista === "turnos" && <>
            <div className="page-heading"><div><span className="eyebrow">AGENDA PETCARE</span><h1>{esAdmin ? "Todos los turnos" : "Mis turnos"}</h1><p>{esAdmin ? "Consultá las reservas de todos los clientes." : "Consultá y administrá tus solicitudes."}</p></div><button className="button button-primary" onClick={()=>setVista("reservar")}>＋ Nuevo turno</button></div>
            <section className="content-card"><div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Servicio</th><th>Fecha</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{turnos.map(t=><tr key={t.id}><td>{t.nombre_mascota || `#${t.mascota_id}`}</td><td>{t.nombre_servicio || `#${t.servicio_id}`}</td><td>{formatoFecha(t.fecha_inicio)}</td><td>{moneda(t.precio)}</td><td><span className={`status status-${t.estado}`}>{t.estado}</span></td><td><div className="item-actions">{["pendiente","confirmado"].includes(t.estado) && <><button className="button button-small button-outline" onClick={()=>modificarTurno(t.id)}>Reprogramar</button><button className="button button-small button-danger" onClick={()=>cancelarTurno(t.id)}>Cancelar</button></>}</div></td></tr>)}</tbody></table></div>{!turnos.length && <p className="empty-state">Todavía no hay turnos registrados.</p>}</section>
          </>}

          {vista === "clientes" && esAdmin && <>
            <div className="page-heading"><div><span className="eyebrow">ADMINISTRACIÓN</span><h1>Clientes</h1><p>Listado de usuarios registrados en PetCare.</p></div></div>
            <section className="content-card"><div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Mascotas</th><th>Turnos</th></tr></thead><tbody>{clientes.map(c=><tr key={c.id}><td>{c.nombre}</td><td>{c.email}</td><td>{c.telefono || "—"}</td><td>{c.total_mascotas}</td><td>{c.total_turnos}</td></tr>)}</tbody></table></div>{!clientes.length && <p className="empty-state">No hay clientes registrados.</p>}</section>
          </>}

          {vista === "mascotas-admin" && esAdmin && <>
            <div className="page-heading"><div><span className="eyebrow">ADMINISTRACIÓN</span><h1>Todas las mascotas</h1><p>Listado general con los datos de sus propietarios.</p></div></div>
            <section className="content-card"><div className="table-wrap"><table><thead><tr><th>Mascota</th><th>Especie</th><th>Raza</th><th>Propietario</th><th>Correo</th></tr></thead><tbody>{mascotasAdmin.map((m:any)=><tr key={m.id}><td>{m.nombre}</td><td>{m.especie}</td><td>{m.raza || "—"}</td><td>{m.nombre_propietario || "—"}</td><td>{m.email_propietario || "—"}</td></tr>)}</tbody></table></div>{!mascotasAdmin.length && <p className="empty-state">No hay mascotas registradas.</p>}</section>
          </>}

          {vista === "horarios" && esAdmin && <>
            <div className="page-heading"><div><span className="eyebrow">CONFIGURACIÓN</span><h1>Horarios de atención</h1><p>Definí los días y las franjas horarias disponibles.</p></div></div>
            <section className="content-card admin-form-card"><div className="section-title"><div><h2>{horarioEditando ? "Editar horario" : "Agregar horario"}</h2><p>Los horarios activos estarán disponibles para las reservas.</p></div></div><form className="form-stack" onSubmit={guardarHorario}><div className="form-row"><label>Día<select value={formHorario.dia_semana} onChange={e=>setFormHorario({...formHorario,dia_semana:e.target.value})}>{dias.map((d,i)=><option key={i} value={i}>{d}</option>)}</select></label><label>Apertura<input type="time" required value={formHorario.hora_apertura} onChange={e=>setFormHorario({...formHorario,hora_apertura:e.target.value})}/></label><label>Cierre<input type="time" required value={formHorario.hora_cierre} onChange={e=>setFormHorario({...formHorario,hora_cierre:e.target.value})}/></label></div><div className="form-actions"><button className="button button-primary">{horarioEditando ? "Guardar cambios" : "Crear horario"}</button>{horarioEditando && <button type="button" className="button button-outline" onClick={()=>{setHorarioEditando(null);setFormHorario({dia_semana:"1",hora_apertura:"09:00",hora_cierre:"18:00"});}}>Cancelar</button>}</div></form></section>
            <section className="content-card"><div className="table-wrap"><table><thead><tr><th>Día</th><th>Apertura</th><th>Cierre</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{horarios.map(h=><tr key={h.id}><td>{dias[h.dia_semana]}</td><td>{String(h.hora_apertura).slice(0,5)}</td><td>{String(h.hora_cierre).slice(0,5)}</td><td><span className={`status ${h.activo ? "status-confirmado" : "status-cancelado"}`}>{h.activo ? "Activo" : "Inactivo"}</span></td><td><div className="item-actions"><button className="icon-button" title="Editar" onClick={()=>{setHorarioEditando(h.id);setFormHorario({dia_semana:String(h.dia_semana),hora_apertura:String(h.hora_apertura).slice(0,5),hora_cierre:String(h.hora_cierre).slice(0,5)});}}>✎</button><button className="button button-small button-outline" onClick={()=>cambiarEstadoHorario(h)}>{h.activo ? "Desactivar" : "Activar"}</button></div></td></tr>)}</tbody></table></div>{!horarios.length && <p className="empty-state">No hay horarios configurados.</p>}</section>
          </>}
          <footer className="page-footer">© 2026 PetCare Turnos · Cuidamos a quienes más querés.</footer>
        </div>
      </main>
    </div>
  );
}

export default App;
