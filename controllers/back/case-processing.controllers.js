const db = require('../../config/db');
const log = require('@lib/catch-error');
const ErrorModel = require('@models/errorResponse');
const dateFormat = require('dateformat');
const moment = require('moment');


//Tramitacion de Casos

let getFormVersion = (req, res) => {

  let version = parseFloat("2.4");

  return res.status(200).json({ version });
}

let getInvolverFormVersion = (req, res) => {

  let version = parseFloat("1.8");

  return res.status(200).json({ version });
}

let getcaseProcesingFormList = async (req, res) => {
  const { offset } = req.query;

  var cod_usu = req.user.user_id;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/getcaseProcesingFormList" });
    await db.query(`SELECT id_caso_temp::numeric AS form_id 
    FROM tcdh_caso_temp 
    WHERE cod_usu_ing = $1 AND marca is null
    ORDER BY id_caso_temp DESC LIMIT 25 OFFSET $2
    `, [cod_usu, offset], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var cases = results.rows;


        return res.status(200).json({
          cases
        });
      }
    });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getcaseProcesingFormList', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
}

let getCaseProcessingForm = async (req, res) => {

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcessingForm" });

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais ORDER BY id_pais ASC`);
    country = country.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    var sections = [];

    // Seccion --- Via de entrada
    var meansEntry = {
      section_id: "meansEntry",
      bold_title: true,
      section_title: "Via de Entrada",
      questions: [
        {
          question_id: "fec_hora",
          question_type: "date",
          max: moment().format("YYYY-MM-DD"),
          required: true,
          answer: registration_date,
          question: "Fecha de ingreso"
        },
        {
          question_id: "tipo_via_entrada",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "via_entrada",
            section_id: "meansEntry"
          },
          question: "Tipo Vía Entrada",
          answers: [
            { answer_id: 'V', answer: 'Verbal' },
            { answer_id: 'E', answer: 'Escrita' },
            { answer_id: 'O', answer: 'De Oficio' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          question: "Via Entrada",
          answers: [
            { answer_id: 'P', answer: 'Persona', to_compare: "V" },
            { answer_id: 'T', answer: 'Telefonica', to_compare: "V" },
            { answer_id: 'O', answer: 'Otra', to_compare: "V" },

            { answer_id: 'F', answer: 'Fax', to_compare: "E" },
            { answer_id: 'E', answer: 'E-mail', to_compare: "E" },
            { answer_id: 'C', answer: 'Carta', to_compare: "E" },
            { answer_id: 'O', answer: 'Otra', to_compare: "E" },

            { answer_id: 'S', answer: 'Prensa Escrita', to_compare: "O" },
            { answer_id: 'R', answer: 'Radio', to_compare: "O" },
            { answer_id: 'V', answer: 'Television', to_compare: "O" },
            { answer_id: 'I', answer: 'Internet', to_compare: "O" },
            { answer_id: 'M', answer: 'Informe', to_compare: "O" },
            { answer_id: 'A', answer: 'Aviso', to_compare: "O" },
            { answer_id: 'N', answer: 'Noticia', to_compare: "O" },
            { answer_id: 'O', answer: 'Otra', to_compare: "O" },

          ]
        },
        //Se cambio el orden que estaba, estaba antes de fuente. 
        {
          question_id: "otra_via_entrada",
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          max_lines: 6,
          question: "Otra vía Entrada"
        },
        {
          question_id: "fuente",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          question: "Fuente Emisión"
        },
        {
          question_id: "fec_emision",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "date_before",
          question: "Fecha Emisión"
        },
        {
          question_id: "tit_emision",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          question: "Título Emisión"
        },
        {
          question_id: "fec_recepcion",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "date_before",
          question: "Fecha Recepción"
        },
        {
          question_id: "otra_via_entrada",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          max_lines: 6,
          question: "Otra vía Entrada"
        }
      ]
    };



    //Lugar y Hecho
    var institutionInformation = {
      section_id: "institutionInformation",
      section_title: "Lugar y Hecho",
      questions: [
        {
          question_id: "fec_hecho",
          question_type: "date_time_before",
          required: true,
          question: "Fecha y Hora Hecho"
        },
        {
          question_id: "fec_hor_hecho_aprox",
          question_type: "closed",
          required: true,
          question: "Fecha y Hora Hecho ES",
          answers: [
            { answer_id: 'A', answer: 'Fecha y Hora Exacta' },
            { answer_id: 'E', answer: 'Fecha y Hora Aproximada' },
            { answer_id: 'H', answer: 'Fecha Exacta y Hora Aproximada' },
            { answer_id: 'F', answer: 'Fecha Aproximada y Hora Exacta' }
          ]
        },
        {
          question_id: "id_pais_hecho",
          required: true,
          question_type: "closed_searchable_case_processing",//NO TOCAR
          question: "Pais",
          answer: "EL SALVADOR",
          answers: country
        },
        {
          question_id: "id_depto_hecho",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_mun_hecho",
            section_id: "institutionInformation"
          },
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_mun_hecho",
          required: true,
          is_child: true,
          question_type: "closed",
          question: "Municipio",
          all_answers: municipality
        },
        {
          question_id: "lugar",
          question_type: "open",
          required: true,
          max_lines: 6,
          question: "Lugar del Hecho",
        },
        {
          question_id: "hecho",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Descripcíon del Hecho",
        }

      ]
    }


    sections.push(meansEntry, institutionInformation);

    var formcasaProcessing = {
      form_id: 0,
      sections: sections
    }


    return res.status(200).json({
      form: formcasaProcessing
    })

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getCaseProcessingForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

// Create case 
let createCaseProcessing = async (req, res) => {
  const { tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, fec_hecho, id_depto_hecho,
    id_mun_hecho, lugar, hecho, fuente, fec_emision, tit_emision, fec_recepcion, id_pais_hecho } = req.body

  
  try {
    
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al guardar el tramite del caso.", instance: "case-processing/createCaseProcessing" });

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    var fecha = dateFormat(localDate, 'yyyy-mm-dd');

    var est_reg = 'R';
    var cod_usu = req.user.user_id;
    var user_name = req.user.name;
    var inst_user = req.user.id_ins_usuario;
    var depto_user = req.user.id_depto_usuario;
    var cod_user = req.user.codigo;


    var nueva_fec_hecho;

    if (fec_hecho == null || fec_hecho === "" || fec_hecho == undefined) {
      nueva_fec_hecho = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    } else {
      nueva_fec_hecho = fec_hecho
    }

    var hora = dateFormat(nueva_fec_hecho, 'HH:MM:ss');
    var hor_recepcion = dateFormat(registration_date, 'HH:MM:ss');

    let nuevo_id_pais_hecho = 0;
    if (id_pais_hecho == null || id_pais_hecho === "" || id_pais_hecho == undefined) {
      nuevo_id_pais_hecho = 0;
    } else {
      let nuevo_id_pais_hecho = await db.query(`SELECT id_pais, descripcion
    FROM admi_pais WHERE descripcion like '%${id_pais_hecho}'`);
    nuevo_id_pais_hecho = nuevo_id_pais_hecho.rows[0].id_pais;
    }

    await db.query(`INSERT INTO tcdh_caso_temp(
      hay_mas_vic_den, reg_ing_turno, en_turno, 
      fec_en_turno, tipo_via_entrada, via_entrada, otra_via_entrada, id_usu_asignado, fec_asignado, fecha, fec_hora,  
      fec_hor_hecho_aprox, fec_hecho, hor_hecho, id_depto_hecho, id_mun_hecho, lugar, hecho, est_reg, fec_est_reg, cod_usu_ing, 
      usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, fuente, fec_emision, tit_emision, fec_recepcion, hor_recepcion, id_pais_hecho, id_ins_mod, id_depto_asignado, cod_depto_ing, id_ins_ing, id_ins_asignado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) RETURNING *`,
      ['N', 'N', 'N', registration_date, tipo_via_entrada, via_entrada, otra_via_entrada, cod_usu, registration_date, fecha,
        fec_hora, fec_hor_hecho_aprox, nueva_fec_hecho, hora, id_depto_hecho, id_mun_hecho, lugar, hecho,
        est_reg, registration_date, cod_usu, user_name, registration_date, cod_usu, user_name, registration_date, fuente, fec_emision,
        tit_emision, fec_recepcion, hor_recepcion, nuevo_id_pais_hecho, inst_user, depto_user, cod_user, inst_user, inst_user], (err, results) => {
          if (err) {
            console.log(err.message);
            return res.status(500).json(errorResponse.toJson());
          } else {
            var caseProcessing = results.rows[0];
            return res.status(201).json({
              "case_id": caseProcessing.id_caso_temp
            });
          }
        });

  } catch (error) {
    console.log("error");
    console.log(error);
    log('src/controllers/back', 'case-processing', 'createCaseProcessing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let getCaseProcesingById = async (req, res) => {
  const { id_caso_temp } = req.params;

  let get_caso_temp = id_caso_temp;
  let id_caso = Number.parseInt(get_caso_temp);

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getCaseProcesingById" });

    var caseProcessing = await db.query(`SELECT * FROM tcdh_caso_temp WHERE id_caso_temp = $1`, [id_caso]);
    caseProcessing = caseProcessing.rows[0];

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows;


    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var sections = [];

    // Seccion --- Via de entrada
    var meansEntry = {
      section_id: "meansEntry",
      bold_title: true,
      section_title: "Via de Entrada",
      questions: [
        {
          question_id: "fec_hora",
          question_type: "date_time_before",
          required: true,
          question: "Fecha de ingreso",
          answer: caseProcessing.fec_hora
        },
        {
          question_id: "tipo_via_entrada",
          required: true,
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "via_entrada",
            section_id: "meansEntry"
          },
          question: "Tipo Vía Entrada",
          answer: caseProcessing.tipo_via_entrada,
          answers: [
            { answer_id: 'V', answer: 'Verbal' },
            { answer_id: 'E', answer: 'Escrita' },
            { answer_id: 'O', answer: 'De Oficio' }
          ]
        },
        {
          question_id: "via_entrada",
          question_type: "closed",
          question: "Via Entrada",
          is_child: true,
          answer: caseProcessing.via_entrada,
          all_answers: [
            { answer_id: 'P', answer: 'Persona', to_compare: "V" },
            { answer_id: 'T', answer: 'Telefonica', to_compare: "V" },
            { answer_id: 'O', answer: 'Otra', to_compare: "V" },

            { answer_id: 'F', answer: 'Fax', to_compare: "E" },
            { answer_id: 'E', answer: 'E-mail', to_compare: "E" },
            { answer_id: 'C', answer: 'Carta', to_compare: "E" },
            { answer_id: 'O', answer: 'Otra', to_compare: "E" },

            { answer_id: 'S', answer: 'Prensa Escrita', to_compare: "O" },
            { answer_id: 'R', answer: 'Radio', to_compare: "O" },
            { answer_id: 'V', answer: 'Television', to_compare: "O" },
            { answer_id: 'I', answer: 'Internet', to_compare: "O" },
            { answer_id: 'M', answer: 'Informe', to_compare: "O" },
            { answer_id: 'A', answer: 'Aviso', to_compare: "O" },
            { answer_id: 'N', answer: 'Noticia', to_compare: "O" },
            { answer_id: 'O', answer: 'Otra', to_compare: "O" }

          ]
        },
        {
          question_id: "otra_via_entrada",
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: "OV"
          },
          question_type: "open",
          question: "Otra vía Entrada",
          answer: caseProcessing.otra_via_entrada
        },
        {
          question_id: "fuente",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          question: "Fuente Emisión",
          answer: caseProcessing.fuente
        },
        {
          question_id: "fec_emision",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "date",
          question: "Fecha Emisión",
          answer: caseProcessing.fec_emision

        },
        {
          question_id: "tit_emision",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          question: "Título Emisión",
          answer: caseProcessing.tit_emision
        },
        {
          question_id: "fec_recepcion",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "date",
          min: moment().format("YYYY-MM-DD"),
          type: "date",
          format: "DD-MM-YYYY",
          question: "Fecha Recepción",
          answer: caseProcessing.fec_recepcion
        },
        {
          question_id: "otra_via_entrada",
          required: true,
          dependent: true,
          dependent_section_id: "meansEntry",
          dependent_question_id: "tipo_via_entrada",
          dependent_answer: {
            type: "text",
            answer: 'O'
          },
          question_type: "open",
          max_lines: 6,
          question: "Otra vía Entrada",
          answer: caseProcessing.otra_via_entrada
        }
      ]
    };


    //Lugar y Hecho
    var institutionInformation = {
      section_id: "institutionInformation",
      section_title: "Lugar y Hecho",
      questions: [
        {
          question_id: "fec_hecho",
          question_type: "date",
          type: "datetime",
          required: true,
          question: "Fecha y Hora Hecho",
          answer: caseProcessing.fec_hecho
        },
        {
          question_id: "fec_hor_hecho_aprox",
          question_type: "closed",
          required: true,
          question: "Fecha y Hora Hecho ES",
          answer: caseProcessing.fec_hor_hecho_aprox,
          answers: [
            { answer_id: 'A', answer: 'Fecha y Hora Exacta' },
            { answer_id: 'E', answer: 'Fecha y Hora Aproximada' },
            { answer_id: 'H', answer: 'Fecha Exacta y Hora Aproximada' },
            { answer_id: 'F', answer: 'Fecha Aproximada y Hora Exacta' }
          ]
        },
        {
          question_id: "id_pais_hecho",
          question_type: "closed",
          required: true,
          question: "Pais",
          //answer: Number.parseInt(caseProcessing.id_pais_hecho),
          answer: 62,
          answers: country
        },
        {
          question_id: "id_depto_hecho",
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_mun_hecho",
            section_id: "institutionInformation"
          },
          question: "Departamento",
          answer: Number.parseInt(caseProcessing.id_depto_hecho),
          answers: state
        },
        {
          question_id: "id_mun_hecho",
          question_type: "closed",
          is_child: true,
          question: "Municipio",
          answer: Number.parseInt(caseProcessing.id_mun_hecho),
          all_answers: municipality
        },
        {
          question_id: "lugar",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Lugar del Hecho",
          answer: caseProcessing.lugar
        },
        {
          question_id: "hecho",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Descripcíon del Hecho",
          answer: caseProcessing.hecho
        }

      ]
    }


    sections.push(meansEntry, institutionInformation);

    var formcasaProcessing = {
      form_id: caseProcessing.id_caso_temp,
      sections: sections
    }


    return res.status(200).json({
      form: formcasaProcessing
    })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getCaseProcesingById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

// Update Case 
let updateCaseProcesing = async (req, res) => {

  const { id_caso_temp } = req.params;

  const { tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, fec_hecho, id_depto_hecho,
    id_mun_hecho, lugar, hecho, fuente, fec_emision, tit_emision, fec_recepcion, nom_victima, nom_denunciante,
    id_pais_hecho } = req.body

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al actualizar el tramite del caso.", instance: "case-processing/updateCaseProcesing" });

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    var cod_usu = req.user.user_id;
    var user_name = req.user.name;
    var inst_user = req.user.id_ins_usuario;

    var nueva_fec_hecho;

    //fecha asignado y fecha
    var fec_asignado = dateFormat(fec_hora, 'yyyy-mm-dd');
    var fecha = dateFormat(fec_hora, 'yyyy-mm-dd');


    //fecha hecho
    if (fec_hecho == null || fec_hecho === "" || fec_hecho == undefined) {
      nueva_fec_hecho = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    } else {
      nueva_fec_hecho = fec_hecho;
    }

    var hora = dateFormat(nueva_fec_hecho, 'HH:MM:ss');
    var hor_recepcion = dateFormat(registration_date, 'HH:MM:ss');

    if (id_pais_hecho == null || id_pais_hecho === "" || id_pais_hecho == undefined) {
      nuevo_id_pais_hecho = 0;
    } else {
      nuevo_id_pais_hecho = id_pais_hecho;
    }


    await db.query(`UPDATE tcdh_caso_temp
    SET tipo_via_entrada=$1, via_entrada=$2, otra_via_entrada=$3, fec_hora=$4, fec_hor_hecho_aprox=$5, fec_hecho=$6, hor_hecho=$7, 
    id_depto_hecho=$8, id_mun_hecho=$9, lugar=$10, hecho=$11, cod_usu_mod=$12, usu_mod_reg=$13, fec_mod_reg=$14, fuente=$15, 
    fec_emision=$16, tit_emision=$17, fec_recepcion=$18, hor_recepcion=$19, nom_victima=$20, nom_denunciante=$21, id_pais_hecho=$22,
    fec_asignado = $23, fecha=$24, id_ins_mod=$25
    WHERE id_caso_temp = $26 RETURNING*`, [tipo_via_entrada, via_entrada, otra_via_entrada, fec_hora, fec_hor_hecho_aprox, nueva_fec_hecho, hora,
      id_depto_hecho, id_mun_hecho, lugar, hecho, cod_usu, user_name, registration_date, fuente, fec_emision, tit_emision,
      fec_recepcion, hor_recepcion, nom_victima, nom_denunciante, id_pais_hecho, fec_asignado, fecha, inst_user, id_caso_temp], (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var caseProcessing = results.rows[0];
          return res.status(201).json({
            caseProcessing
          });
        }
      })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updateCaseProcesing', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

//Persona Involucrado
let getInvolvedFormList = async (req, res) => {
  const { id_caso_temp } = req.params;

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener la lista de involucrados del caso.", instance: "case-processing/getInvolvedFormList" });
    await db.query(`SELECT rc.id_persona_temp::integer AS form_id, 
    CONCAT(pt.nombre,' ',pt.apellido) AS name, pt.tipo_rel_caso
    FROM tcdh_per_rel_caso_temp as rc
    LEFT JOIN tcdh_persona_temp AS pt ON pt.id_persona_temp = rc.id_persona_temp
    LEFT JOIN tcdh_caso_temp AS c ON c.id_caso_temp = rc.id_caso_temp
    WHERE rc.id_caso_temp = $1
    ORDER BY rc.id_caso_temp DESC 
    `, [id_caso_temp], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {
        var involved = results.rows;
        return res.status(200).json({
          involved
        });
      }
    });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getInvolvedFormList', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
}

let getPersonInvolvedForm = async (req, res) => {

  try {

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de tramitacion de caso.", instance: "case-processing/getPersonInvolvedForm" });

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer, mascara, obl_cap_documento FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var maskDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer, mascara, obl_cap_documento FROM admi_doc_persona WHERE est_reg = 'A' ORDER BY id_doc_persona ASC`);
    maskDocuments = maskDocuments.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    notificationMeans = notificationMeans.rows;

    var typeDisability = await db.query(`SELECT id_cat_tip_discapacidad::integer AS answer_id, descripcion AS answer FROM admi_cat_tip_discapacidad WHERE est_reg = 'A'`);
    typeDisability = typeDisability.rows;

    var academicLevel = await db.query(`SELECT id_niv_academico::integer AS answer_id, descripcion AS answer FROM admi_niv_academico WHERE est_reg = 'A'`);
    academicLevel = academicLevel.rows;

    var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
    qualityOperates = qualityOperates.rows;

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais ORDER BY id_pais ASC`);
    country = country.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;

    var sections = [];

    // Seccion --- Denunciante
    var whistleblower = {
      section_id: "whistleblower",
      section_title: "Identificación de Tipo de Persona",
      questions: [
        {
          question_id: "tipo_rel_caso",
          required: true,
          question_type: "closed",
          question: "Tipo de Persona",
          answers: [
            { answer_id: 'D', answer: 'Denunciante' },
            { answer_id: 'V', answer: 'Victima' },
            { answer_id: 'A', answer: 'Denunciante/Victima' }
          ]
        },
        //Se cambio el nombre
        {
          question_id: "tipo_persona",
          required: true,
          dependent: true,
          dependent_multiple: 1,
          dependent_section_id: "whistleblower",
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: {
            type: "containtString",
            answer: ['D', 'A']
          },
          question_type: "closed",
          question: "Persona Denunciante",
          answers: [
            { answer_id: 'N', answer: 'Natural' },
            { answer_id: 'J', answer: 'Jurídico' },
          ]
        },
        {
          question_id: "persona_victima",
          required: true,
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "whistleblower",
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: {
            type: "containtString",
            answer: ['V', 'A']
          },
          question_type: "closed",
          question: "Persona Víctima",
          answers: [
            { answer_id: 'I', answer: 'Individual' },
            { answer_id: 'C', answer: 'Colectivo' },
          ]
        },
        {
          question_id: "confidencial",
          required: true,
          question_type: "closed",
          question: "Confidencial",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        }
      ]
    };

    //Seccion --- Informacion general de la persona
    var generalData = {
      section_id: "generalData",
      section_title: "Información General de la persona",
      questions: [
        {
          question_id: "nombre",
          question_type: "open",
          required: true,
          limit: 100,
          question: "Nombre"
        },
        {
          question_id: "apellido",
          question_type: "open",
          required: true,
          limit: 100,
          question: "Apellido"
        },
        {
          question_id: "id_cat_doc_persona",
          required: true,
          question_type: "closed",
          question: "Doc. Presentado",
          answers: personalDocuments
        },
        {
          question_id: "num_documento_1",
          required: true,
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "generalData",
          dependent_question_id: "id_cat_doc_persona",
          dependent_answer: {
            type:"containInt",
            answer: [4, 3]
          },
          limit: 50,
          question_type: "numeric_mask",
          mask: maskDocuments[4].mascara,
          question: "Núm. Documento"
          
        },
        {
          question_id: "num_documento_2",
          required: true,
          dependent: true,
          dependent_section_id: "generalData",
          dependent_question_id: "id_cat_doc_persona",
          dependent_answer: {
            type:"numeric",
            answer: 1
          },
          limit: 50,
          question_type: "numeric_mask",
          mask: maskDocuments[1].mascara,
          question: "Núm. Documento"
          
        },
        {
          question_id: "num_documento_3",
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "generalData",
          dependent_question_id: "id_cat_doc_persona",
          dependent_answer: {
            type:"containInt",
            answer: [0, 5]
          },
          limit: 50,
          question_type: "open",
          question: "Núm. Documento"
          
        },
        {
          question_id: "num_documento_4",
          required: true,
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "generalData",
          dependent_question_id: "id_cat_doc_persona",
          dependent_answer: {
            type:"containInt",
            answer: [2, 7]
          },
          limit: 50,
          question_type: "open",
          question: "Núm. Documento"
          
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          max: moment().format("YYYY-MM-DD"),
          question: "Fecha Nacimiento"
        },
        // {
        //   question_id: "edad_aprox",
        //   required: true,
        //   question_type: "numeric",
        //   limit: 3,
        //   question: "Edad Aproximada"
        // },
        {
          question_id: "id_pais_nacimiento",
          enabled: false,
          question_type: "closed",
          searchable: true,
          question: "Pais Nacimiento",
          answer: "EL SALVADOR",
          answers: country
        },
        {
          question_id: "sexo",
          required: true,
          question_type: "closed",
          question: "Sexo",
          answers: [
            { answer_id: "H", answer: "Hombre" },
            { answer_id: "M", answer: "Mujer" }
          ]
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answers: [
            { answer_id: 'F', answer: 'Femenino' },
            { answer_id: 'M', answer: 'Masculino' }
            // { answer_id: 'R', answer: 'Sin Respuesta' }
          ]
        },
        {
          question_id: "id_ori_sexual",
          required: true,
          question_type: "closed",
          multi_select: true,
          question: "Orientación Sexual",
          answers: sexualOrientation
        },
        {
          question_id: "lee",
          required: true,
          question_type: "closed",
          question: "Saber Leer",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "escribe",
          required: true,
          question_type: "closed",
          question: "Saber Escribir",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "id_niv_academico",
          required: true,
          dependent: true,
          dependent_section_id: "generalData",
          dependent_question_id: "escribe",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          question: "Niv. Académico",
          answers: academicLevel
        },
        {
          question_id: "discapacidad",
          question_type: "closed",
          question: "Discapacidad",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_cat_tip_discapacidad",
          required: true,
          dependent: true,
          dependent_section_id: "generalData",
          dependent_question_id: "discapacidad",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          question: "Tipo de Discapacidad",
          answers: typeDisability
        },
        {
          question_id: "id_cat_pro_oficio",
          required: true,
          question_type: "closed_searchable_case_processing",
          question: "Ocupación",
          answers: occupation
        }
      ]

    };

    //Seccion --- Informacion de Ubicacion de la Persona
    var locationPerson = {
      section_id: "locationPerson",
      bold_title: true,
      section_title: "Información de Ubicación de la Persona",
      questions: [
        {
          question_id: "id_departamento",
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_municipio",
            section_id: "locationPerson"
          },
          question: "Departamento",
          answers: state
        },
        {
          question_id: "id_municipio",
          question_type: "closed",
          is_child: true,
          question: "Municipio",
          all_answers: municipality
        },
        
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: true,
          question: "Tipo de Zona",
          answers: [
            { answer_id: 'R', answer: 'Rural' },
            { answer_id: 'M', answer: 'Semirural' },
            { answer_id: 'U', answer: 'Urbano' },
            { answer_id: 'O', answer: 'Semiurbano' },
            { answer_id: 'N', answer: 'No Definida' }
          ]
        },
        // {
        //   question_id: "id_documento_solicitante",
        //   question_type: "closed",
        //   question: "Documento de identificación",
        //   required: true,
        //   answers: personalDocuments
        // },
        {
          question_id: "domicilio",
          question_type: "open",
          max_lines: 6,
          required: true,
          limit: 500,
          question: "Dirección",
        },
        {
          question_id: "enable_med_notification",
          required: true,
          question_type: "closed",
          question: "¿Se ingresará un medio de notificación o se dejerá pendiente?",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "med_rec_notificacion",
          dependent: true,
          dependent_section_id: "locationPerson",
          dependent_question_id: "enable_med_notification",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          multi_select: true,
          question: "Medio de Notificación",
          answers: [
            { answer_id: 0, answer: 'Teléfono' },
            { answer_id: 1, answer: 'Dirección que señala para notificar' },
            { answer_id: 2, answer: 'Fax' },
            { answer_id: 3, answer: 'Correo Electrónico' },
            { answer_id: 4, answer: 'Pendiente' }
          ]
        },
        {
          question_id: "num_telefono",
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "locationPerson",
          dependent_question_id: "med_rec_notificacion",
          dependent_answer: {
            type: "numeric",
            answer: 0
          },
          question_type: "open",
          question: "Teléfono",
        },
        {
          question_id: "fax",
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "locationPerson",
          dependent_question_id: "med_rec_notificacion",
          dependent_answer: {
            type: "numeric",
            answer: 2
          },
          question_type: "open",
          question: "Fax",
        },
        {
          question_id: "correo_electronico",
          dependent: true,
          dependent_multiple: 1,
          dependent_section_id: "locationPerson",
          dependent_question_id: "med_rec_notificacion",
          dependent_answer: {
            type: "numeric",
            answer: 3
          },
          question_type: "open",
          question: "Correo Electrónico",
        },
        {
          question_id: "dir_notificar",
          question_type: "open",
          max_lines: 6,
          required: true,
          dependent: true,
          dependent_multiple: true,
          dependent_section_id: "locationPerson",
          dependent_question_id: "med_rec_notificacion",
          dependent_answer: {
            type: "numeric",
            answer: 1
          },
          limit: 500,
          question: "Dirección",
        },
      ]

    };

    //Seccion --- Grupos en Condición de Vulnerabilidad
    var SectionvulnerableGroups = {
      section_id: "SectionvulnerableGroups",
      section_title: "Grupos en Condición de Vulnerabilidad",
      questions: [
        {
          question_id: "enable_grp_vulnerable",
          required: true,
          question_type: "closed",
          question: "¿Se ingresará un grupo en condiciones de vulnerabilidad o se dejerá pendiente?",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_grp_vulnerable",
          required: true,
          dependent: true,
          dependent_section_id: "SectionvulnerableGroups",
          dependent_question_id: "enable_grp_vulnerable",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          multi_select: true,
          question: "Grupos en condición de vulnerabilidad",
          answers: vulnerableGroup
        }
      ]
    };

    //Información de Institución
    var institutionInformation = {
      section_id: "institutionInformation",
      dependent: true,
      dependent_section_id: "whistleblower",
      dependent_question_id: "tipo_persona",
      dependent_answer: {
        type: "text",
        answer: "J"
      },
      section_title: "Información de Institución",
      questions: [
        {
          question_id: "institucion",
          question_type: "open",
          max_lines: 6,
          required: true,
          limit: 200,
          question: "Institución",
        },
        {
          question_id: "id_pais_ins_rep",
          question_type: "closed",
          searchable: true,
          question: "Nacionalidad de Institución",
          answers: country
        },
        {
          question_id: "id_cat_cal_actua",
          //required: true,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answers: qualityOperates
        }
      ]
    }


    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: 0,
      // id_caso_temp: caso_temp != null ? caso_temp.id_caso_temp: null,
      sections: sections
    }

    return res.status(200).json({
      form: involved
    })

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getPersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

//Create Involved
let createPersonInvolvedForm = async (req, res) => {
  const { id_caso_temp } = req.params;
  const { tipo_rel_caso, tipo_persona, persona_victima, confidencial, aut_dat_den_vic, nombre, apellido, id_cat_cal_actua,
    sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento_1, num_documento_2, num_documento_3, num_documento_4, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio,
    discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, num_telefono, fax, correo_electronico, dir_notificar, id_grp_vulnerable, id_ori_sexual, institucion } = req.body;
       

  try {
   
   let num_documento = null;
   if(id_cat_doc_persona == 1){
    num_documento = num_documento_2;
   } else if(id_cat_doc_persona == 2 || id_cat_doc_persona == 7){
    num_documento = num_documento_4;
   }
   else if(id_cat_doc_persona == 3 || id_cat_doc_persona == 4){
    num_documento = num_documento_1;
   } else if(id_cat_doc_persona == 5){
    num_documento = num_documento_3;
   } 

   let edad_aprox = null;
   if(fec_nacimiento != null){
    edad_aprox = Number.parseInt(new Date().getFullYear()) - Number.parseInt(new Date(fec_nacimiento).getFullYear());
   }
 
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/createPersonInvolvedForm" });

    let professionPerson = await db.query(`SELECT id_cat_pro_oficio, descripcion
    FROM admi_cat_pro_oficio WHERE descripcion like '%${id_cat_pro_oficio}'`);
    professionPerson = professionPerson.rows[0];

    let paisNacimiento = await db.query(`SELECT id_pais, descripcion
    FROM admi_pais WHERE descripcion like '%${id_pais_nacimiento}'`);
    paisNacimiento = paisNacimiento.rows[0].id_pais;

    let paisInsti; 
    
    if(id_pais_ins_rep == null){
      
      paisInsti = await db.query(`SELECT id_pais FROM admi_pais WHERE id_pais = 62`);
      paisInsti = paisInsti.rows[0].id_pais;

    }else{

      paisInsti = await db.query(`SELECT id_pais, descripcion
      FROM admi_pais WHERE descripcion like '%${id_pais_ins_rep}'`);
      paisInsti = paisInsti.rows[0].id_pais;
      
    }
     

    var medNotificationTempArray = [];

    if (med_rec_notificacion != null) {
      for (let i = 0; i < med_rec_notificacion.length; i++) {
        if (med_rec_notificacion[i] == 0) {
          medNotificationTempArray.push('T');
        } else if (med_rec_notificacion[i] == 1) {
          medNotificationTempArray.push('D');
        } else if (med_rec_notificacion[i] == 2) {
          medNotificationTempArray.push('F');
        } else if (med_rec_notificacion[i] == 3) {
          medNotificationTempArray.push('C');
        } else {
          med_rec_notificacion[i] == 4
          medNotificationTempArray.push('P');
        }
      }
    }


    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');
    var est_reg = 'R';

    let fec_nacimiento_nueva;
    if (fec_nacimiento == null || fec_nacimiento == "" || fec_nacimiento == undefined) {
      fec_nacimiento_nueva = dateFormat(fec_nacimiento, 'yyyy-mm-dd');
    } else {
      fec_nacimiento_nueva = fec_nacimiento;
    }


    var cod_user = req.user.user_id;
    var user_name = req.user.name;
    var inst_user = req.user.id_ins_usuario;

    let nom_completo;

    if (tipo_rel_caso == 'A') {
      nom_completo = institucion;
    } else {
      nom_completo = nombre + ' ' + apellido;
    }


    let per_den_es_victima;
    let per_principal;

    if (tipo_rel_caso == "A") {
      per_den_es_victima = 'S';
    } else {
      per_den_es_victima = 'N';
    }

    if (tipo_rel_caso == "V") {
      per_principal = 'S';
    } else {
      per_principal = 'N';
    }

    await db.query(`INSERT INTO tcdh_persona_temp(
      tipo_rel_caso, per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero, lee, escribe, id_cat_doc_persona, 
      otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento, id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, 
      id_departamento, id_municipio, domicilio, discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, num_telefono, fax, correo_electronico, dir_notificar, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, 
      fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp, persona_denunciante, persona_victima, institucion, id_ins_ing, id_ins_mod)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45) RETURNING *`, [tipo_rel_caso,
      per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad,
      num_documento, id_niv_academico, paisNacimiento, paisInsti, fec_nacimiento_nueva, edad_aprox, professionPerson.id_cat_pro_oficio, zona_domicilio, id_departamento,
      id_municipio, domicilio, discapacidad, id_cat_tip_discapacidad, medNotificationTempArray, num_telefono, fax, correo_electronico, dir_notificar, est_reg, registration_date, cod_user, user_name, registration_date,
      cod_user, user_name, registration_date, id_caso_temp, tipo_persona, persona_victima, institucion, inst_user, inst_user], async (err, results) => {

        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var personInvolved = results.rows[0];

          if (personInvolved.tipo_rel_caso == 'A') {

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
            id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
            fec_mod_reg, confidencial, aut_dat_den_vic, id_ins_ing, id_ins_mod)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
              [personInvolved.id_persona_temp, id_caso_temp, 'D', tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic, inst_user, inst_user]);

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic, id_ins_ing, id_ins_mod)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
              [personInvolved.id_persona_temp, id_caso_temp, 'V', persona_victima, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic, inst_user, inst_user]);

          } else if (personInvolved.tipo_rel_caso == 'D') {

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic, id_ins_ing, id_ins_mod)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
              [personInvolved.id_persona_temp, id_caso_temp, personInvolved.tipo_rel_caso, tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic, inst_user, inst_user]);

          } else if (personInvolved.tipo_rel_caso == 'V') {

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
                  id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
                  fec_mod_reg, confidencial, aut_dat_den_vic, id_ins_ing, id_ins_mod)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
              [personInvolved.id_persona_temp, id_caso_temp, personInvolved.tipo_rel_caso, persona_victima, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic, inst_user, inst_user]);
          }


          if (id_grp_vulnerable != undefined || id_grp_vulnerable != null) {
            for (let i = 0; i < id_grp_vulnerable.length; i++) {
              db.query(`INSERT INTO tcdh_grp_vul_temp(
            id_grp_vulnerable, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_per_rel, id_caso_temp, migrado, id_ins_ing, id_ins_mod)
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
                [id_grp_vulnerable[i], 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date, personInvolved.id_persona_temp,
                  id_caso_temp, 'N', inst_user, inst_user]);
            }
          }

          if (id_ori_sexual != undefined || id_ori_sexual != null) {
            for (let i = 0; i < id_ori_sexual.length; i++) {
              db.query(`INSERT INTO tcdh_ori_sex_per_temp(
                id_persona_temp, id_ori_sexual, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp, id_ins_ing, id_ins_mod)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [personInvolved.id_persona_temp, id_ori_sexual[i], 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date,
                  id_caso_temp, inst_user, inst_user]);
            }
          }

          return res.status(201).json({
            personInvolved
          });


        }

      });

  } catch (error) {
    log('src/controllers/back', 'case-processing', 'createPersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

// FormById Actualizado
let getPersonInvolvedById = async (req, res) => {

  const { id_persona_temp } = req.params;

  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al obtener el formulario de la persona involucrada.", instance: "case-processing/getPersonInvolvedById" });
    
    var personInvolved = await db.query(`SELECT po.descripcion AS ocupacion, p.*, pc.confidencial, pc.aut_dat_den_vic, pc.tipo_persona  
    FROM tcdh_persona_temp AS p
    LEFT JOIN tcdh_per_rel_caso_temp AS pc ON pc.id_persona_temp = p.id_persona_temp
	  LEFT JOIN admi_cat_pro_oficio AS po ON po.id_cat_pro_oficio = p.id_cat_pro_oficio
    WHERE p.id_persona_temp = $1`, [id_persona_temp]);
    personInvolved = personInvolved.rows[0];

    var personalDocuments = await db.query(`SELECT id_doc_persona::integer AS answer_id, descripcion AS answer FROM admi_doc_persona WHERE est_reg = 'A'`);
    personalDocuments = personalDocuments.rows;

    var occupation = await db.query(`SELECT id_cat_pro_oficio::integer AS answer_id, descripcion AS answer FROM admi_cat_pro_oficio WHERE est_reg = 'A'`);
    occupation = occupation.rows;

    var vulnerableGroup = await db.query(`SELECT id_grp_vulnerable::integer AS answer_id, descripcion AS answer FROM admi_grp_vulnerable WHERE est_reg = 'A' ORDER BY id_grp_vulnerable ASC`);
    vulnerableGroup = vulnerableGroup.rows;

    var vulnerableGroupSelected = await db.query(`SELECT array_agg(gt.id_grp_vulnerable::integer) AS id_grp_vulnerable
    FROM tcdh_persona_temp AS p 
    INNER JOIN tcdh_grp_vul_temp AS gt 	   ON gt.id_per_rel = p.id_persona_temp
    INNER JOIN admi_grp_vulnerable AS gv   ON gv.id_grp_vulnerable = gt.id_grp_vulnerable
    WHERE gt.id_per_rel = $1`, [id_persona_temp]);
    vulnerableGroupSelected = vulnerableGroupSelected.rows[0].id_grp_vulnerable;
    
    var countvulnerableGroup = await db.query('SELECT COUNT(id_grp_vulnerable) AS grp_vulnerable  FROM tcdh_grp_vul_temp WHERE id_per_rel = $1', [id_persona_temp]);
    countvulnerableGroup = countvulnerableGroup.rows[0].grp_vulnerable;
  
    var sexualOrientation = await db.query(`SELECT id_ori_sexual::integer AS answer_id, descripcion AS answer FROM admi_ori_sexual WHERE est_reg = 'A' ORDER BY id_ori_sexual ASC`);
    sexualOrientation = sexualOrientation.rows;

    var sexualOrientationSelected = await db.query(`SELECT array_agg(st.id_ori_sexual::integer) AS id_ori_sexual
    FROM tcdh_persona_temp AS p 
    INNER JOIN tcdh_ori_sex_per_temp AS st ON st.id_persona_temp = p.id_persona_temp
    INNER JOIN admi_ori_sexual AS os 	   ON os.id_ori_sexual = st.id_ori_sexual
    WHERE st.id_persona_temp = $1`, [id_persona_temp]);
    sexualOrientationSelected = sexualOrientationSelected.rows[0].id_ori_sexual;

    var notificationMeans = await db.query(`SELECT id_otr_med_notificacion::integer AS answer_id, descripcion AS answer FROM admi_otr_med_notificacion WHERE est_reg = 'A'`);
    notificationMeans = notificationMeans.rows;

    var typeDisability = await db.query(`SELECT id_cat_tip_discapacidad::integer AS answer_id, descripcion AS answer FROM admi_cat_tip_discapacidad WHERE est_reg = 'A'`);
    typeDisability = typeDisability.rows;

    var academicLevel = await db.query(`SELECT id_niv_academico::integer AS answer_id, descripcion AS answer FROM admi_niv_academico WHERE est_reg = 'A'`);
    academicLevel = academicLevel.rows;

    var qualityOperates = await db.query(`SELECT id_cat_cal_actua::integer AS answer_id, descripcion AS answer FROM admi_cat_cal_actua WHERE est_reg = 'A'`);
    qualityOperates = qualityOperates.rows;

    var country = await db.query(`SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais WHERE id_pais = 62`);
    country = country.rows;

    var institutionCountry = await db.query('SELECT id_pais::integer AS answer_id, descripcion AS answer FROM admi_pais');
    institutionCountry = institutionCountry.rows;

    var state = await db.query(`SELECT id_departamento::integer AS answer_id, descripcion AS answer FROM admi_departamento WHERE est_reg = 'A'`);
    state = state.rows;

    var municipality = await db.query(`SELECT id_municipio::integer AS answer_id, descripcion AS answer, id_departamento AS to_compare FROM admi_municipio WHERE est_reg = 'A'`);
    municipality = municipality.rows;

    var typeZone = await db.query('SELECT id_zona::integer AS answer_id, nombre_zona AS answer FROM sat_zonas WHERE estado = 1 ORDER BY id_zona ASC');
    typeZone = typeZone.rows;


    var medNotificationTempArray = [];

    if (personInvolved.med_rec_notificacion != null) {

      for (let i = 0; i < personInvolved.med_rec_notificacion.length; i++) {

        if (personInvolved.med_rec_notificacion[i] == 'T') {
          medNotificationTempArray.push(0);
        } else if (personInvolved.med_rec_notificacion[i] == 'D') {
          medNotificationTempArray.push(1);
        } else if (personInvolved.med_rec_notificacion[i] == 'F') {
          medNotificationTempArray.push(2);
        } else if (personInvolved.med_rec_notificacion[i] == 'C') {
          medNotificationTempArray.push(3);
        } else if (personInvolved.med_rec_notificacion[i] == 'P') {
          medNotificationTempArray.push(4);
        }
      }
    }

    var sections = [];

    // Seccion --- Denunciante
    var whistleblower = {
      section_id: "whistleblower",
      section_title: "Identificación de Tipo de Persona",
      questions: [
        {
          question_id: "tipo_rel_caso",
          required: true,
          question_type: "closed",
          question: "Tipo de Persona",
          answer: personInvolved != null ? personInvolved.tipo_rel_caso : null,
          answers: [
            { answer_id: 'D', answer: 'Denunciante' },
            { answer_id: 'V', answer: 'Victima' },
            { answer_id: 'A', answer: 'Denunciante/Victima' }
          ]
        },
        {
          question_id: "tipo_persona",
          required: true,
          dependent: true,
          dependent_section_id: "whistleblower",
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: {
            type: "containtString",
            answer: ['D', 'A']
          },
          question_type: "closed",
          question: "Persona Denunciante",
          answer: personInvolved != null ? personInvolved.persona_denunciante : null,
          answers: [
            { answer_id: 'N', answer: 'Natural' },
            { answer_id: 'J', answer: 'Jurídico' },
          ]
        },
        {
          question_id: "persona_victima",
          required: true,
          dependent: true,
          dependent_section_id: "whistleblower",
          dependent_question_id: "tipo_rel_caso",
          dependent_answer: {
            type: "containtString",
            answer: ['V', 'A']
          },
          question_type: "closed",
          question: "Persona Víctima",
          answer: personInvolved != null ? personInvolved.persona_victima : null,
          answers: [
            { answer_id: 'I', answer: 'Individual' },
            { answer_id: 'C', answer: 'Colectivo' },
          ]
        },
        //no seguardan en bases de datos
        {
          question_id: "confidencial",
          required: true,
          required: true,
          question_type: "closed",
          question: "Confidencial",
          answer: personInvolved != null ? personInvolved.confidencial : null,
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        },
        {
          question_id: "aut_dat_den_vic",
          question_type: "closed",
          question: "Autoriza Proporcionar Sus Datos Personales",
          answer: personInvolved != null ? personInvolved.aut_dat_den_vic : null,
          answers: [
            { answer_id: 'S', answer: 'Si' },
            { answer_id: 'N', answer: 'No' }
          ]
        }
      ]
    };

    //Seccion --- Informacion general de la persona
    var generalData = {
      section_id: "generalData",
      section_title: "Información General de la persona",
      questions: [
        {
          question_id: "nombre",
          question_type: "open",
          question: "Nombre",
          answer: personInvolved != null ? personInvolved.nombre : null
        },
        {
          question_id: "apellido",
          question_type: "open",
          question: "Apellido",
          answer: personInvolved != null ? personInvolved.apellido : null
        },
        {
          question_id: "id_cat_doc_persona",
          required: true,
          question_type: "closed",
          question: "Doc. Presentado",
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_cat_doc_persona) : null,
          answers: personalDocuments
        },
        {
          question_id: "num_documento",
          required: true,
          question_type: "open",
          question: "Núm. Documento",
          answer: personInvolved != null ? personInvolved.num_documento : null
        },
        {
          question_id: "fec_nacimiento",
          question_type: "date",
          question: "Fecha Nacimiento",
          answer: personInvolved != null ? personInvolved.fec_nacimiento : null

        },
        {
          question_id: "id_pais_nacimiento",
          enabled: false,
          question_type: "closed",
          searchable: true,
          question: "Pais Nacimiento",
          answer: personInvolved != null ? personInvolved.id_pais : null,
          answers: country
        },
        {
          question_id: "sexo",
          required: true,
          question_type: "closed",
          question: "Sexo",
          answer: personInvolved != null ? personInvolved.sexo : null,
          answers: [
            { answer_id: "H", answer: "Hombre" },
            { answer_id: "M", answer: "Mujer" }
          ]
        },
        {
          question_id: "lee",
          required: true,
          question_type: "closed",
          question: "Saber Leer",
          answer: personInvolved != null ? personInvolved.lee : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "escribe",
          required: true,
          question_type: "closed",
          question: "Saber Escribir",
          answer: personInvolved != null ? personInvolved.escribe : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" },
            { answer_id: "R", answer: "Sin Respuesta" }
          ]
        },
        {
          question_id: "discapacidad",
          question_type: "closed",
          question: "Discapacidad",
          answer: personInvolved != null ? personInvolved.discapacidad : null,
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_ori_sexual",
          required: true,
          question_type: "closed",
          multi_select: true,
          question: "Orientación Sexual",
          answer: sexualOrientationSelected != undefined ? sexualOrientationSelected : null,
          answers: sexualOrientation
        },
        {
          question_id: "edad_aprox",
          required: true,
          question_type: "open",
          question: "Edad Aproximada",
          answer: personInvolved != null ? personInvolved.edad_aprox : null
        },
        {
          question_id: "id_cat_pro_oficio",
          required: true,
          question_type: "closed_searchable_case_processing",
          question: "Ocupación",
          answer: personInvolved != null ? personInvolved.ocupacion : null,
          answers: occupation
        },
        {
          question_id: "ide_genero",
          question_type: "closed",
          question: "Identidad de Genéro",
          answer: personInvolved != null ? personInvolved.ide_genero : null,
          answers: [
            { answer_id: 'F', answer: 'Femenino' },
            { answer_id: 'M', answer: 'Masculino' },
            { answer_id: 'S', answer: 'Sin Respuesta' }
          ]
        },
        {
          question_id: "id_niv_academico",
          required: true,
          dependent: true,
          dependent_section_id: "generalData",
          dependent_question_id: "escribe",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          question: "Niv. Académico",
          answer: personInvolved != null ? Number.parseInt(personInvolved.id_niv_academico) : null,
          answers: academicLevel
        },
        {
          question_id: "id_cat_tip_discapacidad",
          required: true,
          dependent: true,
          dependent_section_id: "generalData",
          dependent_question_id: "discapacidad",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          question: "Tipo de Discapacidad",
          answer: personInvolved != null ? personInvolved.id_cat_tip_discapacidad : null,
          answers: typeDisability
        }

      ]

    };

    //Seccion --- Informacion de Ubicacion de la Persona
    var locationPerson = {
      section_id: "locationPerson",
      bold_title: true,
      section_title: "Información de Ubicación de la Persona",
      questions: [
        {
          question_id: "id_departamento",
          question_type: "closed",
          has_child: true,
          principal_child: {
            question_id: "id_municipio",
            section_id: "locationPerson"
          },
          question: "Departamento",
          answer: personInvolved != null ? personInvolved.id_departamento : null,
          answers: state
        },
        {
          question_id: "id_municipio",
          is_child: true,
          question_type: "closed",
          question: "Municipio",
          answer: personInvolved != null ? personInvolved.id_municipio : null,
          all_answers: municipality
        },
        {
          question_id: "zona_domicilio",
          question_type: "closed",
          required: true,
          question: "Tipo de Zona",
          answer: personInvolved != null ? personInvolved.zona_domicilio : null,
          answers: [
            { answer_id: 'R', answer: 'Rural' },
            { answer_id: 'U', answer: 'Urbano' },
            { answer_id: 'N', answer: 'No Definida' }
          ]
        },
        // {
        //   question_id: "id_documento_solicitante",
        //   question_type: "closed",
        //   question: "Documento de identificación",
        //   required: true,
        //   answers: personalDocuments
        // },
        {
          question_id: "domicilio",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Dirección",
          answer: personInvolved != null ? personInvolved.domicilio : null
        },
        {
          question_id: "enable_med_notification",
          required: true,
          question_type: "closed",
          question: "¿Se ingresará un medio de notificación o se dejerá pendiente?",
          answer: personInvolved.med_rec_notificacion != null ? "S" : "N",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "med_rec_notificacion",
          dependent: true,
          dependent_section_id: "institutionInformation",
          dependent_question_id: "enable_med_notification",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          multi_select: true,
          question: "Medio de Notificación",
          answer: medNotificationTempArray != null ? medNotificationTempArray : null,
          answers: [
            { answer_id: 'T', answer: 'Teléfono' },
            { answer_id: 'D', answer: 'Dirección que señala para notificar' },
            { answer_id: 'F', answer: 'Fax' },
            { answer_id: 'C', answer: 'Correo Electrónico' },
            { answer_id: 'P', answer: 'Pendiente' }
          ]
        }

      ]

    };

    //Seccion --- Grupos en Condición de Vulnerabilidad
    var SectionvulnerableGroups = {
      section_id: "SectionvulnerableGroups",
      section_title: "Grupos en Condición de Vulnerabilidad",
      questions: [
        {
          question_id: "enable_grp_vulnerable",
          required: true,
          question_type: "closed",
          question: "¿Se ingresará un grupo en condiciones de vulnerabilidad o se dejerá pendiente?",
          answer: countvulnerableGroup != 0 ? "S": "N",
          answers: [
            { answer_id: "S", answer: "Si" },
            { answer_id: "N", answer: "No" }
          ]
        },
        {
          question_id: "id_grp_vulnerable",
          required: true,
          dependent: true,
          dependent_section_id: "SectionvulnerableGroups",
          dependent_question_id: "enable_grp_vulnerable",
          dependent_answer: {
            type: "text",
            answer: "S"
          },
          question_type: "closed",
          multi_select: true,
          question: "Grupos en condición de vulnerabilidad",
          answer: vulnerableGroupSelected != undefined ? vulnerableGroupSelected : null,
          answers: vulnerableGroup
        }
      ]
    };

    //Actualmente no se saba en que tabla se guardarán estos datos. 
    //Información de Institución
    var institutionInformation = {
      section_id: "institutionInformation",
      dependent: true,
      dependent_section_id: "whistleblower",
      dependent_question_id: "persona_denunciante",
      dependent_answer: {
        type: "text",
        answer: "J"
      },
      section_title: "Información de Institución",
      questions: [
        {
          question_id: "institución",
          question_type: "open",
          max_lines: 6,
          required: true,
          question: "Institucion",
          answer: personInvolved != null ? personInvolved.institucion : null
        },
        {
          question_id: "id_pais_ins_rep",
          question_type: "closed",
          searchable: true,
          question: "Nacionalidad de Institución",
          answer: personInvolved != null ? personInvolved.id_pais_ins_rep : null,
          answers: institutionCountry
        },
        {
          question_id: "id_cat_cal_actua",
          //required: true,
          question_type: "closed",
          question: "Calidad en que Actúa",
          answer: personInvolved != null ? personInvolved.id_cat_cal_actua : null,
          answers: qualityOperates
        }

      ]
    }


    sections.push(whistleblower, generalData, locationPerson, SectionvulnerableGroups, institutionInformation);

    var involved = {
      form_id: personInvolved != null ? personInvolved.id_persona_temp : null,
      sections: sections
    }

    return res.status(200).json({
      form: involved
    })


  } catch (error) {
    log('src/controllers/back', 'case-processing', 'getPersonInvolvedById', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

// Update Involved Actualizado
let updatePersonInvolvedForm = async (req, res) => {
  const { id_persona_temp } = req.params;
  const { tipo_rel_caso, tipo_persona, persona_victima, per_den_es_victima, per_principal, confidencial, aut_dat_den_vic, nombre, apellido, id_cat_cal_actua,
    sexo, ide_genero, lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento,
    id_pais_ins_rep, fec_nacimiento, edad_aprox, id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio,
    discapacidad, id_cat_tip_discapacidad, med_rec_notificacion, id_grp_vulnerable, id_ori_sexual, institucion } = req.body;

  try {

    let professionPerson = await db.query(`SELECT id_cat_pro_oficio, descripcion
    FROM admi_cat_pro_oficio WHERE descripcion like '%${id_cat_pro_oficio}'`);
    professionPerson = professionPerson.rows[0];

    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al intentar actualizar a la persona involucrada.", instance: "case-processing/updatePersonInvolvedForm" });

    var localDate = new Date();
    var registration_date = dateFormat(localDate, 'yyyy-mm-dd HH:MM:ss');

    var medNotificationTempArray = [];

    if (med_rec_notificacion != null) {
      for (let i = 0; i < med_rec_notificacion.length; i++) {
        if (med_rec_notificacion[i] == 0) {
          medNotificationTempArray.push('T');
        } else if (med_rec_notificacion[i] == 1) {
          medNotificationTempArray.push('D');
        } else if (med_rec_notificacion[i] == 2) {
          medNotificationTempArray.push('F');
        } else if (med_rec_notificacion[i] == 3) {
          medNotificationTempArray.push('C');
        } else {
          med_rec_notificacion[i] == 4
          medNotificationTempArray.push('P');
        }
      }
    }

    let fec_nacimiento_nueva;
    if (fec_nacimiento == null || fec_nacimiento == "" || fec_nacimiento == undefined) {
      fec_nacimiento_nueva = dateFormat(fec_nacimiento, 'yyyy-mm-dd');
    } else {
      fec_nacimiento_nueva = fec_nacimiento;
    }
    
    let nom_completo;

    if (tipo_rel_caso == 'A') {
      nom_completo = institucion;
    } else {
      nom_completo = nombre + ' ' + apellido;
    }

    let per_den_es_victima;
    let per_principal;

    if (tipo_rel_caso == "A") {
      per_den_es_victima = 'S';
    } else {
      per_den_es_victima = 'N';
    }

    if (tipo_rel_caso == "V") {
      per_principal = 'S';
    } else {
      per_principal = 'N';
    }


    var cod_user = req.user.user_id;
    var user_name = req.user.name;


    await db.query(`UPDATE tcdh_persona_temp
    SET per_den_es_victima=$1, per_principal=$2, nombre=$3, apellido=$4, id_cat_cal_actua=$5, nom_completo=$6, sexo=$7, ide_genero=$8, 
    lee=$9, escribe=$10, id_cat_doc_persona=$11, otro_doc_identidad=$12, num_documento=$13, id_niv_academico=$14, id_pais_nacimiento=$15, 
    id_pais_ins_rep=$16, fec_nacimiento=$17, edad_aprox=$18, id_cat_pro_oficio=$19, zona_domicilio=$20, id_departamento=$21, id_municipio=$22, 
    domicilio=$23, discapacidad=$24, id_cat_tip_discapacidad=$25, med_rec_notificacion=$26, cod_usu_mod=$27, usu_mod_reg=$28, fec_mod_reg=$29, 
    tipo_rel_caso=$30, persona_denunciante=$31, persona_victima=$32, institucion=$33 
    WHERE id_persona_temp = $34 RETURNING*`, [per_den_es_victima, per_principal, nombre, apellido, id_cat_cal_actua, nom_completo, sexo, ide_genero,
      lee, escribe, id_cat_doc_persona, otro_doc_identidad, num_documento, id_niv_academico, id_pais_nacimiento, id_pais_ins_rep,
      fec_nacimiento_nueva, edad_aprox, professionPerson.id_cat_pro_oficio, zona_domicilio, id_departamento, id_municipio, domicilio, discapacidad,
      id_cat_tip_discapacidad, medNotificationTempArray, cod_user, user_name, registration_date, tipo_rel_caso, tipo_persona,
      persona_victima, institucion, id_persona_temp], async (err, results) => {
        if (err) {
          console.log(err.message);
          return res.status(500).json(errorResponse.toJson());
        } else {
          var personInvolved = results.rows[0];

          if (personInvolved.tipo_rel_caso == 'A') {

            db.query('DELETE FROM tcdh_per_rel_caso_temp WHERE id_persona_temp = $1', [personInvolved.id_persona_temp]);

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              [personInvolved.id_persona_temp, personInvolved.id_caso_temp, 'D', tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic]);

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
                id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
                fec_mod_reg, confidencial, aut_dat_den_vic)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              [personInvolved.id_persona_temp, personInvolved.id_caso_temp, 'V', tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic]);

          } else {
            
            db.query('DELETE FROM tcdh_per_rel_caso_temp WHERE id_persona_temp = $1', [personInvolved.id_persona_temp]);

            db.query(`INSERT INTO tcdh_per_rel_caso_temp(
              id_persona_temp, id_caso_temp, relacion, tipo_persona, migrado, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, 
              fec_mod_reg, confidencial, aut_dat_den_vic)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
              [personInvolved.id_persona_temp, personInvolved.id_caso_temp, personInvolved.tipo_rel_caso, tipo_persona, 'N', 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name,
                registration_date, confidencial, aut_dat_den_vic]);
          }
          
            
          if (id_grp_vulnerable != null || id_grp_vulnerable != null) {

            db.query('DELETE FROM tcdh_grp_vul_temp WHERE id_per_rel = $1', [personInvolved.id_persona_temp]);

            for (let i = 0; i < id_grp_vulnerable.length; i++) {
              db.query(`INSERT INTO tcdh_grp_vul_temp(
                  id_grp_vulnerable, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_per_rel, id_caso_temp, migrado)
                  VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [id_grp_vulnerable[i], 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date, personInvolved.id_persona_temp,
                personInvolved.id_caso_temp, 'N']);
            }
          }
        

          if (id_ori_sexual != undefined || id_ori_sexual != null) {

            db.query('DELETE FROM tcdh_ori_sex_per_temp WHERE id_persona_temp = $1', [personInvolved.id_persona_temp])

            for (let i = 0; i < id_ori_sexual.length; i++) {
              db.query(`INSERT INTO tcdh_ori_sex_per_temp(
                id_persona_temp, id_ori_sexual, est_reg, fec_est_reg, cod_usu_ing, usu_ing_reg, fec_ing_reg, cod_usu_mod, usu_mod_reg, fec_mod_reg, id_caso_temp)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [personInvolved.id_persona_temp, id_ori_sexual[i], 'R', registration_date, cod_user, user_name, registration_date, cod_user, user_name, registration_date,
                personInvolved.id_caso_temp]);
            }
          }

            return res.status(201).json({
              personInvolved
            });

        }
      });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'updatePersonInvolvedForm', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

