var rows = 10;
var data = new Array();
var calculator;
var savedGraph1 = "";
var savedGraph2 = "";
var selectedOption = "Qs";

/*
 getData() - gets data from table or create empty table
 render() - create table with data
 calculate() - determine results
 display() - inserts data
 graph() - create graph
*/

window.onload = function(){
  getData();
  render();

  //graph
  calculator = Desmos.GraphingCalculator($('#calculator')[0],{zoomButtons:false,expressions:false,lockViewport:true,settingsMenu:false});

  calculator.updateSettings({yAxisLabel:'Price',xAxisLabel:'Qs/Qd'})

  calculator.setMathBounds({
    left: 0,
    bottom: 0,
    right: 10,
    top: 10
  });

  graph();

  if(window.location.hash){
    console.log(window.location.hash);

    data = JSON.parse(window.location.hash.replace('#',''));

    render();
    display();
    graph();
  }
}

window.onkeyup = function(){
  getData();
  calculate();
  display();
  graph();
}

function render(){
  //display the first time
  $('.results').html("");

  for(var i = 0; i < data.length; i++){
    $('.results').append("<tr class='row_" + i + "'><td><input placeholder='$' class='p money' value='" + data[i].P + "'></input></td><td class='qs'><input class='p' value='" + data[i].Qs + "'></input></td><td class='qd'><input class='p' value='" + data[i].Qd + "'></input></td><td class='e es'>" + data[i].Es + "</td><td class='e ed'>" + data[i].Ed + "</td><td class='tr'>" + data[i].Tr + "</td></tr>");
  }
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
        "P" : ""//Math.round(((1 - (e/10))*10))/10
        , "Qs" : ""//((10*2) - e*2) * 10
        , "Qd" : ""//(e*2) * 20
        , "Es" : ""
        , "Ed" : ""
        , "Tr" : ""
    }
  }

  //save data
  data = TableData;
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

    if(data[i].P == 'NaN' || data[i].P == 0){ data[i].P = ""; }
    if(data[i].Qs == 'NaN' || data[i].Qs == 0){ data[i].Qs = ""; }
    if(data[i].Qd == 'NaN' || data[i].Qd == 0){ data[i].Qd = ""; }
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

/******************** end mains *********************/

function importData(){
  data = JSON.parse($('#import').val());

  render();
  display();
  graph();
}

function exportData(){
  var value = JSON.stringify(data);
  while(value.indexOf('null') > 0){
    value = value.replace('null','\"\"');
  }
  $('#export').val(value);
}

function adjust(value,thing){
  if(value.indexOf('%')){
    value = value.replace('%','\"\"');
    percentage = true;
  }

  value = parseFloat(value);

  for(var i = 0; i < data.length; i++){
    if(data[i][thing]){
      data[i][thing] = data[i][thing] = data[i][thing] + (data[i][thing] * value/100);
    }

    if(!data[i].P) { data[i].P = ""; }
    if(!data[i].Qs){ data[i].Qs = ""; }
    if(!data[i].Qd){ data[i].Qd = ""; }
  }

  render();
  calculate();
  graph();
  display();
}

function graph(){
  //set values
  var p = new Array();
  var Qd = new Array();
  var Qs = new Array();

  for(var i = 0; i < data.length; i++){
    Qd[i] = parseFloat(data[i].Qd);
    Qs[i] = parseFloat(data[i].Qs);
    p[i] = parseFloat(data[i].P);
  }

  p.clean();
  Qd.clean();
  Qs.clean();

  calculator.setMathBounds({
    left: 0,
    bottom: 0,
    right: Math.max(max(Qs),max(Qd)),
    top: max(p)
  });

  /* saved graph */
  calculator.setExpression({
    id: 'graph1',latex:savedGraph1, color: '#eec7b6'
  });

  calculator.setExpression({
    id: 'graph2',latex:savedGraph2, color: '#f9e7ff'
  });

  /* demand */
  calculator.setExpression({
    id: 'table1',
    type: 'table',
    columns: [
      { /* Qd */
        latex: 'x',
        values: Qd
      },
      { /* P */
        latex: 'y',
        values: p,
        color: Desmos.Colors.PURPLE
      },
      { /* Demand Curve */
        latex: lineOfBestFit(Qd,p),
        color: Desmos.Colors.PURPLE,
        columnMode: Desmos.ColumnModes.LINES
      }
    ]
  });

  /* supply */
  calculator.setExpression({
    id: 'table2',
    type: 'table',
    columns: [
      { /* Qs */
        latex: 'x',
        values: Qs
      },
      { /* P */
        latex: 'y',
        values: p,
        color: Desmos.Colors.RED
      },
      { /* Supply Curve */
        latex: lineOfBestFit(Qs,p),
        color: Desmos.Colors.RED,
        columnMode: Desmos.ColumnModes.LINES
      }
    ]
  });

  /* equlibrium */
  var eq = equlibrium(p,Qd,Qs);

  calculator.setExpression({
    id: 'equlibrium',
    type: 'table',
    columns: [
      {
        latex: 'x',
        values: [parseFloat(eq.x)]
      },
      {
        latex: 'y',
        values: [parseFloat(eq.y)],
        color: Desmos.Colors.BLUE
      }
    ]
  });
}

function save(){
  //set values
  var p = new Array();
  var Qd = new Array();
  var Qs = new Array();

  for(var i = 0; i < data.length; i++){
    Qd[i] = parseFloat(data[i].Qd);
    Qs[i] = parseFloat(data[i].Qs);
    p[i] = parseFloat(data[i].P);
  }

  p.clean();
  Qd.clean();
  Qs.clean();

  savedGraph1 = lineOfBestFit(Qs,p);
  savedGraph2 = lineOfBestFit(Qd,p);
}

function max(array){
  var max = 0;
  for(var i = 0; i < array.length; i++){
    if(array[max] < array[i]){
      max = i;
    }
  }

  return array[max];
}

function bestfit(values_x, values_y) {
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var count = 0;

  /*
   * We'll use those variables for faster read/write access.
   */
  var x = 0;
  var y = 0;
  var values_length = values_x.length;

  /*
   * Calculate the sum for each of the parts necessary.
   */
  for (var v = 0; v < values_length; v++) {
      x = values_x[v];
      y = values_y[v];
      sum_x += x;
      sum_y += y;
      sum_xx += x*x;
      sum_xy += x*y;
      count++;
  }

  /*
   * Calculate m and b for the formular:
   * y = x * m + b
   */
  var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
  var b = (sum_y/count) - (m*sum_x)/count;

  if(b < 0){

    b = 0;
    console.log(values_y[0] + ";" + b + "," + m);
  }

  return {m:m,b:b};
}

function lineOfBestFit(a,b){
  var obj = bestfit(a,b);

  return "x*" + obj.m + "+" + obj.b;
}

function equlibrium(x_values,y1_values,y2_values){
  var func = bestfit(x_values,y1_values);
  var func2 = bestfit(x_values,y2_values);
  var x = 0;
  var y = 0;
  var found = false;

  y = (func2.b-func.b)/(func.m - func2.m);
  x = y * func.m + func.b;

  return {x:x,y:y};
}

/* clears all 'false' values */
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (!this[i]) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
