function drawPieChart(data) {

  data.totalTracked -= data.totalVac - data.totalEconomyBan - data.totalGameBan;

  const options = {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: ['Not banned', 'VAC Ban', 'Game ban', 'Economy ban'],
    series: [data.totalTracked, data.totalVac, data.totalGameBan, data.totalEconomyBan],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  var chart = new ApexCharts(
    document.querySelector("#pie-chart"),
    options
  );

  chart.render();

}

function drawBarChart(data) {

  const trackedData = [];
  const banData = [];
  const months = [];

  for (const date in data) {
    if (data.hasOwnProperty(date)) {
      const element = data[date];
      const dateObj = new Date(parseInt(date));
      if (element.totalTracked || element.totalBanned) {
        trackedData.push(element.totalTracked);
        banData.push(element.totalBanned);
        months.push(dateObj.toLocaleString('default', {
          month: 'long'
        }))
      }
    }
  }
  var options = {
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [{
      name: 'New accounts tracked',
      data: trackedData
    }, {
      name: 'Banned accounts',
      data: banData
    }],
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: '$ (thousands)'
      }
    },
    fill: {
      opacity: 1

    },
  }

  var chart = new ApexCharts(
    document.querySelector("#bar-chart"),
    options
  );

  chart.render();


}
