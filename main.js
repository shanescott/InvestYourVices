'use strict';


const choices = ['starbucks', 'fast food', 'micro', 'coke', 'beer', 'cigarettes'];

const viceCosts = [
  {
    name: 'starbucks',
    cost: 5,
  },
  {
    name: 'fast food',
    cost: 8,
  },
  {
    name: 'microtransactions',
    cost: 20,
  },
  {
    name: 'coke',
    cost: 2,
  },
  {
    name: 'beer',
    cost: 6,
  },
  {
    name: 'cigarettes',
    cost: 10,
  },
];

const w = 700;
const h = 500;
let dataset = [];

$(document).ready(function () {
  choices.forEach(function (choice) {
    $('.choice-list').append(`<li class="list-images" data-choice="${choice}"><img src="./Images/${choice}.png"/></li>`);
  });

  $('.choice-list').on('click', 'li', function (event) {
    let choice = $(this).attr('data-choice')
    $('.choice-list').empty().append($(`<li class="list-images" data-choice="${choice}"><img src="./Images/${choice}.png"/></li>`));
    $('.logo-container').empty().append(`<h1>Select a stock option below</h1>`)
    $('.stock-options').append(`<button class="tickerBtn" data-selection="AAPL">AAPL</button><button class="tickerBtn" data-selection="PYPL">PYPL</button><button class="tickerBtn" data-selection="GOOGL">GOOGL</button><button class="tickerBtn" data-selection="FB">FB</button>`);
    // $('.graph-container').append($(`<img src="https://docs.oracle.com/javafx/2/charts/img/line-order.png"/>`)).hide().fadeIn(1000);
    //placeholder img of stock chart while I learn D3!!!

    $('.stock-options').on('click', 'button', function (event) {
      event.preventDefault();
      let tickerSelection = $(this).attr('data-selection');
      $('.logo-container').empty()
      $.getJSON(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${tickerSelection}&datatype=json&apikey=FA5ZDI5DSTULG7FP`)
        .done(function (response) {
          let jsonData = response;
          const rmts = jsonData['Monthly Time Series'];
          dataset.push(jsonData['Monthly Time Series']['2017-01-31']['4. close'], rmts['2017-02-28']['4. close'], rmts['2017-03-31']['4. close'], rmts['2017-04-28']['4. close'], rmts['2017-05-31']['4. close'], rmts['2017-06-30']['4. close'], rmts['2017-07-31']['4. close'], rmts['2017-08-31']['4. close'], rmts['2017-09-29']['4. close'], rmts['2017-10-31']['4. close'], rmts['2017-11-30']['4. close'], rmts['2017-12-29']['4. close']);
          console.log(dataset);
          let x = 0;
          let len = dataset.length;
          while (x < len) {
            dataset[x] = parseFloat(dataset[x]).toFixed(0);
            x++
          }

          let stockChoiceStart = response['Monthly Time Series']['2017-01-31']['4. close'];
          stockChoiceStart = parseFloat(stockChoiceStart).toFixed(0);
          let stockChoiceFin = response['Monthly Time Series']['2018-01-31']['4. close'];
          stockChoiceFin = parseFloat(stockChoiceFin).toFixed(0);
          console.log(stockChoiceStart);
          console.log(stockChoiceFin);
          let viceYearlyCost = 0;
          viceCosts.forEach(function (item, index) {
            if (item.name === choice)
              viceYearlyCost = (item.cost * 365);

          });
          console.log(viceYearlyCost);
         let initialShares = viceYearlyCost / stockChoiceStart;
          initialShares = initialShares.toFixed(0);
          let finalGain = (initialShares * stockChoiceFin) - viceYearlyCost;
          finalGain = finalGain.toFixed(0);
          
          $('.logo-container').append(`<h2>Spending money on ${choice} may not seem like much at the time, but a years worth of ${choice} adds up to $${viceYearlyCost}! </h2>`);
          $('.gains').append(`<h2>If you took a year worth of ${choice} and invested in ${tickerSelection} your profits in 1 year would have been $${finalGain}</h2><h3>Vice cost per year $${viceYearlyCost}. Initial shares you can purchase, ${initialShares} at $${stockChoiceStart} each. Shares sold after 1 year at $${stockChoiceFin} each</h3>`);

          let svg = d3.select('.graph-container')
            .append('svg')
            .attr('height', h)
            .attr('width', w);
            


          svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr("height", (d, i) => `${d * 2}px`)
            .attr("width", 50)
            .attr("x", (d, i) => i * 80)
            .attr("y", (d, i) => h - (d * 2))
            .attr('class', 'bars');
          

          svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text((d) => d)
            .attr("x", (d, i) => i * 95)
            .attr("y", (d, i) => h - (d * 2) - 2);
            
          //viceYearlyCost = user's choice's cost * 365. Then use viceYearlyCost in your equations to find their investment gains

          //viceYearlyCost / stockChoiceStart = X

          //X * stockChoiceFin = totalMoney; totalMoney - viceYearlyCost = investmentGain

        });


    });
  });
});





