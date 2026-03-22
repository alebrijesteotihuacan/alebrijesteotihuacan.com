// ==================
// ANIMACIÓN DE CONTADORES
// ==================
function animarContador(elemento, valorFinal, duracion = 1500, prefijo = '') {
  const valorInicial = 0;
  const incremento = valorFinal / (duracion / 16); // 60 FPS
  let valorActual = valorInicial;

  const intervalo = setInterval(() => {
    valorActual += incremento;

    if (valorActual >= valorFinal) {
      elemento.textContent = prefijo + valorFinal;
      clearInterval(intervalo);
    } else {
      elemento.textContent = prefijo + Math.floor(valorActual);
    }
  }, 16);
}

function iniciarAnimacionEstadisticas() {
  console.log('🎬 Iniciando animación de estadísticas...');

  const elementos = [
    { id: 'totalRegistrosHero', atributo: 'data-target-value' },
    { id: 'totalVisoriasRealizadas', atributo: 'data-target-value' },
    { id: 'totalVisores', atributo: 'data-target-value' }
  ];

  elementos.forEach((config, index) => {
    const elemento = document.getElementById(config.id);
    if (elemento) {
      const valorRaw = elemento.getAttribute(config.atributo) || '0';
      const tienePrefijo = valorRaw.startsWith('+');
      const valorObjetivo = parseInt(valorRaw.replace('+', '')) || 0;
      const prefijo = tienePrefijo ? '+' : '';

      // Agregar delay escalonado para efecto visual
      setTimeout(() => {
        animarContador(elemento, valorObjetivo, 1500, prefijo);
      }, index * 200);
    }
  });
}

function actualizarContadores() {
  // Esta función ahora solo actualiza el contador de la lista de registros
  // Las estadísticas hero se manejan con valores fijos editables en el HTML
  const total = Estado.registros.length;
  const totalElement = document.getElementById('totalRegistros');

  if (totalElement) totalElement.textContent = total;
}

