function getStateData(data, state) {
  let statedata = [];
  for (const point of data) {
    if (point['state'] == state) {
      statedata.push(point)
    }
  }
  return statedata
}

function formatDates(data) {
  let dates = []
  for (const pt of data) {
    strdate = pt['date'].toString()
    year = strdate.slice(0, 4)
    month = strdate.slice(4, 6)
    day = strdate.slice(6, 8)

    dates.push(`${month}/${day}/${year}`)
  }
  return dates
}

function getDerivativeData(data) {
  delta = []
  for (let i = 0; i < data.length; i++) {
    let idx = i == 0 ? 1 : i

    delta.push(data[idx]['death'] - data[idx - 1]['death'])
  }
  return delta
}

function createChart(data, state) {
  var statedata = getStateData(data, state)
  var ctx = document.getElementById('covid').getContext('2d')
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: formatDates(statedata),
      datasets: [
        {
          label: 'Covid Deaths (total)',
          data: statedata.map(day => day['death']),
          borderColor: 'rgba(72, 192, 192, 1)',
          backgroundColor: 'rgba(72, 192, 192, 0.2)',
          borderWidth: 1
        },
        {
          label: 'Covid deaths/day',
          data: getDerivativeData(statedata),
          borderColor: 'rgba(192, 10, 192, 1)',
          backgroundColor: 'rgba(192, 10, 192, 0.2)',
          borderWidth: 1
        }
      ]
    },
  });
}

function fetchData(state) {
  fetch('https://covidtracking.com/api/v1/states/daily.json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      createChart(data.reverse(), state.toUpperCase());
    });
}

$('#state').keypress(function (e) {
  if (e.which == 13) {
    fetchData($('#state').val())
    return false
  }
})

$('#submit').click(function () {
  fetchData($('#state').val())
})
