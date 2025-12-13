import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

// Tipos básicos para evitar errores de TS (puedes importarlos de tus models si prefieres)
interface ResguardantePDF {
  res_nombre?: string;
  res_apellidos?: string;
  res_rfc?: string;
  res_curp?: string;
  usuario_nombre?: string; // Fallback
  departamento?: {
    dep_nombre: string;
  };
}

interface BienPDF {
  bien_codigo?: string;
  bien_descripcion?: string;
  bien_marca?: string;
  bien_modelo?: string;
  bien_serie?: string;
  bien_valor_monetario?: string | number;
}

/**
 * Función Principal: Genera el HTML, crea el PDF y abre el diálogo de compartir.
 */
export const generarYCompartirValeResguardo = async (
  resguardante: ResguardantePDF,
  bienes: BienPDF[],
  tipo: 'RESGUARDO' | 'LIBERACION' = 'RESGUARDO',
) => {
  try {
    // 1. Generar el string HTML con el diseño exacto
    const htmlContent = generateHtml(resguardante, bienes, tipo);

    // 2. Definir ruta temporal
    const fileUri = `${FileSystem.cacheDirectory}Vale_Resguardo_${Date.now()}.pdf`;

    // 3. Generar el archivo PDF usando Expo Print
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      width: 612, // Carta (points) aprox
      height: 792,
      base64: false,
    });

    console.log('PDF Generado en:', uri);

    // 4. Mover el archivo a una ruta cache controlada (opcional, pero buena práctica)
    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });

    // 5. Verificar si se puede compartir
    if (!(await Sharing.isAvailableAsync())) {
      alert('La función de compartir no está disponible en este dispositivo.');
      return;
    }

    // 6. Compartir el archivo
    await Sharing.shareAsync(fileUri, {
      dialogTitle:
        tipo === 'RESGUARDO'
          ? 'Descargar Vale de Resguardo'
          : 'Descargar Acta de Devolución',
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('Error en generarYCompartirValeResguardo:', error);
    throw new Error('No se pudo generar el PDF.');
  }
};

/**
 * Función auxiliar que construye el HTML/CSS replicando el diseño del PDF original.
 */
