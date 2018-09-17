'use strict';

const vices = [
  {
    name: 'starbucks',
    label: 'Starbucks Coffee',
    cost: 5,
    alt: 'Starbucks coffee logo',
  },
  {
    name: 'fastFood',
    label: 'Fast Food',
    cost: 8,
    alt: 'taco bell logo',
  },
  {
    name: 'microtransactions',
    label: 'Microtransactions',
    cost: 20,
    alt: 'Mario holding coins',
  },
  {
    name: 'coke',
    label: 'Soft Drinks',
    cost: 2,
    alt: 'Coca Cola Logo',
  },
  {
    name: 'beer',
    label: 'Beer',
    cost: 6,
    alt: 'Glass of beer',
  },
  {
    name: 'cigarettes',
    label: 'Cigarettes',
    cost: 10,
    alt: 'Pack of cigarettes',
  },
];

let w, h;
let dataset = [];
let choice, tickerSelection  = '';
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


function renderPage() {
  vices.forEach(function (item, choice) {
    $('.choice-list').append(`<li class="list-images" data-choice="${item.name}"><img src="Images/${item.name}.png" alt="${item.alt}" tabindex="0"/></li>`);
    $('choice-made').hide();
    $('.stock-options').hide();
    $('.graph-container').hide();
    handleSelection();
  });
}

function handleSelection() {
  $('.choice-list').on('click keypress', 'li', function (event) {
    choice = $(this).attr('data-choice');
    $('.choice-image').html(`<img src="Images/${choice}.png"/></li>`);
    $('.choice-list').hide();
    $('.choice-made').hide();
    $('.choice-made').show();
    $('.stock-options').show();
    let userSelection = '';
    let upperCaseChoice = userSelection.toUpperCase();
    $('.logo-container').html(`<h1>YOU'VE SELECTED ${upperCaseChoice}</h1>`);
    $('.bannerArea').hide();

    vices.forEach(function (item, index) {
      if (item.name === choice) {
        userSelection = item.label;
      }
    });

  });
  handleTickers();
  goBack();
}

function handleTickers() {
  $('.stock-options').on('click', 'button', function (event) {
    tickerSelection = $(this).attr('data-selection');
    $('.graph-container').show();
    getApiData();
  });
}

function getApiData() {
  $('.logo-container').empty()
  $.getJSON(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${tickerSelection}&datatype=json&apikey=7SGRMU6L5ATDS0W1`)
    .done(function (response) {
      let stockData = response;
      const rmts = stockData['Monthly Time Series'];
      dataset.push(stockData['Monthly Time Series']['2017-01-31']['4. close'], rmts['2017-02-28']['4. close'], rmts['2017-03-31']['4. close'], rmts['2017-04-28']['4. close'], rmts['2017-05-31']['4. close'], rmts['2017-06-30']['4. close'], rmts['2017-07-31']['4. close'], rmts['2017-08-31']['4. close'], rmts['2017-09-29']['4. close'], rmts['2017-10-31']['4. close'], rmts['2017-11-30']['4. close'], rmts['2017-12-29']['4. close']);

      let x = 0;
      let len = dataset.length;
      while (x < len) {
        dataset[x] = parseFloat(dataset[x]).toFixed(0);
        x++
      }

      let stockChoiceStart = stockData['Monthly Time Series']['2017-01-31']['4. close'];
      stockChoiceStart = parseFloat(stockChoiceStart).toFixed(0);
      let stockChoiceFin = stockData['Monthly Time Series']['2018-01-31']['4. close'];
      stockChoiceFin = parseFloat(stockChoiceFin).toFixed(0);
      let viceYearlyCost = 0;
      let label = "";
      vices.forEach(function (item, index) {
        if (item.name === choice) {
          viceYearlyCost = (item.cost * 365);
          label = item.label;
        }

      });
      let initialShares = viceYearlyCost / stockChoiceStart;
      initialShares = initialShares.toFixed(0);
      let finalGain = (initialShares * stockChoiceFin) - viceYearlyCost;
      finalGain = finalGain.toFixed(0);
      let totalMoney = parseInt(finalGain) + parseInt(viceYearlyCost);

      $('.logo-container').html(`<h2>Spending money on ${label} may not seem like much at the time,</br> but a year's worth adds up to $${viceYearlyCost}! </h2>`);
      $('.gains').html(`<h2>If you took a years worth of ${label} and invested it in ${tickerSelection} your profits in 1 year would have been $${finalGain}!</h2><h3>${label} cost per year is $${viceYearlyCost}. Initial shares you can purchase, ${initialShares} at $${stockChoiceStart} each. Shares sold after 1 year at $${stockChoiceFin} each. </br>That brings your total to $${totalMoney}! </h3>`);

      let largestNumber = 0;
      for (let i = 0; i < dataset.length; i++) {
        if (parseInt(dataset[i]) > largestNumber) {
          largestNumber = parseInt(dataset[i]);
        }
      }
      h = parseInt(largestNumber * 2) + 100;
      handleGraph();
    });
};

function handleGraph() {
  $('.graph-description').show();
  $('.gains').show();
  $('.graph-container').html(`<canvas id="myChart"></canvas>`);

  //This code keeps our graph's highest $ amount relative to current stock choice
  let dLength = dataset.length;
  if (dLength > 12) { dataset.splice(0, dLength - 12); }

  let ctx = document.getElementById('myChart').getContext('2d');
  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      datasets: [{
        label: "Stock Performance Jan - Dec 2017",
        backgroundColor: 'rgb(37, 139, 187)',
        borderColor: 'rgb(37, 139, 187)',
        data: dataset,
      }]
    },
    options: {
      maintainAspectRation: false,
      scales: {
        yAxes: [{
          stacked: true,
          gridlines: {
            display: true,
            color: "rgba(0, 0, 0, 0.4)",
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }]
      }
    }

  });
}

function goBack() {
  $('.choice-made').on('click', 'button', function (event) {
    dataset = [];
    $('.choice-made').hide();
    $('.stock-options').hide();
    $('.choice-list').show();
    $('.gains').hide();
    $('.graph-container').hide();
    $('.logo-container').html(`<h1>Click on one of the following vices you throw money at every day</h1>`);
  });
}

$(renderPage);




