//-- Form Criterio
$(document).ready(function () {
    $('#id_tema').on('change', function () {
        var id_tema = $(this).children("option:selected").val();
        if ($.trim(id_tema) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/topic/subtopic/' + id_tema + '/list',
                success: function (result) {

                    $('#id_subtema').empty();
                    var value = Object.values(result.subtopics);
                    if (Object.values(result.subtopics).length == 0) {
                        $('#id_subtema').append("<option value =''>Ningún dato encontrado</option>");
                    } else {
                        $('#id_subtema').append("<option value =''>Desplegar sub-temas</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_subtema').append("<option value='" + value[i].id_subtema + "'>" + value[i].nombre_subtema + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_subtema').empty();
            $('#id_situacion_conflictiva').empty();
            $('#id_subtema').append("<option value =''>Seleccionar un tema</option>");
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_subtema').on('change', function () {
        var id_subtema = $(this).children("option:selected").val();
        if ($.trim(id_subtema) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/subtopic/situation/' + id_subtema + '/list',
                success: function (result) {

                    $('#id_situacion_conflictiva').empty();
                    var value = Object.values(result.situations);
                    if (Object.values(result.situations).length == 0) {
                        $('#id_situacion_conflictiva').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            $('#id_situacion_conflictiva').append("<option value='" + value[i].id_situacion_conflictiva + "'>" + value[i].nombre_sit_conflictiva + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_situacion_conflictiva').empty();
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_tema').on('change', function () {

        $('#id_situacion_conflictiva').empty();
        $('#id_situacion_conflictiva').append("<option value =''>Seleccionar un sub-tema</option>");

    });
});

//-- Search Municipalites by State
$(document).ready(function () {
    $('#id_departamento').on('change', function () {
        var id_departamento = $(this).children("option:selected").val();
        if ($.trim(id_departamento) != '' || id_departamento == 0) {

            $.ajax({
                type: "GET",
                url: '/api-sat/municipality/' + id_departamento + '/list',
                success: function (result) {

                    $('#id_municipio').empty();
                    var value = Object.values(result.municipalities);
                    if (Object.values(result.municipalities).length == 0) {
                        $('#id_municipio').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {
                        for (var i = 0; i < value.length; i++) {
                            $('#id_municipio').append("<option value='" + value[i].id_municipio + "'>" + value[i].descripcion + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_municipio').empty();
            $('#id_municipio').append("<option value ='0'>Seleccionar</option>");
        }
    });
});

//-- Form Early Alert
$(document).ready(function () {
    $('#id_tematica_relacionada').on('change', function () {
        var id_tematica_relacionada = $(this).children("option:selected").val();
        if ($.trim(id_tematica_relacionada) != '') {
            console.log(id_tematica_relacionada);
            $.ajax({
                type: "GET",
                url: '/api-sat/subtopic/' + id_tematica_relacionada + '/list',
                success: function (result) {

                    $('#id_sub_tematica').empty();
                    var value = Object.values(result.subtopics);
                    console.log(value);
                    if (Object.values(result.subtopics).length == 0) {
                        $('#id_sub_tematica').append("<option value =''>Ningún dato encontrado</option>");
                    } else {
                        $('#id_sub_tematica').append("<option value =''>Seleccionar</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_sub_tematica').append("<option value='" + value[i].id_subtema + "'>" + value[i].nombre_subtema + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_sub_tematica').empty();
            $('#id_situacion_conflictiva').empty();
            $('#id_criterio').empty();
            $('#id_sub_tematica').append("<option value =''>Seleccionar</option>");
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar</option>");
            $('#id_criterio').append("<option value =''>Seleccionar</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_sub_tematica').on('change', function () {
        var id_subtematica = $(this).children("option:selected").val();
        if ($.trim(id_subtematica) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/situacion_conflictiva/' + id_subtematica + '/list',
                success: function (result) {

                    $('#id_situacion_conflictiva').empty();
                    var value = Object.values(result.situations);
                    if (Object.values(result.situations).length == 0) {
                        $('#id_situacion_conflictiva').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {
                        $('#id_situacion_conflictiva').append("<option value =''>Seleccionar</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_situacion_conflictiva').append("<option value='" + value[i].id_situacion_conflictiva + "'>" + value[i].nombre_sit_conflictiva + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_situacion_conflictiva').empty();
            $('#id_criterio').empty();
            $('#id_criterio').append("<option value =''>Seleccionar</option>");
            $('#id_situacion_conflictiva').append("<option value =''>Seleccionar</option>");
        }
    });
});

$(document).ready(function () {
    $('#id_situacion_conflictiva').on('change', function () {
        var id_situacion_conflictiva = $(this).children("option:selected").val();
        if ($.trim(id_situacion_conflictiva) != '') {

            $.ajax({
                type: "GET",
                url: '/api-sat/criterio/' + id_situacion_conflictiva + '/list',
                success: function (result) {

                    $('#id_criterio').empty();
                    var value = Object.values(result.criterios);
                    if (Object.values(result.criterios).length == 0) {
                        $('#id_criterio').append("<option value ='0'>Ningún dato encontrado</option>");
                    } else {
                        $('#id_criterio').append("<option value =''>Seleccionar</option>");
                        for (var i = 0; i < value.length; i++) {
                            $('#id_criterio').append("<option value='" + value[i].id_criterio + "'>" + value[i].nombre_criterio + "</option>");
                        }
                    }
                },
                error: function (err) {
                    console.log('err ', err)
                }
            });
        
        } else {
            $('#id_criterio').empty();
            $('#id_criterio').append("<option value =''>Seleccionar</option>");
        }
    });
});
