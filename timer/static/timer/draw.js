// chart.jsによる棒グラフの記述-------------------

var ctx = document.getElementById("bargraph").getContext('2d');
ctx.canvas.width = 400;
ctx.canvas.height = 290;
let myChart = new Chart(ctx, json); 

