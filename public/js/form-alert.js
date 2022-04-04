$(document).ready(function(){
	$(".date-feature-switch input").on("change", function(e) {
  	const isOn = e.currentTarget.checked;
    console.log(isOn)
    if (isOn) {
        $(".date-report").show();
    } else {
        $(".date-report").hide();
    }
  });
});

//crisis_conflicto

//Show Date Report
function showOptionsReport() {
    if (document.getElementById('fecha_futura_hechos').checked) {
        document.getElementById('content-options-reports').style.display = 'block';
        document.getElementById('temporalidad').style.display = 'block';
        document.getElementById('cantidad').style.display = 'block';

    }else{ 
        document.getElementById('content-options-reports').style.display = 'none';
        document.getElementById('temporalidad').style.display = 'none';
        document.getElementById('cantidad').style.display = 'none';

    }
}

//Type Agression
function showOptionsAgression() {
    if (document.getElementById('hubo_agresion').checked) {
        document.getElementById('content-options-agression').style.display = 'block';
    }else{ 
        document.getElementById('content-options-agression').style.display = 'none';
    }
}

//Show options Acciones Anterior and Mecanismo de Resolucion 
function showOptionsCrisis() {
    if (document.getElementById('crisis_conflicto').checked) {
        document.getElementById('content-acciones-hecho').style.display = 'block';
        document.getElementById('content-resolucion-conflicto').style.display = 'block';  
       

    }else{ 
        document.getElementById('content-acciones-hecho').style.display = 'none';
        document.getElementById('content-resolucion-conflicto').style.display = 'none';
    }
}

function showOptionsFuerzaPublica() {
    if (document.getElementById('presencia_fuerza_publica').checked) {
        document.getElementById('intervencion_fuerza_publica').style.display = 'block';
    }else{ 
        document.getElementById('intervencion_fuerza_publica').style.display = 'none';

    }
};

function showOptionsFuerzaPublica(){
    if(document.getElementById('presencia_fuerza_publica').checked){
        document.getElementById('content-intervencion_fuerza_publica').style.display = 'block';
    }else{
        document.getElementById('content-intervencion_fuerza_publica').style.display = 'none';
    }
};

