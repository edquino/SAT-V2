const db = require('@config/db');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');
const sendemail = require('@lib/emails');
const moment = require('moment');

let getFormVersion = (req, res) => {

  let version = parseFloat("2.0");

  return res.status(200).json({ version });
}

let earlyAlertsList = async (req, res) => {
  const { offset } = req.query;
  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la lista de Alertas Tempranas.", instance: "early-alert/earlyAlertsList" });

    var cod_usu_ing = req.user.user_id;
    let rol_user = req.user.roles[0].role_id;

    let earlyAlerts;

    //Perfil Consulta
    if (rol_user == 1) {

      earlyAlerts = await db.query(`SELECT id_alerta_temprana::numeric AS form_id,
      CASE WHEN analizada IS null THEN false ELSE analizada END AS analyzed, enviada_analizar AS sent_to_analyze,
      COALESCE( json_agg(json_build_object('form_id', sacr.id_hijo, 'analyzed', (SELECT CASE WHEN analizada IS null THEN false ELSE analizada END FROM sat_alerta_temprana WHERE id_alerta_temprana = sacr.id_hijo))) FILTER (WHERE sacr.id_padre IS NOT null),'[]') AS children
      FROM sat_alerta_temprana 
      LEFT JOIN sat_alerta_temprana_relacionados AS sacr ON sacr.id_padre = id_alerta_temprana
      WHERE NOT EXISTS ( SELECT FROM sat_alerta_temprana_relacionados WHERE id_hijo = sat_alerta_temprana.id_alerta_temprana )
      GROUP BY sat_alerta_temprana.id_alerta_temprana
      ORDER BY id_alerta_temprana DESC LIMIT 25 OFFSET $1`, [offset]);
      earlyAlerts = earlyAlerts.rows;

      //Perfil Tecnico
    } else if (rol_user == 2) {

      earlyAlerts = await db.query(`SELECT id_alerta_temprana::numeric AS form_id,
      CASE WHEN analizada IS null THEN false ELSE analizada END AS analyzed, enviada_analizar AS sent_to_analyze,
      COALESCE( json_agg(json_build_object('form_id', sacr.id_hijo, 'analyzed', (SELECT CASE WHEN analizada IS null THEN false ELSE analizada END FROM sat_alerta_temprana WHERE id_alerta_temprana = sacr.id_hijo))) FILTER (WHERE sacr.id_padre IS NOT null),'[]') AS children
      FROM sat_alerta_temprana 
      LEFT JOIN sat_alerta_temprana_relacionados AS sacr ON sacr.id_padre = id_alerta_temprana
      WHERE NOT EXISTS ( SELECT FROM sat_alerta_temprana_relacionados WHERE id_hijo = sat_alerta_temprana.id_alerta_temprana )
      AND cod_usu_ing = $1 
      GROUP BY sat_alerta_temprana.id_alerta_temprana
      ORDER BY id_alerta_temprana DESC LIMIT 25 OFFSET $2`, [cod_usu_ing, offset]);
      earlyAlerts = earlyAlerts.rows;


      //Perfil Supervisor
    } else if (rol_user == 3) {

      earlyAlerts = await db.query(`SELECT id_alerta_temprana::numeric AS form_id,
      CASE WHEN analizada IS null THEN false ELSE analizada END AS analyzed, enviada_analizar AS sent_to_analyze,
      COALESCE( json_agg(json_build_object('form_id', sacr.id_hijo, 'analyzed', (SELECT CASE WHEN analizada IS null THEN false ELSE analizada END FROM sat_alerta_temprana WHERE id_alerta_temprana = sacr.id_hijo))) FILTER (WHERE sacr.id_padre IS NOT null),'[]') AS children
      FROM sat_alerta_temprana 
      LEFT JOIN sat_alerta_temprana_relacionados AS sacr ON sacr.id_padre = id_alerta_temprana
      WHERE NOT EXISTS ( SELECT FROM sat_alerta_temprana_relacionados WHERE id_hijo = sat_alerta_temprana.id_alerta_temprana )
      GROUP BY sat_alerta_temprana.id_alerta_temprana
      ORDER BY id_alerta_temprana DESC LIMIT 25 OFFSET $1`, [offset]);
      earlyAlerts = earlyAlerts.rows;

      //Perfil Analista
    } else if (rol_user == 4) {

      earlyAlerts = await db.query(`SELECT id_alerta_temprana::numeric AS form_id,
      CASE WHEN analizada IS null THEN false ELSE analizada END AS analyzed, enviada_analizar AS sent_to_analyze,
      COALESCE( json_agg(json_build_object('form_id', sacr.id_hijo, 'analyzed', (SELECT CASE WHEN analizada IS null THEN false ELSE analizada END FROM sat_alerta_temprana WHERE id_alerta_temprana = sacr.id_hijo))) FILTER (WHERE sacr.id_padre IS NOT null),'[]') AS children
      FROM sat_alerta_temprana 
      LEFT JOIN sat_alerta_temprana_relacionados AS sacr ON sacr.id_padre = id_alerta_temprana
      WHERE NOT EXISTS ( SELECT FROM sat_alerta_temprana_relacionados WHERE id_hijo = sat_alerta_temprana.id_alerta_temprana )
      AND enviada_analizar = true
      GROUP BY sat_alerta_temprana.id_alerta_temprana
      ORDER BY id_alerta_temprana DESC LIMIT 25 OFFSET $1`, [offset]);
      earlyAlerts = earlyAlerts.rows;
    }


    return res.status(200).json({ earlyAlerts });


  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }
};