// ==================
// RENDERIZADO DE LISTA
// ==================
function renderizarListaRegistros() {
  const grid = document.getElementById('gridRegistros');
  const estadoVacio = document.getElementById('estadoVacio');

  if (!grid || !estadoVacio) return;

  if (Estado.registros.length === 0) {
    grid.innerHTML = '';
    estadoVacio.classList.add('active');
    return;
  }

  estadoVacio.classList.remove('active');

  const registrosFiltrados = aplicarFiltros();

  if (registrosFiltrados.length === 0) {
    grid.innerHTML = `
      <div class="empty-state active">
        <svg width="120" height="120" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="60" cy="60" r="50"/>
          <path d="M40 60h40M60 40v40"/>
        </svg>
        <h3>No se encontraron resultados</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = registrosFiltrados.map(registro => `
    <div class="registro-card">
      <div class="registro-foto-header">
        <img src="${registro.foto}" alt="${registro.nombreCompleto}">
      </div>
      <div class="registro-body">
        <h4 class="registro-nombre">${registro.nombreCompleto}</h4>
        <div class="registro-folio">Folio: ${registro.folio}</div>
        
        <div class="registro-detalles">
          <div class="detalle-row">
            <span class="detalle-label">Edad:</span>
            <span class="detalle-value">${registro.edad} años</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Posición:</span>
            <span class="detalle-value">${registro.posicion}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Sede:</span>
            <span class="detalle-value">${acortarTexto(registro.sedeVisoria, 25)}</span>
          </div>
          <div class="detalle-row">
            <span class="detalle-label">Registro:</span>
            <span class="detalle-value">${formatearFecha(registro.fechaRegistro)}</span>
          </div>
        </div>
        
        <div class="registro-acciones">
          <button class="btn-accion" onclick="verDetalleRegistro('${registro.folio}')" title="Ver detalle">
            👁️ Ver
          </button>
          <button class="btn-accion" onclick="descargarPDFRegistro('${registro.folio}')" title="Descargar PDF">
            📄 PDF
          </button>
          <button class="btn-accion delete" onclick="eliminarRegistro('${registro.folio}')" title="Eliminar">
            🗑️
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function aplicarFiltros() {
  const busqueda = document.getElementById('inputBuscar')?.value.toLowerCase() || '';
  const filtroSede = document.getElementById('filtroSede')?.value || '';
  const filtroPosicion = document.getElementById('filtroPosicion')?.value || '';

  let registrosFiltrados = [...Estado.registros];

  if (busqueda) {
    registrosFiltrados = registrosFiltrados.filter(r =>
      r.nombreCompleto.toLowerCase().includes(busqueda) ||
      r.folio.toLowerCase().includes(busqueda) ||
      r.correo.toLowerCase().includes(busqueda)
    );
  }

  if (filtroSede) {
    registrosFiltrados = registrosFiltrados.filter(r => r.sedeVisoria === filtroSede);
  }

  if (filtroPosicion) {
    registrosFiltrados = registrosFiltrados.filter(r => r.posicion.includes(filtroPosicion));
  }

  return registrosFiltrados;
}

// ==================
// GENERACIÓN DE CÓDIGOS
// ==================
// ==================
// GENERAR CÓDIGO QR - CORREGIDO (DATOS REDUCIDOS)
// ==================
async function generarCodigoQR(registro) {
  console.log('🔵 Iniciando generarCodigoQR con registro:', registro);
  return new Promise((resolve) => {
    try {
      console.log('🔵 Verificando si QRCode está disponible:', typeof QRCode);

      if (typeof QRCode === 'undefined') {
        console.error('❌ QRCode no está definido. Verifica que la librería qrcode.min.js esté cargada.');
        resolve(null);
        return;
      }

      const container = document.createElement('div');
      container.id = 'qr-temp-container';
      container.style.cssText = 'position: fixed; top: -9999px; left: -9999px;';
      document.body.appendChild(container);
      console.log('✅ Container creado y agregado al body');

      // SOLO datos esenciales para evitar overflow
      const datosQR = `FOLIO:${registro.folio}|NOMBRE:${registro.nombreCompleto}|EDAD:${registro.edad}`;

      console.log('✅ Datos del QR preparados (reducidos):', datosQR);
      console.log('📏 Longitud de datos:', datosQR.length, 'caracteres');

      const qrCode = new QRCode(container, {
        text: datosQR,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.L  // Nivel de corrección bajo para permitir más datos
      });
      console.log('✅ QRCode generado, esperando renderización...');

      // Esperar más tiempo y verificar múltiples veces
      let intentos = 0;
      const maxIntentos = 10;

      const verificarQR = setInterval(() => {
        intentos++;
        console.log(`🔍 Intento ${intentos} de ${maxIntentos} buscando QR...`);

        const canvas = container.querySelector('canvas');
        const img = container.querySelector('img');

        if (canvas) {
          console.log('✅ Canvas encontrado!');
          clearInterval(verificarQR);
          try {
            const dataURL = canvas.toDataURL('image/png');
            console.log('✅ DataURL del QR generado:', dataURL.substring(0, 50) + '...');
            document.body.removeChild(container);
            resolve(dataURL);
          } catch (error) {
            console.error('❌ Error convirtiendo canvas a dataURL:', error);
            document.body.removeChild(container);
            resolve(null);
          }
        } else if (img && img.src) {
          console.log('✅ Imagen encontrada!');
          clearInterval(verificarQR);
          document.body.removeChild(container);
          resolve(img.src);
        } else if (intentos >= maxIntentos) {
          console.error('❌ No se encontró el QR después de', maxIntentos, 'intentos');
          clearInterval(verificarQR);
          document.body.removeChild(container);
          resolve(null);
        }
      }, 100);

    } catch (error) {
      console.error('❌ Error en generarCodigoQR:', error);
      const container = document.getElementById('qr-temp-container');
      if (container) {
        document.body.removeChild(container);
      }
      resolve(null);
    }
  });
}

async function generarCodigoBarras(folio) {
  return new Promise((resolve) => {
    console.log('🔄 Iniciando generación de código de barras...');
    console.log('📝 Folio:', folio);

    const canvas = document.createElement('canvas');

    try {
      JsBarcode(canvas, folio, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 16,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000'
      });

      const dataURL = canvas.toDataURL('image/png');
      console.log('✅ Código de barras generado correctamente, tamaño:', dataURL.length, 'caracteres');
      resolve(dataURL);

    } catch (error) {
      console.error('❌ Error generando código de barras:', error);
      resolve(null);
    }
  });
}

// ==================
// MODAL REGISTRO EXITOSO
// ==================
function mostrarModalRegistroExitoso(registro, qrDataURL, barcodeDataURL) {
  console.log('🎉 ==== INICIO mostrarModalRegistroExitoso ====');
  console.log('📋 Registro:', registro);

  Estado.registroActual = { registro, qrDataURL: null, barcodeDataURL: null };
  console.log('✅ Estado.registroActual guardado');

  // OCULTAR FORZOSAMENTE EL MODAL VIEJO
  const modalViejo = document.getElementById('modalVistaPrevia');
  if (modalViejo) {
    modalViejo.classList.remove('active');
    modalViejo.style.display = 'none';
    modalViejo.style.visibility = 'hidden';
    modalViejo.style.opacity = '0';
    modalViejo.style.zIndex = '-1';
    console.log('✅ Modal viejo OCULTADO forzosamente');
  }

  // Ocultar todo el contenido principal
  const main = document.querySelector('main');
  const menuLateral = document.getElementById('menuLateral');

  console.log('🔍 Main encontrado:', main ? 'Sí' : 'No');
  console.log('🔍 Menu lateral encontrado:', menuLateral ? 'Sí' : 'No');

  if (main) {
    main.style.display = 'none';
    console.log('✅ Main ocultado');
  }

  if (menuLateral) {
    menuLateral.style.display = 'none';
    console.log('✅ Menu lateral ocultado');
  }

  // Mostrar pantalla de éxito
  console.log('🔍 Buscando pantallaExito...');
  const pantallaExito = document.getElementById('pantallaExito');
  console.log('🔍 pantallaExito encontrado:', pantallaExito);
  console.log('🔍 pantallaExito es null?', pantallaExito === null);

  if (!pantallaExito) {
    console.error('❌ ===== ERROR: Pantalla de éxito NO encontrada =====');
    console.error('❌ Verificar que existe: <div id="pantallaExito">');
    return;
  }

  console.log('✅ Pantalla de éxito encontrada, mostrando...');
  pantallaExito.style.display = 'block';
  pantallaExito.style.visibility = 'visible';
  pantallaExito.style.opacity = '1';
  pantallaExito.style.zIndex = '10000';
  pantallaExito.style.position = 'fixed';
  pantallaExito.style.top = '0';
  pantallaExito.style.left = '0';
  pantallaExito.style.width = '100vw';
  pantallaExito.style.height = '100vh';
  console.log('✅ pantallaExito FORZADO a mostrar');

  // Llenar información
  console.log('📝 Llenando folio...');
  const exitoFolio = document.getElementById('exitoFolio');
  console.log('🔍 exitoFolio:', exitoFolio);
  if (exitoFolio) {
    exitoFolio.textContent = registro.folio;
    console.log('✅ Folio: ' + registro.folio);
  }

  const exitoFecha = document.getElementById('exitoFecha');
  console.log('🔍 exitoFecha:', exitoFecha);
  if (exitoFecha) {
    exitoFecha.textContent = `Fecha: ${formatearFecha(registro.fechaRegistro)}`;
    console.log('✅ Fecha actualizada');
  }

  // Los códigos QR y de barras han sido eliminados del diseño

  // Información personal
  console.log('📝 Llenando información personal...');
  const infoPersonal = document.getElementById('exitoInfoPersonal');
  console.log('🔍 infoPersonal:', infoPersonal);

  if (infoPersonal) {
    infoPersonal.innerHTML = `
      <div><strong>Nombre:</strong> ${registro.nombreCompleto}</div>
      <div><strong>Edad:</strong> ${registro.edad} años</div>
      <div><strong>Teléfono:</strong> ${registro.telefono}</div>
      <div><strong>Correo:</strong> ${registro.correo}</div>
      <div><strong>Residencia:</strong> ${registro.lugarRadica}</div>
    `;
    console.log('✅ Info personal agregada');
  }

  // Información deportiva
  console.log('📝 Llenando información deportiva...');
  const infoDeportiva = document.getElementById('exitoInfoDeportiva');
  console.log('🔍 infoDeportiva:', infoDeportiva);

  if (infoDeportiva) {
    infoDeportiva.innerHTML = `
      <div><strong>Posición:</strong> ${registro.posicion}</div>
      <div><strong>Sede:</strong> ${registro.sedeVisoria}</div>
      <div><strong>Estatura:</strong> ${registro.estatura} cm</div>
      <div><strong>Peso:</strong> ${registro.peso} kg</div>
      <div><strong>Lesiones:</strong> ${registro.tieneLesiones}</div>
      <div><strong>Experiencias:</strong> ${registro.experiencias.join(', ') || 'Sin experiencia'}</div>
    `;
    console.log('✅ Info deportiva agregada');
  }

  // Iniciar confeti y música con delay para asegurar que la pantalla está visible
  console.log('⏰ Iniciando confeti y música en 300ms...');
  setTimeout(() => {
    console.log('🎊 Ejecutando iniciarConfeti...');
    iniciarConfeti();
    console.log('🎵 Ejecutando reproducirMusica...');
    reproducirMusica();
  }, 300);

  // El PDF ya no se descarga automáticamente
  // El usuario debe hacer clic en el botón "Descargar PDF" para descargarlo manualmente

  console.log('✅ ==== FIN mostrarModalRegistroExitoso ====');
  console.log('✅ Pantalla de éxito debería estar visible ahora');
}

// ==================
// MODAL FUNCIONES
// ==================
function cerrarModal() {
  const modal = document.getElementById('modalVistaPrevia');
  if (modal) {
    modal.classList.remove('active');

    setTimeout(() => {
      const respuesta = confirm('¿Qué deseas hacer ahora?\n\n✅ Aceptar = Ver todos los registros\n❌ Cancelar = Crear otro registro');
      if (respuesta) {
        mostrarPantalla('pantallaLista');
      } else {
        resetearFormulario();
      }
    }, 300);
  }
}

async function descargarPDFActual() {
  if (!Estado.registroActual) {
    mostrarNotificacion('No hay registro para descargar', 'error');
    return;
  }

  // Mostrar modal de Términos y Condiciones antes de descargar
  mostrarModalTerminos();
}

// ==================
// MODAL TÉRMINOS Y CONDICIONES
// ==================
function mostrarModalTerminos() {
  const modal = document.getElementById('modalTerminos');
  const checkbox = document.getElementById('checkboxAceptaTerminos');
  const btnAceptar = document.getElementById('btnAceptarTerminos');

  if (!modal) {
    console.error('❌ Modal de términos no encontrado');
    return;
  }

  // Resetear estado del checkbox y botón
  if (checkbox) checkbox.checked = false;
  if (btnAceptar) btnAceptar.disabled = true;

  modal.style.display = 'flex';
}

function cerrarModalTerminos() {
  const modal = document.getElementById('modalTerminos');
  if (modal) {
    modal.style.display = 'none';
  }
}

async function aceptarTerminosYDescargar() {
  const checkbox = document.getElementById('checkboxAceptaTerminos');
  if (!checkbox || !checkbox.checked) {
    mostrarNotificacion('Debes aceptar los términos y condiciones', 'error');
    return;
  }

  // Cerrar modal de términos
  cerrarModalTerminos();

  // Proceder con la descarga del PDF
  mostrarLoading(true, 'Generando PDF...');

  const { registro } = Estado.registroActual;
  await crearPDF(registro, null, null);

  mostrarLoading(false);
  mostrarNotificacion('PDF descargado correctamente', 'success');
}

async function verDetalleRegistro(folio) {
  const registro = Estado.registros.find(r => r.folio === folio);
  if (!registro) return;

  mostrarLoading(true, 'Cargando vista previa...');

  Estado.registroActual = { registro, qrDataURL: null, barcodeDataURL: null };

  const modal = document.getElementById('modalVistaPrevia');
  const modalBody = document.getElementById('modalBody');
  const modalHeader = document.querySelector('.modal-header h3');

  if (modalHeader) {
    modalHeader.textContent = 'Vista Previa del Registro';
  }

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <div style="background: linear-gradient(135deg, #f26522 0%, #d94d0a 100%); padding: 2rem; border-radius: 12px; color: white; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">${registro.folio}</h2>
        <p style="opacity: 0.95;">Fecha: ${formatearFecha(registro.fechaRegistro)}</p>
      </div>
      
    </div>
    
    <div style="display: grid; gap: 1.5rem;">
      <div style="background: #f7fafc; padding: 1.5rem; border-radius: 12px;">
        <h4 style="color: #f26522; margin-bottom: 1rem; font-size: 1.1rem;">Información Personal</h4>
        <div style="display: grid; gap: 0.75rem; font-size: 0.95rem;">
          <div><strong>Nombre:</strong> ${registro.nombreCompleto}</div>
          <div><strong>Edad:</strong> ${registro.edad} años</div>
          <div><strong>Teléfono:</strong> ${registro.telefono}</div>
          <div><strong>Correo:</strong> ${registro.correo}</div>
          <div><strong>Residencia:</strong> ${registro.lugarRadica}</div>
        </div>
      </div>
      
      <div style="background: #f7fafc; padding: 1.5rem; border-radius: 12px;">
        <h4 style="color: #f26522; margin-bottom: 1rem; font-size: 1.1rem;">Información Deportiva</h4>
        <div style="display: grid; gap: 0.75rem; font-size: 0.95rem;">
          <div><strong>Posición:</strong> ${registro.posicion}</div>
          <div><strong>Sede:</strong> ${registro.sedeVisoria}</div>
          <div><strong>Estatura:</strong> ${registro.estatura} cm</div>
          <div><strong>Peso:</strong> ${registro.peso} kg</div>
          <div><strong>Lesiones:</strong> ${registro.tieneLesiones || 'No especificado'}</div>
          <div><strong>Experiencias:</strong> ${registro.experiencias.join(', ') || 'Sin experiencia'}</div>
        </div>
      </div>
    </div>
  `;

  mostrarLoading(false);
  modal.classList.add('active');
}

// ==================
// GENERACIÓN DE PDF - DISEÑO PROFESIONAL E INSTITUCIONAL
// ==================

// Función auxiliar para cargar imágenes desde assets con timeout
async function loadImageAsDataURL(path) {
  return new Promise((resolve) => {
    // Timeout de 3 segundos para evitar que se trabe
    const timeout = setTimeout(() => {
      console.warn(`⏱️ Timeout cargando imagen: ${path}`);
      resolve(null);
    }, 3000);

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = function () {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn(`⚠️ Error procesando imagen: ${path}`, e);
        resolve(null);
      }
    };

    img.onerror = function () {
      clearTimeout(timeout);
      // Intentar con fetch como alternativa para rutas locales
      fetch(path)
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch');
          return response.blob();
        })
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => {
            clearTimeout(timeout);
            resolve(reader.result);
          };
          reader.onerror = () => {
            clearTimeout(timeout);
            resolve(null);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => {
          clearTimeout(timeout);
          resolve(null); // Si falla, retornar null
        });
    };

    img.src = path;
  });
}

async function crearPDF(registro, qrDataURL, barcodeDataURL) {
  try {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF no está disponible. Verifica que la librería esté cargada.');
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // === CONFIGURACIÓN DE LAYOUT ===
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    const colGap = 6;
    const rowGap = 3;
    const sectionGap = 10;

    // === PALETA DE COLORES ===
    const colors = {
      negro: [28, 28, 28],
      blanco: [255, 255, 255],
      naranja: [242, 101, 34],
      naranjaOscuro: [200, 80, 25],
      grisOscuro: [60, 60, 60],
      grisMedio: [100, 100, 100],
      grisClaro: [240, 240, 240],
      grisBorde: [200, 200, 200]
    };

    // === TIPOGRAFÍA ===
    const fonts = {
      titulo: 14,
      subtitulo: 10,
      seccion: 9,
      label: 7,
      valor: 9,
      footer: 7
    };

    // === FUNCIÓN HELPER: Renderizar Campo ===
    function renderField(x, y, label, valor, width) {
      // Label (pequeño, gris, mayúsculas)
      doc.setFontSize(fonts.label);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.grisMedio);
      doc.text(label.toUpperCase(), x, y);

      // Valor (grande, negro)
      doc.setFontSize(fonts.valor);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.negro);
      const valorTexto = String(valor || '-');
      const lineas = doc.splitTextToSize(valorTexto, width - 2);
      doc.text(lineas, x, y + 4);

      return y + 4 + (lineas.length * 4) + rowGap;
    }

    // === FUNCIÓN HELPER: Título de Sección ===
    function renderSectionTitle(y, titulo, x = margin) {
      doc.setFontSize(fonts.seccion);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.negro);
      doc.text(titulo.toUpperCase(), x, y);

      // Línea decorativa
      doc.setDrawColor(...colors.naranja);
      doc.setLineWidth(0.8);
      doc.line(x, y + 2, x + 40, y + 2);

      return y + 8;
    }

    // === CARGAR LOGOS ===
    let logoAlebrijesData = null;
    let logoFBData = null;

    const rutasAlebrijes = [
      '../../assets/Alebrijes Teotihuacan.png',
      '../../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
      'assets/Alebrijes Teotihuacan.png'
    ];

    const rutasFB = [
      '../../assets/03_TEOTIHUACAN_-_Fuerzas_Basicas.png',
      'assets/03_TEOTIHUACAN_-_Fuerzas_Basicas.png'
    ];

    for (const ruta of rutasAlebrijes) {
      try {
        const logo = await loadImageAsDataURL(ruta);
        if (logo && logo !== 'null') { logoAlebrijesData = logo; break; }
      } catch (e) { continue; }
    }

    for (const ruta of rutasFB) {
      try {
        const logo = await loadImageAsDataURL(ruta);
        if (logo && logo !== 'null') { logoFBData = logo; break; }
      } catch (e) { continue; }
    }

    let y = 0;

    // ╔══════════════════════════════════════════════════════════╗
    // ║                    ENCABEZADO                            ║
    // ╚══════════════════════════════════════════════════════════╝
    const headerHeight = 40;

    // Barra naranja superior
    doc.setFillColor(...colors.naranja);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Fondo blanco del header
    doc.setFillColor(...colors.blanco);
    doc.rect(0, 4, pageWidth, headerHeight - 4, 'F');

    // Logos
    const logoSize = 28;
    const logoY = 8;
    if (logoAlebrijesData) {
      try { doc.addImage(logoAlebrijesData, 'PNG', margin, logoY, logoSize, logoSize); } catch (e) { }
    }
    if (logoFBData) {
      try { doc.addImage(logoFBData, 'PNG', pageWidth - margin - logoSize, logoY, logoSize, logoSize); } catch (e) { }
    }

    // Título centrado
    doc.setFontSize(fonts.titulo);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.negro);
    doc.text('REGISTRO DE VISORÍA', pageWidth / 2, 18, { align: 'center' });

    // Subtítulo
    doc.setFontSize(fonts.subtitulo);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.grisOscuro);
    doc.text('Alebrijes de Oaxaca Teotihuacán · Fuerzas Básicas', pageWidth / 2, 26, { align: 'center' });

    // Texto institucional
    doc.setFontSize(7);
    doc.setTextColor(...colors.grisMedio);
    doc.text('Documento Oficial del Club', pageWidth / 2, 33, { align: 'center' });

    y = headerHeight + 8;

    // ╔══════════════════════════════════════════════════════════╗
    // ║                    FOLIO Y FECHA                         ║
    // ╚══════════════════════════════════════════════════════════╝
    const folioWidth = 90;
    const folioX = (pageWidth - folioWidth) / 2;

    // Caja del folio
    doc.setFillColor(252, 250, 248);
    doc.roundedRect(folioX, y, folioWidth, 22, 2, 2, 'F');
    doc.setDrawColor(...colors.naranja);
    doc.setLineWidth(0.6);
    doc.roundedRect(folioX, y, folioWidth, 22, 2, 2, 'S');

    // Texto del folio
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.naranja);
    doc.text('FOLIO ÚNICO', pageWidth / 2, y + 6, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.negro);
    doc.text(registro.folio || 'N/A', pageWidth / 2, y + 14, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.grisMedio);
    const fechaEmision = formatearFecha(registro.fechaRegistro);
    doc.text('Fecha de Emisión: ' + fechaEmision, pageWidth / 2, y + 20, { align: 'center' });

    y += 30;

    // ╔══════════════════════════════════════════════════════════╗
    // ║              DATOS PERSONALES Y DEPORTIVOS               ║
    // ╚══════════════════════════════════════════════════════════╝

    // Foto del jugador
    const fotoSize = 35;
    const fotoX = margin;
    const fotoY = y;

    if (registro.foto && !registro.foto.includes('data:image/svg+xml')) {
      try {
        doc.addImage(registro.foto, 'JPEG', fotoX, fotoY, fotoSize, fotoSize);
        doc.setDrawColor(...colors.grisBorde);
        doc.setLineWidth(0.3);
        doc.roundedRect(fotoX, fotoY, fotoSize, fotoSize, 2, 2, 'S');
      } catch (e) {
        doc.setFillColor(...colors.grisClaro);
        doc.roundedRect(fotoX, fotoY, fotoSize, fotoSize, 2, 2, 'F');
        doc.setFontSize(6);
        doc.setTextColor(...colors.grisMedio);
        doc.text('FOTO', fotoX + fotoSize / 2, fotoY + fotoSize / 2, { align: 'center' });
      }
    } else {
      doc.setFillColor(...colors.grisClaro);
      doc.roundedRect(fotoX, fotoY, fotoSize, fotoSize, 2, 2, 'F');
      doc.setFontSize(6);
      doc.setTextColor(...colors.grisMedio);
      doc.text('FOTO', fotoX + fotoSize / 2, fotoY + fotoSize / 2, { align: 'center' });
    }

    // Área de datos (al lado de la foto)
    const datosX = fotoX + fotoSize + 8;
    const datosWidth = contentWidth - fotoSize - 8;
    const colWidth = (datosWidth - colGap) / 2;

    // === COLUMNA IZQUIERDA: Datos Personales ===
    let yIzq = y;
    yIzq = renderSectionTitle(yIzq, 'Información Personal', datosX);
    yIzq = renderField(datosX, yIzq, 'Nombre Completo', registro.nombreCompleto, colWidth);
    yIzq = renderField(datosX, yIzq, 'Fecha de Nacimiento', formatearFecha(registro.fechaNacimiento), colWidth);
    yIzq = renderField(datosX, yIzq, 'Edad', registro.edad ? registro.edad + ' años' : '-', colWidth);
    yIzq = renderField(datosX, yIzq, 'Teléfono', registro.telefono, colWidth);
    yIzq = renderField(datosX, yIzq, 'Correo', registro.correo, colWidth);
    yIzq = renderField(datosX, yIzq, 'Lugar de Residencia', registro.lugarRadica, colWidth);

    // === COLUMNA DERECHA: Datos Deportivos ===
    const datosXDer = datosX + colWidth + colGap;
    let yDer = y;
    yDer = renderSectionTitle(yDer, 'Información Deportiva', datosXDer);
    yDer = renderField(datosXDer, yDer, 'Posición', registro.posicion, colWidth);
    yDer = renderField(datosXDer, yDer, 'Sede de Visoría', registro.sedeVisoria, colWidth);
    yDer = renderField(datosXDer, yDer, 'Fecha de Visoría', formatearFecha(registro.fechaVisoria), colWidth);
    yDer = renderField(datosXDer, yDer, 'Estatura', registro.estatura ? registro.estatura + ' cm' : '-', colWidth);
    yDer = renderField(datosXDer, yDer, 'Peso', registro.peso ? registro.peso + ' kg' : '-', colWidth);
    yDer = renderField(datosXDer, yDer, 'Pie Hábil', registro.pieHabil, colWidth);

    y = Math.max(yIzq, yDer, fotoY + fotoSize) + sectionGap;

    // Línea separadora
    doc.setDrawColor(...colors.grisBorde);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += sectionGap;

    // ╔══════════════════════════════════════════════════════════╗
    // ║             EXPERIENCIA Y ANTECEDENTES                   ║
    // ╚══════════════════════════════════════════════════════════╝
    y = renderSectionTitle(y, 'Experiencia y Antecedentes');

    const expColWidth = (contentWidth - colGap * 2) / 3;

    // Fila de campos
    const experiencias = registro.experiencias && registro.experiencias.length > 0
      ? registro.experiencias.join(', ')
      : 'Sin experiencia';

    renderField(margin, y, 'Experiencia Deportiva', experiencias, expColWidth);
    renderField(margin + expColWidth + colGap, y, 'Club Anterior', registro.clubAnterior || 'Ninguno', expColWidth);
    renderField(margin + 2 * (expColWidth + colGap), y, 'Lesiones Previas', registro.tieneLesiones || 'No', expColWidth);

    y += 22;

    // Si hay descripción de lesiones
    if (registro.tieneLesiones === 'Sí' && registro.descripcionLesiones) {
      y = renderField(margin, y, 'Descripción de Lesiones', registro.descripcionLesiones, contentWidth);
    }

    // Línea separadora
    doc.setDrawColor(...colors.grisBorde);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += sectionGap;

    // ╔══════════════════════════════════════════════════════════╗
    // ║              CONTACTO DE EMERGENCIA                      ║
    // ╚══════════════════════════════════════════════════════════╝
    y = renderSectionTitle(y, 'Contacto de Emergencia');

    const emergColWidth = (contentWidth - colGap) / 2;
    renderField(margin, y, 'Nombre del Contacto', registro.nombreContactoEmergencia, emergColWidth);
    renderField(margin + emergColWidth + colGap, y, 'Teléfono de Emergencia', registro.telefonoEmergencia, emergColWidth);

    y += 18;

    // Alergias/Información Médica
    if (registro.alergias && registro.alergias.trim()) {
      y = renderField(margin, y, 'Información Médica / Alergias', registro.alergias, contentWidth);
    }

    // Línea separadora
    doc.setDrawColor(...colors.grisBorde);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += sectionGap;

    // ╔══════════════════════════════════════════════════════════╗
    // ║                      FIRMA                               ║
    // ╚══════════════════════════════════════════════════════════╝
    y = renderSectionTitle(y, 'Firmas');

    // Texto legal antes de firmas
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...colors.grisMedio);
    const textoLegal = 'Al firmar este documento, declaro que la información proporcionada es verídica y acepto los Términos y Condiciones para jugadores en proceso de visoría local 2026 de Fuerzas Básicas Teotihuacán.';
    const lineasLegal = doc.splitTextToSize(textoLegal, contentWidth);
    doc.text(lineasLegal, margin, y);
    y += lineasLegal.length * 3.5 + 8;

    // Firma del aspirante
    const firmaWidth = (contentWidth - 30) / 2;
    const firmaXLeft = margin;
    const firmaXRight = margin + firmaWidth + 30;

    // Línea de firma izquierda (aspirante)
    doc.setDrawColor(...colors.negro);
    doc.setLineWidth(0.5);
    doc.line(firmaXLeft, y + 15, firmaXLeft + firmaWidth, y + 15);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.negro);
    doc.text('NOMBRE Y FIRMA DEL ASPIRANTE', firmaXLeft + firmaWidth / 2, y + 21, { align: 'center' });

    // Línea de firma derecha (titular/tutor)
    doc.line(firmaXRight, y + 15, firmaXRight + firmaWidth, y + 15);
    doc.text('NOMBRE Y FIRMA DEL TITULAR', firmaXRight + firmaWidth / 2, y + 21, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.grisMedio);
    doc.text('(Padre, madre o tutor)', firmaXRight + firmaWidth / 2, y + 25, { align: 'center' });

    y += 35;

    // ╔══════════════════════════════════════════════════════════╗
    // ║                      FOOTER                              ║
    // ╚══════════════════════════════════════════════════════════╝
    const footerY = pageHeight - 18;

    // Línea superior del footer
    doc.setDrawColor(...colors.grisBorde);
    doc.setLineWidth(0.4);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    // Texto del footer
    doc.setFontSize(fonts.footer);
    doc.setTextColor(...colors.grisMedio);
    doc.setFont('helvetica', 'normal');
    doc.text('Sistema de Registro de Visorías · Alebrijes de Oaxaca Teotihuacán · Fuerzas Básicas', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Documento Oficial del Club', pageWidth / 2, footerY + 5, { align: 'center' });

    // ╔══════════════════════════════════════════════════════════╗
    // ║                   MARCA DE AGUA                          ║
    // ╚══════════════════════════════════════════════════════════╝
    if (logoAlebrijesData) {
      try {
        doc.setGState(doc.GState({ opacity: 0.08 }));
        const watermarkSize = 100;
        doc.addImage(logoAlebrijesData, 'PNG', (pageWidth - watermarkSize) / 2, (pageHeight - watermarkSize) / 2, watermarkSize, watermarkSize);
        doc.setGState(doc.GState({ opacity: 1.0 }));
      } catch (e) { }
    }

    // ╔══════════════════════════════════════════════════════════╗
    // ║                      GUARDAR PDF                         ║
    // ╚══════════════════════════════════════════════════════════╝
    const nombreArchivo = `Visoria_${registro.folio}_${registro.nombreCompleto.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);

  } catch (error) {
    console.error('Error en crearPDF:', error);
    throw error;
  }
}