// get Source By Type Source
$(document).ready(function () {
    $('#id_tipo_fuente').on('change', function () {
        var id_tipo_fuente = $(this).children("option:selected").val();
        if ($.trim(id_tipo_fuente) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/source/' + id_tipo_fuente + '/list',
                success: function (result) {

                    $('#id_fuente').empty();
                    var value = Object.values(result.Sources);
                    if (Object.values(result.Sources).length == 0) {
                        $('#id_fuente').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {

                        //--------- Clean Form prensa escrita.
                        document.getElementById('titulo_noticia').value = '';
                        document.getElementById('nombre_medio_prensa').value = '';
                        document.getElementById('paginas_prensa').value = '';
                        document.getElementById('autor_prensa').value = '';
                        document.getElementById('fecha_publicacion_prensa').value = '';
                        document.getElementById('select_fotografia_prensa').value = 0;
                        //document.getElementById('fotografia_prensa').value = '';

                        //--------- Clean Form Television/Radio
                        document.getElementById('nombre_medio_radio').value = '';
                        document.getElementById('canal_radio').value = '';
                        document.getElementById('nombre_programa_radio').value = '';
                        document.getElementById('fecha_emision_radio').value = '';
                        
                        //--------- Clean Form Colectivos
                        document.getElementById('nombre_colectivo').value = '';
                        document.getElementById('nombre_contacto_colectivo').value = '';
                        document.getElementById('telefono_colectivo').value = '';

                        //--------- Clean Form Instituaciones Gubernamentales
                        document.getElementById('nombre_inst_gub').value = '';
                        document.getElementById('contacto_inst_gub').value = '';
                        document.getElementById('correo_inst_gub').value = '';
                        document.getElementById('telefono_inst_gub').value = '';
                        document.getElementById('datos_inst_gub').value = '';
                        
                        //--------- Clean Form Organismos Internacionales
                        document.getElementById('nombre_organismo').value = '';
                        document.getElementById('nombre_contacto_organismo').value = '';
                        document.getElementById('correo_organismo').value = '';
                        document.getElementById('telefono_organismo').value = '';
                        document.getElementById('datos_organismo').value = '';

                        //--------- Clean Form Mensajeria
                        document.getElementById('nombre_mensajeria').value = '';
                        document.getElementById('nombre_contacto_mensajeria').value = '';
                        document.getElementById('contacto_mensajeria').value = '';
                        document.getElementById('datos_mensajeria').value = '';
                        document.getElementById('select_fotografia_mensajeria').value = 0;
                        //document.getElementById('fotografia_mensajeria').value = '';

                        //--------- Clean Form Otras
                        document.getElementById('otras_detalle').value = '';
                        document.getElementById('otras_adicionales').value = '';

                        //--------- Clean Form Prensa Escrita
                        document.getElementById('titulo_redes').value = '';
                        document.getElementById('nombre_red_social').value = '';
                        document.getElementById('url_red_social').value = '';
                        document.getElementById('fecha_pub_red_social').value = '';
                        document.getElementById('select_pantalla_red_social').value = 0;
                        //document.getElementById('pantalla_red_social').value = '';

                        //--------- Show Forms
                        document.getElementById('prensa-escrita').style.display = 'none';
                        document.getElementById('radio-tv').style.display = 'none';
                        document.getElementById('colectivo').style.display = 'none';
                        document.getElementById('inst-gub').style.display = 'none';
                        document.getElementById('ong-internacionales').style.display = 'none';
                        document.getElementById('mensajeria').style.display = 'none';
                        document.getElementById('otras').style.display = 'none';
                        document.getElementById('medios-digitales').style.display = 'none';

                        $('#id_fuente').append("<option value =''>Seleccionar</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_fuente').append("<option value='" + value[i].id_fuente + "'>" + value[i].nombre_fuente + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_fuente').empty();
            $('#id_fuente').append("<option value =''>Seleccionar</option>");
            document.getElementById('prensa-escrita').style.display = 'none';
            document.getElementById('select_fotografia_prensa').value = 0;
            document.getElementById('radio-tv').style.display = 'none';
            document.getElementById('colectivo').style.display = 'none';
            document.getElementById('inst-gub').style.display = 'none';
            document.getElementById('ong-internacionales').style.display = 'none';
            document.getElementById('mensajeria').style.display = 'none';
            document.getElementById('select_fotografia_mensajeria').value = 0;
            document.getElementById('otras').style.display = 'none';
            document.getElementById('medios-digitales').style.display = 'none';
            document.getElementById('select_pantalla_red_social').value = 0;
        }
    });
});



//Show Form Type Source
$(document).ready(function () {
    $('#id_fuente').on('change', function () {
        var optionSelectd = $(this).children("option:selected").val();

        if ($.trim(optionSelectd) != '') {
              
            if (optionSelectd == 1) {
                document.getElementById('prensa-escrita').style.display = 'block';
                document.getElementById('select_fotografia_prensa').value = 1;
            } else {
                document.getElementById('prensa-escrita').style.display = 'none';
                document.getElementById('select_fotografia_prensa').value = 0;
            }

            if (optionSelectd == 2) {
                document.getElementById('radio-tv').style.display = 'block';
            } else {
                document.getElementById('radio-tv').style.display = 'none';
            }

            
            if (optionSelectd == 3 || optionSelectd == 4) {
                document.getElementById('medios-digitales').style.display = 'block';
                document.getElementById('select_pantalla_red_social').value = 1;
            } else {
                document.getElementById('medios-digitales').style.display = 'none';
                document.getElementById('select_pantalla_red_social').value = 0;
            }

            if (optionSelectd == 5 || optionSelectd == 6 || optionSelectd == 7) {
                document.getElementById('colectivo').style.display = 'block';
            } else {
                document.getElementById('colectivo').style.display = 'none';
            }

            if (optionSelectd == 8 || optionSelectd == 9 || optionSelectd == 10 || optionSelectd == 11) {
                document.getElementById('inst-gub').style.display = 'block';
            } else {
                document.getElementById('inst-gub').style.display = 'none';
            }

            if (optionSelectd == 12 || optionSelectd == 13 || optionSelectd == 16) {
                document.getElementById('ong-internacionales').style.display = 'block';
            } else {
                document.getElementById('ong-internacionales').style.display = 'none';
            }

            if (optionSelectd == 14) {
                document.getElementById('mensajeria').style.display = 'block';
                document.getElementById('select_fotografia_mensajeria').value = 1;
            } else {
                document.getElementById('mensajeria').style.display = 'none';
                document.getElementById('select_fotografia_mensajeria').value = 0;
            }
            
            if (optionSelectd == 15) {
                document.getElementById('otras').style.display = 'block';
            } else {
                document.getElementById('otras').style.display = 'none';
            }
            


        } else {
            document.getElementById('prensa-escrita').style.display = 'none';
            document.getElementById('select_fotografia_prensa').value = 0;
            document.getElementById('radio-tv').style.display = 'none';
            document.getElementById('colectivo').style.display = 'none';
            document.getElementById('inst-gub').style.display = 'none';
            document.getElementById('ong-internacionales').style.display = 'none';
            document.getElementById('mensajeria').style.display = 'none';
            document.getElementById('select_fotografia_mensajeria').value = 0;
            document.getElementById('otras').style.display = 'none';
            document.getElementById('medios-digitales').style.display = 'none';
            document.getElementById('select_pantalla_red_social').value = 0;
        }
    });
});