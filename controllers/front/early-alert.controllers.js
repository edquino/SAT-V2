const db = require('@config/db');
const log = require('@lib/catch-error');
const dateFormat = require('dateformat');
const sendemail = require('@lib/emails');

let earlyAlertsList = async (req, res) => {

  try {

    let cod_usu_ing  = req.user.id_usuario;
    let rol_user = req.user.role;
    let earlyAlerts;

    if(rol_user == 1){

      earlyAlerts = await db.query(`SELECT a.id_alerta_temprana, ta.nombre_alerta, sc.nombre_sit_conflictiva, c.nombre_criterio  
      FROM sat_alerta_temprana AS a 
	    LEFT JOIN sat_tipo_alerta AS ta ON ta.id_tipo_alerta = a.id_tipo_alerta
	    INNER JOIN sat_criterio AS c ON c.id_criterio = a.id_criterio
	    INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = a.id_situacion_conflictiva
      ORDER BY a.id_alerta_temprana DESC`);
      earlyAlerts = earlyAlerts.rows;
      
      //Perfil Tecnico
    }else if(rol_user == 2){

      earlyAlerts = await db.query(`SELECT a.id_alerta_temprana, a.alerta_relacionada, a.enviada_analizar, 
      a.alerta_padre, ta.nombre_alerta, sc.nombre_sit_conflictiva, c.nombre_criterio  
      FROM sat_alerta_temprana AS a 
	    LEFT JOIN sat_tipo_alerta AS ta ON ta.id_tipo_alerta = a.id_tipo_alerta
	    INNER JOIN sat_criterio AS c ON c.id_criterio = a.id_criterio
	    INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = a.id_situacion_conflictiva
      WHERE a.cod_usu_ing = $1 AND a.alerta_relacionada = false 
	    ORDER BY a.id_alerta_temprana DESC`, [cod_usu_ing]);
      earlyAlerts = earlyAlerts.rows;

      //Perfil Supervisor
    }else if(rol_user == 3){

      earlyAlerts = await db.query(`SELECT a.id_alerta_temprana, a.alerta_relacionada, a.enviada_analizar, 
      a.alerta_padre, ta.nombre_alerta, sc.nombre_sit_conflictiva, c.nombre_criterio  
      FROM sat_alerta_temprana AS a 
	    LEFT JOIN sat_tipo_alerta AS ta ON ta.id_tipo_alerta = a.id_tipo_alerta
	    INNER JOIN sat_criterio AS c ON c.id_criterio = a.id_criterio
	    INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = a.id_situacion_conflictiva
      WHERE a.alerta_relacionada = false
      ORDER BY a.id_alerta_temprana DESC`);
      earlyAlerts = earlyAlerts.rows;

      //Perfil Analista 
    }else if(rol_user == 4){
      earlyAlerts = await db.query(`SELECT a.id_alerta_temprana, a.alerta_relacionada, a.enviada_analizar, 
      a.alerta_padre, ta.nombre_alerta, sc.nombre_sit_conflictiva, c.nombre_criterio  
      FROM sat_alerta_temprana AS a 
	    LEFT JOIN sat_tipo_alerta AS ta ON ta.id_tipo_alerta = a.id_tipo_alerta
	    INNER JOIN sat_criterio AS c ON c.id_criterio = a.id_criterio
	    INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = a.id_situacion_conflictiva
	    WHERE a.enviada_analizar = true AND a.alerta_relacionada = false
	    ORDER BY a.id_alerta_temprana DESC`);
      earlyAlerts = earlyAlerts.rows;
    }

    return res.render('early-alerts/early-alert-list', { earlyAlerts });

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'earlyAlertsList', error, false, req, res);
  }
};