async function descargarPDFRegistro(folio) {
  const registro = Estado.registros.find(r => r.folio === folio);
  if (!registro) return;

  mostrarLoading(true, 'Generando PDF...');

  await crearPDF(registro, null, null);

  mostrarLoading(false);
  mostrarNotificacion('PDF descargado correctamente', 'success');
}

async function exportarTodosPDFs() {
  if (Estado.registros.length === 0) {
    mostrarNotificacion('No hay registros para exportar', 'error');
    return;
  }

  const confirmar = confirm(`¿Deseas exportar ${Estado.registros.length} registros en PDF?\n\nEsto puede tomar unos momentos.`);
  if (!confirmar) return;

  mostrarLoading(true, `Generando ${Estado.registros.length} PDFs...`);

  for (let i = 0; i < Estado.registros.length; i++) {
    const registro = Estado.registros[i];

    await crearPDF(registro, null, null);

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  mostrarLoading(false);
  mostrarNotificacion(`Se generaron ${Estado.registros.length} PDFs exitosamente`, 'success');
}

// ==================
// UTILIDADES
// ==================
function mostrarLoading(mostrar, texto = 'Procesando...') {
  const loading = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');
  const loadingLogo = document.getElementById('loadingLogo');

  if (!loading) return;

  if (mostrar) {
    if (loadingText) loadingText.textContent = texto;

    // Intentar cargar el logo de Alebrijes, usar fallback si no está disponible
    if (loadingLogo) {
      const rutasLogo = [
        '../../assets/Alebrijes Teotihuacan.png',
        '../../assets/EquiposGrupo9_LigaTDP/AlebrijesTeotihuacán.png',
        'assets/Alebrijes Teotihuacan.png',
        '../assets/Alebrijes Teotihuacan.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Alebrijes_Oaxaca_Logo_Escudo.png/960px-Alebrijes_Oaxaca_Logo_Escudo.png'
      ];

      // Probar con la primera ruta, si falla usar el logo de Wikipedia
      loadingLogo.src = rutasLogo[0];
      loadingLogo.onerror = function () {
        this.src = rutasLogo[rutasLogo.length - 1]; // Usar logo de Wikipedia como fallback
      };
    }

    loading.classList.add('active');

    // Reiniciar la animación de la barra de progreso
    const progressBar = loading.querySelector('.loading-progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      setTimeout(() => {
        progressBar.style.animation = 'progress-fill 2s ease-in-out infinite';
      }, 10);
    }
  } else {
    // Fade out suave antes de ocultar
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.classList.remove('active');
      loading.style.opacity = '';
    }, 300);
  }
}

