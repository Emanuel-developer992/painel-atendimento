window.onload = function() {
    calendario();
    dataset();
    filter();
    hoje();
};

function calendario() {
    webix.i18n.setLocale("pt-BR");

    webix.ui({
        view:"calendar",
        container: "container1",
        id: "calenderID",
        date:new Date(),
        weekHeader:true,
        events:webix.Date.isHoliday,
        width: 370,
        height: 270,
        multiselect:"touch",
    });

    var selectData = [];
    var dataset = DatasetFactory.getDataset("DSFormulariodeAgenda", null, null, null);
    var nRow = dataset.values.length;

    for (var i = 0; i < nRow; i++) {
        var data = dataset.values[i].data_ag;

        var dia = data.substring(8, 10);
        var mes = data.substring(5, 7);
        var ano = data.substring(0, 4);

        dia = parseInt(dia);
        mes = parseInt(mes) - 1;

        selectData.push(new Date(ano,mes,dia));
    }
    
    $$("calenderID").selectDate(selectData);

};

function dataset() {
    var dataset = DatasetFactory.getDataset("DSFormulariodeAgenda", null, null, null);
    console.log(dataset);

    var clickCR = 0;

    var nRow = dataset.values.length;

    for (var i = 0; i < nRow; i++) {
        clickCR++;
        var aTb = [];
        var table = document.getElementById("tb_agenda");

        var d1 = dataset.values[i].participante;
        var d2 = dataset.values[i].orc;
        var d3 = dataset.values[i].setor;
        var d4 = dataset.values[i].estudo;
        var d5 = dataset.values[i].data_ag;
        var d6 = dataset.values[i].hrs;

        d5 = d5.substring(8, 10)+'/'+d5.substring(5, 7)+'/'+d5.substring(0, 4);
        
        aTb.push(d1);
        aTb.push(d2);
        aTb.push(d3);
        aTb.push(d4);
        aTb.push(d5+' - '+d6);
        aTb.push('<button type="button" class="btn btn-agenda open"><i class="flaticon flaticon-send icon-sm"></i></buttom>');
	
        var numOfRows = table.rows.length;
        
        var numOfCols = 6;
        
        var newRow = table.insertRow(numOfRows);
        
        for (var j = 0; j < numOfCols; j++) {
        
            newCell = newRow.insertCell(j);
            
            newCell.innerHTML = aTb[j];
        }

    }
    $(".open").bind("click", Editar);

    
}

function Editar() {

    thisRow = $(this).parent().parent();

    var td0 = thisRow[0].innerHTML;
    var tratamento = td0.replaceAll("</td>","");
    var arrayThis = tratamento.split("<td>");
    console.log(arrayThis);

    $("#painel_nav").removeClass('active');
    $("#painel_nav").addClass('nav-close');

    $("#atendimento_nav").addClass('active');
    $("#atendimento_nav").removeClass('nav-close');

    var c1 = DatasetFactory.createConstraint("idO", arrayThis[2], arrayThis[2], ConstraintType.MUST);
    var constraints = new Array(c1);

    var dataset = DatasetFactory.getDataset("DSCadastroGeral", null, constraints, null);

    $("#participante").val(arrayThis[1]);
    $("#nEstudo").val(dataset.values[0].nProj);
    $("#orc").val(arrayThis[2]);
    $("#setor").val(arrayThis[3]);
    $("#estudo").val(arrayThis[4]);
    $("#setData").val(arrayThis[5]);

    var title = document.getElementById('jumName');
    title.innerHTML = arrayThis[1];

}

function cancelar() {
    $("#atendimento_nav").removeClass('active');
    $("#atendimento_nav").addClass('nav-close');
    $("#painel_nav").addClass('active');
    $("#painel_nav").removeClass('nav-close');


    $("#participante").val("");
    $("#nEstudo").val("");
    $("#orc").val("");
    $("#setor").val("");
    $("#estudo").val("");
    $("#setData").val("");
}
                             
function filter() {
    $("#filter").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#dadosFilter tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
};

$("#save").click(function(){
    descFormId();
    setTimeout(function(){
        $("#workflowActions > button:first-child", window.parent.document).click();
    }, 200); 
});

function descFormId() {
		
    var orc = $('#orc').val();
    var setor = $('#setor').val();
    var partic = $('#participante').val();
    var data = $('#setData').val();

    var dataset = DatasetFactory.getDataset("processAttachment", null, null, null);
    var nRow = dataset.values.length;

    var nProcess = dataset.values[nRow-1]['processAttachmentPK.processInstanceId'];

    $('#descForm').val(nProcess+1+' : '+partic+' - '+data+' - '+setor);
    
};

function hoje() {

    var hj = new Date();
    var seman = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    var dia = hj.getDate();
    var mes = hj.getMonth();
    var ano = hj.getFullYear();

    var title = document.getElementById('today');
    title.innerHTML = dia+' '+seman[mes]+', '+ano;

};

function timeMax() {
    var hrs1 = $("#hrs_aten").val();
    var hrs2 = $("#hrs_fim").val();

    var h1 = hrs1.substring(0, 2);
    var m1 = hrs1.substring(3, 5);

    var h2 = hrs2.substring(0, 2);
    var m2 = hrs2.substring(3, 5);

    var m3 = (parseInt(h1) * 60) + parseInt(m1);
    var m4 = (parseInt(h2) * 60) + parseInt(m2);
    
    var mT = m4 - m3;
    var hT = mT / 60;

    if (hT < 1) {
        hT = '00'
    }
    else {
        if (hT > 9) {
            hT = hT.toString().substring(0, 2);
        }
        else {
            hT = hT.toString().substring(0, 1);
        }
        mT = mT - (parseInt(hT) * 60);
        if(hT < 10) {
            hT = "0"+hT; 
        }
    }
    if(mT < 10) {
        mT = '0'+mT
    }

    if (hT < 0 || mT < 0) {
        hT = '00';
        mT = '00';
    }

    $("#hrs_time").val(hT+':'+mT);

};

$(document).on('change', "#hrs_aten",
    function atenIni() {
       timeMax();
    });

    $(document).on('change', "#hrs_fim",
    function atenFim() {
       timeMax();
    });