let viewCreateAlert = async (req, res) => {

  try {

    var sourceType = await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente, nombre_fuente FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario, nombre_escenario FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    var typeZone = await db.query('SELECT id_zona, nombre_zona FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var country = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE est_reg = 'A'`);
    country = country.rows;

    var ESAcountry = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE id_pais = 62`);
    ESAcountry = ESAcountry.rows[0];

    var municipality = await db.query(`SELECT id_municipio, descripcion, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var state = await db.query(`SELECT id_departamento, descripcion FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable, descripcion FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto, nombre_conflicto FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var aggresionType = await db.query(`SELECT id_tipo_agresion, nombre_agresion FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
    aggresionType = aggresionType.rows;

    var law = await db.query(`SELECT id_cat_derecho, descripcion FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad, nombre_temporalidad FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var subTopics = await db.query(`SELECT id_subtema, nombre_subtema, id_tema::integer AS to_compare
    FROM sat_subtemas 
    WHERE estado = 1 ORDER BY id_subtema ASC`);
    subTopics = subTopics.rows;


    var conflictSituations = await db.query(`SELECT id_situacion_conflictiva::integer AS answer_id, nombre_sit_conflictiva AS answer, id_subtema AS to_compare
    FROM sat_situacion_conflictiva 
    WHERE estado = 1 ORDER BY id_situacion_conflictiva ASC`);
    conflictSituations = conflictSituations.rows;

    var criteria = await db.query(`SELECT id_criterio::integer AS answer_id, nombre_criterio AS answer, id_sit_conflictiva AS to_compare
    FROM sat_criterio 
    WHERE estado = 1 ORDER BY id_criterio ASC`);
    criteria = criteria.rows;

    var profileActors = await db.query(`SELECT id_perfil_actor, nombre_actor FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho, nombre_hecho FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;

    return res.render('early-alerts/early-alert-create', { temporality, sourceType, law, topics, scenario, typeZone, state, ESAcountry, country, profileActors, vulnerableGroup, actionsFact, conflictSituation, aggresionType });

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'getEarlyAlertForm', error, false, req, res);
  }


};

let createAlert = async (req, res) => {
  const {
    id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
    fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
    fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
    pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
    nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
    contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
    contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
    fecha_hechos, fecha_futura_hechos, fecha_reporte, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
    descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
    id_criterio, id_temporalidad, cantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
    id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos, poblacion_ninas, adolecentes_mujeres, adolecentes_hombres,
    poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho,
    proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
    id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
    presencia_fuerza_publica, intervencion_fuerza_publica } = req.body;


  //imagen - prensa
  var fotoPrensa;
  var rutaFotoPrensa = '';

  if (fotografia_prensa != 0) {
    if (req.files[0] != undefined || req.files[0] === "") {
      fotoPrensa = req.files[0].filename;
      rutaFotoPrensa = '/uploads/' + fotoPrensa;
    }
  }

  //imagen - pantalla red social
  var fotoRedSocial;
  var rutaFotoRedSocial='';

  if (pantalla_red_social != 0) {
    if (req.files[0] != undefined || req.files[0] === "") {
      fotoRedSocial = req.files[0].filename;
      rutaFotoRedSocial = '/uploads/' + fotoRedSocial;
    }
  }

  //imagen - fotografia mensajeria
  var fotoMensajeria;
  var rutafotoMensajeria='';

  if (fotografia_mensajeria != 0) {
    if (req.files[0] != undefined || req.files[0] === "") {
      fotoMensajeria = req.files[0].filename;
      rutafotoMensajeria = '/uploads/' + fotoMensajeria;
    }
  }

  // Convert value to int Poblacion Ninos
  let valuePoblacionNino = poblacion_ninos;
  let convertPoblacionNino;

  if (valuePoblacionNino === "") {
    convertPoblacionNino = 0
  } else {
    convertPoblacionNino = parseInt(valuePoblacionNino);
  }

  // Convert value to int Poblacion Ninas
  let valuePoblacionNinas = poblacion_ninas;
  let convertPoblacionNinas;

  if (valuePoblacionNinas === "") {
    convertPoblacionNinas = 0
  } else {
    convertPoblacionNinas = parseInt(valuePoblacionNinas);
  }

  // Convert value to int Adolescentes Mujeres
  let valueAdolecentesMujeres = adolecentes_mujeres;
  let convertAdolecentesMujeres;

  if (valueAdolecentesMujeres === "") {
    convertAdolecentesMujeres = 0;
  } else {
    convertAdolecentesMujeres = parseInt(valueAdolecentesMujeres);
  }

  // Convert value to int Adolescentes Hombres
  let valueAdolecentesHombres = adolecentes_hombres;
  let convertAdolecentesHombres;

  if (valueAdolecentesHombres === "") {
    convertAdolecentesHombres = 0;
  } else {
    convertAdolecentesHombres = parseInt(valueAdolecentesHombres);
  }

  // Convert value to Poblacion Hombres
  let valuePoblacionHombres = poblacion_hombres;
  let convertPoblacionHombres;

  if (valuePoblacionHombres === "") {
    convertPoblacionHombres = 0;
  } else {
    convertPoblacionHombres = parseInt(valuePoblacionHombres);
  }

  //Convert value to Poblacion Mujeres
  let valuePoblacionMujeres = poblacion_mujeres;
  let convertPoblacionMujeres;

  if (valuePoblacionMujeres === "") {
    convertPoblacionMujeres = 0;
  } else {
    convertPoblacionMujeres = parseInt(valuePoblacionMujeres);
  }


  //Convert value to Poblacion Hombre Mayor
  let valuePoblacionHombreMayor = poblacion_hombre_mayor;
  let convertPoblacionHombreMayor;

  if (valuePoblacionHombreMayor === "") {
    convertPoblacionHombreMayor = 0;
  } else {
    convertPoblacionHombreMayor = parseInt(valuePoblacionHombreMayor);
  }

  //Convert value to Poblacion Mujer Mayor
  let valuePoblacionMujerMayor = poblacion_mujer_mayor;
  let convertPoblacionMujerMayor;

  if (valuePoblacionMujerMayor === "") {
    convertPoblacionMujerMayor = 0;
  } else {
    convertPoblacionMujerMayor = parseInt(valuePoblacionMujerMayor);
  }

  //Convert value to cantidad aproximada
  let valueCantidadAproximada = cantidad_aproximada;
  let convertCantidadAproximada;

  if (valueCantidadAproximada === "") {
    convertCantidadAproximada = 0;
  } else {
    convertCantidadAproximada = parseInt(valueCantidadAproximada);
  }

  var cantidad_poblacion_afectada = convertPoblacionNino + convertPoblacionNinas + convertAdolecentesMujeres + convertAdolecentesHombres + convertPoblacionHombres + convertPoblacionMujeres + convertPoblacionHombreMayor + convertPoblacionMujerMayor + convertCantidadAproximada;
  var cod_usu = req.user.id_usuario;

  let valueCantidad = cantidad;
  let newValueCantidad;

  if (valueCantidad === "") {
    newValueCantidad = 0;
  } else {
    newValueCantidad = parseInt(valueCantidad);
  }

  //Convert Dates
  let today = new Date();

  //Covert Fecha Publicacion Prensa
  let datePublicacion = fecha_publicacion_prensa;
  let convertDatepublicacion;

  if (datePublicacion == undefined || datePublicacion === "") {
    convertDatepublicacion = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDatepublicacion = datePublicacion;
  }

  //Covert Fecha Red Socialºººººº
  let dateRedSocial = fecha_pub_red_social;
  let convertDateRedSocial;

  if (dateRedSocial == undefined || dateRedSocial === "") {
    convertDateRedSocial = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDateRedSocial = dateRedSocial;
  }

  //Covert Date Emision Radio 
  let dateEmisionRadio = fecha_emision_radio;
  let convertDateEmisionRadio;

  if (dateEmisionRadio == undefined || dateEmisionRadio === "") {
    convertDateEmisionRadio = dateFormat(today, 'yyyy-mm-dd HH:MM:ss');
  } else {
    convertDateEmisionRadio = dateFormat(dateEmisionRadio, 'yyyy-mm-dd HH:MM:ss');
  }

  //Covert Date Fecha Hechos
  let dateHechos = fecha_hechos;
  let convertDateHechos;
  convertDateHechos = dateFormat(dateHechos, 'yyyy-mm-dd HH:MM:ss');

  //Change value fecha_futura_hechos
  let validateFechaHechos = fecha_futura_hechos;
  let valueFechaHechos;

  if (validateFechaHechos == undefined) {
    valueFechaHechos = false;
  } else {
    valueFechaHechos = validateFechaHechos;
  }

  //Covert Date Reporte
  let dateReporte = fecha_reporte;
  let convertDateReporte;

  if (dateReporte == undefined || dateReporte === "") {
    convertDateReporte = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDateReporte = dateReporte;
  }

  //Asignate valor a Proteccion Vigente 
  let validateProteccionVigente = proteccion_vigente;
  let valueProteccionVigente;

  if (validateProteccionVigente == undefined) {
    valueProteccionVigente = false;
  } else {
    valueProteccionVigente = validateProteccionVigente;
  }

  //Asignate Value Hubo Agression 
  let validateHuboAgreion = hubo_agresion;
  let valueHuboAgresion;

  if (validateHuboAgreion == undefined) {
    valueHuboAgresion = false;
  } else {
    valueHuboAgresion = validateHuboAgreion;
  }

  //Asignate Dialogo Conflicto
  let validateDialogoConflicto = dialogo_conflicto;
  let valueDialogoConflicto;

  if (validateDialogoConflicto == undefined) {
    valueDialogoConflicto = false;
  } else {
    valueDialogoConflicto = validateDialogoConflicto;
  }

  //Asignate Medida Conflicto
  let validateMedidaConflicto = medida_conflicto;
  let valueMedidaConflicto;

  if (validateMedidaConflicto == undefined) {
    valueMedidaConflicto = false;
  } else {
    valueMedidaConflicto = validateMedidaConflicto;
  }

  //Asignate Dialogo Roto Conflicto 
  let validateDialogoRoto = dialogo_roto_conflicto;
  let valueDialogoRoto;

  if (validateDialogoRoto == undefined) {
    valueDialogoRoto = false;
  } else {
    valueDialogoRoto = validateDialogoRoto;
  }

  //Asignate Crisis Conflicto
  let validateCrisisConflicto = crisis_conflicto;
  let valueCrisisConflicto;

  if (validateCrisisConflicto == undefined) {
    valueCrisisConflicto = false;
  } else {
    valueCrisisConflicto = validateCrisisConflicto;
  }

  //Asignate Resolucion Conflicto
  let validateResolucionConflicto = resolucion_conflicto;
  let valueResolucionConflicto;

  if (validateResolucionConflicto == undefined) {
    valueResolucionConflicto = false;
  } else {
    valueResolucionConflicto = validateResolucionConflicto;
  }

  //Asignate Cantidad Persona Involucrada
  let validatePersonaInvolucrada = cant_persona_involucrada;
  let valuePersonaInvolucrada;

  if (validatePersonaInvolucrada == undefined) {
    valuePersonaInvolucrada = false;
  } else {
    valuePersonaInvolucrada = validatePersonaInvolucrada;
  }

  // Asignate value Presencia Publica
  let validateFuerzaPublica = presencia_fuerza_publica;
  let valueFuerzaPublica;

  if (validateFuerzaPublica == undefined) {
    valueFuerzaPublica = false;
  } else {
    valueFuerzaPublica = validateFuerzaPublica;
  }

  // Asignate value intervencion publica
  let validateIntervencionPublica = intervencion_fuerza_publica;
  let valueIntervencionPublica;

  if (validateIntervencionPublica == undefined) {
    valueIntervencionPublica = false;
  } else {
    valueIntervencionPublica = valueFuerzaPublica;
  }


  try {
    var pais = await db.query(`SELECT id_pais FROM public.admi_pais WHERE codigo = 'SV'`);
    pais = pais.rows[0].id_pais;

    await db.query(`INSERT INTO sat_alerta_temprana(
      id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
    fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
    fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
    pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
    nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
    contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
    contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
    fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
    descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva, 
    id_criterio, id_temporalidad, cantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte, 
    id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos,poblacion_ninas, adolecentes_mujeres, adolecentes_hombres, 
    poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor,poblacion_mujer_mayor, cantidad_aproximada,cantidad_poblacion_afectada, id_acciones_hecho, 
    proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
    id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
    presencia_fuerza_publica, intervencion_fuerza_publica, cod_usu_ing )
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 
                    $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, 
                    $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, 
                    $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84,
                    $85, $86) RETURNING *`,
      [id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
        convertDatepublicacion, rutaFotoPrensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
        convertDateEmisionRadio, titulo_redes, nombre_red_social, url_red_social, convertDateRedSocial,
        rutaFotoRedSocial, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
        nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
        contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
        contacto_mensajeria, datos_mensajeria, rutafotoMensajeria, otras_detalle, otras_adicionales,
        convertDateHechos, valueFechaHechos, convertDateReporte, pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
        descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
        id_criterio, id_temporalidad, newValueCantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
        id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, convertPoblacionNino, convertPoblacionNinas, convertAdolecentesMujeres, convertAdolecentesHombres,
        convertPoblacionHombres, convertPoblacionMujeres, convertPoblacionHombreMayor, convertPoblacionMujerMayor, convertCantidadAproximada, cantidad_poblacion_afectada, id_acciones_hecho,
        valueProteccionVigente, valueHuboAgresion, id_tipo_agresion, valueDialogoConflicto, valueMedidaConflicto, valueDialogoRoto, valueCrisisConflicto,
        id_acciones_hecho_anterior, valueResolucionConflicto, id_situacion_conflicto, valuePersonaInvolucrada,
        valueFuerzaPublica, valueIntervencionPublica, cod_usu], async (err, results) => {
          //
          if (err) {
            log('src/controllers/front', 'early-alert', 'createAlert', err, false, req, res);
          } else {

            var earlyAlerts = results.rows[0];

            var clasificada = false;

            //Obtener Alerta temprana latente
            let lantenteEarlyAlert = await db.query(`SELECT id_alerta_temprana 
            from sat_alerta_temprana where (id_criterio = 1 or id_criterio =55  or (id_criterio =56 and cantidad_poblacion_afectada<15)  or id_criterio =61 or id_criterio =64 or id_criterio =40 or id_criterio =35 or id_criterio =3  or id_criterio =3 or (id_criterio =5 and id_temporalidad='1' and cantidad<13) or id_criterio =6 or id_criterio =7  or id_criterio =7 or id_criterio =17  or id_criterio =12 or id_criterio =14 or id_criterio =9  or id_criterio =36  or id_criterio =67  or id_criterio =75  or id_criterio =76  or id_criterio =49 or id_criterio =52 or id_criterio =21 or id_criterio =30 or id_criterio =71 or (id_criterio =74 and cantidad_poblacion_afectada<76) or id_criterio =26 or id_criterio =45) and id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
            lantenteEarlyAlert = lantenteEarlyAlert.rows[0];


            //Obtener alerta temprana escalada 
            let escaladaEarlyAlert;

            if (lantenteEarlyAlert == undefined) {
              escaladaEarlyAlert = await db.query(`SELECT id_alerta_temprana 
              from sat_alerta_temprana where ((id_criterio =56 and cantidad_poblacion_afectada>15) or id_criterio =57 or id_criterio =62 or id_criterio =65 or (id_criterio =44 and proteccion_vigente='false') or (id_criterio =35 and presencia_fuerza_publica='true') or (id_criterio =5 and id_temporalidad='1' and cantidad>12 and cantidad<20) or (id_criterio =4 and id_temporalidad='2') or (id_criterio =34 and presencia_fuerza_publica='true')  or (id_criterio =18 and presencia_fuerza_publica='true' and dialogo_roto_conflicto='true') or (id_criterio =20 and presencia_fuerza_publica='true' and dialogo_roto_conflicto='true') or (id_criterio =13 and presencia_fuerza_publica='true') or (id_criterio =16 and presencia_fuerza_publica='true') or (id_criterio =37 and presencia_fuerza_publica='true') or id_criterio =11  or id_criterio =68  or (id_criterio =76 and cantidad_poblacion_afectada<16)  or id_criterio =78 or id_criterio =50 or (id_criterio =51 and presencia_fuerza_publica='true') or id_criterio =53 or (id_criterio =54 and presencia_fuerza_publica='true') or id_criterio =22 or id_criterio =23 or (id_criterio =25 and presencia_fuerza_publica='true') or (id_criterio =31 and cantidad_poblacion_afectada>10 and cantidad_poblacion_afectada<15) or id_criterio =72 or (id_criterio =74 and  cantidad_poblacion_afectada>75 and cantidad_poblacion_afectada<161) or id_criterio =46) and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
              escaladaEarlyAlert = escaladaEarlyAlert.rows[0];
            }


            //Obtenet alerta vigente

            let vigenteAlert;
            if (lantenteEarlyAlert == undefined && escaladaEarlyAlert == undefined) {
              vigenteAlert = await db.query(`SELECT id_alerta_temprana 
              from sat_alerta_temprana where (id_criterio=63  or (id_criterio =66 and cantidad_poblacion_afectada>50) or (id_criterio =35 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true') or (id_criterio =5 and id_temporalidad='1' and cantidad>20) or (id_criterio =4 and id_temporalidad='2' and cantidad=2)  or (id_criterio =34 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true') or (id_criterio =18 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true')  or (id_criterio =20 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true') or (id_criterio =16 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true')   or (id_criterio =37 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true')  or (id_criterio =76 and cantidad_poblacion_afectada>16)  or (id_criterio =51 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true') or id_criterio =78 or (id_criterio =54 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true')  or (id_criterio =25 and intervencion_fuerza_publica='true' and hubo_agresion='true' and presencia_fuerza_publica='true') or id_criterio =33 or (id_criterio =74 and cantidad_poblacion_afectada>160)) and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
              vigenteAlert = vigenteAlert.rows[0];
            }


            //Obtener alerta continua, 
            let continuaAlert;

            if (lantenteEarlyAlert == undefined && escaladaEarlyAlert == undefined && vigenteAlert == undefined) {
              continuaAlert = await db.query(`SELECT id_alerta_temprana from public.sat_alerta_temprana where ((id_criterio = 35 and cant_persona_involucrada='true') or (id_criterio = 34 and cant_persona_involucrada='true') or (id_criterio = 18 and cant_persona_involucrada='true' and presencia_fuerza_publica='true' and crisis_conflicto='true')  or (id_criterio = 13 and cant_persona_involucrada='true')  or (id_criterio = 16 and cant_persona_involucrada='true' and presencia_fuerza_publica='true') or (id_criterio = 37 and cant_persona_involucrada='true' and presencia_fuerza_publica='true') or (id_criterio =76 and cantidad_poblacion_afectada<17) or (id_criterio = 51 and cant_persona_involucrada='true' and presencia_fuerza_publica='true')  or (id_criterio = 54 and cant_persona_involucrada='true' and presencia_fuerza_publica='true') or (id_criterio = 76 and cantidad_poblacion_afectada<161)) and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
              continuaAlert = continuaAlert.rows[0];
            }


            //Clasificar alerta temprana latente
            if (lantenteEarlyAlert != undefined) {
              db.query(`UPDATE public.sat_alerta_temprana SET id_fase_conflicto='1', id_tipo_alerta='1' WHERE id_alerta_temprana=$1`, [lantenteEarlyAlert.id_alerta_temprana]);
              clasificada = true;
            }

            //Clasificar alerta temprana escalada
            if (escaladaEarlyAlert != undefined && !clasificada) {
              db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='2', id_tipo_alerta='1' WHERE id_alerta_temprana=$1`, [escaladaEarlyAlert.id_alerta_temprana])
              clasificada = true;

            } else {
              if (!clasificada) {
                let escaladaVerificationSecond = await db.query(`SELECT id_alerta_temprana from public.sat_alerta_temprana where id_acciones_hecho_anterior<>null and id_acciones_hecho_anterior<>'1' and hubo_agresion='false' and cant_persona_involucrada='false' and presencia_fuerza_publica='true' and intervencion_fuerza_publica='false' and dialogo_roto_conflicto='true' and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
                escaladaVerificationSecond = escaladaVerificationSecond.rows[0];

                if (escaladaVerificationSecond != undefined) {
                  db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='2', id_tipo_alerta='1' WHERE id_alerta_temprana=$1`, [escaladaVerificationSecond.id_alerta_temprana]);
                  clasificada = true;

                }
              }
            }

            //Clasificar alerta vigente
            if (vigenteAlert != undefined && !clasificada) {
              db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='3', id_tipo_alerta='2' WHERE id_alerta_temprana=$1`, [vigenteAlert.id_alerta_temprana]);
              clasificada = true;

            } else {

              if (!clasificada) {
                let vigenteVerificationSecond = await db.query(`SELECT id_alerta_temprana from public.sat_alerta_temprana where id_acciones_hecho_anterior<>null and id_acciones_hecho_anterior<>'1' and hubo_agresion='true' and presencia_fuerza_publica='true' and intervencion_fuerza_publica='true' and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
                vigenteVerificationSecond = vigenteVerificationSecond.rows[0];

                if (vigenteVerificationSecond != undefined) {
                  db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='3', id_tipo_alerta='2' WHERE id_alerta_temprana=$1`, [vigenteVerificationSecond.id_alerta_temprana]);
                  clasificada = true;

                }
              }

            }

            //Clasificar alerta continua
            if (continuaAlert != undefined && !clasificada) {
              db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='4', id_tipo_alerta='3' WHERE id_alerta_temprana=$1`, [continuaAlert.id_alerta_temprana]);
              clasificada = true;

            } else {
              if (!clasificada) {
                let continuaVerificationSecond = await db.query(`SELECT id_alerta_temprana from public.sat_alerta_temprana where id_acciones_hecho_anterior<>null and id_acciones_hecho_anterior<>'1' and hubo_agresion='false' and presencia_fuerza_publica='false' and intervencion_fuerza_publica='false' and cant_persona_involucrada='true' and (id_situacion_conflicto=2 or id_situacion_conflicto=3 or id_situacion_conflicto=4) and  id_alerta_temprana=$1`, [earlyAlerts.id_alerta_temprana]);
                continuaVerificationSecond = continuaVerificationSecond.rows[0];

                if (continuaVerificationSecond != undefined) {
                  db.query(`UPDATE sat_alerta_temprana SET id_fase_conflicto='4', id_tipo_alerta='3' WHERE id_alerta_temprana=$1`, [continuaVerificationSecond.id_alerta_temprana]);
                  clasificada = true;

                }
              }

            }


            insertStats(id_departamento, id_municipio, fecha_hechos, id_criterio, intervencion_fuerza_publica, proteccion_vigente, id_temporalidad, cantidad, cantidad_poblacion_afectada, hubo_agresion, presencia_fuerza_publica, crisis_conflicto, valueFechaHechos, cant_persona_involucrada, dialogo_roto_conflicto);

            req.flash('success', 'Alerta creada correctamente');
            return res.redirect('/api-sat/early-alert/list')

          }
        });
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'createAlert', error, false, req, res);
  }
};

let insertStats = async (id_departamento, id_municipio, fecha_hecho, id_criterio, intervencion_fuerza_publica, proteccion_vigente, id_temporalidad, cantidad, cantidad_poblacion_afectada, hubo_agresion, presencia_fuerza_publica, crisis_conflicto, valueFechaHechos, cant_persona_involucrada, dialogo_roto_conflicto) => {

  var localDate = new Date();
  var fecha_ingreso = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

  if (id_criterio == 55) {
    await db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
      VALUES (1, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 56 || id_criterio == 57) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (1, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 61) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (2, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 62 && intervencion_fuerza_publica == false) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (2, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 62 && intervencion_fuerza_publica == true || id_criterio == 63 && intervencion_fuerza_publica == true) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (2, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }
  else if (id_criterio == 44 && proteccion_vigente == true) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (4, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 7 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 6 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 35 && id_temporalidad == 21 && cantidad < 24) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }
  else if (id_criterio == 34 && hubo_agresion == false && presencia_fuerza_publica == false && (crisis_conflicto == false || valueFechaHechos == true) || id_criterio == 34 && hubo_agresion == false && (presencia_fuerza_publica == true && intervencion_fuerza_publica == false) && (crisis_conflicto == false || valueFechaHechos == true) || id_criterio == 35 && id_temporalidad == 2 && cantidad < 4 || id_criterio == 4 && id_temporalidad == 3 && cantidad < 2) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 34 && hubo_agresion == true && presencia_fuerza_publica == true && intervencion_fuerza_publica == true && id_temporalidad == 2 && cantidad < 31 || id_criterio == 35 && id_temporalidad == 2 && cantidad > 4 || id_criterio == 4 && id_temporalidad == 3 && cantidad > 1) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 34 && cant_persona_involucrada == true) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 17 && id_temporalidad == 2 && cantidad > 90) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 18 && hubo_agresion == false && presencia_fuerza_publica == false && (crisis_conflicto == false && dialogo_roto_conflicto == true) || id_criterio == 18 && hubo_agresion == false && (presencia_fuerza_publica == true && intervencion_fuerza_publica == false) && (crisis_conflicto == false && dialogo_roto_conflicto == true)) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 18 && hubo_agresion == true && presencia_fuerza_publica == true && intervencion_fuerza_publica == true || id_criterio == 20 && hubo_agresion == true && presencia_fuerza_publica == true && intervencion_fuerza_publica == true) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if ((id_criterio == 18 || id_criterio == 20) && hubo_agresion == false && crisis_conflicto == true && intervencion_fuerza_publica == false) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 14 && id_temporalidad == 2 && cantidad < 60) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 15 && id_temporalidad == 2 && cantidad < 30) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 16 && valueFechaHechos == true && (hubo_agresion == false && (intervencion_fuerza_publica == false && id_temporalidad == 2 && cantidad < 8))) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 16 && valueFechaHechos == false && hubo_agresion == true && presencia_fuerza_publica == true && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 16 && valueFechaHechos == false && hubo_agresion == false && intervencion_fuerza_publica == false && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 36) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 11 && id_temporalidad == 2 && cantidad < 31) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
    //*****
  } else if (id_criterio == 37 && hubo_agresion == false && intervencion_fuerza_publica == false && crisis_conflicto == false && dialogo_roto_conflicto == true && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 37 && hubo_agresion == true && presencia_fuerza_publica == true && intervencion_fuerza_publica == true && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 37 && hubo_agresion == false && intervencion_fuerza_publica == false && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 68 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 76 && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 76 && cantidad_poblacion_afectada > 1 && cantidad_poblacion_afectada < 16 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 78 && cantidad < 8 && cantidad_poblacion_afectada < 2) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 76 && id_temporalidad == 2 && cantidad > 15 || id_criterio == 78 && cantidad < 8 && cantidad_poblacion_afectada > 2) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 22 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 21 && id_temporalidad == 2 && cantidad < 30) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (17, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 25 && hubo_agresion == false && intervencion_fuerza_publica == false && crisis_conflicto == false) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (17, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 46 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 47 && id_temporalidad == 2 && cantidad < 16) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (19, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }

}

let viewUpdateAlert = async (req, res) => {
  const { id_alerta_temprana } = req.params;

  try {

  let getAlert = await db.query(`SELECT st.*, to_char(st.fecha_hechos::timestamp , 'YYYY-MM-DD HH:MM:SS') as nueva_fecha_fechos, to_char(st.fecha_publicacion_prensa::date , 'yyyy-mm-dd') as nueva_fecha_prensa, to_char(st.fecha_reporte::date , 'YYYY-MM-DD') as nueva_fecha_reporte, to_char(st.fecha_pub_red_social::date , 'YYYY-MM-DD') as nueva_fecha_red_social, to_char(st.fecha_emision_radio::timestamp , 'YYYY-MM-DD HH:MM:SS') as nueva_fecha_radio, tf.nombre_tipo_fuente, f.nombre_fuente, p.descripcion, ad.descripcion AS departamento, m.descripcion as municipio,
  z.nombre_zona, s.nombre_escenario, d.descripcion AS derecho, tm.nombre_tema, sb.nombre_subtema,
  sc.nombre_sit_conflictiva, c.nombre_criterio, h.nombre_hecho, ha.nombre_hecho as hecho_anterior, stc.nombre_conflicto
  FROM sat_alerta_temprana AS st
  INNER JOIN sat_tipo_fuente AS tf ON tf.id_tipo_fuente = st.id_tipo_fuente
  INNER JOIN sat_fuente AS f ON f.id_fuente = st.id_fuente 
  INNER JOIN admi_pais AS p ON p.id_pais = st.id_pais
  INNER JOIN admi_departamento AS ad ON ad.id_departamento = st.id_departamento
  INNER JOIN admi_municipio AS m ON m.id_municipio = st.id_municipio
  INNER JOIN sat_zonas AS z ON z.id_zona = st.id_tipo_zona
  INNER JOIN sat_escenarios AS s ON s.id_escenario = st.id_escenarios
  INNER JOIN admi_cat_derecho AS d ON d.id_cat_derecho = st.id_derecho
  INNER JOIN sat_temas AS tm ON tm.id_tema = st.id_tematica_relacionada 
  INNER JOIN sat_subtemas AS sb ON sb.id_subtema = st.id_sub_tematica
  INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = st.id_situacion_conflictiva 
  INNER JOIN sat_criterio AS c ON c.id_criterio = st.id_criterio
  INNER JOIN sat_acciones_hecho AS h ON h.id_acciones_hecho = st.id_acciones_hecho
  INNER JOIN sat_acciones_hecho AS ha ON ha.id_acciones_hecho = st.id_acciones_hecho_anterior
  INNER JOIN sat_situacion_actual_conflicto AS stc ON stc.id_situacion_conflicto = st.id_situacion_conflicto
  WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    getAlert = getAlert.rows[0];

    var sourceType = await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente, nombre_fuente FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario, nombre_escenario FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    var typeZone = await db.query('SELECT id_zona, nombre_zona FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var country = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE est_reg = 'A'`);
    country = country.rows;

    var ESAcountry = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE id_pais = 62`);
    ESAcountry = ESAcountry.rows[0];

    var municipality = await db.query(`SELECT id_municipio, descripcion, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var state = await db.query(`SELECT id_departamento, descripcion FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable, descripcion FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto, nombre_conflicto FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var law = await db.query(`SELECT id_cat_derecho, descripcion FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad, nombre_temporalidad FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var profileActors = await db.query(`SELECT id_perfil_actor, nombre_actor FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho, nombre_hecho FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;

    //--------------------------------------------------------------
    //-------------------Perfil actores

    //Obtenemos los perfiles de los actores seleccionados en la Alerta
    let alertPerfilActor = await db.query(`SELECT json_agg((pa.id_perfil_actor)) as perfiles_alerta
    FROM sat_alerta_temprana AS st
    INNER JOIN sat_perfil_actores AS pa ON pa.id_perfil_actor = ANY(st.id_perfil_actor)  
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertPerfilActor = alertPerfilActor.rows[0];

    let listPerfiles = []; //Arreglo para los perfiles seleccionados en la alerta y los que no. 

    for (let i = 0; i < alertPerfilActor.perfiles_alerta.length; i++) {
      let perfilActorsSelect = await db.query(`SELECT id_perfil_actor::integer as perfil_actor, nombre_actor 
      FROM sat_perfil_actores
      WHERE id_perfil_actor = $1` , [alertPerfilActor.perfiles_alerta[i]]);
      perfilActorsSelect = perfilActorsSelect.rows[0];
      perfilActorsSelect.checked = 'checked';

      listPerfiles.push(perfilActorsSelect);

    }

    //Obtiene la lista de todos los perfiles de actores
    let listPerfilActors = await db.query(`SELECT id_perfil_actor::integer as id_perfil_actor FROM sat_perfil_actores`);
    listPerfilActors = listPerfilActors.rows;

    let listIdsPerfiles = []; //Almacena los ids de los perfiles.

    for (let i = 0; i < listPerfilActors.length; i++) {
      listIdsPerfiles.push(listPerfilActors[i].id_perfil_actor); //Agregando el id de cada grupo de vulnerabilidad no seleccionado, en el arreglo "listIdsGruposVulnerables".    
    }

    //Se recorren ambas listas y se almacena en el arreglo "listPerfiles" los perfiles seleccionados en la alerta y los que no. 
    for (let i = 0; i < listIdsPerfiles.length; i++) {
        for (let j = 0; j < alertPerfilActor.perfiles_alerta.length; j++) {
          if (listIdsPerfiles[i] === alertPerfilActor.perfiles_alerta[j]) {
            //console.log(listIdsPerfiles[j], 'j-- ---- --i', alertPerfilActor.perfiles_alerta[i])
            listIdsPerfiles.splice(i, 1);
            i--;
            //break;
          }
        }
    }
    
    for (let i = 0; i < listIdsPerfiles.length; i++) {
      let perfilActorsNotSelect = await db.query(`SELECT id_perfil_actor::integer as perfil_actor, nombre_actor 
      FROM sat_perfil_actores
      WHERE id_perfil_actor = $1` , [listIdsPerfiles[i]]);
      perfilActorsNotSelect = perfilActorsNotSelect.rows[0];
      perfilActorsNotSelect.checked = '';

      listPerfiles.push(perfilActorsNotSelect);
    }

    //--------------------------------------------------------------
    //------------------- Grupos de vulnerabilidad

    //Obtiene la lista de grupos de vulnerabilidad seleccionados en la Alerta
    let alertGruposVulnerabilidad = await db.query(`SELECT json_agg((g.id_grp_vulnerable)) as grp_vulnerabilidad
     FROM sat_alerta_temprana AS st
     INNER JOIN admi_grp_vulnerable AS g ON g.id_grp_vulnerable = ANY(st.id_grupo_vulnerable)  
     WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertGruposVulnerabilidad = alertGruposVulnerabilidad.rows[0];

    let listGrpVulnerabilidad = []; // Alamacena la data de los grupos de vulnerabilidad seleccionados y no seleccionados.

    // Se crea una nueva lista de grupos y se agrega la variable checked a cada grupo para identificar el que fue seleccionado en la Alerta.
    for (let i = 0; i < alertGruposVulnerabilidad.grp_vulnerabilidad.length; i++) {

        var grupoVulneravilidad = await db.query(`SELECT id_grp_vulnerable::integer AS id_grp_vulnerable, descripcion 
        FROM admi_grp_vulnerable
        WHERE id_grp_vulnerable = $1
        ORDER BY id_grp_vulnerable ASC`, [alertGruposVulnerabilidad.grp_vulnerabilidad[i]]);
        grupoVulneravilidad = grupoVulneravilidad.rows[0];
        grupoVulneravilidad.checked = 'checked';

        listGrpVulnerabilidad.push(grupoVulneravilidad);
    }   

    //Obtiene todos los grupos de vulnerabilidad
    let listGruposVulnerabilidad = await db.query(`SELECT id_grp_vulnerable::integer AS id_grp_vulnerable
    FROM admi_grp_vulnerable ORDER BY id_grp_vulnerable ASC`);
    listGruposVulnerabilidad = listGruposVulnerabilidad.rows;

    let listIdsGruposVulnerables = []; //Almacena los ids de los grupos de vulnerabilidad no seleccionados en la Alerta.

    for (let i = 0; i < listGruposVulnerabilidad.length; i++) {
      listIdsGruposVulnerables.push(listGruposVulnerabilidad[i].id_grp_vulnerable); //Agregando el id de cada grupo de vulnerabilidad no seleccionado, en el arreglo "listIdsGruposVulnerables".    
    }

    //Se compara los ids de los grupos seleccionados y no seleccionados. 
    //La lista solo tendra los ids que no fueron seleccionado en la alerta.  
    for (let i = 0; i < listIdsGruposVulnerables.length; i++) {
      for (let j = 0; j < alertGruposVulnerabilidad.grp_vulnerabilidad.length; j++) {
        if (listIdsGruposVulnerables[i] === alertGruposVulnerabilidad.grp_vulnerabilidad[j]) {
          listIdsGruposVulnerables.splice(i, 1);
          i--;
          //break;
        }
      }
    }


    //Obetenemos la data de los grupos de vulnerabilidad no seleccionados en la alerta.
    //Agregamos los datos de los grupos al arreglo "listGrpVulnerabilidad", para identificarlos agregamos la variable chedked

    // Se crea una nueva lista de grupos y se agrega la variable checked a cada grupo para identificar el que fue seleccionado en la Alerta.
    for (let i = 0; i < listIdsGruposVulnerables.length; i++) {

      var grupoVulneravilidadNoSelect = await db.query(`SELECT id_grp_vulnerable::integer AS id_grp_vulnerable, descripcion 
          FROM admi_grp_vulnerable
          WHERE id_grp_vulnerable = $1
          ORDER BY id_grp_vulnerable ASC`, [listIdsGruposVulnerables[i]]);
      grupoVulneravilidadNoSelect = grupoVulneravilidadNoSelect.rows[0];
      grupoVulneravilidadNoSelect.checked = '';

      listGrpVulnerabilidad.push(grupoVulneravilidadNoSelect);
    }

    //--------------------------------------------------------------
    //------------------- Tipos de Agresión

    //Obtiene la lista de tipos_agresion seleccionadas en Alerta
    let alertTiposAgresion = await db.query(`SELECT json_agg((ta.id_tipo_agresion)) as tipo_agresion
    FROM sat_alerta_temprana AS st
    INNER JOIN sat_tipo_agresion AS ta ON ta.id_tipo_agresion = ANY(st.id_tipo_agresion)  
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertTiposAgresion = alertTiposAgresion.rows[0];
    
    //Arreglo que almacena la lista de tipos de agresion seleccionados y no seleccionados.
    var agressionType = [];

    //Obtiene la lista de los tipos_agresion 
    let listaTiposAgresion = await db.query(`SELECT id_tipo_agresion::integer AS id_tipo_agresion
    FROM sat_tipo_agresion 
    WHERE estado = 1 ORDER 
    BY id_tipo_agresion ASC`);
    listaTiposAgresion = listaTiposAgresion.rows;

    let listIdsTiposAgresion = []; //Almacena los ids de los tipos de agresion no seleccionados en la Alerta.

    for (let i = 0; i < listaTiposAgresion.length; i++) {
      listIdsTiposAgresion.push(listaTiposAgresion[i].id_tipo_agresion); //Agregando el id de cada tipo de agresion no seleccionado, en el arreglo "listIdsTiposAgresion".    
    }
    
    if (alertTiposAgresion.tipo_agresion != null) {

      for (let i = 0; i < listIdsTiposAgresion.length; i++) {
        for (let j = 0; j < alertTiposAgresion.tipo_agresion.length; j++) {
          if (listIdsTiposAgresion[i] === alertTiposAgresion.tipo_agresion[j]) {
            listIdsTiposAgresion.splice(i, 1);
            i--;
          }
        }
      }

      //lista de tipos de agression seleccionadas en la alerta
      for (let i = 0; i < alertTiposAgresion.tipo_agresion.length; i++) {
        let listTiposAgresionSelect = await db.query(`SELECT id_tipo_agresion::integer AS id_tipo_agresion, nombre_agresion
        FROM sat_tipo_agresion
        WHERE id_tipo_agresion = $1`, [alertTiposAgresion.tipo_agresion[i]]);
        listTiposAgresionSelect = listTiposAgresionSelect.rows[0];
        listTiposAgresionSelect.checked = 'checked';
        agressionType.push({ id_tipo_agresion: listTiposAgresionSelect.id_tipo_agresion, nombre_agresion: listTiposAgresionSelect.nombre_agresion, checked: listTiposAgresionSelect.checked });
      }

      //lista de tipos de agression no seleccionadas en la alerta
      for (let i = 0; i < listIdsTiposAgresion.length; i++) {
          let listTiposAgresionNotSelect = await db.query(`SELECT id_tipo_agresion::integer AS id_tipo_agresion, nombre_agresion
          FROM sat_tipo_agresion
          WHERE id_tipo_agresion = $1`, [listIdsTiposAgresion[i]]);
          listTiposAgresionNotSelect = listTiposAgresionNotSelect.rows[0];
          listTiposAgresionNotSelect.checked = '';
          agressionType.push({id_tipo_agresion: listTiposAgresionNotSelect.id_tipo_agresion, nombre_agresion: listTiposAgresionNotSelect.nombre_agresion, checked: listTiposAgresionNotSelect.checked});
      }


    } else {

      for (let i = 0; i < listaTiposAgresion.length; i++) {
        let checked = '';
        var getAgressionType = await db.query(`SELECT id_tipo_agresion, nombre_agresion 
        FROM sat_tipo_agresion 
        WHERE id_tipo_agresion = $1 
        ORDER BY id_tipo_agresion ASC`, [listaTiposAgresion[i].id_tipo_agresion]);
        getAgressionType = getAgressionType.rows[0]; 

        agressionType.push({id_tipo_agresion: getAgressionType.id_tipo_agresion, nombre_agresion: getAgressionType.nombre_agresion, checked});
        
      }
    }

    return res.render('early-alerts/early-alert-update', { getAlert, temporality, sourceType, law, topics, scenario, typeZone, state, ESAcountry, country, profileActors, vulnerableGroup, actionsFact, conflictSituation, listPerfiles, listGrpVulnerabilidad, agressionType});


  } catch (error) {
    log('src/controllers/front', 'early-alert', 'viewUpdateAlert', error, false, req, res);
  }

};

let updateAlert = async (req, res) => {

  const { id_alerta_temprana } = req.params;
  const { id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
    fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
    fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
    pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
    nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
    contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
    contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
    fecha_hechos, fecha_futura_hechos, fecha_reporte, id_pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
    descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
    id_criterio, id_temporalidad, cantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
    id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos, poblacion_ninas, adolecentes_mujeres, adolecentes_hombres,
    poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho,
    proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
    id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
    presencia_fuerza_publica, intervencion_fuerza_publica } = req.body;

  var localDate = new Date();
  var fecha_mod_reg = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
  var cod_usu_mod = req.user.id_usuario;

  // console.log('----------------------------------------------------------------------');
  // console.log('id_alerta_temprana---:', id_alerta_temprana);
  // console.log('----------------------------------------------------------------------');
  // console.log('id_tipo_fuente---:', id_tipo_fuente);
  // console.log('id_fuente---:', id_fuente);
  // console.log('titulo_noticia---:', titulo_noticia);
  // console.log('nombre_medio_prensa---:', nombre_medio_prensa);
  // console.log('paginas_prensa---:', paginas_prensa); 
  // console.log('autor_prensa---:', autor_prensa);
  // console.log('fecha_publicacion_prensa---:', fecha_publicacion_prensa);
  console.log('fotografia_prensa---:', fotografia_prensa);
  // console.log('nombre_medio_radio---:', nombre_medio_radio);
  // console.log('canal_radio---:', canal_radio);
  // console.log('nombre_programa_radio---:', nombre_programa_radio);
  // console.log('fecha_emision_radio---:', fecha_emision_radio);
  // console.log('titulo_redes---:', titulo_redes);
  // console.log('nombre_red_social---:', nombre_red_social);
  // console.log('url_red_social---:', url_red_social);
  // console.log('fecha_pub_red_social---:', fecha_pub_red_social);
  console.log('pantalla_red_social---:', pantalla_red_social);
  // console.log('nombre_colectivo---:', nombre_colectivo);
  // console.log('nombre_contacto_colectivo---:', nombre_contacto_colectivo);
  // console.log('telefono_colectivo---:', telefono_colectivo);
  // console.log('nombre_organismo---:', nombre_organismo);
  // console.log('nombre_contacto_organismo---:', nombre_contacto_organismo);
  // console.log('correo_organismo---:', correo_organismo);
  // console.log('telefono_organismo---:', telefono_organismo);
  // console.log('datos_organismo---:', datos_organismo);
  // console.log('nombre_inst_gub---:', nombre_inst_gub);
  // console.log('contacto_inst_gub---:', contacto_inst_gub);
  // console.log('correo_inst_gub---:', correo_inst_gub);
  // console.log('contacto_inst_gub---:', contacto_inst_gub);
  // console.log('telefono_inst_gub---:', telefono_inst_gub);
  // console.log('datos_inst_gub---:', datos_inst_gub);
  // console.log('nombre_mensajeria---:', nombre_mensajeria);
  // console.log('nombre_contacto_mensajeria---:', nombre_contacto_mensajeria);
  // console.log('contacto_mensajeria---:', contacto_mensajeria);
  // console.log('datos_mensajeria---:', datos_mensajeria);
  console.log('fotografia_mensajeria---:', fotografia_mensajeria);
  //    console.log('otras_detalle---:', otras_detalle);
  // console.log('otras_adicionales---:', otras_adicionales);
  // console.log('fecha_hechos---:', fecha_hechos);
  // console.log('fecha_futura_hechos---:', fecha_futura_hechos);
  // console.log('fecha_reporte---:', fecha_reporte);
  // console.log('id_departamento---:', id_departamento);
  // console.log('id_municipio---:', id_municipio);
  // console.log('id_tipo_zona---:', id_tipo_zona);
  // console.log('id_escenarios---:', id_escenarios);

  // console.log('descripcion_hechos---:', descripcion_hechos);
  // console.log('id_derecho---:', id_derecho);
  // console.log('id_tematica_relacionada---:', id_tematica_relacionada);
  // console.log('id_sub_tematica---:', id_sub_tematica);
  // console.log('id_situacion_conflictiva---:', id_situacion_conflictiva);

  // console.log('id_criterio---:', id_criterio);
  // console.log('id_temporalidad---:', id_temporalidad);
  // console.log('cantidad---:', cantidad);
  // console.log('id_escenario---:', id_escenario);
  // console.log('antecedentes_hecho---:', antecedentes_hecho);
  // console.log('poblacion_afectada---:', poblacion_afectada);
  // console.log('contraparte---:', contraparte);

  // console.log('id_perfil_actor---:', id_perfil_actor);
  // console.log('id_grupo_vulnerable---:', id_grupo_vulnerable);
  // console.log('demanda_solicitud---:', demanda_solicitud);
  // console.log('postura_autoridades', postura_autoridades);
  // console.log('poblacion_ninos---:', poblacion_ninos);
  // console.log('poblacion_ninas---:', poblacion_ninas);
  // console.log('adolecentes_mujeres---:', adolecentes_mujeres);
  // console.log('adolecentes_hombres---:', adolecentes_hombres);

  // console.log('poblacion_hombres---:', poblacion_hombres);
  // console.log('poblacion_mujeres---:', poblacion_mujeres);
  // console.log('poblacion_hombre_mayor---:', poblacion_hombre_mayor);
  // console.log('poblacion_mujer_mayor---:', poblacion_mujer_mayor);
  // console.log('cantidad_aproximada---:', cantidad_aproximada);
  // console.log('id_acciones_hecho---:', id_acciones_hecho);

  // console.log('proteccion_vigente---:', proteccion_vigente);
  // console.log('hubo_agresion---:', hubo_agresion);
  // console.log('id_tipo_agresion---:', id_tipo_agresion);
  // console.log('dialogo_conflicto---:', dialogo_conflicto);
  // console.log('medida_conflicto---:', medida_conflicto);
  // console.log('dialogo_roto_conflicto---:', dialogo_roto_conflicto);
  // console.log('crisis_conflicto---:', crisis_conflicto);

  // console.log('id_acciones_hecho_anterior---:', id_acciones_hecho_anterior);
  // console.log('resolucion_conflicto---:', resolucion_conflicto);
  // console.log('id_situacion_conflicto---:', id_situacion_conflicto);
  // console.log('cant_persona_involucrada---:', cant_persona_involucrada);

  // console.log('presencia_fuerza_publica---:', presencia_fuerza_publica);
  // console.log('intervencion_fuerza_publica---:', intervencion_fuerza_publica);
  // console.log('----------------------------------------------------------------------');

    //---------------------------- imagenes

    //imagen - prensa
    var fotoPrensa;
    var rutaFotoPrensa = '';
    
    if (fotografia_prensa === "") {
      if (req.files[0] != undefined) {
        fotoPrensa = req.files[0].filename;
        rutaFotoPrensa = '/uploads/' + fotoPrensa;
      }
    } else {

      if (req.files[0] != undefined) {
        fotoPrensa = req.files[0].filename;
        rutaFotoPrensa = '/uploads/' + fotoPrensa;
      } else {
        rutaFotoPrensa = fotografia_prensa;
      }
    }
  
    //imagen - pantalla red social
    var fotoRedSocial;
    var rutaFotoRedSocial='';
  
    if (pantalla_red_social === "") {
      if (req.files[0] != undefined) {
        fotoRedSocial = req.files[0].filename;
        rutaFotoRedSocial = '/uploads/' + fotoRedSocial;
      }
    }else{
      if (req.files[0] != undefined) {
        fotoRedSocial = req.files[0].filename;
        rutaFotoRedSocial = '/uploads/' + fotoRedSocial;
      }else{
        rutaFotoRedSocial = pantalla_red_social;
      }
    }
  
    //imagen - fotografia mensajeria
    var fotoMensajeria;
    var rutafotoMensajeria='';
  
    if (fotografia_mensajeria === "") {
      if (req.files[0] != undefined) {
        fotoMensajeria = req.files[0].filename;
        rutafotoMensajeria = '/uploads/' + fotoMensajeria;
      }
    }else{
      if (req.files[0] != undefined) {
        fotoMensajeria = req.files[0].filename;
        rutafotoMensajeria = '/uploads/' + fotoMensajeria;
      }else{
        rutafotoMensajeria = fotografia_mensajeria;
      }
    }


   // Convert value to int Poblacion Ninos
   let valuePoblacionNino = poblacion_ninos;
   let convertPoblacionNino;
 
   if (valuePoblacionNino === "") {
     convertPoblacionNino = 0;
   } else {
     convertPoblacionNino = parseInt(valuePoblacionNino);
   }
 
   // Convert value to int Poblacion Ninas
   let valuePoblacionNinas = poblacion_ninas;
   let convertPoblacionNinas;
 
   if (valuePoblacionNinas === "") {
     convertPoblacionNinas = 0;
   } else {
     convertPoblacionNinas = parseInt(valuePoblacionNinas);
   }
 
   // Convert value to int Adolescentes Mujeres
   let valueAdolecentesMujeres = adolecentes_mujeres;
   let convertAdolecentesMujeres;
 
   if (valueAdolecentesMujeres === "") {
     convertAdolecentesMujeres = 0;
   } else {
     convertAdolecentesMujeres = parseInt(valueAdolecentesMujeres);    
   }
 
   // Convert value to int Adolescentes Hombres
   let valueAdolecentesHombres = adolecentes_hombres;
   let convertAdolecentesHombres;
 
   if (valueAdolecentesHombres === "") {
     convertAdolecentesHombres = 0;
   } else {
     convertAdolecentesHombres = parseInt(valueAdolecentesHombres);
   }
 
   // Convert value to Poblacion Hombres
   let valuePoblacionHombres = poblacion_hombres;
   let convertPoblacionHombres;
 
   if (valuePoblacionHombres === "") {
     convertPoblacionHombres = 0;
   } else {
     convertPoblacionHombres = parseInt(valuePoblacionHombres);
   }
 
   //Convert value to Poblacion Mujeres
   let valuePoblacionMujeres = poblacion_mujeres;
   let convertPoblacionMujeres;
 
   if (valuePoblacionMujeres === "") {
     convertPoblacionMujeres = 0;
   } else {
     convertPoblacionMujeres = parseInt(valuePoblacionMujeres);
   }
 
 
   //Convert value to Poblacion Hombre Mayor
   let valuePoblacionHombreMayor = poblacion_hombre_mayor;
   let convertPoblacionHombreMayor;
 
   if (valuePoblacionHombreMayor === "") {
     convertPoblacionHombreMayor = 0;
   } else {
     convertPoblacionHombreMayor = parseInt(valuePoblacionHombreMayor);
   }
 
   //Convert value to Poblacion Mujer Mayor
   let valuePoblacionMujerMayor = poblacion_mujer_mayor;
   let convertPoblacionMujerMayor;
 
   if (valuePoblacionMujerMayor === "") {
     convertPoblacionMujerMayor = 0;
   } else {
     convertPoblacionMujerMayor = parseInt(valuePoblacionMujerMayor);
   }
 
   //Convert value to cantidad aproximada
   let valueCantidadAproximada = cantidad_aproximada;
   let convertCantidadAproximada;
 
   if (valueCantidadAproximada === "") {
     convertCantidadAproximada = 0;
   } else {
     convertCantidadAproximada = parseInt(valueCantidadAproximada);
   }
 
   var cantidad_poblacion_afectada = convertPoblacionNino + convertPoblacionNinas + convertAdolecentesMujeres + convertAdolecentesHombres + convertPoblacionHombres + convertPoblacionMujeres + convertPoblacionHombreMayor + convertPoblacionMujerMayor + convertCantidadAproximada;

  //Convert Dates
  let today = new Date();

  //Covert Fecha Publicacion Prensa
  let datePublicacion = fecha_publicacion_prensa;
  let convertDatepublicacion;

  if (datePublicacion == undefined || datePublicacion === "") {
    convertDatepublicacion = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDatepublicacion = datePublicacion;
  }

  //Covert Fecha Red Social
  let dateRedSocial = fecha_pub_red_social;
  let convertDateRedSocial;

  if (dateRedSocial == undefined || dateRedSocial === "") {
    convertDateRedSocial = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDateRedSocial = dateRedSocial;
  }

  //Covert Date Emision Radio 
  let dateEmisionRadio = fecha_emision_radio;
  let convertDateEmisionRadio;

  if (dateEmisionRadio == undefined || dateEmisionRadio === "") {
    convertDateEmisionRadio = dateFormat(today, 'yyyy-mm-dd HH:MM:ss');
  } else {
    convertDateEmisionRadio = dateFormat(dateEmisionRadio, 'yyyy-mm-dd HH:MM:ss');
  }

  //Covert Date Fecha Hechos
  let dateHechos = fecha_hechos;
  let convertDateHechos;
  if(dateHechos === ""){
    convertDateHechos = dateFormat(today, 'yyyy-mm-dd HH:MM:ss');
  }else{
    convertDateHechos = dateFormat(dateHechos, 'yyyy-mm-dd HH:MM:ss');
  }

  //Change value fecha_futura_hechos
  let validateFechaHechos = fecha_futura_hechos;
  let valueFechaHechos;

  if (validateFechaHechos == undefined) {
    valueFechaHechos = false;
  } else {
    valueFechaHechos = validateFechaHechos;
  }

  //Covert Date Reporte
  let dateReporte = fecha_reporte;
  let convertDateReporte;

  if (dateReporte == undefined || dateReporte === "") {
    convertDateReporte = dateFormat(today, 'yyyy-mm-dd');
  } else {
    convertDateReporte = dateReporte;
  }

  //Validate value Cantidad
  let valueCantidad = cantidad;
  let newValueCantidad;

  if (valueCantidad === "") {
    newValueCantidad = 0;
  } else {
    newValueCantidad = valueCantidad;
  }

  //Asignate valor a Proteccion Vigente 
  let validateProteccionVigente = proteccion_vigente;
  let valueProteccionVigente;

  if (validateProteccionVigente == undefined) {
    valueProteccionVigente = false;
  } else {
    valueProteccionVigente = validateProteccionVigente;
  }

  //Asignate Value Hubo Agression 
  let validateHuboAgreion = hubo_agresion;
  let valueHuboAgresion;

  if (validateHuboAgreion == undefined) {
    valueHuboAgresion = false;
  } else {
    valueHuboAgresion = validateHuboAgreion;
  }

  //Asignate Dialogo Conflicto
  let validateDialogoConflicto = dialogo_conflicto;
  let valueDialogoConflicto;

  if (validateDialogoConflicto == undefined) {
    valueDialogoConflicto = false;
  } else {
    valueDialogoConflicto = validateDialogoConflicto;
  }

  //Asignate Medida Conflicto
  let validateMedidaConflicto = medida_conflicto;
  let valueMedidaConflicto;

  if (validateMedidaConflicto == undefined) {
    valueMedidaConflicto = false;
  } else {
    valueMedidaConflicto = validateMedidaConflicto;
  }

  //Asignate Dialogo Roto Conflicto 
  let validateDialogoRoto = dialogo_roto_conflicto;
  let valueDialogoRoto;

  if (validateDialogoRoto == undefined) {
    valueDialogoRoto = false;
  } else {
    valueDialogoRoto = validateDialogoRoto;
  }

  //Asignate Crisis Conflicto
  let validateCrisisConflicto = crisis_conflicto;
  let valueCrisisConflicto;

  if (validateCrisisConflicto == undefined) {
    valueCrisisConflicto = false;
  } else {
    valueCrisisConflicto = validateCrisisConflicto;
  }

  //Asignate Resolucion Conflicto
  let validateResolucionConflicto = resolucion_conflicto;
  let valueResolucionConflicto;

  if (validateResolucionConflicto == undefined) {
    valueResolucionConflicto = false;
  } else {
    valueResolucionConflicto = validateResolucionConflicto;
  }

  //Asignate Cantidad Persona Involucrada
  let validatePersonaInvolucrada = cant_persona_involucrada;
  let valuePersonaInvolucrada;

  if (validatePersonaInvolucrada == undefined) {
    valuePersonaInvolucrada = false;
  } else {
    valuePersonaInvolucrada = validatePersonaInvolucrada;
  }

  // Asignate value Presencia Publica
  let validateFuerzaPublica = presencia_fuerza_publica;
  let valueFuerzaPublica;

  if (validateFuerzaPublica == undefined) {
    valueFuerzaPublica = false;
  } else {
    valueFuerzaPublica = validateFuerzaPublica;
  }

  // Asignate value intervencion publica
  let validateIntervencionPublica = intervencion_fuerza_publica;
  let valueIntervencionPublica;

  if (validateIntervencionPublica == undefined) {
    valueIntervencionPublica = false;
  } else {
    valueIntervencionPublica = valueFuerzaPublica;
  }


  try {

    var pais = await db.query(`SELECT id_pais FROM public.admi_pais WHERE codigo = 'SV'`);
    pais = pais.rows[0].id_pais;

    await db.query(`UPDATE sat_alerta_temprana
    SET id_tipo_fuente=$1, id_fuente=$2, titulo_noticia=$3, nombre_medio_prensa=$4, paginas_prensa=$5, autor_prensa=$6, 
    fecha_publicacion_prensa=$7, fotografia_prensa=$8, nombre_medio_radio=$9, canal_radio=$10, nombre_programa_radio=$11, 
    fecha_emision_radio=$12, titulo_redes=$13, nombre_red_social=$14, url_red_social=$15, fecha_pub_red_social=$16, pantalla_red_social=$17, 
    nombre_colectivo=$18, nombre_contacto_colectivo=$19, telefono_colectivo=$20, nombre_organismo=$21, nombre_contacto_organismo=$22, 
    correo_organismo=$23, telefono_organismo=$24, datos_organismo=$25, nombre_inst_gub=$26, contacto_inst_gub=$27, 
    correo_inst_gub=$28, telefono_inst_gub=$29, datos_inst_gub=$30, nombre_mensajeria=$31, nombre_contacto_mensajeria=$32, 
    contacto_mensajeria=$33, datos_mensajeria=$34, fotografia_mensajeria=$35, otras_detalle=$36, otras_adicionales=$37, fecha_hechos=$38, 
    fecha_futura_hechos=$39, fecha_reporte=$40, id_pais=$41, id_departamento=$42, id_municipio=$43, id_tipo_zona=$44, id_escenarios=$45, 
    descripcion_hechos=$46, id_derecho=$47, id_tematica_relacionada=$48, id_sub_tematica=$49, id_situacion_conflictiva=$50, id_criterio=$51, 
    id_temporalidad=$52, cantidad=$53, id_escenario=$54, antecedentes_hecho=$55, poblacion_afectada=$56, contraparte=$57, id_perfil_actor=$58, 
    id_grupo_vulnerable=$59, demanda_solicitud=$60, postura_autoridades=$61, poblacion_ninos=$62, poblacion_ninas=$63, adolecentes_mujeres=$64, 
    adolecentes_hombres=$65, poblacion_hombres=$66, poblacion_mujeres=$67, poblacion_hombre_mayor=$68, poblacion_mujer_mayor=$69, cantidad_aproximada=$70, 
    id_acciones_hecho=$71, proteccion_vigente=$72, hubo_agresion=$73, id_tipo_agresion=$74, dialogo_conflicto=$75, medida_conflicto=$76, dialogo_roto_conflicto=$77, 
    crisis_conflicto=$78, id_acciones_hecho_anterior=$79, resolucion_conflicto=$80, id_situacion_conflicto=$81, cant_persona_involucrada=$82, presencia_fuerza_publica=$83, 
    intervencion_fuerza_publica=$84, fecha_mod_reg=$85, cod_usu_mod=$86, cantidad_poblacion_afectada = $87
    WHERE id_alerta_temprana = $88`,
      [id_tipo_fuente, id_fuente, titulo_noticia, nombre_medio_prensa, paginas_prensa, autor_prensa,
        convertDatepublicacion, rutaFotoPrensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
        convertDateEmisionRadio, titulo_redes, nombre_red_social, url_red_social, convertDateRedSocial,
        rutaFotoRedSocial, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
        nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
        contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
        contacto_mensajeria, datos_mensajeria, rutafotoMensajeria, otras_detalle, otras_adicionales,
        convertDateHechos, valueFechaHechos, convertDateReporte, pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
        descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
        id_criterio, id_temporalidad, newValueCantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
        id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, convertPoblacionNino, convertPoblacionNinas, convertAdolecentesMujeres, convertAdolecentesHombres,
        convertPoblacionHombres, convertPoblacionMujeres, convertPoblacionHombreMayor, convertPoblacionMujerMayor, convertCantidadAproximada, id_acciones_hecho,
        valueProteccionVigente, valueHuboAgresion, id_tipo_agresion, valueDialogoConflicto, valueMedidaConflicto, valueDialogoRoto, valueCrisisConflicto,
        id_acciones_hecho_anterior, valueResolucionConflicto, id_situacion_conflicto, valuePersonaInvolucrada,
        valueFuerzaPublica, valueIntervencionPublica, fecha_mod_reg, cod_usu_mod, cantidad_poblacion_afectada, id_alerta_temprana], (err, results) => {
          if (err) {
            log('src/controllers/front', 'early-alert', 'updateAlert', err, false, req, res);
          }
          
          req.flash('warning', 'Alerta Actualizada correctamente');
          return res.redirect('/api-sat/early-alert/list')

        });

  } catch (error) {
  log('src/controllers/front', 'early-alert', 'updateAlert', err, false, req, res);  }
};

//Analizar Alerta
let viewAnalizeAlert = async (req, res) =>{
  const { id_alerta_temprana } = req.params;
  id_alerta_temprana
  try {

    var earlyAlert = await db.query(`SELECT st.id_alerta_temprana, st.id_fase_conflicto, st.id_tipo_alerta, st.id_accion_pddh, st.analisis, 
    st.notificar, st.texto_mensaje, st.analizada AS analyzed, ap.nombre_accion, ua.nombre_unidad,
    fc.nombre_fase, ta.nombre_alerta
    FROM sat_alerta_temprana AS st
    LEFT JOIN sat_fase_conflicto AS fc ON fc.id_fase_conflicto = st.id_fase_conflicto
    LEFT JOIN sat_tipo_alerta AS ta ON ta.id_tipo_alerta = st.id_tipo_alerta
    LEFT JOIN sat_accion_pddh AS ap ON ap.id_accion_pddh = st.id_accion_pddh
    LEFT JOIN sat_unidad_administrativa AS ua ON ua.id_unidad_administrativa = st.notificar
    WHERE id_alerta_temprana = ${id_alerta_temprana}`);
    earlyAlert = earlyAlert.rows[0];
    
    var fases_conflicto = await db.query('SELECT id_fase_conflicto::integer AS id_fase_conflicto, nombre_fase FROM sat_fase_conflicto WHERE estado = 1');
    fases_conflicto = fases_conflicto.rows;
  
    var tipos_alerta = await db.query('SELECT id_tipo_alerta::integer AS id_tipo_alerta, nombre_alerta FROM sat_tipo_alerta WHERE estado = 1');
    tipos_alerta = tipos_alerta.rows;
  
    var acciones_pddh = await db.query('SELECT id_accion_pddh::integer AS id_accion_pddh, nombre_accion FROM sat_accion_pddh WHERE estado = 1');
    acciones_pddh = acciones_pddh.rows;
  
    var administrative_unit = await db.query(`SELECT id_unidad_administrativa:: integer AS id_unidad_administrativa, nombre_unidad
    FROM sat_unidad_administrativa WHERE estado = 1`);
    administrative_unit = administrative_unit.rows; 

    let relatedAlert = await db.query(`SELECT id_padre, id_hijo FROM sat_alerta_temprana_relacionados
    WHERE id_padre = $1`, [id_alerta_temprana]);
    relatedAlert = relatedAlert.rows;

    return res.render('early-alerts/early-alert-analize', {earlyAlert, fases_conflicto, tipos_alerta, acciones_pddh, administrative_unit, relatedAlert})

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'viewAnalizeAlert', error, false, req, res);
  }

};

//View Relate Alert
let viewRealteAlert = async(req, res) => {
  const {id_alerta_temprana} = req.params;

  try {

    await db.query(`SELECT id_alerta_temprana::integer AS id_alerta_temprana FROM sat_alerta_temprana
          WHERE id_alerta_temprana != $1 
          AND enviada_analizar = true 
          AND alerta_relacionada = false 
          AND alerta_padre = false
          ORDER BY id_alerta_temprana DESC`,[id_alerta_temprana],(err, results) =>{
      if(err){
        log('src/controllers/front', 'early-alert', 'viewRealteAlert', err, false, req, res);
      }else{
        let AlertNotRelate = results.rows;
        let alertListToRelate = [];

        for (let i = 0; i < AlertNotRelate.length; i++) {
          alertListToRelate.push({id_alerta_temprana:AlertNotRelate[i].id_alerta_temprana, alerta_principal: parseInt(id_alerta_temprana)});          
        }

        res.render('early-alerts/elarly-alert-relate', {id_alerta_temprana, alertListToRelate});
      }
    });
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'viewRealteAlert', error, false, req, res);
  }
};

//Relate Alert
let realteAlert = async(req, res) =>{

  const {id_alerta_principal, id_alerta_temprana} = req.params;
  let cod_user = req.user.id_usuario;

  try {

    await db.query(`INSERT INTO sat_alerta_temprana_relacionados(
    id_padre, id_hijo, cod_usu_ing, cod_usu_mod)
    VALUES ( $1, $2, $3, $4)`, [id_alerta_principal, id_alerta_temprana, cod_user, cod_user], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'realteAlert', err, false, req, res);
      } else {

        db.query(`UPDATE sat_alerta_temprana SET alerta_relacionada = true
        WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);

        db.query(`UPDATE sat_alerta_temprana SET alerta_padre = true
        WHERE id_alerta_temprana = $1`, [id_alerta_principal]);

        req.flash('success', 'Alerta relacionada correctamente');
        return res.redirect(`/api-sat/early-alert/${id_alerta_principal}/view-analize`);
      }
    });

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'realteAlert', error, false, req, res);

  }

};

//Remove Related Alert 
let removeRelateedAlert = async(req, res)=>{
  const {id_alerta_temprana, id_alerta_relacionada} = req.params;
  console.log('padre', id_alerta_temprana);
  try {
    await db.query(`UPDATE sat_alerta_temprana SET alerta_relacionada = false 
    WHERE id_alerta_temprana = $1`, [id_alerta_relacionada], async (err, results)=>{
      if(err){
        log('src/controllers/front', 'early-alert', 'removeRelateedAlert', err, false, req, res);
      }else{
        db.query(`DELETE FROM sat_alerta_temprana_relacionados WHERE id_padre = $1 AND id_hijo = $2`, [id_alerta_temprana, id_alerta_relacionada]);
        
        let updateAlertPrincipal = await db.query(`SELECT COUNT(id_padre) AS alerta_padre 
        FROM sat_alerta_temprana_relacionados 
        WHERE id_padre = $1`, [id_alerta_temprana]);
        updateAlertPrincipal = updateAlertPrincipal.rows[0].alerta_padre;

        if(updateAlertPrincipal == 0){
          db.query(`UPDATE sat_alerta_temprana SET alerta_padre = false
          WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
        }

        req.flash('delete', 'La alerta ha sido removida');
        res.redirect(`/api-sat/early-alert/${id_alerta_temprana}/view-analize`);
      }
    });
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'removeRelateedAlert', error, false, req, res);
  }
};

//Enviar Alerta a Analizar
let SendAlerttoAnalyze = async (req, res) =>{
  
  const {id_alerta_temprana} = req.params;

  try {
    await db.query(`UPDATE sat_alerta_temprana SET enviada_analizar = true 
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana], (err, results)=>{
      if(err){
        log('src/controllers/front', 'early-alert', 'SendAlerttoAnalyze', err, false, req, res);
      }else{
        req.flash('warning', 'La Alerta fue enviada a Análisis');
        res.redirect('/api-sat/early-alert/list');
      }
    });
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'SendAlerttoAnalyze', error, false, req, res);
  }

};

//Analizar Alerta
let AnalizeAlert = async (req, res) =>{

  const { id_alerta_temprana } = req.params;
  const { id_accion_pddh, analisis, notificar, texto_mensaje} = req.body;

  try {

    let administrativUnit = await db.query(`SELECT nombre_unidad, correo_prinicipal, correo_secundario
    FROM sat_unidad_administrativa WHERE id_unidad_administrativa = $1`, [notificar]);
    administrativUnit = administrativUnit.rows[0];

    var correo_principal = administrativUnit.correo_prinicipal;

    await db.query(`UPDATE sat_alerta_temprana SET analizada = true, id_accion_pddh = $1, analisis = $2, notificar = $3, texto_mensaje = $4 WHERE id_alerta_temprana = $5`, [id_accion_pddh, analisis, notificar, texto_mensaje, id_alerta_temprana], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'AnalizeAlert', err, false, req, res);
      } else {

        //--- Envio de correo electronico
        sendemail('"NOTIFICACIÓN DEL SISTEMA SAT" <correo@nextdeployed.com>', correo_principal, 'ANÁLISIS DE ALERTA', `Por este medio se le notifica que se ha asignado un caso desde el Sistema SAT, el cual se encuentra en la etapa de análisis del cual se considera usted debe tener conocimiento, por lo que puede ingresar al Sistema SAT para mayor detalle. Mensaje Ingresado: ${texto_mensaje}`).then((result) => {
          //console.log(result);
          //console.log("correo enviado.");
        }, function (error) {
          console.log(error.stack);
        });

        req.flash('warning', 'Alerta Actualizada correctamente');
        res.redirect('/api-sat/early-alert/list');
      }
    });

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'AnalizeAlert', error, false, req, res);
  }



};

//Ver Alerta
let viewAlert = async(req, res) =>{
  const { id_alerta_temprana } = req.params;

  try {

    let getAlert = await db.query(`SELECT st.*, to_char(st.fecha_hechos::timestamp , 'YYYY-MM-DD HH:MM:SS') as nueva_fecha_fechos, to_char(st.fecha_publicacion_prensa::date , 'YYYY-MM-DD') as nueva_fecha_prensa, to_char(st.fecha_reporte::date , 'YYYY-MM-DD') as nueva_fecha_reporte, to_char(st.fecha_pub_red_social::date , 'YYYY-MM-DD') as nueva_red_social, to_char(st.fecha_emision_radio::timestamp , 'YYYY-MM-DD HH:MM:SS') as nueva_fecha_radio, tf.nombre_tipo_fuente, f.nombre_fuente, p.descripcion, ad.descripcion AS departamento, m.descripcion as municipio,
    z.nombre_zona, s.nombre_escenario, d.descripcion AS derecho, tm.nombre_tema, sb.nombre_subtema,
    sc.nombre_sit_conflictiva, c.nombre_criterio, h.nombre_hecho, ha.nombre_hecho as hecho_anterior, stc.nombre_conflicto
    FROM sat_alerta_temprana AS st
    INNER JOIN sat_tipo_fuente AS tf ON tf.id_tipo_fuente = st.id_tipo_fuente
    INNER JOIN sat_fuente AS f ON f.id_fuente = st.id_fuente 
    INNER JOIN admi_pais AS p ON p.id_pais = st.id_pais
    INNER JOIN admi_departamento AS ad ON ad.id_departamento = st.id_departamento
    INNER JOIN admi_municipio AS m ON m.id_municipio = st.id_municipio
    INNER JOIN sat_zonas AS z ON z.id_zona = st.id_tipo_zona
    INNER JOIN sat_escenarios AS s ON s.id_escenario = st.id_escenarios
    INNER JOIN admi_cat_derecho AS d ON d.id_cat_derecho = st.id_derecho
    INNER JOIN sat_temas AS tm ON tm.id_tema = st.id_tematica_relacionada 
    INNER JOIN sat_subtemas AS sb ON sb.id_subtema = st.id_sub_tematica
    INNER JOIN sat_situacion_conflictiva AS sc ON sc.id_situacion_conflictiva = st.id_situacion_conflictiva 
    INNER JOIN sat_criterio AS c ON c.id_criterio = st.id_criterio
    INNER JOIN sat_acciones_hecho AS h ON h.id_acciones_hecho = st.id_acciones_hecho
    INNER JOIN sat_acciones_hecho AS ha ON ha.id_acciones_hecho = st.id_acciones_hecho_anterior
    INNER JOIN sat_situacion_actual_conflicto AS stc ON stc.id_situacion_conflicto = st.id_situacion_conflicto
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    getAlert = getAlert.rows[0];

    var sourceType = await db.query('SELECT id_tipo_fuente, nombre_tipo_fuente FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente, nombre_fuente FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario, nombre_escenario FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    var typeZone = await db.query('SELECT id_zona, nombre_zona FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var country = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE est_reg = 'A'`);
    country = country.rows;

    var ESAcountry = await db.query(`SELECT id_pais, descripcion FROM admi_pais WHERE id_pais = 62`);
    ESAcountry = ESAcountry.rows[0];

    var municipality = await db.query(`SELECT id_municipio, descripcion, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var state = await db.query(`SELECT id_departamento, descripcion FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable, descripcion FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto, nombre_conflicto FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var law = await db.query(`SELECT id_cat_derecho, descripcion FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad, nombre_temporalidad FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema, nombre_tema FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var profileActors = await db.query(`SELECT id_perfil_actor, nombre_actor FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho, nombre_hecho FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;

    //Perfil actores

    //Obtenemos los perfiles del actor seleccionados en la Alerta
    let alertPerfilActor = await db.query(`SELECT json_agg((pa.id_perfil_actor)) as perfiles_alerta
    FROM sat_alerta_temprana AS st
    INNER JOIN sat_perfil_actores AS pa ON pa.id_perfil_actor = ANY(st.id_perfil_actor)  
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertPerfilActor = alertPerfilActor.rows[0];
   
    //Obtiene la lista de todos los perfiles de actores
    let listPerfilActors = await db.query(`SELECT id_perfil_actor::integer as perfil_actor, nombre_actor FROM sat_perfil_actores`);
    listPerfilActors = listPerfilActors.rows;

    let listPerfiles = []; //Arreglo para los perfiles seleccionados en la alerta y los que no 
    let checked; //Variable utilizada en la vista para que muestre seleccionado el perfil_actor de le Alerta

    //Se recorren ambas listas y se crear un arreglo para guardar los perfiles seleccionados en la alerta y los que no. 
    for (let i = 0; i < alertPerfilActor.perfiles_alerta.length; i++) {
        for (let j = 0; j < listPerfilActors.length; j++) {
            if(alertPerfilActor.perfiles_alerta[i] == listPerfilActors[j].perfil_actor){
              checked = 'checked';
              listPerfiles.push({id_perfil_actor: listPerfilActors[j].perfil_actor, nombre_actor:listPerfilActors[j].nombre_actor, checked});
            }else{
              checked = '';
              listPerfiles.push({id_perfil_actor: listPerfilActors[j].perfil_actor, nombre_actor:listPerfilActors[j].nombre_actor, checked});
            }
        }
    }

    //Obtiene la grupos de vulnerabilidad seleccionadas en Alerta
    let alertGruposVulnerabilidad = await db.query(`SELECT json_agg((g.id_grp_vulnerable)) as grp_vulnerabilidad
     FROM sat_alerta_temprana AS st
     INNER JOIN admi_grp_vulnerable AS g ON g.id_grp_vulnerable = ANY(st.id_grupo_vulnerable)  
     WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertGruposVulnerabilidad = alertGruposVulnerabilidad.rows[0];
    
    let GruposVulnerabilidadSelectd = []; // Guardar la informacion de los grupos de vulnerabilidad seleccionados.
       
    for (let i = 0; i < alertGruposVulnerabilidad.grp_vulnerabilidad.length; i++) {

        var grupoVulneravilidad = await db.query(`SELECT id_grp_vulnerable::integer AS id_grp_vulnerable, descripcion 
        FROM admi_grp_vulnerable
        WHERE id_grp_vulnerable = $1
        ORDER BY id_grp_vulnerable ASC`, [alertGruposVulnerabilidad.grp_vulnerabilidad[i]]);
        grupoVulneravilidad = grupoVulneravilidad.rows[0];
        grupoVulneravilidad.checked = 'checked';

        GruposVulnerabilidadSelectd.push(grupoVulneravilidad);
    }

    //Obtiene la lista de tipos_agresion seleccionadas en Alerta
    let alertTiposAgresion = await db.query(`SELECT json_agg((ta.id_tipo_agresion)) as tipo_agresion
    FROM sat_alerta_temprana AS st
    INNER JOIN sat_tipo_agresion AS ta ON ta.id_tipo_agresion = ANY(st.id_tipo_agresion)  
    WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    alertTiposAgresion = alertTiposAgresion.rows[0];

    ////Obtiene la lista de los tipos_agresion 
    let listaTiposAgresion = await db.query(`SELECT id_tipo_agresion 
    FROM sat_tipo_agresion 
    WHERE estado = 1 ORDER 
    BY id_tipo_agresion ASC`);
    listaTiposAgresion = listaTiposAgresion.rows;
    
    //Arreglo que almacena la lista de tipos de agresion y las seleccionadas
    var agressionType = [];

    if (alertTiposAgresion.tipo_agresion != null) {

      for (let i = 0; i < alertTiposAgresion.tipo_agresion.length; i++) {
        let checked = 'checked';       
        var aggresionTypeSelect = await db.query(`SELECT id_tipo_agresion, nombre_agresion 
        FROM sat_tipo_agresion  
        WHERE id_tipo_agresion = $1 
        ORDER BY id_tipo_agresion ASC`, [alertTiposAgresion.tipo_agresion[i]]);
        aggresionTypeSelect = aggresionTypeSelect.rows[0]
        
        agressionType.push({id_tipo_agresion: aggresionTypeSelect.id_tipo_agresion, nombre_agresion: aggresionTypeSelect.nombre_agresion, checked});       

      }
      
    } else {

      for (let i = 0; i < listaTiposAgresion.length; i++) {
        let checked = '';
        var getAgressionType = await db.query(`SELECT id_tipo_agresion, nombre_agresion 
        FROM sat_tipo_agresion 
        WHERE id_tipo_agresion = $1 
        ORDER BY id_tipo_agresion ASC`, [listaTiposAgresion[i].id_tipo_agresion]);
        getAgressionType = getAgressionType.rows[0]; 

        agressionType.push({id_tipo_agresion: getAgressionType.id_tipo_agresion, nombre_agresion: getAgressionType.nombre_agresion, checked});
        
      }
    }
    return res.render('early-alerts/early-alert-view', { getAlert, temporality, sourceType, law, topics, scenario, typeZone, state, ESAcountry, country, profileActors, vulnerableGroup, actionsFact, conflictSituation, listPerfiles, GruposVulnerabilidadSelectd, agressionType});


  } catch (error) {
    log('src/controllers/front', 'early-alert', 'viewAlert', error, false, req, res);
  }
};

// Metodos utilizado en las vista crear.
// Se filtran los sub-temas y situacion conflictiva
let searchMunicipalityBySatate = async (req, res) => {

  const { id_departamento } = req.params;

  try {
    await db.query(`SELECT id_municipio, descripcion 
      FROM admi_municipio 
      WHERE id_departamento = $1 AND est_reg = 'A'`, [id_departamento], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'searchMunicipalityBySatate', err, false, req, res);
      } else {
        let municipalities = results.rows;
        return res.status(200).json({
          municipalities
        });
      }
    });

  } catch (error) {
    log('src/controllers/front', 'early-alert', 'searchMunicipalityBySatate', error, false, req, res);
  }
};

let getSubtopicsByTopic = async (req, res) => {
  const { id_tematica_relacionada } = req.params;
  try {
    await db.query(`SELECT id_subtema, nombre_subtema
      FROM sat_subtemas
      WHERE id_tema = $1 AND estado = 1`, [id_tematica_relacionada], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'getSubtopicsByIdTopic', err, false, req, res);
      } else {
        var subtopics = results.rows;
        return res.status(200).json({
          subtopics
        });
      }
    });
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'getSubtopicsByIdTopic', error, false, req, res);
  }

};

let getConflictSituationBySubtopic = async (req, res) => {
  const { id_subtematica } = req.params;
  try {
    await db.query(`SELECT id_situacion_conflictiva, nombre_sit_conflictiva FROM sat_situacion_conflictiva 
      WHERE id_subtema = $1 AND estado = 1`, [id_subtematica], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'getConflictSituationBySubtopic', err, false, req, res);
      } else {
        var situations = results.rows;
        return res.status(200).json({
          situations
        });
      }
    })
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'getConflictSituationBySubtopic', error, false, req, res);

  }
};