let getById = async (req, res) => {
  const { id_alerta_temprana } = req.params;


  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener la Alerta.", instance: "early-alert/getById" });

    var early_alert = await db.query(`SELECT * FROM sat_alerta_temprana WHERE id_alerta_temprana = $1`, [id_alerta_temprana]);
    early_alert = early_alert.rows[0];

    var sourceType = await db.query('SELECT id_tipo_fuente::integer AS answer_id, nombre_tipo_fuente AS answer FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente::integer AS answer_id, nombre_fuente AS answer, id_tipo_fuente AS to_compare FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    //var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    //country = country.rows[0];

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    var municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto::integer AS answer_id, nombre_conflicto AS answer FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var aggresionType = await db.query(`SELECT id_tipo_agresion::integer AS answer_id, nombre_agresion AS answer FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
    aggresionType = aggresionType.rows;

    var law = await db.query(`SELECT id_cat_derecho::integer AS answer_id, descripcion AS answer FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad::integer AS answer_id, nombre_temporalidad AS answer FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema::integer AS answer_id, nombre_tema AS answer FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var subTopics = await db.query(`SELECT id_subtema::integer AS answer_id, nombre_subtema AS answer, id_tema::integer AS to_compare
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

    var profileActors = await db.query(`SELECT id_perfil_actor::integer AS answer_id, nombre_actor AS answer FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho::integer AS answer_id, nombre_hecho AS answer FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;


    /*var sections = [
      new Section({
        sectionId: "tipofuente",
        sectionTitle: "Arguments Sections",
        questions: [
          new Question({
            sectionId: "tipofuente",
            questionId: "id_tipo_fuente",
            required: true,
            questionType: "closed",
            hasChild: true,
            principalChild: "id_fuente",
            questionTitle: "Tipo de fuente",
            answers: sourceType,
            answer: Number.parseInt(early_alert.id_tipo_fuente)
          })
        ]

      })
    ];

    var form = new Form({
      formId : id_alerta_temprana,
      sentToAnalyze: false,
      analyzed: false,
      sections,
    });*/

    //---------- 5
    var tipofuente = {
      section_id: "tipofuente",
      questions: [
        {
          question_id: "id_tipo_fuente",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_fuente",
            section_id: "tipofuente"
          },
          question: "Tipo de fuente",
          answers: sourceType,
          answer: Number.parseInt(early_alert.id_tipo_fuente)
        },
        {
          question_id: "id_fuente",
          required: true,
          question_type: "closed",
          is_child: true,
          question: "Fuente",
          all_answers: source,
          answer: Number.parseInt(early_alert.id_fuente)
        }

      ]
    }

    //Prensa Escrita
    var newspapers = {
      section_id: "newspapers",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 1
      },
      section_title: "Prensa escrita",
      questions: [
        {
          question_id: "titulo_noticia",
          question_type: "open",
          question: "Titulo de la noticia",
          answer: early_alert.titulo_noticia
        },
        {
          question_id: "nombre_medio_prensa",
          question_type: "open",
          question: "Nombre del medio",
          answer: early_alert.nombre_medio_prensa
        },
        {
          question_id: "paginas_prensa",
          question_type: "open",
          question: "Páginas",
          answer: early_alert.paginas_prensa
        },
        {
          question_id: "autor_prensa",
          question_type: "open",
          question: "Autor/a",
          answer: early_alert.autor_prensa
        },
        {
          question_id: "fecha_publicacion_prensa",
          question_type: "date",
          question: "Fecha de publicación",
          answer: early_alert.fecha_publicacion_prensa
        },
        {
          question_id: "fotografia_prensa",
          question_type: "image",
          question: "Fotografía",
          answer: early_alert.fotografia_prensa
        }
      ]
    }

    //Radio Tv
    var radioAndTv = {
      section_id: "radioAndTv",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 2
      },
      section_title: "Radio/TV",
      questions: [
        {
          question_id: "nombre_medio_radio",
          question_type: "open",
          question: "Nombre del medio",
          answer: early_alert.nombre_medio_radio
        },
        {
          question_id: "canal_radio",
          question_type: "open",
          question: "Canal/Emisora",
          answer: early_alert.canal_radio
        },
        {
          question_id: "nombre_programa_radio",
          question_type: "open",
          question: "Nombre del programa",
          answer: early_alert.nombre_programa_radio
        },
        {
          question_id: "fecha_emision_radio",
          question_type: "date_time",
          question: "Fecha y Hora de emisión",
          answer: early_alert.fecha_emision_radio
        }
      ]
    }

    //Social Media
    var socialMedia = {
      section_id: "socialMedia",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [3, 4]
      },
      section_title: "Redes sociales/medios digitales",
      questions: [
        {
          question_id: "titulo_redes",
          required: true,
          question_type: "open",
          question: "Titulo de la noticia",
          answer: early_alert.titulo_redes
        },
        {
          question_id: "nombre_red_social",
          question_type: "open",
          question: "Nombre de la red o medio",
          answer: early_alert.nombre_red_social
        },
        {
          question_id: "url_red_social",
          question_type: "open",
          question: "URL",
          answer: early_alert.url_red_social
        },
        {
          question_id: "fecha_pub_red_social",
          question_type: "date",
          question: "Fecha de publicación",
          answer: early_alert.fecha_pub_red_social
        },
        {
          question_id: "pantalla_red_social",
          question_type: "image",
          question: "Captura de pantalla",
          answer: early_alert.pantalla_red_social
        }
      ]
    }

    //Colectivos
    var collectives = {
      section_id: "collectives",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [5, 6, 7]
      },
      section_title: "Colectivos",
      questions: [
        {
          question_id: "nombre_colectivo",
          question_type: "open",
          question: "Nombre colectivo",
          answer: early_alert.nombre_colectivo
        },
        {
          question_id: "nombre_contacto_colectivo",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_colectivo
        },
        {
          question_id: "telefono_colectivo",
          question_type: "open",
          question: "Teléfono contacto",
          answer: early_alert.telefono_colectivo
        }
      ]
    }

    //Organizacion Internacionales  
    var internationalOrganization = {
      section_id: "internationalOrganization",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [12, 13, 16]
      },
      section_title: "Organizaciones internacionales",
      questions: [
        {
          question_id: "nombre_organismo",
          question_type: "open",
          question: "Nombre Organización",
          answer: early_alert.nombre_organismo
        },
        {
          question_id: "nombre_contacto_organismo",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_organismo
        },
        {
          question_id: "correo_organismo",
          question_type: "open",
          question: "Correo",
          answer: early_alert.correo_organismo
        },
        {
          question_id: "telefono_organismo",
          question_type: "open",
          question: "Teléfono contacto",
          answer: early_alert.telefono_organismo
        },
        {
          question_id: "datos_organismo",
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.datos_organismo
        }
      ]
    }

    //Sistema de mensajeria
    var messagingSystem = {
      section_id: "messagingSystem",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 14
      },
      section_title: "Sistemas de mensajería",
      questions: [
        {
          question_id: "nombre_mensajeria",
          question_type: "open",
          question: "Nombre mensajeria",
          answer: early_alert.nombre_mensajeria
        },
        {
          question_id: "nombre_contacto_mensajeria",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.nombre_contacto_mensajeria
        },
        {
          question_id: "contacto_mensajeria",
          question_type: "open",
          question: "Contacto",
          answer: early_alert.contacto_mensajeria
        },
        {
          question_id: "datos_mensajeria",
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.datos_mensajeria
        },
        {
          question_id: "fotografia_mensajeria",
          question_type: "image",
          question: "Captura de pantalla",
          answer: early_alert.fotografia_mensajeria
        }
      ]
    }

    //Insituciones Gubernamentales
    var governmentInstitutions = {
      section_id: "governmentInstitutions",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [8, 9, 10, 11],
      },
      section_title: "Instituciones Gubernamentales",
      questions: [
        {
          question_id: "nombre_inst_gub",
          question_type: "open",
          question: "Nombre Organización",
          answer: early_alert.nombre_inst_gub
        },
        {
          question_id: "contacto_inst_gub",
          question_type: "open",
          question: "Nombre contacto",
          answer: early_alert.contacto_inst_gub
        },
        {
          question_id: "correo_inst_gub",
          question_type: "open",
          question: "Correo",
          answer: early_alert.correo_inst_gub
        },
        {
          question_id: "telefono_inst_gub",
          question_type: "open",
          question: "Teléfono Contacto",
          answer: early_alert.telefono_inst_gub
        },
        {
          question_id: "datos_inst_gub",
          question_type: "open",
          question: "Datos Adicionales",
          answer: early_alert.datos_inst_gub
        }
      ]
    }

    //Otras
    var other = {
      section_id: "other",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 15
      },
      section_title: "Otras",
      questions: [
        {
          question_id: "otras_detalle",
          question_type: "open",
          question: "Detalle",
          answer: early_alert.otras_detalle
        },
        {
          question_id: "otras_adicionales",
          question_type: "open",
          question: "Datos adicionales",
          answer: early_alert.otras_adicionales
        }
      ]
    }

    //Información relacionada al hecho
    var factInformation = {
      section_id: "factInformation",
      section_title: "Información relacionada al hecho/situación/problema",
      bold_title: true,
      questions: [
        {
          question_id: "fecha_hechos",
          question_type: "date",
          question: "Fecha y hora del hecho/Situación/Problema",
          answer: early_alert.fecha_hechos
        },
        {
          question_id: "fecha_futura_hechos",
          question_type: "switch",
          question: "Fecha Futura",
          answer: early_alert.fecha_futura_hechos
        },
        {
          question_id: "fecha_reporte",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question_type: "date",
          question: "Fecha de reporte del hecho/Situación/Problema",
          answer: early_alert.fecha_reporte
        }
      ]
    }

    //Lugar especifico del hecho
    var specificPlace = {
      section_id: "specificPlace",
      section_title: "Lugar específico del hecho/Situación/Problema",
      questions: [
        {
          question_id: "id_pais",
          enabled: false,
          question_type: "open",
          question: "Pais",
          answer: "El Salvador"
        },
        {
          question_id: "id_departamento",
          question_type: "closed",
          required: true,
          has_child: true,
          principal_child: {
            question_id: "id_municipio",
            section_id: "specificPlace"
          },
          question: "Departamento",
          answers: state,
          answer: Number.parseInt(early_alert.id_departamento)
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          is_child: true,
          question: "Municipio",
          all_answers: municipality,
          answer: Number.parseInt(early_alert.id_municipio)
        },
        {
          question_id: "id_tipo_zona",
          question_type: "closed",
          question: "Tipo de Zona",
          answers: typeZone,
          answer: Number.parseInt(early_alert.id_tipo_zona)
        },
        {
          question_id: "id_escenarios",
          question_type: "closed",
          question: "Escenarios",
          answers: scenarios,
          answer: Number.parseInt(early_alert.id_escenarios)
        },
        {
          question_id: "descripcion_hechos",
          question_type: "open",
          max_lines: 6,
          question: "Breve descripción del hecho/Situación/Problema",
          limit: 500,
          answer: early_alert.descripcion_hechos
        },
        {
          question_id: "id_derecho",
          question_type: "closed",
          question: "Derecho",
          answers: law,
          answer: Number.parseInt(early_alert.id_derecho)
        },
        {
          question_id: "id_temporalidad",
          question_type: "closed",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Temporalidad",
          answers: temporality,
          answer: Number.parseInt(early_alert.id_temporalidad)
        },
        {
          question_id: "cantida",
          question_type: "numeric",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Cantidad",
          answer: early_alert.cantidad
        },
        {
          question_id: "id_escenario",
          question_type: "closed",
          question: "Escenario",
          answers: scenario,
          answer: Number.parseInt(early_alert.id_escenario)
        },
        {
          question_id: "id_tematica_relacionada",
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_sub_tematica",
            section_id: "specificPlace"
          },
          children: [
            {
              question_id: "id_situacion_conflictiva",
              section_id: "specificPlace"
            },
            {
              question_id: "id_criterio",
              section_id: "specificPlace"
            }
          ],
          question: "Temática",
          answers: topics,
          answer: Number.parseInt(early_alert.id_tematica_relacionada)
        },
        {
          question_id: "id_sub_tematica",
          question_type: "closed",
          is_child : true,
          has_child: true,
          principal_child: {
            question_id: "id_situacion_conflictiva",
            section_id: "specificPlace"
          },
          children: [
            {
              question_id: "id_criterio",
              section_id: "specificPlace"
            }
          ],
          question: "Sub Temática",
          all_answers: subTopics,
          answer: Number.parseInt(early_alert.id_sub_tematica)
        },
        {
          question_id: "id_situacion_conflictiva",
          question_type: "closed",
          is_child: true,
          has_child: true,
          principal_child: {
            question_id: "id_criterio",
            section_id: "specificPlace"
          },
          question: "Situación conflictiva",
          all_answers: conflictSituations,
          answer: Number.parseInt(early_alert.id_situacion_conflictiva)
        },
        {
          question_id: "id_criterio",
          question_type: "closed",
          is_child: true,
          question: "Criterio",
          all_answers: criteria,
          answer: Number.parseInt(early_alert.id_criterio)
        },
        {
          question_id: "antecedentes_hecho",
          question_type: "open",
          max_lines: 6,
          question: "Antecedente del hecho/Situación/Problema",
          answer: early_alert.antecedentes_hecho
        }
      ]
    }

    //Partes Involucradas Directamente
    var partiesInvolved = {
      section_id: "partiesInvolved",
      section_title: "Partes involucradas directamente",
      questions: [
        {
          question_id: "poblacion_afectada",
          question_type: "open",
          question: "Población afectada",
          answer: early_alert.poblacion_afectada
        },
        {
          question_id: "contraparte",
          question_type: "open",
          question: "Contraparte",
          answer: early_alert.contraparte
        },
        {
          question_id: "id_perfil_actor",
          question_type: "closed",
          multi_select: true,
          question: "Perfil de actores",
          answers: profileActors,
          answer: early_alert.id_perfil_actor

        },
        {
          question_id: "id_grupo_vulnerable",
          required: true,
          question_type: "closed",
          multi_select: true,
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup,
          answer: early_alert.id_grupo_vulnerable
        },
        {
          question_id: "demanda_solicitud",
          question_type: "open",
          max_lines: 6,
          question: "Demanda o solicitud de la población afectada a las autoridades competentes",
          hint: "Escriba aqui...",
          answer: early_alert.demanda_solicitud
        },
        {
          question_id: "postura_autoridades",
          question_type: "open",
          max_lines: 6,
          question: "Postura de las autoridades y/o contrapartes",
          hint: "Escriba aqui...",
          answer: early_alert.postura_autoridades
        }
      ]
    }

    //Población afectada Indeterminada/Determinada ****************
    var affectedPopulation = {
      section_id: "affectedPopulation",
      section_title: "Población afectada Indeterminada/Determinada",
      bold_title: true,
      questions: []
    }

    //Poblacion Determinada
    var determinedPopulation = {
      section_id: "determinedPopulation",
      section_title: "Población determinada",
      questions: [
        {
          question_id: "poblacion_ninos",
          question_type: "numeric",
          question: "Niños",
          answer: early_alert.poblacion_ninos
        },
        {
          question_id: "poblacion_ninas",
          question_type: "numeric",
          question: "Niñas",
          answer: early_alert.poblacion_ninas
        },
        {
          question_id: "adolecentes_mujeres",
          question_type: "numeric",
          question: "Adolecentes Mujeres",
          answer: early_alert.adolecentes_mujeres
        },
        {
          question_id: "adolecentes_hombres",
          question_type: "numeric",
          question: "Adolecentes Hombres",
          answer: early_alert.adolecentes_hombres
        },
        {
          question_id: "poblacion_hombres",
          question_type: "numeric",
          question: "Hombres",
          answer: early_alert.poblacion_hombres
        },
        {
          question_id: "poblacion_mujeres",
          question_type: "numeric",
          question: "Mujeres",
          answer: early_alert.poblacion_mujeres
        },
        {
          question_id: "poblacion_hombre_mayor",
          question_type: "numeric",
          question: "Hombres adulto mayor",
          answer: early_alert.poblacion_hombre_mayor
        },
        {
          question_id: "poblacion_mujer_mayor",
          question_type: "numeric",
          question: "Mujeres adulto mayor",
          answer: early_alert.poblacion_mujer_mayor
        }

      ]
    }

    //Poblacion Determinada
    var numberPopulationDetermined = {
      section_id: "numberPopulationDetermined",
      section_title: "Población indeterminada",
      questions: [
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          question: "Cantidad aproximada",
          answer: early_alert.cantidad_aproximada
        }
      ]
    }

    //Valoracion de Fase de Conflicto
    var conflictPhaseAssessment = {
      section_id: "conflictPhaseAssessment",
      section_title: "Valoración de fase del conflicto",
      questions: [
        {
          question_id: "id_acciones_hecho",
          required: false,
          question_type: "closed",
          question: "Acciones del Hecho",
          answers: actionsFact,
          answer: Number.parseInt(early_alert.id_acciones_hecho)
        },
        {
          question_id: "proteccion_vigente",
          required: true,
          question_type: "switch",
          question: "¿Existen medidas de protección vigentes? ",
          answer: early_alert.proteccion_vigente
        },
        {
          question_id: "hubo_agresion",
          required: true,
          question_type: "switch",
          question: "¿Se ha producido algún tipo de agresión?",
          answer: early_alert.hubo_agresion
        },
        {
          question_id: "id_tipo_agresion",
          required: true,
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "hubo_agresion",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question_type: "closed",
          multi_select: true,
          question: "Tipo de agresión",
          answers: aggresionType,
          answer: early_alert.id_tipo_agresion
        },
        {
          question_id: "dialogo_conflicto",
          required: true,
          question_type: "switch",
          question: "¿Existe disposición al diálogo?",
          answer: early_alert.dialogo_conflicto
        },
        {
          question_id: "medida_conflicto",
          required: true,
          question_type: "switch",
          question: "¿Se ha expresado/anunciado la realización de algún tipo de medida de presión?",
          answer: early_alert.medida_conflicto
        },
        {
          question_id: "dialogo_roto_conflicto",
          required: true,
          question_type: "switch",
          question: "¿Se rompió dialogo?",
          answer: early_alert.dialogo_roto_conflicto
        },
        {
          question_id: "crisis_conflicto",
          required: true,
          question_type: "switch",
          question: "¿Hubo crisis?",
          answer: early_alert.crisis_conflicto
        },
        {
          question_id: "id_acciones_hecho_anterior",
          required: false,
          question_type: "closed",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "crisis_conflicto",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Acciones del Hecho Anterior",
          answers: actionsFact,
          answer: Number.parseInt(early_alert.id_acciones_hecho_anterior)
        },
        {
          question_id: "resolucion_conflicto",
          required: true,
          question_type: "switch",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "crisis_conflicto",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "¿Hubo mecanismos de resolución del conflicto?",
          answer: early_alert.resolucion_conflicto

        },
        {
          question_id: "id_situacion_conflicto",
          question_type: "closed",
          question: "Situación actual del conflicto",
          answers: conflictSituation,
          answer: Number.parseInt(early_alert.id_situacion_conflicto)
        },
        {
          question_id: "cant_persona_involucrada",
          required: true,
          question_type: "switch",
          question: "¿A disminuido la cantidad de personas involucradas?",
          answer: early_alert.cant_persona_involucrada
        },
        {
          question_id: "presencia_fuerza_publica",
          required: true,
          question_type: "switch",
          question: "¿Hubo Presencia de fuerzas públicas",
          answer: early_alert.presencia_fuerza_publica
        },
        {
          question_id: "intervencion_fuerza_publica",
          required: true,
          question_type: "switch",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "presencia_fuerza_publica",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "¿Hubo Intervencion de fuerzas públicas",
          answer: early_alert.intervencion_fuerza_publica
        }
      ]
    }

    // ---------2
    var sections = [];

    sections.push(tipofuente, newspapers, radioAndTv, socialMedia, collectives, internationalOrganization, messagingSystem,
      governmentInstitutions, other, factInformation, specificPlace, partiesInvolved, affectedPopulation, determinedPopulation, numberPopulationDetermined,
      conflictPhaseAssessment);
    //1
    var formEarlyAlert = {
      form_id: early_alert.id_alerta_temprana,
      analyzed: early_alert.analizada,
      sent_to_analyze: early_alert.enviada_analizar,
      sections: sections
    }

    return res.status(200).json({ form: formEarlyAlert });

  } catch (error) {
    console.log(error);
    return res.status(500).json(errorResponse.toJson());
  }
};