function mostrarNotificacion(mensaje, tipo = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = mensaje;
  toast.className = `toast ${tipo} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function acortarTexto(texto, maxLength) {
  if (texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==================
// EXPONER FUNCIONES GLOBALMENTE
// ==================
window.verDetalleRegistro = verDetalleRegistro;
window.descargarPDFRegistro = descargarPDFRegistro;
window.eliminarRegistro = eliminarRegistro;// ==========================================
// SISTEMA DE REGISTRO DE VISORÍAS
// Alebrijes de Oaxaca
// ==========================================

// ==================
// ESTADO GLOBAL
// ==================
const Estado = {
  registros: [],
  pasoActual: 1,
  totalPasos: 5,
  fotoBase64: null,
  registroActual: null,
  registroTemporal: null
};

// ==================
// INICIALIZACIÓN
// ==================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando aplicación...');
  inicializarAplicacion();
});

function inicializarAplicacion() {
  cargarRegistrosDesdeLocalStorage();
  verificarEspacioStorage();
  configurarEventos();
  inicializarFormulario();
  actualizarContadores();
  mostrarPantalla('pantallaFormulario');

  // Iniciar animación de estadísticas después de que todo esté cargado
  setTimeout(() => {
    iniciarAnimacionEstadisticas();
  }, 300);

  console.log('✅ Aplicación inicializada correctamente');
}

function verificarEspacioStorage() {
  try {
    const registrosStr = localStorage.getItem('visorias_alebrijes') || '[]';
    const tamaño = new Blob([registrosStr]).size;
    const tamañoMB = (tamaño / 1024 / 1024).toFixed(2);

    console.log(`💾 Espacio usado en localStorage: ${tamañoMB} MB`);

    if (tamaño > 4 * 1024 * 1024) {
      const limpiar = confirm(
        `⚠️ ADVERTENCIA: El almacenamiento está casi lleno (${tamañoMB} MB).\n\n` +
        `Tienes ${Estado.registros.length} registros guardados.\n\n` +
        `¿Deseas limpiar registros antiguos para liberar espacio?\n\n` +
        `(Se mantendrán los últimos 10 registros)`
      );

      if (limpiar) {
        limpiarRegistrosAntiguos();
      }
    }
  } catch (error) {
    console.error('Error verificando espacio:', error);
  }
}

function limpiarRegistrosAntiguos() {
  try {
    Estado.registros = Estado.registros.slice(-10);
    guardarEnLocalStorage();
    actualizarContadores();
    mostrarNotificacion('✅ Se limpiaron los registros antiguos. Se mantuvieron los últimos 10.', 'success');
  } catch (error) {
    mostrarNotificacion('Error al limpiar registros', 'error');
  }
}

// ==================
// CONFIGURACIÓN DE EVENTOS
// ==================
function configurarEventos() {
  console.log('⚙️ Configurando eventos...');

  // Menú lateral
  const btnAbrirMenu = document.getElementById('btnAbrirMenu');
  const btnCerrarMenu = document.getElementById('btnCerrarMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  if (btnAbrirMenu) {
    btnAbrirMenu.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👆 Click en abrir menú');
      abrirMenu();
    });
  }

  if (btnCerrarMenu) {
    btnCerrarMenu.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👆 Click en cerrar menú');
      cerrarMenu();
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', (e) => {
      e.preventDefault();
      cerrarMenu();
    });
  }

  // Navegación entre pantallas
  document.getElementById('btnListaRegistros')?.addEventListener('click', () => mostrarPantalla('pantallaLista'));
  document.getElementById('btnNuevoRegistro')?.addEventListener('click', () => mostrarPantalla('pantallaFormulario'));
  document.getElementById('btnCrearPrimero')?.addEventListener('click', () => mostrarPantalla('pantallaFormulario'));

  // Formulario - Navegación de pasos
  const btnSiguiente = document.getElementById('btnSiguiente');
  const btnAnterior = document.getElementById('btnAnterior');
  const formRegistro = document.getElementById('formRegistroVisoria');

  if (btnSiguiente) {
    btnSiguiente.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👉 Avanzar paso');
      avanzarPaso();
    });
  }

  if (btnAnterior) {
    btnAnterior.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('👈 Retroceder paso');
      retrocederPaso();
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('📝 Procesando formulario');
      procesarFormulario(e);
    });
  }

  // Fecha de nacimiento - calcular edad
  document.getElementById('fechaNacimiento')?.addEventListener('change', calcularEdad);


  // Radio buttons de lesiones - mostrar/ocultar descripción
  document.querySelectorAll('input[name="tieneLesiones"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const descripcionRow = document.getElementById('descripcionLesionesRow');
      if (this.value === 'Sí') {
        if (descripcionRow) descripcionRow.style.display = 'flex';
      } else {
        if (descripcionRow) descripcionRow.style.display = 'none';
        document.getElementById('descripcionLesiones').value = '';
      }
    });
  });
  // Foto
  const inputFoto = document.getElementById('fotoJugador');
  if (inputFoto) {
    inputFoto.addEventListener('change', manejarCambioFoto);

    // Drag & Drop
    const fileUploadLabel = document.getElementById('fileUploadLabel');
    if (fileUploadLabel) {
      fileUploadLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadLabel.style.borderColor = 'var(--naranja-primary)';
        fileUploadLabel.style.background = 'var(--naranja-ultra-light)';
      });

      fileUploadLabel.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadLabel.style.borderColor = 'var(--gris-claro)';
        fileUploadLabel.style.background = 'var(--gris-ultra-claro)';
      });

      fileUploadLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadLabel.style.borderColor = 'var(--gris-claro)';
        fileUploadLabel.style.background = 'var(--gris-ultra-claro)';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          inputFoto.files = files;
          inputFoto.dispatchEvent(new Event('change'));
        }
      });

      fileUploadLabel.addEventListener('click', () => inputFoto.click());
    }
  }

  // Botones de editar y borrar foto
  const btnEditarFoto = document.getElementById('btnEditarFoto');
  const btnBorrarFoto = document.getElementById('btnBorrarFoto');

  if (btnEditarFoto) {
    btnEditarFoto.addEventListener('click', editarFoto);
  }

  if (btnBorrarFoto) {
    btnBorrarFoto.addEventListener('click', borrarFoto);
  }

  // Checkbox "Sin Experiencia"
  const sinExperiencia = document.getElementById('sinExperiencia');
  if (sinExperiencia) {
    sinExperiencia.addEventListener('change', function (e) {
      if (e.target.checked) {
        document.querySelectorAll('input[name="experiencia"]').forEach(checkbox => {
          if (checkbox.id !== 'sinExperiencia') {
            checkbox.checked = false;
          }
        });
      }
    });
  }

  // Otros checkboxes
  document.querySelectorAll('input[name="experiencia"]:not(#sinExperiencia)').forEach(checkbox => {
    checkbox.addEventListener('change', function (e) {
      if (e.target.checked) {
        const sinExp = document.getElementById('sinExperiencia');
        if (sinExp) sinExp.checked = false;
      }
    });
  });

  // Búsqueda y filtros
  document.getElementById('inputBuscar')?.addEventListener('input', debounce(aplicarFiltros, 300));
  document.getElementById('filtroSede')?.addEventListener('change', aplicarFiltros);
  document.getElementById('filtroPosicion')?.addEventListener('change', aplicarFiltros);

  // Modal
  document.getElementById('btnCerrarModal')?.addEventListener('click', cerrarModal);
  document.getElementById('btnCerrarModalFooter')?.addEventListener('click', cerrarModal);
  document.getElementById('modalOverlay')?.addEventListener('click', cerrarModal);
  document.getElementById('btnDescargarPDF')?.addEventListener('click', descargarPDFActual);

  // Exportar todos
  document.getElementById('btnExportarTodos')?.addEventListener('click', exportarTodosPDFs);

  // Modal de Términos y Condiciones
  const checkboxTerminos = document.getElementById('checkboxAceptaTerminos');
  const btnAceptarTerminos = document.getElementById('btnAceptarTerminos');
  const btnCancelarTerminos = document.getElementById('btnCancelarTerminos');
  const btnCerrarTerminos = document.getElementById('btnCerrarTerminos');
  const overlayTerminos = document.querySelector('.modal-terminos-overlay');

  if (checkboxTerminos) {
    checkboxTerminos.addEventListener('change', function () {
      if (btnAceptarTerminos) {
        btnAceptarTerminos.disabled = !this.checked;
      }
    });
  }

  if (btnAceptarTerminos) {
    btnAceptarTerminos.addEventListener('click', aceptarTerminosYDescargar);
  }

  if (btnCancelarTerminos) {
    btnCancelarTerminos.addEventListener('click', cerrarModalTerminos);
  }

  if (btnCerrarTerminos) {
    btnCerrarTerminos.addEventListener('click', cerrarModalTerminos);
  }

  if (overlayTerminos) {
    overlayTerminos.addEventListener('click', cerrarModalTerminos);
  }
}

// ==================
// MENÚ LATERAL
// ==================
function abrirMenu() {
  console.log('🔓 Abriendo menú lateral');
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');

  if (menu) menu.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function cerrarMenu() {
  console.log('🔒 Cerrando menú lateral');
  const menu = document.getElementById('menuLateral');
  const overlay = document.getElementById('menuOverlay');

  if (menu) menu.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

// ==================
// GESTIÓN DE PANTALLAS
// ==================
function mostrarPantalla(idPantalla) {
  console.log('📺 Mostrando pantalla:', idPantalla);
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  const pantalla = document.getElementById(idPantalla);
  if (pantalla) {
    pantalla.classList.add('activa');
  }

  if (idPantalla === 'pantallaLista') {
    renderizarListaRegistros();
  } else if (idPantalla === 'pantallaFormulario') {
    resetearFormulario();
  }
}

// ==================
// FORMULARIO - NAVEGACIÓN POR PASOS
// ==================
function inicializarFormulario() {
  crearIndicadoresPasos();
  mostrarPaso(1);
}

function crearIndicadoresPasos() {
  const contenedor = document.getElementById('stepIndicators');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  for (let i = 1; i <= Estado.totalPasos; i++) {
    const indicador = document.createElement('div');
    indicador.className = 'step-indicator';
    indicador.dataset.paso = i;
    indicador.addEventListener('click', () => irAPaso(i));
    contenedor.appendChild(indicador);
  }
}

function mostrarPaso(numeroPaso) {
  console.log('📍 Mostrando paso:', numeroPaso);

  document.querySelectorAll('.form-step').forEach(paso => paso.classList.remove('active'));

  const pasoActual = document.querySelector(`.form-step[data-step="${numeroPaso}"]`);
  if (pasoActual) {
    pasoActual.classList.add('active');
  }

  document.querySelectorAll('.step-indicator').forEach((ind, index) => {
    if (index + 1 === numeroPaso) {
      ind.classList.add('active');
    } else {
      ind.classList.remove('active');
    }
  });

  const btnAnterior = document.getElementById('btnAnterior');
  const btnSiguiente = document.getElementById('btnSiguiente');
  const btnEnviar = document.getElementById('btnEnviar');

  if (btnAnterior) {
    btnAnterior.style.display = numeroPaso === 1 ? 'none' : 'inline-flex';
  }

  if (numeroPaso === Estado.totalPasos) {
    if (btnSiguiente) btnSiguiente.style.display = 'none';
    if (btnEnviar) btnEnviar.style.display = 'inline-flex';
  } else {
    if (btnSiguiente) btnSiguiente.style.display = 'inline-flex';
    if (btnEnviar) btnEnviar.style.display = 'none';
  }

  Estado.pasoActual = numeroPaso;
}

function avanzarPaso() {
  console.log('⏩ Intentando avanzar paso desde:', Estado.pasoActual);

  if (!validarPasoActual()) {
    console.log('❌ Validación fallida');
    return;
  }

  console.log('✅ Validación exitosa');

  if (Estado.pasoActual < Estado.totalPasos) {
    mostrarPaso(Estado.pasoActual + 1);
  }
}

function retrocederPaso() {
  if (Estado.pasoActual > 1) {
    mostrarPaso(Estado.pasoActual - 1);
  }
}

function irAPaso(numeroPaso) {
  if (numeroPaso < Estado.pasoActual) {
    mostrarPaso(numeroPaso);
    return;
  }

  for (let i = Estado.pasoActual; i < numeroPaso; i++) {
    if (!validarPaso(i)) {
      mostrarNotificacion('Completa los campos requeridos del paso actual', 'error');
      return;
    }
  }
  mostrarPaso(numeroPaso);
}

function validarPasoActual() {
  return validarPaso(Estado.pasoActual);
}

function validarPaso(numeroPaso) {
  console.log('🔍 Validando paso:', numeroPaso);

  const paso = document.querySelector(`.form-step[data-step="${numeroPaso}"]`);
  if (!paso) {
    console.log('⚠️ Paso no encontrado');
    return true;
  }

  if (numeroPaso === 1) {
    return validarPaso1();
  } else if (numeroPaso === 2) {
    return validarPaso2();
  } else if (numeroPaso === 3) {
    return validarPaso3();
  } else if (numeroPaso === 4) {
    return validarPaso4();
  } else if (numeroPaso === 5) {
    return validarPaso5();
  }

  return true;
}

function validarPaso1() {
  const nombre = document.getElementById('nombreCompleto').value.trim();
  const fechaNac = document.getElementById('fechaNacimiento').value;
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const lugar = document.getElementById('lugarRadica').value.trim();

  if (!nombre) {
    mostrarNotificacion('Ingresa tu nombre completo', 'error');
    return false;
  }

  if (!fechaNac) {
    mostrarNotificacion('Selecciona tu fecha de nacimiento', 'error');
    return false;
  }

  if (!telefono) {
    mostrarNotificacion('Ingresa tu teléfono', 'error');
    return false;
  }

  if (telefono.replace(/\D/g, '').length !== 10) {
    mostrarNotificacion('El teléfono debe tener 10 dígitos', 'error');
    return false;
  }

  if (!correo) {
    mostrarNotificacion('Ingresa tu correo electrónico', 'error');
    return false;
  }

  if (!validarEmail(correo)) {
    mostrarNotificacion('El correo electrónico no es válido', 'error');
    return false;
  }

  if (!lugar) {
    mostrarNotificacion('Ingresa el lugar donde radicas', 'error');
    return false;
  }

  return true;
}

function validarPaso2() {
  const posicion = document.getElementById('posicion').value;
  const pieHabil = document.getElementById('pieHabil').value;
  const estatura = document.getElementById('estatura').value;
  const peso = document.getElementById('peso').value;
  const sede = document.getElementById('sedeVisoria').value.trim();
  const fechaVisoria = document.getElementById('fechaVisoria').value;

  if (!posicion) {
    mostrarNotificacion('Selecciona tu posición de juego', 'error');
    return false;
  }

  if (!pieHabil) {
    mostrarNotificacion('Selecciona tu pie hábil', 'error');
    return false;
  }

  if (!estatura) {
    mostrarNotificacion('Ingresa tu estatura', 'error');
    return false;
  }

  if (!peso) {
    mostrarNotificacion('Ingresa tu peso', 'error');
    return false;
  }

  if (!sede) {
    mostrarNotificacion('Ingresa la sede de visoría', 'error');
    return false;
  }

  if (!fechaVisoria) {
    mostrarNotificacion('Selecciona la fecha de visoría', 'error');
    return false;
  }

  return true;
}

function validarPaso3() {
  // Validar que se haya seleccionado si tiene lesiones o no
  const lesiones = document.querySelector('input[name="tieneLesiones"]:checked');

  if (!lesiones) {
    mostrarNotificacion('Indica si has sufrido lesiones', 'error');
    return false;
  }

  // Si tiene lesiones, validar que haya descripción
  if (lesiones.value === 'Sí') {
    const descripcion = document.getElementById('descripcionLesiones').value.trim();
    if (!descripcion) {
      mostrarNotificacion('Describe tus lesiones', 'error');
      return false;
    }
  }

  // Validar experiencia profesional
  const experiencias = document.querySelectorAll('input[name="experiencia"]:checked');

  if (experiencias.length === 0) {
    mostrarNotificacion('Selecciona al menos una opción de experiencia', 'error');
    return false;
  }

  return true;
}

function validarPaso4() {
  const nombreContacto = document.getElementById('nombreContactoEmergencia').value.trim();
  const telefonoContacto = document.getElementById('telefonoEmergencia').value.trim();

  if (!nombreContacto) {
    mostrarNotificacion('Ingresa el nombre del contacto de emergencia', 'error');
    return false;
  }

  if (!telefonoContacto) {
    mostrarNotificacion('Ingresa el teléfono de emergencia', 'error');
    return false;
  }

  if (telefonoContacto.replace(/\D/g, '').length !== 10) {
    mostrarNotificacion('El teléfono de emergencia debe tener 10 dígitos', 'error');
    return false;
  }

  return true;
}

function validarPaso5() {
  const motivacion = document.getElementById('motivacion').value.trim();

  if (!motivacion) {
    mostrarNotificacion('Escribe tu motivación', 'error');
    return false;
  }

  if (motivacion.length < 50) {
    mostrarNotificacion(`La motivación debe tener al menos 50 caracteres. Actualmente: ${motivacion.length}`, 'error');
    return false;
  }

  if (!Estado.fotoBase64) {
    mostrarNotificacion('Debes cargar una foto del jugador', 'error');
    return false;
  }

  return true;
}

// ==================
// VALIDACIONES
// ==================
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function calcularEdad() {
  const fechaNac = document.getElementById('fechaNacimiento').value;
  if (!fechaNac) return;

  const hoy = new Date();
  const nacimiento = new Date(fechaNac);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  if (edad >= 0) {
    document.getElementById('edad').value = edad;
  }
}

// ==================
// MANEJO DE FOTO
// ==================
function manejarCambioFoto(e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  if (!archivo.type.startsWith('image/')) {
    mostrarNotificacion('Solo se permiten archivos de imagen', 'error');
    e.target.value = '';
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    mostrarNotificacion('La imagen no debe superar los 5MB', 'error');
    e.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    Estado.fotoBase64 = event.target.result;
    mostrarPreviewFoto(Estado.fotoBase64);
    mostrarNotificacion('Foto cargada correctamente', 'success');
  };
  reader.readAsDataURL(archivo);
}

function mostrarPreviewFoto(base64) {
  const preview = document.getElementById('filePreview');
  const label = document.getElementById('fileUploadLabel');
  const fileActions = document.getElementById('fileActions');

  if (preview && label && fileActions) {
    preview.innerHTML = `<img src="${base64}" alt="Preview de foto">`;
    preview.classList.add('active');
    label.style.display = 'none';
    fileActions.style.display = 'flex';
  }
}

function editarFoto() {
  const inputFoto = document.getElementById('fotoJugador');
  if (inputFoto) {
    inputFoto.click();
  }
}

function borrarFoto() {
  if (!confirm('¿Estás seguro de que deseas eliminar esta foto?\n\nDeberás seleccionar otra foto para continuar.')) {
    return;
  }

  const inputFoto = document.getElementById('fotoJugador');
  const preview = document.getElementById('filePreview');
  const label = document.getElementById('fileUploadLabel');
  const fileActions = document.getElementById('fileActions');

  // Limpiar el estado
  Estado.fotoBase64 = null;

  // Limpiar el input file
  if (inputFoto) {
    inputFoto.value = '';
  }

  // Ocultar preview y botones, mostrar label
  if (preview) {
    preview.innerHTML = '';
    preview.classList.remove('active');
  }

  if (label) {
    label.style.display = 'flex';
  }

  if (fileActions) {
    fileActions.style.display = 'none';
  }

  mostrarNotificacion('Foto eliminada. Por favor selecciona una nueva foto.', 'info');
}

// ==================
// PROCESAMIENTO DEL FORMULARIO
// ==================
async function procesarFormulario(e) {
  e.preventDefault();
  console.log('📋 Procesando formulario completo');

  for (let i = 1; i <= Estado.totalPasos; i++) {
    if (!validarPaso(i)) {
      mostrarPaso(i);
      return;
    }
  }

  mostrarLoading(true, 'Generando tu registro...');

  try {
    await new Promise(resolve => setTimeout(resolve, 800));

    const registro = recopilarDatosFormulario();
    const fotoCompletaTemporal = registro.foto;

    console.log('✅ Registro creado:', registro);

    guardarRegistro(registro);

    // --- FIREBASE INTEGRATION ---
    if (window.guardarRegistroFirebase) {
      console.log('🔥 Iniciando guardado en Firebase...');
      // No esperamos (await) para no bloquear la UI si firebase tarda
      window.guardarRegistroFirebase(registro)
        .then(id => console.log('✅ Guardado en Firebase con éxito, ID:', id))
        .catch(err => console.error('❌ Error guardando en Firebase:', err));
    } else {
      console.warn('⚠️ Firebase no está disponible (window.guardarRegistroFirebase no existe)');
    }
    // ----------------------------

    Estado.registroTemporal = {
      ...registro,
      foto: fotoCompletaTemporal
    };

    mostrarLoading(false);
    mostrarNotificacion('¡Registro creado exitosamente!', 'success');

    mostrarModalRegistroExitoso(Estado.registroTemporal, null, null);

  } catch (error) {
    console.error('❌ Error procesando formulario:', error);
    mostrarLoading(false);
    mostrarNotificacion('Error al procesar el registro. Por favor intenta de nuevo.', 'error');
  }
}

function recopilarDatosFormulario() {
  const experienciasSeleccionadas = [];
  document.querySelectorAll('input[name="experiencia"]:checked').forEach(cb => {
    experienciasSeleccionadas.push(cb.value);
  });

  const lesionesRadio = document.querySelector('input[name="tieneLesiones"]:checked');
  const tieneLesiones = lesionesRadio ? lesionesRadio.value : 'No especificado';
  const descripcionLesiones = tieneLesiones === 'Sí' ? document.getElementById('descripcionLesiones').value.trim() : '';

  const folio = generarFolio();

  return {
    folio: folio,
    fechaRegistro: new Date().toISOString(),
    timestamp: Date.now(),
    nombreCompleto: document.getElementById('nombreCompleto').value.trim(),
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    edad: document.getElementById('edad').value,
    telefono: document.getElementById('telefono').value.trim(),
    correo: document.getElementById('correo').value.trim(),
    lugarRadica: document.getElementById('lugarRadica').value.trim(),
    nuiProfesional: document.getElementById('nuiProfesional').value.trim(),
    posicion: document.getElementById('posicion').value,
    pieHabil: document.getElementById('pieHabil').value,
    sedeVisoria: document.getElementById('sedeVisoria').value.trim(),
    fechaVisoria: document.getElementById('fechaVisoria').value,
    estatura: document.getElementById('estatura').value,
    peso: document.getElementById('peso').value,
    tallaUniforme: document.getElementById('tallaUniforme')?.value || '',
    tieneLesiones: tieneLesiones,
    descripcionLesiones: descripcionLesiones,
    experiencias: experienciasSeleccionadas,
    clubAnterior: document.getElementById('clubAnterior').value.trim(),
    nombreContactoEmergencia: document.getElementById('nombreContactoEmergencia').value.trim(),
    telefonoEmergencia: document.getElementById('telefonoEmergencia').value.trim(),
    alergias: document.getElementById('alergias').value.trim(),
    motivacion: document.getElementById('motivacion').value.trim(),
    foto: Estado.fotoBase64
  };
}

function generarFolio() {
  const año = new Date().getFullYear();
  const consecutivo = (Estado.registros.length + 1).toString().padStart(4, '0');
  return `VIS-${año}-${consecutivo}`;
}

function resetearFormulario() {
  const form = document.getElementById('formRegistroVisoria');
  if (form) form.reset();

  Estado.fotoBase64 = null;
  Estado.pasoActual = 1;

  const preview = document.getElementById('filePreview');
  const label = document.getElementById('fileUploadLabel');
  const fileActions = document.getElementById('fileActions');

  if (preview && label) {
    preview.classList.remove('active');
    preview.innerHTML = '';
    label.style.display = 'flex';
  }

  if (fileActions) {
    fileActions.style.display = 'none';
  }

  document.querySelectorAll('input[name="experiencia"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[name="tieneLesiones"]').forEach(rb => rb.checked = false);

  // Ocultar campo de descripción de lesiones
  const descripcionRow = document.getElementById('descripcionLesionesRow');
  if (descripcionRow) {
    descripcionRow.style.display = 'none';
  }
  document.getElementById('descripcionLesiones').value = '';

  mostrarPaso(1);
}

// ==================
// ALMACENAMIENTO
// ==================
function cargarRegistrosDesdeLocalStorage() {
  try {
    const data = localStorage.getItem('visorias_alebrijes');
    if (data) {
      const registrosCargados = JSON.parse(data);
      Estado.registros = registrosCargados.map(r => ({
        ...r,
        foto: r.fotoComprimida || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YyNjUyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKavzwvdGV4dD48L3N2Zz4='
      }));
    } else {
      Estado.registros = [];
    }
    console.log('📦 Registros cargados:', Estado.registros.length);
  } catch (error) {
    console.error('Error cargando registros:', error);
    Estado.registros = [];
  }
}

function guardarRegistro(registro) {
  Estado.registros.push(registro);
  guardarEnLocalStorage();
  actualizarContadores();
}

function guardarEnLocalStorage() {
  try {
    const registrosParaGuardar = Estado.registros.map(r => {
      const { foto, ...registroSinFoto } = r;
      return {
        ...registroSinFoto,
        tieneFoto: !!foto,
        fotoComprimida: foto ? comprimirFotoParaGuardar(foto) : null
      };
    });

    localStorage.setItem('visorias_alebrijes', JSON.stringify(registrosParaGuardar));
  } catch (error) {
    console.error('Error guardando registros:', error);

    if (error.name === 'QuotaExceededError') {
      mostrarNotificacion('⚠️ Almacenamiento lleno. Se guardará el registro pero sin la foto completa.', 'error');

      try {
        const registrosSinFotos = Estado.registros.map(r => {
          const { foto, fotoComprimida, ...registroSinFoto } = r;
          return { ...registroSinFoto, tieneFoto: false };
        });
        localStorage.setItem('visorias_alebrijes', JSON.stringify(registrosSinFotos));
      } catch (err) {
        mostrarNotificacion('Error crítico: No se pudo guardar. Contacta al administrador.', 'error');
      }
    } else {
      mostrarNotificacion('Error al guardar en el almacenamiento local', 'error');
    }
  }
}

function comprimirFotoParaGuardar(fotoBase64) {
  try {
    return fotoBase64.substring(0, 1000) + '...';
  } catch (error) {
    return null;
  }
}

function eliminarRegistro(folio) {
  if (!confirm('¿Estás seguro de que deseas eliminar este registro?\n\nEsta acción no se puede deshacer.')) {
    return;
  }

  Estado.registros = Estado.registros.filter(r => r.folio !== folio);
  guardarEnLocalStorage();
  renderizarListaRegistros();
  actualizarContadores();
  mostrarNotificacion('Registro eliminado exitosamente', 'success');
}

// ==================
// CONFETI
// ==================
// ==================
// CONFETI - MEJORADO CON REPETICIÓN
// ==================
function iniciarConfeti() {
  console.log('🎊 Intentando iniciar confeti mejorado con repetición...');

  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) {
    console.error('❌ Canvas de confeti no encontrado');
    return;
  }

  console.log('✅ Canvas encontrado:', canvas);

  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error('❌ El elemento no es un canvas válido');
    return;
  }

  // Asegurar que el canvas sea visible
  canvas.style.display = 'block';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '10001';

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('❌ No se pudo obtener el contexto 2d del canvas');
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log(`✅ Canvas configurado: ${canvas.width}x${canvas.height}`);

  const confettiColors = [
    '#F05A28', '#E94E1B', '#FF6B35',  // Naranjas institucionales
    '#000000', '#1C1C1C',              // Negros
    '#FFFFFF', '#F5F5F5',              // Blancos
    '#C7C7C7', '#A0A0A0'               // Grises deportivos
  ];

  const confettiCount = 100; // Reducido para ser más sutil
  let repeatInterval;

  class ConfettiPiece {
    constructor(delay = 0) {
      this.x = Math.random() * canvas.width;
      this.y = -30 - (Math.random() * 100);
      this.size = Math.random() * 8 + 4; // Tamaño más pequeño y uniforme
      this.speedY = Math.random() * 1.5 + 0.5; // Velocidad más lenta
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 6;
      this.delay = delay;
      this.opacity = 0.4 + Math.random() * 0.4; // Opacidad entre 40% y 80%
      this.gravity = 0.06;
      this.wind = (Math.random() - 0.5) * 0.2;
    }

    update() {
      if (this.delay > 0) {
        this.delay--;
        return true;
      }

      this.speedY += this.gravity;
      this.speedX += this.wind;

      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > canvas.height - 100) {
        this.opacity -= 0.02;
      }

      if (this.y > canvas.height + 50 || this.opacity <= 0) {
        return false;
      }
      return true;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);

      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size * 0.4, this.size * 0.4);

      ctx.restore();
    }
  }

  function lanzarConfeti() {
    const confettiPieces = [];

    for (let i = 0; i < confettiCount; i++) {
      confettiPieces.push(new ConfettiPiece(i * 2));
    }

    console.log(`🎊 Lanzando ${confettiCount} piezas de confeti!`);

    let animationId;
    let frameCount = 0;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const piece = confettiPieces[i];
        if (!piece.update()) {
          confettiPieces.splice(i, 1);
        } else {
          piece.draw();
        }
      }

      frameCount++;

      if (confettiPieces.length > 0 && frameCount < 1000) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // Lanzar confeti inmediatamente
  lanzarConfeti();

  // Repetir cada 20 segundos
  repeatInterval = setInterval(() => {
    console.log('🔄 Repitiendo confeti después de 20 segundos');
    lanzarConfeti();
  }, 20000);

  console.log('✅ Confeti configurado para repetirse cada 20 segundos');

  const resizeHandler = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`🔄 Canvas redimensionado: ${canvas.width}x${canvas.height}`);
  };

  window.addEventListener('resize', resizeHandler);

  return () => {
    if (repeatInterval) {
      clearInterval(repeatInterval);
    }
    window.removeEventListener('resize', resizeHandler);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('🧹 Confeti limpiado');
  };
}


// ==================
// MÚSICA
// ==================
function reproducirMusica() {
  console.log('🎵 Intentando reproducir música...');

  const audio = document.getElementById('audioExito');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const controlVolumen = document.getElementById('controlVolumen');
  const volumenValor = document.getElementById('volumenValor');

  if (!audio) {
    console.error('❌ Elemento de audio no encontrado');
    return;
  }

  if (!btnPlayPause) {
    console.warn('⚠️ Botón play/pause no encontrado');
    return;
  }

  const iconoPlay = btnPlayPause.querySelector('.icono-play');
  const iconoPause = btnPlayPause.querySelector('.icono-pause');

  if (!iconoPlay || !iconoPause) {
    console.warn('⚠️ Iconos de play/pause no encontrados');
    return;
  }

  // Configurar volumen inicial
  audio.volume = 0.7;
  console.log('✅ Volumen configurado a 70%');

  // Reproducir automáticamente
  audio.play()
    .then(() => {
      console.log('✅ Música reproduciéndose correctamente');
    })
    .catch(error => {
      console.warn('⚠️ No se pudo reproducir automáticamente:', error.message);
      console.log('💡 El usuario deberá hacer click en play');
      // Mostrar icono de play si falla la reproducción automática
      iconoPlay.style.display = 'block';
      iconoPause.style.display = 'none';
    });

  // Actualizar iconos cuando se reproduzca
  audio.addEventListener('play', () => {
    console.log('▶️ Audio playing');
    iconoPlay.style.display = 'none';
    iconoPause.style.display = 'block';
  });

  audio.addEventListener('pause', () => {
    console.log('⏸️ Audio paused');
    iconoPlay.style.display = 'block';
    iconoPause.style.display = 'none';
  });

  audio.addEventListener('ended', () => {
    console.log('🏁 Audio terminado');
    iconoPlay.style.display = 'block';
    iconoPause.style.display = 'none';
  });

  audio.addEventListener('error', (e) => {
    console.error('❌ Error en audio:', e);
    console.error('❌ Verifica que el archivo Metegol_Alebrijes.mp3 existe en la carpeta');
  });

  // Botón play/pause
  btnPlayPause.addEventListener('click', () => {
    if (audio.paused) {
      audio.play()
        .then(() => console.log('✅ Play manual exitoso'))
        .catch(error => console.error('❌ Error al reproducir:', error));
    } else {
      audio.pause();
    }
  });

  // Control de volumen
  if (controlVolumen) {
    controlVolumen.addEventListener('input', (e) => {
      const volumen = e.target.value / 100;
      audio.volume = volumen;
      if (volumenValor) {
        volumenValor.textContent = `${e.target.value}%`;
      }
      console.log(`🔊 Volumen ajustado a ${e.target.value}%`);
    });
  }

  // No hacer loop (solo una vez)
  audio.loop = false;
  console.log('✅ Controles de música configurados');
}

// ==================
// FUNCIONES DE PANTALLA DE ÉXITO
// ==================
function cerrarPantallaExito() {
  const pantallaExito = document.getElementById('pantallaExito');
  const main = document.querySelector('main');
  const menuLateral = document.getElementById('menuLateral');
  const audio = document.getElementById('audioExito');

  if (pantallaExito) {
    pantallaExito.style.display = 'none';
  }

  if (main) {
    main.style.display = 'block';
  }

  if (menuLateral) {
    menuLateral.style.display = 'block';
  }

  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

async function descargarPDFExito() {
  if (!Estado.registroActual) {
    mostrarNotificacion('No hay registro para descargar', 'error');
    return;
  }

  // Mostrar modal de Términos y Condiciones antes de descargar
  mostrarModalTerminos();
}

// Event listeners para botones de la pantalla de éxito
document.addEventListener('DOMContentLoaded', () => {
  const btnExitoDescargarPDF = document.getElementById('btnExitoDescargarPDF');

  if (btnExitoDescargarPDF) {
    btnExitoDescargarPDF.addEventListener('click', descargarPDFExito);
  }
});