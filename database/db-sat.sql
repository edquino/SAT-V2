
-- estado: <0>:INACTIVO  <1>: ACTIVO  
CREATE SEQUENCE seq_sat_modulos_id_modulo_app;
CREATE TABLE sat_modulos (
    id_modulo NUMERIC NOT NULL DEFAULT nextval('seq_sat_modulos_id_modulo_app'),
    nombre_modulo VARCHAR (30) NOT NULL,
    tipo_modulo NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_modulos_pkey PRIMARY KEY (id_modulo)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO  
CREATE SEQUENCE seq_sat_banner_id_banner;
CREATE TABLE sat_banner (
    id_banner NUMERIC NOT NULL DEFAULT nextval('seq_sat_banner_id_banner'),
    titulo_banner VARCHAR (50) NOT NULL,
    descripcion TEXT,
    url VARCHAR,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_banner_pkey PRIMARY KEY (id_banner)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_fuente_id_tipo_fuente;
CREATE TABLE sat_tipo_fuente(
    id_tipo_fuente NUMERIC NOT NULL DEFAULT nextval('seq_sat_tipo_fuente_id_tipo_fuente'),
    nombre_tipo_fuente VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_fuente_pkey PRIMARY KEY (id_tipo_fuente)
);


-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_fuente_id_fuente;
CREATE TABLE sat_fuente(
    id_fuente NUMERIC NOT NULL DEFAULT nextval('seq_sat_fuente_id_fuente'),
    nombre_fuente VARCHAR(30) NOT NULL,
    id_tipo_fuente NUMERIC NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_fuente_pkey PRIMARY KEY (id_fuente)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_escenario_id_escenario;
CREATE TABLE sat_escenario(
    id_escenario NUMERIC NOT NULL DEFAULT nextval('seq_sat_escenario_id_escenario'),
    nombre_escenario VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_escenario_pkey PRIMARY KEY (id_escenario)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_fase_conflicto_id_fase_conflicto;
CREATE TABLE sat_fase_conflicto (
    id_fase_conflicto NUMERIC NOT NULL DEFAULT nextval('seq_sat_fase_conflicto_id_fase_conflicto'),
    nombre_fase VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_fase_conflicto_pkey PRIMARY KEY (id_fase_conflicto)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_rol_app_id_rol;
CREATE TABLE sat_rol_app (
    id_rol NUMERIC NOT NULL DEFAULT nextval('seq_sat_rol_app_id_rol'), 
    nombre_rol VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_rol_app_pkey PRIMARY KEY (id_rol)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_rol_app_permisos_id_rol_permisos;
CREATE TABLE sat_rol_app_permisos (
    id_rol_permisos NUMERIC NOT NULL DEFAULT nextval('seq_sat_rol_app_permisos_id_rol_permisos'), 
    nombre_permiso VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_rol_app_permisos_pkey PRIMARY KEY (id_rol_permisos)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_accesos_usuario;
CREATE TABLE sat_accesos_usuario
(
    id_acceso_usuario numeric NOT NULL DEFAULT nextval('seq_sat_accesos_usuario'),
    id_usuario numeric NOT NULL,
    permiso_acceso_app numeric(2) NOT NULL DEFAULT 0,
    permiso_acceso_web numeric(2) NOT NULL DEFAULT 0,
    id_rol_permisos numeric(2) NOT NULL DEFAULT 1,
    fecha_ing_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing numeric NOT NULL,
    cod_usu_mod numeric NOT NULL,
    estado numeric(2,0) NOT NULL DEFAULT 1,
    CONSTRAINT sat_accesos_usuario_pkey PRIMARY KEY (id_acceso_usuario)
);

-- ******** NUEVA
-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_permisos_modulos_usuario;
CREATE TABLE sat_permisos_modulos_usuario
(
    id_permiso_modulo numeric NOT NULL DEFAULT nextval('seq_sat_permisos_modulos_usuario'),
    id_usuario numeric NOT NULL,
    id_modulo numeric NOT NULL,
    fecha_ing_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing numeric NOT NULL,
    cod_usu_mod numeric NOT NULL,
    estado numeric(2,0) NOT NULL DEFAULT 1,
    CONSTRAINT sat_pemisos_modulos_usuario_pkey PRIMARY KEY (id_permiso_modulo)
);


CREATE SEQUENCE seq_sat_seguridad_token_id_seguridad_token;
CREATE TABLE sat_seguridad_token (
    id_seguridad_token NUMERIC NOT NULL DEFAULT nextval('seq_sat_seguridad_token_id_seguridad_token'),
    id_usuario NUMERIC NOT NULL, 
    token VARCHAR NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sat_seguridad_token_pkey PRIMARY KEY (id_seguridad_token)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_accion_pddh_id_accion_pddh;
CREATE TABLE sat_accion_pddh (
    id_accion_pddh NUMERIC NOT NULL DEFAULT nextval('seq_sat_accion_pddh_id_accion_pddh'),
    nombre_accion VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_accion_pddh_pkey PRIMARY KEY (id_accion_pddh)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_alerta_id_tipo_alerta;
CREATE TABLE sat_tipo_alerta (
    id_tipo_alerta NUMERIC NOT NULL DEFAULT nextval('seq_sat_tipo_alerta_id_tipo_alerta'),   
    nombre_alerta VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_alerta_pkey PRIMARY KEY (id_tipo_alerta)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_agresion_id_agresion;
CREATE TABLE sat_tipo_agresion (
    id_tipo_agresion NUMERIC NOT NULL DEFAULT nextval('seq_sat_tipo_agresion_id_agresion'),   
    nombre_agresion VARCHAR(100) NOT NULL,
    ponderacion NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_agresion_pkey PRIMARY KEY (id_tipo_agresion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_situacion_actual_conflicto_id_situacion_conflicto;
CREATE TABLE sat_situacion_actual_conflicto (
    id_situacion_conflicto NUMERIC NOT NULL DEFAULT nextval('seq_sat_situacion_actual_conflicto_id_situacion_conflicto'),   
    nombre_conflicto VARCHAR(250) NOT NULL,
    ponderacion NUMERIC(2) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_situacion_actual_conflicto_pkey PRIMARY KEY (id_situacion_conflicto)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_notificacion_id_notificacion;
CREATE TABLE sat_notificacion(
    id_notificacion NUMERIC NOT NULL DEFAULT nextval('seq_sat_notificacion_id_notificacion'), 
    nombre_notificacion VARCHAR(30) NOT NULL,
    id_usuario NUMERIC(2) NOT NULL,
    mensaje TEXT NOT NULL, 
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_notificacion_pkey PRIMARY KEY (id_notificacion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_verificaciones_id_est_verificacion;
CREATE TABLE sat_est_verificaciones(
    id_est_verificacion NUMERIC NOT NULL DEFAULT nextval('seq_sat_est_verificaciones_id_est_verificacion'),
    id_departamento NUMERIC NOT NULL,
    id_municipio NUMERIC NOT NULL,
    id_autoridad NUMERIC NOT NULL,
    edad NUMERIC NOT NULL,
    id_genero NUMERIC NULL,
    poblacion_afectada NUMERIC(5) NOT NULL,
    CONSTRAINT sat_est_verificaciones_pkey PRIMARY KEY (id_est_verificacion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_acciones_inm_id_est_acciones;
CREATE TABLE sat_est_acciones_inm(
    id_est_acciones NUMERIC NOT NULL DEFAULT nextval('seq_sat_est_acciones_inm_id_est_acciones'),
    id_departamento NUMERIC NOT NULL,
    id_municipio NUMERIC NOT NULL,
    id_autoridad NUMERIC NOT NULL,
    edad NUMERIC(2) NOT NULL,
    id_genero NUMERIC NULL,
    CONSTRAINT sat_est_acciones_inm_pkey PRIMARY KEY (id_est_acciones)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_est_expedientes_id_est_expediente;
CREATE TABLE sat_est_expedientes(
    id_est_expediente NUMERIC NOT NULL DEFAULT nextval('seq_sat_est_expedientes_id_est_expediente'),
    id_departamento NUMERIC NOT NULL,
    id_municipio NUMERIC NOT NULL,
    id_autoridad NUMERIC NOT NULL,
    edad NUMERIC(2) NOT NULL,
    id_genero NUMERIC(2) NULL,
    CONSTRAINT sat_est_expedientes_pkey PRIMARY KEY (id_est_expediente)
); 

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_zonas_id_zona;
CREATE TABLE sat_zonas(
    id_zona NUMERIC NOT NULL DEFAULT nextval('seq_sat_zonas_id_zona'),
    nombre_zona VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_zonas_pkey PRIMARY KEY (id_zona)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_entrada_id_zona;
CREATE TABLE sat_tipo_entrada(
    id_entrada NUMERIC NOT NULL DEFAULT nextval('seq_sat_tipo_entrada_id_zona'),
    nombre_entrada VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_entrada_pkey PRIMARY KEY (id_entrada)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_sexo_id_sexo;
CREATE TABLE sat_sexo(
    id_sexo NUMERIC NOT NULL DEFAULT nextval('seq_sat_sexo_id_sexo'),
    nombre_sexo VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_sexo_pkey PRIMARY KEY (id_sexo)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_genero_id_genero;
CREATE TABLE sat_genero(
    id_genero NUMERIC NOT NULL DEFAULT nextval('seq_sat_genero_id_genero'),
    nombre_genero VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_genero_pkey PRIMARY KEY (id_genero)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_tipo_poblacion_id_poblacion;
CREATE TABLE sat_tipo_poblacion(
    id_poblacion NUMERIC NOT NULL DEFAULT nextval('seq_sat_tipo_poblacion_id_poblacion'),
    nombre_poblacion VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_tipo_poblacion_pkey PRIMARY KEY (id_poblacion)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_calidad_clasificacion_crisis_id_calidad_crisis;
CREATE TABLE sat_calidad_clasificacion_crisis(
    id_calidad_crisis NUMERIC NOT NULL DEFAULT nextval('seq_sat_calidad_clasificacion_crisis_id_calidad_crisis'),
    nombre_calidad_crisis VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_calidad_clasificacion_crisis_pkey PRIMARY KEY (id_calidad_crisis)
);

--sat_calidad_clasificacion_participa
CREATE SEQUENCE seq_sat_calidad_clasificacion_participa_id_calidad_participa;
CREATE TABLE sat_calidad_clasificacion_participa(
    id_calidad_participa NUMERIC NOT NULL DEFAULT nextval('seq_sat_calidad_clasificacion_crisis_id_calidad_crisis'),
    nombre_calidad_participa VARCHAR(80) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_calidad_clasificacion_participa_pkey PRIMARY KEY (id_calidad_participa)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_unidad_administrativa_id_unidad_administrativa;
CREATE TABLE sat_unidad_administrativa(
    id_unidad_administrativa NUMERIC NOT NULL DEFAULT nextval('seq_sat_unidad_administrativa_id_unidad_administrativa'),
    nombre_unidad VARCHAR(80) NOT NULL,
    correo_prinicipal VARCHAR(80) NOT NULL,
    correo_secundario VARCHAR(50) NULL,
    correo_tercero VARCHAR(50) NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_unidad_administrativa_pkey PRIMARY KEY (id_unidad_administrativa)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_referencia_emision_id_referencia_emision;
CREATE TABLE sat_referencia_emision(
    id_referencia_emision NUMERIC NOT NULL DEFAULT nextval('seq_sat_referencia_emision_id_referencia_emision'),
    nombre_referencia VARCHAR(150) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_referencia_emision_pkey PRIMARY KEY (id_referencia_emision)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_escenarios_id_escenario;
CREATE TABLE sat_escenarios(
    id_escenario NUMERIC NOT NULL DEFAULT nextval('seq_sat_escenarios_id_escenario'),
    nombre_escenario VARCHAR(30) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_escenarios_pkey PRIMARY KEY (id_escenario)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_temporalidad_id_temporalidad;
CREATE TABLE sat_temporalidad(
    id_temporalidad NUMERIC NOT NULL DEFAULT nextval('seq_sat_temporalidad_id_temporalidad'),
    nombre_temporalidad VARCHAR(150) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_temporalidad_pkey PRIMARY KEY (id_temporalidad)
);

-- estado: <0>:INACTIVO  <1>: ACTIVO 
CREATE SEQUENCE seq_sat_temas_id_tema;
CREATE TABLE sat_temas(
    id_tema NUMERIC NOT NULL DEFAULT nextval('seq_sat_temas_id_tema'),
    nombre_tema VARCHAR(150) NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_temas_pkey PRIMARY KEY (id_tema)
);

CREATE SEQUENCE seq_sat_subtemas_id_subtema;
CREATE TABLE sat_subtemas(
    id_subtema NUMERIC NOT NULL DEFAULT nextval('seq_sat_subtemas_id_subtema'),
    nombre_subtema VARCHAR(150) NOT NULL,
    id_tema NUMERIC NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_subtemas_pkey PRIMARY KEY (id_subtema)
);

CREATE SEQUENCE seq_sat_situacion_conflictiva_id_situacion_conflictiva;
CREATE TABLE sat_situacion_conflictiva(
    id_situacion_conflictiva NUMERIC NOT NULL DEFAULT nextval('seq_sat_situacion_conflictiva_id_situacion_conflictiva'),
    nombre_sit_conflictiva VARCHAR NOT NULL,
    id_subtema NUMERIC NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_situacion_conflictiva_pkey PRIMARY KEY (id_situacion_conflictiva)
);

CREATE SEQUENCE seq_sat_criterio_id_criterio;
CREATE TABLE sat_criterio(
    id_criterio NUMERIC NOT NULL DEFAULT nextval('seq_sat_criterio_id_criterio'),
    nombre_criterio VARCHAR NOT NULL,
    id_tema NUMERIC NOT NULL,
    id_sit_conflictiva NUMERIC NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_criterio_pkey PRIMARY KEY (id_criterio)
);

CREATE SEQUENCE seq_sat_perfil_actores_id_perfil_actor;
CREATE TABLE sat_perfil_actores(
    id_perfil_actor NUMERIC NOT NULL DEFAULT nextval('seq_sat_perfil_actores_id_perfil_actor'),
    nombre_actor VARCHAR NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_perfil_actores_pkey PRIMARY KEY (id_perfil_actor)
);

CREATE SEQUENCE seq_sat_acciones_hecho_id_acciones_hecho;
CREATE TABLE sat_acciones_hecho(
    id_acciones_hecho NUMERIC NOT NULL DEFAULT nextval('seq_sat_acciones_hecho_id_acciones_hecho'),
    nombre_hecho VARCHAR NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_acciones_hecho_pkey PRIMARY KEY (id_acciones_hecho)
);

CREATE SEQUENCE seq_sat_estadistica_indicadores_id_est_indicador;
CREATE TABLE sat_estadistica_indicadores
(
    id_est_indicador numeric(7) DEFAULT nextval('seq_sat_estadistica_indicadores_id_est_indicador') NOT NULL,
    id_indicador numeric(3),
    id_departamento numeric(2),
    id_municipio numeric(5),
    tipo_alerta numeric,
    fase_conflicto numeric,
    fecha_hecho date,
    fecha_ingreso date,
    CONSTRAINT sat_estadistica_indicadores_pkey PRIMARY KEY (id_est_indicador)
);

CREATE SEQUENCE seq_sat_alerta_temprana_id_alerta_temprana;
CREATE TABLE sat_alerta_temprana (
    id_alerta_temprana NUMERIC NOT NULL DEFAULT nextval('seq_sat_alerta_temprana_id_alerta_temprana'),
    id_tipo_fuente NUMERIC NOT NULL,  
    id_fuente NUMERIC NOT NULL,       
    titulo_noticia VARCHAR (100),
    nombre_medio_prensa VARCHAR(100),
    paginas_prensa VARCHAR(80),
    autor_prensa VARCHAR(100),
    fecha_publicacion_prensa TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fotografia_prensa VARCHAR(100),
    nombre_medio_radio VARCHAR(70),
    canal_radio VARCHAR(100),
    nombre_programa_radio VARCHAR(100),
    fecha_emision_radio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    titulo_redes VARCHAR(70),
    nombre_red_social VARCHAR(50),
    url_red_social VARCHAR(150) ,
    fecha_pub_red_social TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pantalla_red_social VARCHAR(100),
    nombre_colectivo VARCHAR(50),
    nombre_contacto_colectivo VARCHAR(50),
    telefono_colectivo VARCHAR(50),
    nombre_organismo VARCHAR(50),
    nombre_contacto_organismo VARCHAR(50),
    correo_organismo VARCHAR(100),
    telefono_organismo VARCHAR(50),
    datos_organismo VARCHAR(250),
    nombre_mensajeria VARCHAR(50),
    nombre_contacto_mensajeria VARCHAR(50),
    contacto_mensajeria VARCHAR(50),
    datos_mensajeria VARCHAR(250),
    fotografia_mensajeria VARCHAR(100),
    nombre_inst_gub VARCHAR(70),
    contacto_inst_gub VARCHAR(50),
    correo_inst_gub VARCHAR(70),
    telefono_inst_gub VARCHAR(50),
    datos_inst_gub VARCHAR(150),
    otras_detalle VARCHAR(50),
    otras_adicionales VARCHAR(250),
    fecha_hechos TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_futura_hechos boolean,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_pais NUMERIC NOT NULL,   
    id_departamento NUMERIC,  
    id_municipio NUMERIC,  
    id_tipo_zona NUMERIC,  
    descripcion_hechos TEXT ,  
    id_derecho NUMERIC, 
    id_escenarios NUMERIC,
    id_tematica_relacionada NUMERIC,
    id_sub_tematica NUMERIC, 
    id_situacion_conflictiva NUMERIC,
    id_criterio NUMERIC,
    id_temporalidad VARCHAR(100),
    cantidad NUMERIC, 
    id_scenario NUMERIC,
    antecedentes_hecho TEXT,
    poblacion_afectada VARCHAR(100),
    contraparte VARCHAR(100),
    id_perfil_actor NUMERIC[],
    id_grupo_vulnerable NUMERIC[],
    demanda_solicitud TEXT,
    postura_autoridades TEXT,
    poblacion_ninos NUMERIC,
    poblacion_ninas NUMERIC,
    adolecentes_mujeres NUMERIC,
    adolecentes_hombres NUMERIC,
    poblacion_hombres NUMERIC, 
    poblacion_mujeres NUMERIC,
    poblacion_hombre_mayor NUMERIC,
    poblacion_mujer_mayor NUMERIC, 
    cantidad_aproximada NUMERIC,
    id_acciones_hecho NUMERIC,
    proteccion_vigente BOOLEAN DEFAULT false,
    hubo_agresion BOOLEAN DEFAULT false,
    id_tipo_agresion numeric[],
    dialogo_conflicto BOOLEAN DEFAULT false,
    medida_conflicto BOOLEAN DEFAULT false,
    dialogo_roto_conflicto BOOLEAN DEFAULT false,
    crisis_conflicto BOOLEAN DEFAULT false, 
    id_acciones_hecho_anterior NUMERIC,
    resolucion_conflicto BOOLEAN DEFAULT false, 
    id_situacion_conflicto NUMERIC NOT NULL,
    cant_persona_involucrada BOOLEAN DEFAULT false, 
    presencia_fuerza_publica BOOLEAN DEFAULT false, 
    intervencion_fuerza_publica BOOLEAN DEFAULT false, 
    cantidad_poblacion_afectada NUMERIC,
    id_fase_conflicto NUMERIC,
    id_tipo_alerta NUMERIC, 
    id_accion_pddh NUMERIC, 
    analisis VARCHAR,
    notificar NUMERIC,
    texto_mensaje TEXT,
    analizada BOOLEAN,
    enviada_analizar BOOLEAN DEFAULT false,
    alerta_relacionada BOOLEAN DEFAULT false,
    alerta_padre BOOLEAN DEFAULT false,
    fecha_ing_reg TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC,
    estado_modulo NUMERIC(2) DEFAULT 1,
    CONSTRAINT sat_alerta_temprana_pkey PRIMARY KEY (id_alerta_temprana)
);

CREATE SEQUENCE sat_atencion_crisis_id_atencion_crisis;
CREATE TABLE sat_atencion_crisis(
    id_atencion_crisis NUMERIC NOT NULL DEFAULT nextval('sat_atencion_crisis_id_atencion_crisis'),
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    id_tipo_via_entrada NUMERIC,
    via_entrada VARCHAR,
    id_calidad_crisis NUMERIC,
    id_naturaleza NUMERIC,   
    participante_nombre VARCHAR(150),
    participante_dependencia VARCHAR(150), 
    participante_nivel VARCHAR(150),
    nombre_solicitante VARCHAR(50) NOT NULL,
    id_documento_solicitante INT NOT NULL, 
    num_documento VARCHAR(50),
    fecha_nacimiento date,
    edad NUMERIC NOT NULL DEFAULT 0,
    id_sexo_solicitante NUMERIC,
    id_genero_solicitante NUMERIC, 
    id_orientacion_solicitante NUMERIC,
    id_ocupacion NUMERIC(2) NOT NULL, 
    id_grupo_vulnerabilidad NUMERIC[],     
    id_zona_domicilio NUMERIC, 
    id_departamento NUMERIC,  
    id_municipio NUMERIC,   
    direccion VARCHAR(250),
    id_otr_med_notificacion NUMERIC(2),
    detalle_persona VARCHAR(150),
    fuente_informacion VARCHAR(50),
    fecha_informacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia_emision  VARCHAR(250),
    fecha_recepción TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_poblacion NUMERIC,
    cantidad_aproximada NUMERIC(5),
    sector_poblacion_afectada VARCHAR(50),
    grupo_vulnerabilidad NUMERIC[],
    nombre_notificacion_medio VARCHAR(150), 
    resumen_hecho TEXT,
    id_calificacion NUMERIC, 
    nombre_funcionario VARCHAR(150), 
    cargo VARCHAR(150),
    nombre_otros VARCHAR(150), 
    institucion_otros VARCHAR(150), 
    cargo_otros VARCHAR(150), 
    id_calificacion_otros NUMERIC, 
    id_accion_pddh NUMERIC,
    analisis TEXT,
    id_unidad_administrativa NUMERIC, 
    texto_mensaje TEXT,
    analizada BOOLEAN DEFAULT false,
    enviada_analizar BOOLEAN DEFAULT false;
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC,
    cod_usu_mod NUMERIC,
    estado_modulo NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_atencion_crisis_pkey PRIMARY KEY (id_atencion_crisis)
);

CREATE SEQUENCE seq_sat_alertas_relacionadas_id_alerta_relacionada;
CREATE TABLE sat_alertas_relacionadas(
    id_alerta_relacionada NUMERIC NOT NULL DEFAULT nextval('seq_sat_alertas_relacionadas_id_alerta_relacionada'),
    id_padre integer NOT NULL,
    id_hijo integer NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_acciones_hecho_pkey PRIMARY KEY (id_acciones_hecho)
);

CREATE TABLE sat_alerta_temprana_relacionados
(
    id_alerta_relacionada NUMERIC NOT NULL DEFAULT nextval('seq_sat_alerta_temprana_relacionados_id_alerta_relacionada'),
    id_padre numeric NOT NULL,
    id_hijo numeric NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_alerta_temprana_relacionados_pkey PRIMARY KEY (id_padre, id_hijo)
);

CREATE TABLE sat_atencion_crisis_relacionados
(
    id_atencion_crisis_relacionada NUMERIC NOT NULL DEFAULT nextval('seq_sat_atencion_crisis_relacionados_id_atencion_crisis_relacionada'),
    id_padre numeric NOT NULL,
    id_hijo numeric NOT NULL,
    fecha_ing_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_mod_reg TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cod_usu_ing NUMERIC NOT NULL,
    cod_usu_mod NUMERIC NOT NULL,
    estado NUMERIC(2) NOT NULL DEFAULT 1,
    CONSTRAINT sat_atencion_crisis_relacionados_pkey PRIMARY KEY (id_padre, id_hijo)
);

CREATE TABLE variable
(
    id_variable numeric NOT NULL,
    oldidcasotemp numeric,
    sigiidpersonatemp numeric(10,0),
    CONSTRAINT variable_pkey PRIMARY KEY (id_variable)
);

CREATE SEQUENCE seq_sat_atencion_crisis_envio_SIGI;
CREATE TABLE sat_atencion_crisis_envio_SIGI (
	id_atencion_crisis_sigi NUMERIC NOT NULL DEFAULT nextval('seq_sat_atencion_crisis_envio_SIGI'),
	id_temp_atencion_crisis NUMERIC,
	CONSTRAINT sat_atencion_crisis_envio_SIGI_pkey PRIMARY KEY (id_atencion_crisis_sigi)
);