let updateEarlyAlert = async (req, res) => {

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
  var cod_usu_mod = req.user.user_id;


  var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar la Alerta.", instance: "early-alert/updateEarlyAlert" });


  try {

    var cantidad_poblacion_afectada = poblacion_ninos + poblacion_ninas + adolecentes_mujeres + adolecentes_hombres + poblacion_hombres + poblacion_mujeres + poblacion_hombre_mayor + poblacion_mujer_mayor + cantidad_aproximada;



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
        fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
        fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
        pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
        nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
        contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
        contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
        fecha_hechos, fecha_futura_hechos, fecha_reporte, pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
        descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
        id_criterio, id_temporalidad, cantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
        id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos, poblacion_ninas, adolecentes_mujeres, adolecentes_hombres,
        poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor, cantidad_aproximada, id_acciones_hecho,
        proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
        id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
        presencia_fuerza_publica, intervencion_fuerza_publica, fecha_mod_reg, cod_usu_mod, cantidad_poblacion_afectada, id_alerta_temprana], (err, results) => {
          if (err) {
            console.log(err);
            errorResponse.detail = err.message;
            return res.status(500).json(errorResponse.toJson());
          }
          var earlyAlert = results.rows[0];
          return res.status(200).json({ earlyAlert });

        });

  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }

};

