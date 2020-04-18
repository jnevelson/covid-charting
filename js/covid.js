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

function getRatePerDay(data, attr) {
  rates = []
  let i = 0
  while (true) {
    if (data[i + 1] === undefined || data[i + 1][attr] === undefined) {
      break
    }
    let rate = data[i][attr] - data[i + 1][attr]
    day = { 'date': data[i]['date'] }
    day[attr] = rate
    rates.push(day)
    i++
  }
  return rates
}

function createChart(data, state) {
  var statedata = getStateData(data, state)
  var deaths = getRatePerDay(statedata, 'death').reverse()
  debugger
  var ctx = document.getElementById('covid').getContext('2d')

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: formatDates(deaths),
      datasets: [
        {
          label: 'Covid deaths/day',
          data: deaths.map(rate => rate['death']),
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
      createChart(data, state.toUpperCase());
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