const generateHtml = (
  resguardante: ResguardantePDF,
  bienes: BienPDF[],
  tipo: string,
) => {
  const today = new Date().toLocaleDateString('es-MX');

  // Constantes del Plantel
  const CONSTANTES = {
    PLANTEL: 'INSTITUTO TECNOLÓGICO DE CHETUMAL',
    CLAVE: '115130014',
    CENTRO_TRABAJO: '23DIT0001L',
  };

  const tituloTexto =
    tipo === 'LIBERACION'
      ? 'ACTA DE DEVOLUCIÓN DE BIENES MUEBLES'
      : 'VALE ÚNICO DE RESGUARDO DE BIENES MUEBLES';

  // Datos del Servidor Público
  const nombreCompleto =
    `${resguardante.res_nombre || resguardante.usuario_nombre || ''} ${resguardante.res_apellidos || ''}`.trim();
  const rfcCurp = resguardante.res_rfc || resguardante.res_curp || '';
  const areaNombre = resguardante.departamento?.dep_nombre || '';

  // Generar filas de la tabla de bienes
  const bienesRows = bienes
    .map((bien, index) => {
      const desc = bien.bien_descripcion || '';
      const marca = bien.bien_marca ? ` MARCA: ${bien.bien_marca}` : '';
      const modelo = bien.bien_modelo ? ` MODELO: ${bien.bien_modelo}` : '';
      const descripcionCompleta = `${desc}${marca}${modelo}`;
      const precio = parseFloat(String(bien.bien_valor_monetario || 0)).toFixed(
        2,
      );

      return `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td style="text-align: center;">${bien.bien_codigo || 'S/N'}</td>
        <td style="text-align: left;">${descripcionCompleta}</td>
        <td style="text-align: right;">$${precio}</td>
        <td style="text-align: center;">${bien.bien_serie || 'S/N'}</td>
      </tr>
    `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Vale de Resguardo</title>
      <style>
        @page { margin: 15mm; }
        body { 
          font-family: 'Helvetica', 'Arial', sans-serif; 
          font-size: 10px; 
          color: #000; 
          margin: 0;
          padding: 20px;
        }
        
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
        .subtitle { font-size: 12px; margin-bottom: 15px; }

        /* Estilos para las líneas de información (Plantel, Clave, etc) */
        .info-row {
          display: flex;
          align-items: flex-end; /* Alinea el texto al fondo para simular escritura sobre línea */
          margin-bottom: 8px;
          width: 100%;
        }
        .label {
          font-weight: normal;
          white-space: nowrap;
          margin-right: 5px;
        }
        .value-line {
          border-bottom: 1px solid black;
          flex-grow: 1;
          text-align: center;
          padding-bottom: 2px;
          min-height: 14px;
        }
        .value-fixed-sm { width: 100px; flex-grow: 0; }
        .value-fixed-md { width: 150px; flex-grow: 0; }

        /* Tabla de Servidor Público (Diseño invertido: Datos arriba, Labels abajo) */
        .section-title {
          text-align: center;
          font-weight: bold;
          font-size: 10px;
          margin-top: 20px;
          margin-bottom: 5px;
        }

        .servidor-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .servidor-table td, .servidor-table th {
          border: 1px solid black;
          text-align: center;
          width: 25%;
        }
        /* La fila de datos es alta para la firma */
        .data-row td {
          height: 40px; 
          vertical-align: bottom;
          font-weight: bold;
          padding-bottom: 5px;
          font-size: 9px;
        }
        /* La fila de etiquetas es pequeña */
        .label-row td {
          background-color: #fff;
          font-weight: bold;
          font-size: 8px;
          padding: 4px;
        }

        /* Tabla de Bienes */
        .bienes-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 5px;
        }
        .bienes-table th, .bienes-table td {
          border: 1px solid black;
          padding: 4px;
          font-size: 9px;
        }
        .bienes-table th {
          text-align: center;
          font-weight: bold;
          background-color: white; /* Sin color de fondo */
        }
        
        .footer-total {
          text-align: right;
          font-weight: bold;
          padding: 5px;
          margin-top: 5px;
          font-size: 10px;
        }

        .page-footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 8px;
          color: #777;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="title">${tituloTexto}</div>
        <div class="subtitle">${CONSTANTES.PLANTEL}</div>
      </div>

      <!-- Fila 1: Plantel y Clave -->
      <div class="info-row">
        <span class="label">PLANTEL</span>
        <div class="value-line">${CONSTANTES.PLANTEL}</div>
        <span class="label" style="margin-left: 10px;">CLAVE:</span>
        <div class="value-line value-fixed-sm">${CONSTANTES.CLAVE}</div>
      </div>

      <!-- Fila 2: Área y Centro de Trabajo -->
      <div class="info-row">
        <span class="label">ÁREA</span>
        <div class="value-line">${areaNombre}</div>
        <span class="label" style="margin-left: 10px;">CENTRO DE TRABAJO</span>
        <div class="value-line value-fixed-md">${CONSTANTES.CENTRO_TRABAJO}</div>
      </div>

      <!-- Sección Servidor Público -->
      <div class="section-title">DATOS DEL SERVIDOR PÚBLICO</div>
      <table class="servidor-table">
        <tr class="data-row">
          <td>${nombreCompleto}</td>
          <td>${rfcCurp}</td>
          <td>${today}</td>
          <td></td> <!-- Espacio para firma -->
        </tr>
        <tr class="label-row">
          <td>NOMBRE</td>
          <td>RFC/CURP</td>
          <td>FECHA DE ELABORACIÓN</td>
          <td>FIRMA</td>
        </tr>
      </table>

      <!-- Sección Bienes -->
      <div class="section-title">BIENES ASIGNADOS</div>
      <table class="bienes-table">
        <thead>
          <tr>
            <th style="width: 8%;">CANTIDAD</th>
            <th style="width: 20%;">CLAVE CAMB</th>
            <th>NOMBRE Y CARACTERÍSTICAS DEL BIEN</th>
            <th style="width: 15%;">PRECIO</th>
            <th style="width: 20%;">No. DE SERIE</th>
          </tr>
        </thead>
        <tbody>
          ${bienesRows}
        </tbody>
      </table>

      <div class="footer-total">
        TOTAL DE BIENES RESGUARDADOS: ${bienes.length}
      </div>

      <div class="page-footer">
        RAFH - Sistema de Gestión de Activos
      </div>

    </body>
    </html>
  `;
};
