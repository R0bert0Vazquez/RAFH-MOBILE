export type RootStackParamList = {
  Login: undefined;
  WorkCenters: { loginRespuesta: LoginRespuesta };
  MainApp: { access_token: string; workCenterId: number };
  WorkPlace: { access_token: string; workCenterId: number };
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
    usurio_id_rol: number;
  };
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

export interface UltimosMovimientos {
  tipo: string;
  bien_involucrado: string;
  gestor_encargado: string;
  resguardante_responsable: string;
  area: string;
}

export interface Stats {
  bienes_registrados: number;
  gestores_asignados: number;
  areas_asociadas: number;
  resguardantes_registrados: number;
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
