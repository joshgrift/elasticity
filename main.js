var rows = 10;
var data = new Array();

window.onload = function(){
  getData();

  //display the first time
  $('.results').html("");

  for(var i = 0; i < data.length; i++){
    $('.results').append("<tr class='row_" + i + "'><td><input placeholder='$' class='p money' value='" + data[i].P + "'></input></td><td><input class='p' value='" + data[i].Qs + "'></input></td><td><input class='p' value='" + data[i].Qd + "'></input></td><td class='e es'>" + data[i].Es + "</td><td class='e ed'>" + data[i].Ed + "</td><td class='tr'>" + data[i].Tr + "</td></tr>");
  }
}

window.onkeyup = function(){
  getData();
}

function getData(){
  var TableData = new Array();

  //collect data
  $('.results tr').each(function(row, tr){
      TableData[row]={
          "P" : parseFloat($(tr).find('input').val())
          , "Qs" : parseFloat($(tr).find('input:eq(1)').val())
          , "Qd" : parseFloat($(tr).find('input:eq(2)').val())
          , "Es" : 0
          , "Ed" : 0
          , "Tr" : 0
      }
  });

  for(var e = TableData.length; e <= rows; e++){
    TableData[e]={
        "P" : ""
        , "Qs" : ""
        , "Qd" : ""
        , "Es" : ""
        , "Ed" : ""
        , "Tr" : ""
    }
  }

  //calculating
  data = TableData;
  calculate();

  //display
  display();
}

function calculate(){
  for(var i = 0; i < data.length; i++){
    //total revenue
    if(data[i].Qd > data[i].Qs){
      data[i].Tr = data[i].P*data[i].Qs;
    } else {
      data[i].Tr = data[i].P*data[i].Qd;
    }


    if(i != 0){
      //supply
        data[i].Es = Math.abs(((data[i].Qs - data[i-1].Qs)/((data[i].Qs + data[i-1].Qs)/2))/((data[i].P - data[i-1].P)/((data[i].P + data[i-1].P)/2))).toFixed(2);

      //demand
        data[i].Ed = Math.abs(((data[i].Qd - data[i-1].Qd)/((data[i].Qd + data[i-1].Qd)/2))/((data[i].P - data[i-1].P)/((data[i].P + data[i-1].P)/2))).toFixed(2);
    }

    if(data[i].Ed == 'NaN' || data[i].Ed == 0){ data[i].Ed = ""; }
    if(data[i].Es == 'NaN' || data[i].Es == 0){ data[i].Es = ""; }
    if(data[i].Tr == 'NaN' || data[i].Tr == 0){ data[i].Tr = ""; }
  }
}

function display(){
  for(var i = 0; i < data.length; i++){
    $('.row_' + i + ' .es').removeClass('elastic');
    $('.row_' + i + ' .es').removeClass('inelastic');
    $('.row_' + i + ' .es').removeClass('unitary');

    if(data[i].Es == ""){ } else if(data[i].Es > 1){
      $('.row_' + i + ' .es').addClass('elastic');
    } else if(data[i].Es < 1){
      $('.row_' + i + ' .es').addClass('inelastic');
    } else if(data[i].Es == 1){
      $('.row_' + i + ' .es').addClass('unitary');
    }


    $('.row_' + i + ' .ed').removeClass('elastic');
    $('.row_' + i + ' .ed').removeClass('inelastic');
    $('.row_' + i + ' .ed').removeClass('unitary');

    if(data[i].Ed == ""){ } else if(data[i].Ed > 1){
      $('.row_' + i + ' .ed').addClass('elastic');
    } else if(data[i].Ed < 1){
      $('.row_' + i + ' .ed').addClass('inelastic');
    } else if(data[i].Ed == 1){
      $('.row_' + i + ' .ed').addClass('unitary');
    }


    $('.row_' + i + ' .es').html(data[i].Es);
    $('.row_' + i + ' .ed').html(data[i].Ed);
    $('.row_' + i + ' .tr').html("$" + data[i].Tr);
  }
}
