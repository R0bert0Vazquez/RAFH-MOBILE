export type RootStackParamList = {
  Login: undefined;
  Header: { dataWorkPlace: DataWorkPlace };

  Gest_WorkCenters: { loginRespuesta: LoginRespuesta };
  Gest_MainTabNavigator: {
    access_token: string;
    user: User;
    workCenterId: number;
  };
  Gest_WorkPlace: { access_token: string; workCenterId: number };
  Gest_InfoScannerQR: { access_token: string; scannedData: string[] };
  Gest_Resguardantes: { access_token: string; workCenterId: number };
  Gest_InfoResguardante: { res_id_usuario: string };
  Gest_Account: { access_token: string; user: User };

  Resg_MainTabNavigator: { loginRespuesta: LoginRespuesta };
  Resg_InfoScannerQR: { access_token: string; scannedData: string[] };
  Resg_Account: { access_token: string; scannedData: string[] };
};

export interface LoginCredenciales {
  usuario_correo: string;
  usuario_pass: string;
}

export interface LoginRespuesta {
  message: string;
  access_token: string;
  user: {
    usuario_nombre: string;
    usuario_correo: string;
    usuario_id_rol: number;
  };
}

export interface DataWorkPlace {
  image: any;
  title: string;
}

export interface Access_token {
  access_token: string;
}

export interface LogoutCredenciales {
  access_token: string;
}

export interface LogoutRespuesta {
  message: string;
}

export interface User {
  usuario_nombre: string;
  usuario_correo: string;
  usuario_id_rol: number;
}

export interface DashboardWorkPlace {
  stats: {
    bienes_registrados: number;
    gestores_asignados: number;
    areas_asociadas: number;
    resguardantes_registrados: number;
  };
  ultimo_bien_registrado: {
    nombre: string;
  };
  ultima_transferencia: {
    nombre: string;
  };
  notificaciones: [
    {
      id_traspaso: number;
      bien_nombre: string;
      emisor: string;
      receptor: string;
    },
  ];
  ultimos_movimientos: [
    {
      tipo: string;
      bien_involucrado: string;
      gestor_encargado: string;
      resguardante_responsable: string;
      area: string;
    },
  ];

  proximo_mantenimiento: {
    fecha_programada: string;
    para_bien_nombre: string;
  };
}
export interface Stats {
  bienes_registrados: number;
  gestores_asignados: number;
  areas_asociadas: number;
  resguardantes_registrados: number;
}

export interface Notification {
  id_traspaso: number;
  bien_nombre: string;
  emisor: string;
  receptor: string;
}

export interface UltimosMovimientos {
  tipo: string;
  bien_involucrado: string;
  gestor_encargado: string;
  resguardante_responsable: string;
  area: string;
}

export interface Resguardante {
  res_nombre: string;
  res_apellidos: string;
  res_puesto: string;
  res_correo: string;
  res_telefono: string;
  res_departamento: string;
  res_id_usuario: string;
  res_rfc: string;
  res_curp: string;
  id_oficina: string;
}

export interface DataBien {
  bien_codigo: string;
  bien_estado: string;
  bien_ubicacion_actual: string;
  bien_marca: string;
  bien_modelo: string;
  bien_serie: string;
  bien_descripcion: string;
  bien_tipo_adquisicion: string;
  bien_fecha_alta: string;
  bien_valor_monetario: string;
  bien_clave: string;
  bien_y: string;
  bien_secuencia: string;
  bien_provedor: string;
  bien_numero_factura: string;
}

export interface Gestor {
  gestor_nombre: string;
  gestor_apellido1: string;
  gestor_apellido2: string;
  gestor_puesto: string;
  gestor_correo: string;
  gestor_departamento: string;
  gestor_telefono: string;
  gestor_id_usuario: number;
}