let getCriterioByConflictSituation = async (req, res) => {
  const { id_situacion_conflictiva } = req.params;

  try {
    await db.query(`SELECT id_criterio, nombre_criterio FROM sat_criterio 
      WHERE id_sit_conflictiva = $1 AND estado = 1`, [id_situacion_conflictiva], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'getCriterioByConflictSituation', err, false, req, res);
      } else {
        var criterios = results.rows;
        return res.status(200).json({
          criterios
        });
      }
    })
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'getCriterioByConflictSituation', error, false, req, res);
  }
};

let getSourceByTypeSource = async (req, res) => {
  const { id_tipo_fuente } = req.params;
  try {
    await db.query(`SELECT id_fuente, nombre_fuente FROM sat_fuente  
    WHERE id_tipo_fuente = $1 AND estado = 1`, [id_tipo_fuente], (err, results) => {
      if (err) {
        log('src/controllers/front', 'early-alert', 'getSourceByTypeSource', err, false, req, res);
      } else {
        var Sources = results.rows;
        return res.status(200).json({
          Sources
        });
      }
    })
  } catch (error) {
    log('src/controllers/front', 'early-alert', 'getSourceByTypeSource', error, false, req, res);
  }
};

module.exports = {
  earlyAlertsList,
  viewCreateAlert,
  searchMunicipalityBySatate,
  getSubtopicsByTopic,
  getConflictSituationBySubtopic,
  getCriterioByConflictSituation,
  getSourceByTypeSource,
  createAlert,
  viewUpdateAlert,
  updateAlert,
  viewAnalizeAlert,
  SendAlerttoAnalyze,
  AnalizeAlert,
  viewAlert,
  viewRealteAlert,
  realteAlert,
  removeRelateedAlert
}