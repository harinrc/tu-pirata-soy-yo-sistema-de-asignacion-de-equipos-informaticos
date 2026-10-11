let equipos = JSON.parse(localStorage.getItem('equipos_it')) || [
    { id: 1, codigo: 'LAP-001', tipo: 'Laptop', marca: 'Dell XPS 13', estado: 'Asignado', empleado: 'Ana Gómez', departamento: 'Sistemas' },
    { id: 2, codigo: 'MON-002', tipo: 'Monitor', marca: 'LG 27 Pulgadas', estado: 'Disponible', empleado: '-', departamento: '-' }
];


const formEquipo = document.getElementById('form-equipo');
const formAsignacion = document.getElementById('form-asignacion');
const selectEquipo = document.getElementById('select-equipo');
const tablaEquipos = document.getElementById('tabla-equipos');

const statTotales = document.getElementById('stat-totales');
const statDisponibles = document.getElementById('stat-disponibles');
const statAsignados = document.getElementById('stat-asignados');


document.addEventListener('DOMContentLoaded', () => {
    actualizarVista();
});

// Guardar en localStorage almaceamiento del navegador
function guardarLocalStorage() {
    localStorage.setItem('equipos_it', JSON.stringify(equipos));
}


function actualizarVista() {
    renderizarTabla();
    actualizarSelectDisponibles();
    actualizarEstadisticas();
    guardarLocalStorage();
}


function renderizarTabla() {
    tablaEquipos.innerHTML = '';

    if (equipos.length === 0) {
        tablaEquipos.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay equipos registrados.</td></tr>`;
        return;
    }

    equipos.forEach(eq => {
        const tr = document.createElement('tr');
        const esAsignado = eq.estado === 'Asignado';

        tr.innerHTML = `
            <td><strong>${eq.codigo}</strong></td>
            <td>${eq.tipo}</td>
            <td>${eq.marca}</td>
            <td>
                <span class="badge ${esAsignado ? 'badge-asignado' : 'badge-disponible'}">
                    ${eq.estado}
                </span>
            </td>
            <td>${esAsignado ? `${eq.empleado} <br><small>(${eq.departamento})</small>` : '-'}</td>
            <td>
                ${esAsignado ? 
                    `<button class="btn btn-warning" onclick="liberarEquipo(${eq.id})"><i class="fa-solid fa-arrow-rotate-left"></i> Liberar</button>` : 
                    `<button class="btn btn-danger" onclick="eliminarEquipo(${eq.id})"><i class="fa-solid fa-trash"></i> Eliminar</button>`
                }
            </td>
        `;
        tablaEquipos.appendChild(tr);
    });
}


function actualizarSelectDisponibles() {
    selectEquipo.innerHTML = '';
    const disponibles = equipos.filter(e => e.estado === 'Disponible');

    if (disponibles.length === 0) {
        selectEquipo.innerHTML = '<option value="">No hay equipos disponibles</option>';
        return;
    }

    selectEquipo.innerHTML = '<option value="">Seleccione un equipo...</option>';
    disponibles.forEach(eq => {
        const option = document.createElement('option');
        option.value = eq.id;
        option.textContent = `${eq.codigo} - ${eq.tipo} (${eq.marca})`;
        selectEquipo.appendChild(option);
    });
}


function actualizarEstadisticas() {
    const total = equipos.length;
    const asignados = equipos.filter(e => e.estado === 'Asignado').length;
    const disponibles = total - asignados;

    statTotales.textContent = total;
    statDisponibles.textContent = disponibles;
    statAsignados.textContent = asignados;
}


formEquipo.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoEquipo = {
        id: Date.now(),
        codigo: document.getElementById('codigo').value.trim(),
        tipo: document.getElementById('tipo').value,
        marca: document.getElementById('marca').value.trim(),
        estado: 'Disponible',
        empleado: '-',
        departamento: '-'
    };

    equipos.push(nuevoEquipo);
    formEquipo.reset();
    actualizarVista();
});


formAsignacion.addEventListener('submit', (e) => {
    e.preventDefault();

    const idEquipo = Number(selectEquipo.value);
    if (!idEquipo) return;

    const empleado = document.getElementById('empleado').value.trim();
    const departamento = document.getElementById('departamento').value.trim();

    equipos = equipos.map(eq => {
        if (eq.id === idEquipo) {
            return {
                ...eq,
                estado: 'Asignado',
                empleado: empleado,
                departamento: departamento
            };
        }
        return eq;
    });

    formAsignacion.reset();
    actualizarVista();
});

//Funcion de Liberarar
function liberarEquipo(id) {
    equipos = equipos.map(eq => {
        if (eq.id === id) {
            return { ...eq, estado: 'Disponible', empleado: '-', departamento: '-' };
        }
        return eq;
    });
    actualizarVista();
}

// Función de Eliminar Equipo
function eliminarEquipo(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este equipo del sistema?')) {
        equipos = equipos.filter(eq => eq.id !== id);
        actualizarVista();
    }
}