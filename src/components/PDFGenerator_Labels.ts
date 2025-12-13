import * as Print from 'expo-print';
import QRCode from 'qrcode';

interface ItemEtiqueta {
  bien_codigo: string;
  bien_secuencia?: string;
  oficina?: {
    nombre: string;
    departamento?: {
      dep_nombre: string;
    };
  };
  bien_descripcion?: string;
  bien_caracteristicas?: string;
}

/**
 * Genera un PDF con etiquetas forzando diseño de 2 columnas usando CSS Grid.
 */
export const generateLabelsPDF = async (
  items: ItemEtiqueta[],
  isBienes: boolean = true,
) => {
  try {
    // 1. Generar los QRs como cadenas SVG
    const itemsWithQR = await Promise.all(
      items.map(async (item) => {
        const qrSvg = await QRCode.toString(item.bien_codigo, {
          type: 'svg',
          margin: 0,
          color: { dark: '#000000', light: '#ffffff' },
        });
        return { ...item, qrSvg };
      }),
    );

    // 2. Construir el HTML
    // ESTRATEGIA: Margen de página 0 en @page y margen controlado en body (padding).
    // Usamos GRID para asegurar 2 columnas exactas.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page {
            size: letter;
            margin: 0mm; /* Quitamos margen de impresora para controlarlo nosotros */
          }
          
          body {
            margin: 0;
            padding: 12mm 10mm; /* Margen real del contenido: Top/Bottom 12mm, Left/Right 10mm */
            font-family: Helvetica, sans-serif;
            -webkit-print-color-adjust: exact;
            background-color: white;
            width: 216mm; /* Ancho carta fijo */
            box-sizing: border-box;
          }

          .container {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Dos columnas iguales */
            column-gap: 4mm; /* Espacio horizontal entre etiquetas */
            row-gap: 3mm;    /* Espacio vertical entre etiquetas */
            width: 100%;
          }
          
          /* LA ETIQUETA: 91mm x 24mm */
          .label {
            /* No definimos ancho fijo en mm para evitar desbordes, dejamos que el grid mande. 
               Pero aseguramos la altura. */
            height: 24mm;
            border: 0.8px solid #000;
            position: relative;
            box-sizing: border-box;
            background-color: white;
            
            /* Evitar cortes de página dentro de la etiqueta */
            break-inside: avoid; 
            page-break-inside: avoid;
            
            display: flex;
            flex-direction: row;
          }
          
          /* Borde interno decorativo */
          .label-inner-border {
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            border: 0.5px solid #aaa;
            z-index: 0;
            pointer-events: none;
          }

          .text-area {
            flex: 1;
            padding: 2mm 1mm 2mm 3mm;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
          }

          .titulo {
            font-size: 9pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .caracteristicas {
            font-size: 7pt;
            line-height: 8pt;
            height: 16pt;
            overflow: hidden;
            color: #333;
            margin-top: 2px;
            text-transform: uppercase;
            /* Limitar a 2 líneas visualmente */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .descripcion {
            font-size: 7pt;
            line-height: 8pt;
            height: 16pt;
            overflow: hidden;
            color: #333;
            margin-top: 2px;
            text-transform: uppercase;
            /* Limitar a 2 líneas visualmente */
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .depto {
            font-size: 6pt;
            font-weight: bold;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .codigo {
            font-family: 'Courier New', Courier, monospace;
            font-size: 9pt;
            font-weight: 900;
            letter-spacing: 0.5px;
            margin-top: 1px;
          }

          .qr-area {
            width: 22mm;
            height: 24mm;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 2mm;
            z-index: 1;
          }
          
          .qr-svg-container {
            width: 18mm;
            height: 18mm;
          }
          
          .qr-svg-container svg {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${itemsWithQR
            .map(
              (item) => `
            <div class="label">
              <div class="label-inner-border"></div>
              
              <div class="text-area">
                <div class="titulo">${isBienes ? item.bien_codigo : 'SIN CÓDIGO'}</div>
                
                <div class="caracteristicas">
                  ${(item.bien_caracteristicas || 'SIN CARACTERÍSTICAS').substring(0, 65)}
                </div>
                
                <div class="depto">
                  ${(item.oficina?.departamento?.dep_nombre || 'SIN DEPARTAMENTO').toUpperCase()}
                </div>
                
                <div class="descripcion">${(item.bien_descripcion || 'SIN DESCRIPCIÓN').toUpperCase()}</div>
              </div>

              <div class="qr-area">
                <div class="qr-svg-container">
                  ${item.qrSvg}
                </div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    return uri;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};