let getEarlyAlertForm = async (req, res) => {

  try {

    var sourceType = await db.query('SELECT id_tipo_fuente::integer AS answer_id, nombre_tipo_fuente AS answer FROM sat_tipo_fuente WHERE estado = 1 ORDER BY id_tipo_fuente ASC');
    sourceType = sourceType.rows;

    var source = await db.query('SELECT id_fuente::integer AS answer_id, nombre_fuente AS answer, id_tipo_fuente AS to_compare FROM sat_fuente WHERE estado = 1 ORDER BY id_fuente ASC');
    source = source.rows;

    var scenarios = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenarios ORDER BY id_escenario ASC');
    scenarios = scenarios.rows;

    var scenario = await db.query('SELECT id_escenario::integer AS answer_id, nombre_escenario AS answer FROM sat_escenario ORDER BY id_escenario ASC');
    scenario = scenario.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var conflictSituation = await db.query(`SELECT id_situacion_conflicto::integer AS answer_id, nombre_conflicto AS answer FROM sat_situacion_actual_conflicto WHERE estado = 1 ORDER BY id_situacion_conflicto ASC`);
    conflictSituation = conflictSituation.rows;

    var aggresionType = await db.query(`SELECT id_tipo_agresion::integer AS answer_id, nombre_agresion AS answer FROM sat_tipo_agresion WHERE estado = 1 ORDER BY id_tipo_agresion ASC`);
    aggresionType = aggresionType.rows;

    var law = await db.query(`SELECT id_cat_derecho::integer AS answer_id, descripcion AS answer FROM admi_cat_derecho WHERE est_reg = 'A'`);
    law = law.rows;

    var temporality = await db.query(`SELECT id_temporalidad::integer AS answer_id, nombre_temporalidad AS answer FROM sat_temporalidad WHERE estado = 1`);
    temporality = temporality.rows;

    var topics = await db.query(`SELECT id_tema::integer AS answer_id, nombre_tema AS answer FROM sat_temas WHERE estado = 1`);
    topics = topics.rows;

    var subTopics = await db.query(`SELECT id_subtema::integer AS answer_id, nombre_subtema AS answer, id_tema::integer AS to_compare
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

    var profileActors = await db.query(`SELECT id_perfil_actor::integer AS answer_id, nombre_actor AS answer FROM sat_perfil_actores WHERE estado = 1`);
    profileActors = profileActors.rows;

    var actionsFact = await db.query(`SELECT id_acciones_hecho::integer AS answer_id, nombre_hecho AS answer FROM sat_acciones_hecho WHERE estado = 1`);
    actionsFact = actionsFact.rows;

    var sections = [];

    var tipofuente = {
      section_id: "tipofuente",
      questions: [
        {
          question_id: "id_tipo_fuente",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_fuente",
            section_id: "tipofuente"
          },
          question: "Tipo de Fuente",
          answers: sourceType
        },
        {
          question_id: "id_fuente",
          required: true,
          question_type: "closed",
          is_child: true,
          question: "Fuente",
          all_answers: source
        },
        
      ]
    }

    //Prensa Escrita
    var newspapers = {
      section_id: "newspapers",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 1
      },
      section_title: "Prensa escrita",
      questions: [
        {
          question_id: "titulo_noticia",
          question_type: "open",
          question: "Titulo de la noticia"
        },
        {
          question_id: "nombre_medio_prensa",
          question_type: "open",
          question: "Nombre del medio"
        },
        {
          question_id: "paginas_prensa",
          question_type: "open",
          question: "Páginas"
        },
        {
          question_id: "autor_prensa",
          question_type: "open",
          question: "Autor/a"
        },
        {
          question_id: "fecha_publicacion_prensa",
          question_type: "date",
          question: "Fecha de publicación",
          type: "date",
          max: moment().format("YYYY-MM-DD")
          
        },
        {
          question_id: "fotografia_prensa",
          question_type: "image",
          question: "Fotografía"
        }
      ]
    }

    //Radio Tv
    var radioAndTv = {
      section_id: "radioAndTv",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 2
      },
      section_title: "Radio/TV",
      questions: [
        {
          question_id: "nombre_medio_radio",
          question_type: "open",
          question: "Nombre del medio"
        },
        {
          question_id: "canal_radio",
          question_type: "open",
          question: "Canal/Emisora"
        },
        {
          question_id: "nombre_programa_radio",
          question_type: "open",
          question: "Nombre del programa"
        },
        {
          question_id: "fecha_emision_radio",
          question_type: "date",
          question: "Fecha y Hora de emisión",
          type: "datetime",
          max: moment().format("YYYY-MM-DD")
        }
      ]
    }

    //Social Media
    var socialMedia = {
      section_id: "socialMedia",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [3, 4]
      },
      section_title: "Redes sociales/medios digitales",
      questions: [
        {
          question_id: "titulo_redes",
          question_type: "open",
          question: "Titulo de la noticia"
        },
        {
          question_id: "nombre_red_social",
          question_type: "open",
          question: "Nombre de la red o medio"
        },
        {
          question_id: "url_red_social",
          question_type: "open",
          question: "URL"
        },
        {
          question_id: "fecha_pub_red_social",
          question_type: "date",
          question: "Fecha de publicación",
          type: "date",
          max: moment().format("YYYY-MM-DD")
        },
        {
          question_id: "pantalla_red_social",
          question_type: "image",
          question: "Captura de pantalla"
        }
      ]
    }

    //Colectivos
    var collectives = {
      section_id: "collectives",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [5, 6, 7]
      },
      section_title: "Colectivos",
      questions: [
        {
          question_id: "nombre_colectivo",
          question_type: "open",
          question: "Nombre colectivo"
        },
        {
          question_id: "nombre_contacto_colectivo",
          question_type: "open",
          question: "Nombre contacto"
        },
        {
          question_id: "telefono_colectivo",
          question_type: "open",
          question: "Teléfono contacto"
        }
      ]
    }

    //Organizacion Internacionales  
    var internationalOrganization = {
      section_id: "internationalOrganization",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [12, 13, 16]
      },
      section_title: "Organizaciones internacionales",
      questions: [
        {
          question_id: "nombre_organismo",
          question_type: "open",
          question: "Nombre Organización"
        },
        {
          question_id: "nombre_contacto_organismo",
          question_type: "open",
          question: "Nombre contacto"
        },
        {
          question_id: "correo_organismo",
          question_type: "open",
          question: "Correo"
        },
        {
          question_id: "telefono_organismo",
          question_type: "open",
          question: "Teléfono contacto"
        },
        {
          question_id: "datos_organismo",
          question_type: "open",
          question: "Datos adicionales",
          max_lines: 6
        }
      ]
    }

    //Sistema de mensajeria
    var messagingSystem = {
      section_id: "messagingSystem",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 14
      },
      section_title: "Sistemas de mensajería",
      questions: [
        {
          question_id: "nombre_mensajeria",
          question_type: "open",
          question: "Nombre mensajeria"
        },
        {
          question_id: "nombre_contacto_mensajeria",
          question_type: "open",
          question: "Nombre contacto"
        },
        {
          question_id: "contacto_mensajeria",
          question_type: "open",
          question: "Contacto"
        },
        {
          question_id: "datos_mensajeria",
          question_type: "open",
          question: "Datos adicionales",
          max_lines: 6
        },
        {
          question_id: "fotografia_mensajeria",
          question_type: "image",
          question: "Captura de pantalla"
        }
      ]
    }

    //Insituciones Gubernamentales
    var governmentInstitutions = {
      section_id: "governmentInstitutions",
      dependent_multiple: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "containInt",
        "answer": [8, 9, 10, 11]
      },
      section_title: "Instituciones Gubernamentales",
      questions: [
        {
          question_id: "nombre_inst_gub",
          question_type: "open",
          question: "Nombre Organización"
        },
        {
          question_id: "contacto_inst_gub",
          question_type: "open",
          question: "Nombre contacto"
        },
        {
          question_id: "correo_inst_gub",
          question_type: "open",
          question: "Correo"
        },
        {
          question_id: "telefono_inst_gub",
          question_type: "open",
          question: "Teléfono Contacto"
        },
        {
          question_id: "datos_inst_gub",
          question_type: "open",
          question: "Datos Adicionales",
          max_lines: 6
        }
      ]
    }

    //Otras
    var other = {
      section_id: "other",
      dependent: true,
      dependent_section_id: "tipofuente",
      dependent_question_id: "id_fuente",
      dependent_answer: {
        "type": "numeric",
        "answer": 15
      },
      section_title: "Otras",
      questions: [
        {
          question_id: "otras_detalle",
          question_type: "open",
          question: "Detalle",
          max_lines: 6
        },
        {
          question_id: "otras_adicionales",
          question_type: "open",
          question: "Datos adicionales",
          max_lines: 6
        }
      ]
    }

    //Información relacionada al hecho
    var factInformation = {
      section_id: "factInformation",
      section_title: "Información relacionada al hecho/situación/problema",
      bold_title: true,
      questions: [
        {
          question_id: "fecha_hechos",
          required: true,
          question_type: "date",
          question: "Fecha y hora del hecho/Situación/Problema",
          type: "datetime",
          max: moment().format("YYYY-MM-DD")
        },
        {
          question_id: "fecha_futura_hechos",
          question_type: "switch",
          question: "Fecha Futura"
        },
        {
          question_id: "fecha_reporte",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question_type: "date",
          question: "Fecha de reporte del hecho/Situación/Problema"
        }
      ]
    }

    //Lugar especifico del hecho
    var specificPlace = {
      section_id: "specificPlace",
      section_title: "Lugar específico del hecho/Situación/Problema",
      questions: [
        {
          question_id: "id_pais",
          enabled: false,
          question_type: "open",
          question: "Pais",
          answer: "El Salvador"
        },
        {
          question_id: "id_departamento",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_municipio",
            section_id: "specificPlace"
          },
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          is_child: true,
          required: true,
          question: "Municipio",
          all_answers: municipality
        },
        {
          question_id: "id_tipo_zona",
          question_type: "closed",
          question: "Tipo de Zona",
          answers: typeZone
        },
        {
          question_id: "id_escenarios",
          question_type: "closed",
          question: "Escenarios",
          answers: scenarios
        },
        {
          question_id: "descripcion_hechos",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Breve descripción del hecho/Situación/Problema",
          limit: 500
        },
        {
          question_id: "id_derecho",
          question_type: "closed",
          required: true,
          question: "Derecho",
          answers: law
        },

        {
          question_id: "id_temporalidad",
          question_type: "closed",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Temporalidad",
          answers: temporality
        },
        {
          question_id: "cantida",
          question_type: "numeric",
          dependent: true,
          dependent_section_id: "factInformation",
          dependent_question_id: "fecha_futura_hechos",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Cantidad"
        },
        {
          question_id: "id_tematica_relacionada",
          question_type: "closed",
          has_child: true,
          required: true,
          principal_child: {
            question_id: "id_sub_tematica",
            section_id: "specificPlace"
          },
          children: [
            {
              question_id: "id_situacion_conflictiva",
              section_id: "specificPlace"
            },
            {
              question_id: "id_criterio",
              section_id: "specificPlace"
            }
          ],
          question: "Temática",
          answers: topics
        },
        {
          question_id: "id_sub_tematica",
          question_type: "closed",
          required: true,
          has_child: true,
          is_child: true,
          principal_child: {
            question_id: "id_situacion_conflictiva",
            section_id: "specificPlace"
          },
          children: [
            {
              question_id: "id_criterio",
              section_id: "specificPlace"
            }
          ],
          question: "Sub Temática",
          all_answers: subTopics
        },
        {
          question_id: "id_situacion_conflictiva",
          question_type: "closed",
          required: true,
          has_child: true,
          is_child: true,
          principal_child: {
            question_id: "id_criterio",
            section_id: "specificPlace"
          },
          question: "Situación conflictiva",
          all_answers: conflictSituations
        },
        {
          question_id: "id_criterio",
          required: true,
          question_type: "closed",
          is_child: true,
          question: "Criterio",
          all_answers: criteria
        },
        {
          question_id: "antecedentes_hecho",
          question_type: "open",
          max_lines: 6,
          question: "Antecedente del hecho/Situación/Problema"
        }
      ]
    }

    //Partes Involucradas Directamente
    var partiesInvolved = {
      section_id: "partiesInvolved",
      section_title: "Partes involucradas directamente",
      questions: [
        {
          question_id: "poblacion_afectada",
          question_type: "open",
          required: true,
          question: "Población afectada"
        },
        {
          question_id: "contraparte",
          question_type: "open",
          required: true,
          question: "Contraparte"
        },
        {
          question_id: "id_perfil_actor",
          question_type: "closed",
          multi_select: true,
          required: true,
          question: "Perfil de actores",
          answers: profileActors
        },
        {
          question_id: "id_grupo_vulnerable",
          required: true,
          question_type: "closed",
          multi_select: true,
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup
        },
        {
          question_id: "demanda_solicitud",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Demanda o solicitud de la población afectada a las autoridades competentes",
          hint: "Escriba aqui..."
        },
        {
          question_id: "postura_autoridades",
          question_type: "open",
          max_lines: 6,
          question: "Postura de las autoridades y/o contrapartes",
          hint: "Escriba aqui..."
        }
      ]
    }

    //Población afectada Indeterminada/Determinada ****************
    var affectedPopulation = {
      section_id: "affectedPopulation",
      section_title: "Población afectada Indeterminada/Determinada",
      bold_title: true,
      questions: []
    }

    //Poblacion Determinada
    var determinedPopulation = {
      section_id: "determinedPopulation",
      section_title: "Población determinada",
      questions: [
        {
          question_id: "poblacion_ninos",
          question_type: "numeric",
          question: "Niños"
        },
        {
          question_id: "poblacion_ninas",
          question_type: "numeric",
          question: "Niñas"
        },
        {
          question_id: "adolecentes_mujeres",
          question_type: "numeric",
          question: "Adolecentes Mujeres"
        },
        {
          question_id: "adolecentes_hombres",
          question_type: "numeric",
          question: "Adolecentes Hombres"
        },
        {
          question_id: "poblacion_hombres",
          question_type: "numeric",
          question: "Hombres"
        },
        {
          question_id: "poblacion_mujeres",
          question_type: "numeric",
          question: "Mujeres"
        },
        {
          question_id: "poblacion_hombre_mayor",
          question_type: "numeric",
          question: "Hombres adulto mayor"
        },
        {
          question_id: "poblacion_mujer_mayor",
          question_type: "numeric",
          question: "Mujeres adulto mayor"
        }

      ]
    }

    //Poblacion Determinada
    var numberPopulationDetermined = {
      section_id: "numberPopulationDetermined",
      section_title: "Población indeterminada",
      questions: [
        {
          question_id: "cantidad_aproximada",
          question_type: "numeric",
          question: "Cantidad aproximada"
        }
      ]
    }

    //Valoracion de Fase de Conflicto
    var conflictPhaseAssessment = {
      section_id: "conflictPhaseAssessment",
      section_title: "Valoración de fase del conflicto",
      questions: [
        {
          question_id: "id_acciones_hecho",
          required: false,
          question_type: "closed",
          question: "Acciones del Hecho",
          answers: actionsFact
        },
        {
          question_id: "proteccion_vigente",
          question_type: "switch",
          question: "¿Existen medidas de protección vigentes? "
        },
        {
          question_id: "hubo_agresion",
          question_type: "switch",
          question: "¿Se ha producido algún tipo de agresión?"
        },
        {
          question_id: "id_tipo_agresion",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "hubo_agresion",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question_type: "closed",
          multi_select: true,
          question: "Tipo de agresión",
          answers: aggresionType
        },
        {
          question_id: "dialogo_conflicto",
          question_type: "switch",
          question: "¿Existe disposición al diálogo?"
        },
        {
          question_id: "medida_conflicto",
          question_type: "switch",
          question: "¿Se ha expresado/anunciado la realización de algún tipo de medida de presión?"
        },
        {
          question_id: "dialogo_roto_conflicto",
          question_type: "switch",
          question: "¿Se rompió dialogo?"
        },
        {
          question_id: "crisis_conflicto",
          question_type: "switch",
          question: "¿Hubo crisis?"
        },
        {
          question_id: "id_acciones_hecho_anterior",
          required: false,
          question_type: "closed",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "crisis_conflicto",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "Acciones del Hecho Anterior",
          answers: actionsFact
        },
        {
          question_id: "resolucion_conflicto",
          question_type: "switch",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "crisis_conflicto",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "¿Hubo mecanismos de resolución del conflicto?"
        },
        {
          question_id: "id_situacion_conflicto",
          question_type: "closed",
          question: "Situación actual del conflicto",
          answers: conflictSituation
        },
        {
          question_id: "cant_persona_involucrada",
          question_type: "switch",
          question: "¿A disminuido la cantidad de personas involucradas?"
        },
        {
          question_id: "presencia_fuerza_publica",
          question_type: "switch",
          question: "¿Hubo Presencia de fuerzas públicas"
        },
        {
          question_id: "intervencion_fuerza_publica",
          question_type: "switch",
          dependent: true,
          dependent_section_id: "conflictPhaseAssessment",
          dependent_question_id: "presencia_fuerza_publica",
          dependent_answer: {
            "type": "boolean",
            "answer": true
          },
          question: "¿Hubo Intervencion de fuerzas públicas"
        }
      ]
    }


    sections.push(tipofuente, newspapers, radioAndTv, socialMedia, collectives, internationalOrganization, messagingSystem,
      governmentInstitutions, other, factInformation, specificPlace, partiesInvolved, affectedPopulation, determinedPopulation, numberPopulationDetermined,
      conflictPhaseAssessment);


    var formEarlyAlert = {
      form_id: 0,
      sections: sections
    }

    console.log(formEarlyAlert);

    return res.status(200).json({
      form: formEarlyAlert
    })

  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }



};

let getFormToAnalyze = async (req, res) => {
  const { id_alerta_temprana } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener el formulario.", instance: "early-alert/getAnalyzedForm" });

    var earlyAlert = await db.query(`SELECT id_fase_conflicto, id_tipo_alerta, id_accion_pddh, analisis, notificar, texto_mensaje, analizada AS analyzed FROM sat_alerta_temprana WHERE id_alerta_temprana = ${id_alerta_temprana}`);
    earlyAlert = earlyAlert.rows[0];

    var fases_conflicto = await db.query('SELECT id_fase_conflicto::integer AS answer_id, nombre_fase AS answer FROM sat_fase_conflicto WHERE estado = 1');
    fases_conflicto = fases_conflicto.rows;

    var tipos_alerta = await db.query('SELECT id_tipo_alerta::integer AS answer_id, nombre_alerta AS answer FROM sat_tipo_alerta WHERE estado = 1');
    tipos_alerta = tipos_alerta.rows;

    var acciones_pddh = await db.query('SELECT id_accion_pddh::integer AS answer_id, nombre_accion AS answer FROM sat_accion_pddh WHERE estado = 1');
    acciones_pddh = acciones_pddh.rows;

    var administrative_unit = await db.query(`SELECT id_unidad_administrativa:: integer AS answer_id, nombre_unidad AS answer
    FROM sat_unidad_administrativa WHERE estado = 1`);
    administrative_unit = administrative_unit.rows;


    var section = {
      section_id: "tipofuente",
      questions: [
        {
          question_id: "id_fase_conflicto",
          question_type: "closed",
          enabled: false,
          question: "Fases del conflicto",
          answers: fases_conflicto,
          answer: Number.parseInt(earlyAlert.id_fase_conflicto)
        },
        {
          question_id: "id_tipo_alerta",
          question_type: "closed",
          enabled: false,
          question: "Tipo de alerta",
          answers: tipos_alerta,
          answer: Number.parseInt(earlyAlert.id_tipo_alerta)
        },
        {
          question_id: "id_accion_pddh",
          question_type: "closed",
          question: "Acciones PDDH",
          answers: acciones_pddh,
          answer: Number.parseInt(earlyAlert.id_accion_pddh)
        },
        {
          question_id: "analisis",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Analisis",
          answer: earlyAlert.analisis
        },
        {
          question_id: "notificar",
          question_type: "closed",
          question: "Notificar a:",
          answers: administrative_unit,
          answer: Number.parseInt(earlyAlert.notificar)
        },
        {
          question_id: "texto_mensaje",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Texto en el Mensaje",
          answer: earlyAlert.texto_mensaje
        }
      ]
    }

    var sections = [];
    sections.push(section);

    var formEarlyAlert = {
      form_id: id_alerta_temprana,
      analyzed: earlyAlert.analyzed,
      sections
    }


    return res.status(200).json({
      form: formEarlyAlert
    });

  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }


};

let analyzeEarlyAlert = async (req, res) => {
  const { id_alerta_temprana } = req.params;
  const { id_accion_pddh, analisis, notificar, texto_mensaje } = req.body;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar analizar la Alerta.", instance: "early-alert/analyzeEarlyAlert" });

    let administrativUnit = await db.query(`SELECT nombre_unidad, correo_prinicipal, correo_secundario
    FROM sat_unidad_administrativa WHERE id_unidad_administrativa = $1`, [notificar]);
    administrativUnit = administrativUnit.rows[0];

    var correo_principal = administrativUnit.correo_prinicipal;

    await db.query(`UPDATE sat_alerta_temprana SET analizada = true, id_accion_pddh = $1, analisis = $2, notificar = $3, texto_mensaje = $4 WHERE id_alerta_temprana = $5`, [id_accion_pddh, analisis, notificar, texto_mensaje, id_alerta_temprana], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var earlyAlert = results.rows[0];

        //--- Envio de correo electronico
        sendemail('"NOTIFICACIÓN DEL SISTEMA SAT" <correo@nextdeployed.com>', correo_principal, 'ANÁLISIS DE ALERTA', `Por este medio se le notifica que se ha asignado un caso desde el Sistema SAT, el cual se encuentra en la etapa de análisis del cual se considera usted debe tener conocimiento, por lo que puede ingresar al Sistema SAT para mayor detalle. Mensaje Ingresado ${texto_mensaje}`).then((result) => {
          console.log(result);
          console.log("correo enviado.");
        }, function (error) {
          console.log(error.stack);
        });

        return res.status(200).json({ earlyAlert });
      }
    });
  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }


};

let searchEarlyAlert = async (req, res) => {
  const { delegate } = req.query;

  try {
    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar procesar su busqueda.", instance: "early-alert/searchEarlyAlert" });

    await db.query(`SELECT id_alerta_temprana::integer AS form_id, analizada AS analyzed FROM sat_alerta_temprana WHERE texto_mensaje ILIKE '%${delegate}%'`, (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      }

      var earlyAlerts = results.rows;
      return res.status(200).json({ earlyAlerts });

    });

  } catch (e) {
    return res.status(500).json(errorResponse.toJson());
  }


};

let createEarlyAlert = async (req, res) => {
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

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar crear la Alerta.", instance: "early-alert/createEarlyAlert" });

    var cantidad_poblacion_afectada = poblacion_ninos + poblacion_ninas + adolecentes_mujeres + adolecentes_hombres + poblacion_hombres + poblacion_mujeres + poblacion_hombre_mayor + poblacion_mujer_mayor + cantidad_aproximada;
    var cod_usu = req.user.user_id;

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
        fecha_publicacion_prensa, fotografia_prensa, nombre_medio_radio, canal_radio, nombre_programa_radio,
        fecha_emision_radio, titulo_redes, nombre_red_social, url_red_social, fecha_pub_red_social,
        pantalla_red_social, nombre_colectivo, nombre_contacto_colectivo, telefono_colectivo, nombre_organismo,
        nombre_contacto_organismo, correo_organismo, telefono_organismo, datos_organismo, nombre_inst_gub,
        contacto_inst_gub, correo_inst_gub, telefono_inst_gub, datos_inst_gub, nombre_mensajeria, nombre_contacto_mensajeria,
        contacto_mensajeria, datos_mensajeria, fotografia_mensajeria, otras_detalle, otras_adicionales,
        fecha_hechos, fecha_futura_hechos, fecha_reporte, pais, id_departamento, id_municipio, id_tipo_zona, id_escenarios,
        descripcion_hechos, id_derecho, id_tematica_relacionada, id_sub_tematica, id_situacion_conflictiva,
        id_criterio, id_temporalidad, cantidad, id_escenario, antecedentes_hecho, poblacion_afectada, contraparte,
        id_perfil_actor, id_grupo_vulnerable, demanda_solicitud, postura_autoridades, poblacion_ninos, poblacion_ninas, adolecentes_mujeres, adolecentes_hombres,
        poblacion_hombres, poblacion_mujeres, poblacion_hombre_mayor, poblacion_mujer_mayor, cantidad_aproximada, cantidad_poblacion_afectada, id_acciones_hecho,
        proteccion_vigente, hubo_agresion, id_tipo_agresion, dialogo_conflicto, medida_conflicto, dialogo_roto_conflicto, crisis_conflicto,
        id_acciones_hecho_anterior, resolucion_conflicto, id_situacion_conflicto, cant_persona_involucrada,
        presencia_fuerza_publica, intervencion_fuerza_publica, cod_usu], async (err, results) => {
          if (err) {
            console.log(err);
            errorResponse.detail = err.message;
            return res.status(500).json(errorResponse.toJson());
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


            insertStats(id_departamento, id_municipio, fecha_hechos, fecha_hechos, id_criterio, intervencion_fuerza_publica, proteccion_vigente, id_temporalidad, cantidad, cantidad_poblacion_afectada, hubo_agresion, presencia_fuerza_publica, crisis_conflicto, fecha_futura_hechos, cant_persona_involucrada, dialogo_roto_conflicto);


            return res.status(201).json({
              earlyAlerts
            });

          }
        });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(errorResponse.toJson());
  }
};

let insertStats = async (id_departamento, id_municipio, fecha_hecho, fecha_ingreso, id_criterio, intervencion_fuerza_publica, proteccion_vigente, id_temporalidad, cantidad, cantidad_poblacion_afectada, hubo_agresion, presencia_fuerza_publica, crisis_conflicto, fecha_futura_hechos, cant_persona_involucrada, dialogo_roto_conflicto) => {

  if (id_criterio == 55) {
    console.log('entro ------ criterio 55');
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
  } else if (id_criterio == 62 && !intervencion_fuerza_publica) {
    console.log('entro con criterio 62 y verdadero');
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (2, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 62 && intervencion_fuerza_publica || id_criterio == 63 && intervencion_fuerza_publica) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (2, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }
  else if (id_criterio == 44 && proteccion_vigente) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (4, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 7 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 6 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 35 && id_temporalidad == 21 && cantidad < 24) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }
  //Nunca se va a cumplir, validar esta verificacion
  else if (id_criterio == 34 && !hubo_agresion && !presencia_fuerza_publica && (presencia_fuerza_publica && !intervencion_fuerza_publica) && (!crisis_conflicto || fecha_futura_hechos) || id_criterio == 35 && id_temporalidad == 2 && cantidad < 4 || id_criterio == 4 && id_temporalidad == 3 && cantidad < 2) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 34 && hubo_agresion && presencia_fuerza_publica && intervencion_fuerza_publica && id_temporalidad == 2 && cantidad < 31 || id_criterio == 35 && id_temporalidad == 2 && cantidad > 4 || id_criterio == 4 && id_temporalidad == 3 && cantidad > 1) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 34 && cant_persona_involucrada) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (5, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 17 && id_temporalidad == 2 && cantidad > 90) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 18 && !hubo_agresion && !presencia_fuerza_publica && (presencia_fuerza_publica && !intervencion_fuerza_publica) && (!crisis_conflicto && dialogo_roto_conflicto)) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 18 && hubo_agresion && presencia_fuerza_publica && intervencion_fuerza_publica || id_criterio == 20 && hubo_agresion && presencia_fuerza_publica && intervencion_fuerza_publica) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (6, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if ((id_criterio == 18 || id_criterio == 20) && !hubo_agresion && crisis_conflicto && !presencia_fuerza_publica && (presencia_fuerza_publica && intervencion_fuerza_publica)) {
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
  } else if (id_criterio == 16 && fecha_futura_hechos || (!hubo_agresion && !presencia_fuerza_publica && (presencia_fuerza_publica && !intervencion_fuerza_publica && id_temporalidad == 2 && cantidad < 8))) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 16 && !fecha_futura_hechos && hubo_agresion && presencia_fuerza_publica && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (8, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 16 && !fecha_futura_hechos && !hubo_agresion && !presencia_fuerza_publica || (presencia_fuerza_publica && !intervencion_fuerza_publica) && id_temporalidad == 2 && cantidad < 8) {
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
  } else if (id_criterio == 37 && !hubo_agresion && !presencia_fuerza_publica || (presencia_fuerza_publica && !intervencion_fuerza_publica) && !crisis_conflicto && dialogo_roto_conflicto && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 37 && hubo_agresion && presencia_fuerza_publica && intervencion_fuerza_publica && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 37 && !hubo_agresion && !presencia_fuerza_publica || (presencia_fuerza_publica && !intervencion_fuerza_publica) && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (9, $1, $2, 3, 4, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 68 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 76 && id_temporalidad == 2 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 76 && cantidad_poblacion_afectada > 1 && cantidad_poblacion_afectada < 16 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 78 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 76 && id_temporalidad == 2 && cantidad > 15 || id_criterio == 78 && cantidad < 8) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (12, $1, $2, 2, 3, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 22 && id_temporalidad == 2 && cantidad < 30 || id_criterio == 21 && id_temporalidad == 2 && cantidad < 30) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (17, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 25 && !hubo_agresion && !presencia_fuerza_publica || (presencia_fuerza_publica && !intervencion_fuerza_publica) && !crisis_conflicto) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (17, $1, $2, 1, 2, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  } else if (id_criterio == 46 && id_temporalidad == 2 && cantidad < 8 || id_criterio == 47 && id_temporalidad == 2 && cantidad < 16) {
    db.query(`INSERT INTO public.sat_estadistica_indicadores(id_indicador, id_departamento, id_municipio, tipo_alerta, fase_conflicto, fecha_hecho, fecha_ingreso)
    VALUES (19, $1, $2, 1, 1, $3, $4)`, [id_departamento, id_municipio, fecha_hecho, fecha_ingreso]);
    return;
  }

}

let getRelatedCases = async (req, res) => {
  const { id_alerta_temprana } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar obtener los casos relacionados", instance: "Early-Alert/getRelatedCases" });

    await db.query(`SELECT id_alerta_temprana::integer AS form_id,
    CASE WHEN analizada IS null THEN false ELSE analizada END AS analyzed 
    FROM sat_alerta_temprana 
    WHERE id_alerta_temprana = ANY(SELECT id_hijo FROM sat_alerta_temprana_relacionados WHERE id_padre = $1)
    ORDER BY id_alerta_temprana ASC
    `, [id_alerta_temprana], (err, results) => {
      if (err) {
        console.log(err.message);
        errorResponse.detail = err.message;
        return res.status(500).json(errorResponse.toJson());
      } else {
        var related_cases = results.rows;
        return res.status(200).json({ related_cases });
      }
    });
  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }
}

let removeRelatedCase = async (req, res) => {
  const { id_padre, id_hijo } = req.params;

  var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar remover el caso relacionado.", instance: "Early-Alert/removeRelatedCase" });

  try {

    await db.query(`DELETE FROM sat_alerta_temprana_relacionados WHERE id_padre = $1 AND id_hijo = $2`, [id_padre, id_hijo], (err, results) => {
      if (err) {
        console.log(err.message);
        errorResponse.detail = err.message;
        return res.status(500).json(errorResponse.toJson());
      } else {

        return res.status(200).json();
      }
    });
  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }

}

let searchForRelatedCase = async (req, res) => {
  const { delegate } = req.query;
  const { id_padre } = req.params;

  try {
    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar procesar su busqueda.", instance: "Early-Alert/searchForRelatedCase" });

    await db.query(`SELECT id_alerta_temprana::integer AS form_id, 
    analizada AS analyzed 
    FROM sat_alerta_temprana  
    WHERE NOT EXISTS ( SELECT id_hijo FROM sat_alerta_temprana_relacionados WHERE id_hijo = id_alerta_temprana)
    AND id_alerta_temprana::TEXT LIKE '${delegate}%'
    ORDER BY id_alerta_temprana ASC
    `,
      (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        }

        var earlyAlerts = results.rows;
        return res.status(200).json({ earlyAlerts });

      });

  } catch (e) {
    return res.status(500).json(errorResponse.toJson());
  }


}

let addRelatedCase = async (req, res) => {
  const { id_padre, id_hijo } = req.params;

  var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar agregar el caso relacionado.", instance: "Early-Alert/addRelatedCase" });

  try {

    await db.query(`INSERT INTO sat_alerta_temprana_relacionados (id_padre,id_hijo) VALUES ($1,$2) RETURNING *`, [id_padre, id_hijo], (err, results) => {
      if (err) {
        console.log(err.message);
        errorResponse.detail = err.message;
        return res.status(500).json(errorResponse.toJson());
      } else {

        var result = results.rows[0];

        return res.status(200).json({ result });
      }
    });
  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }

}

//Enviar Alerta a Analizar
let SendAlerttoAnalyze = async (req, res) => {

  const { id_alerta_temprana } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Early-Alert", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al enviar a analizar la Alerta.", instance: "early-alert/SendAlerttoAnalyze" });

    await db.query(`UPDATE sat_alerta_temprana SET enviada_analizar = true 
    WHERE id_alerta_temprana = $1 RETURNING*`, [id_alerta_temprana], (err, results) => {
      if (err) {
        console.log(err.message);
        errorResponse.detail = err.message;
        return res.status(500).json(errorResponse.toJson());
      } else {
        var Alert = results.rows[0];
        return res.status(200).json({
          Alert
        });
      }
    });
  } catch (error) {
    return res.status(500).json(errorResponse.toJson());
  }

};

module.exports = {
  earlyAlertsList,
  createEarlyAlert,
  getById,
  updateEarlyAlert,
  getEarlyAlertForm,
  getFormToAnalyze,
  analyzeEarlyAlert,
  searchEarlyAlert,
  getRelatedCases,
  removeRelatedCase,
  searchForRelatedCase,
  addRelatedCase,
  SendAlerttoAnalyze,
  getFormVersion
}