let deletePersonInvolved = async (req, res) => {
  const { id_persona_temp } = req.params;
  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al eliminar la persona involucrada.", instance: "case-processing/deletePersonInvolved" });
    await db.query(`UPDATE tcdh_persona_temp SET est_reg = 'E' WHERE id_persona_temp = $1`, [id_persona_temp], (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {

        db.query(`UPDATE tcdh_per_rel_caso_temp SET est_reg = 'E' WHERE id_persona_temp = $1`);

        return res.status(201).json({
          message: 'Persona Eliminada'
        });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'deletePersonInvolved', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }
};

//Enviar a SIGI
let sentCaseToSigi = async (req, res) => {
  const { id_caso_temp } = req.params;
  
  try {
    var errorResponse = new ErrorModel({ type: "Case-Processing", title: "Falló la función", status: 500, detail: "Lo sentimos ocurrió un error al enviar el caso al SIGI.", instance: "case-processing/sentCaseToSigi" });

    db.query(`UPDATE variable SET oldidcasotemp = $1 WHERE id_variable = 1`, [id_caso_temp]);

    await db.query(`SELECT * FROM bussat()`, (err, results) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json(errorResponse.toJson());
      } else {

        return res.status(200).json({
          message: 'Caso enviado al sigi'
        });
      }
    });
  } catch (error) {
    log('src/controllers/back', 'case-processing', 'sentCaseToSigi', error, true, req, res);
    return res.status(500).json(errorResponse.toJson());
  }

};

module.exports = {
  getcaseProcesingFormList,
  getCaseProcessingForm,
  createCaseProcessing,
  getCaseProcesingById,
  updateCaseProcesing,
  getPersonInvolvedForm,
  createPersonInvolvedForm,
  getPersonInvolvedById,
  updatePersonInvolvedForm,
  deletePersonInvolved,
  getInvolvedFormList,
  sentCaseToSigi,
  getFormVersion,
  getInvolverFormVersion
}