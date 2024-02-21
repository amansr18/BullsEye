var curr_close = 0;
var buy=0;
console.log(curr_close);


//chart update



        const chartProperties = {
          width:1100,
          height:500,
          timeScale:{
            timeVisible:true,
            secondsVisible:false,
          }
        }

          const domElement = document.getElementById('tvchart');
          const chart = LightweightCharts.createChart(domElement,chartProperties);
          const candleSeries = chart.addCandlestickSeries();



        var symbol = 'BTCUSDT'
        fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
          .then(res => res.json())
          .then(data => {
            const cdata = data.map(d => {
              return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
            });
            candleSeries.setData(cdata);
          })
          .catch(err => console.log(err));


        const socket = new WebSocket('ws://localhost:8000/ws/kline/');

        // Function to handle WebSocket connection open event
        socket.onopen = function(event) {
          console.log('WebSocket connected');
        };

        socket.onmessage = function(event) {
          // Parse the received data
          const data = JSON.parse(event.data);
          // Check if the message event corresponds to 'kline'
          console.log(data);
          
              // Extract candlestick data
            var newsymbol = data[0];
            const newDataObject = {
                time: parseFloat(data[1]),
                open: parseFloat(data[2]),
                high: parseFloat(data[3]),
                low:  parseFloat(data[4]),
                close: parseFloat(data[5])
            };
            curr_close = newDataObject.close;
            
            if(newsymbol != symbol){
              symbol = newsymbol;
              url = `https://api.binance.com/api/v3/klines?symbol=${newsymbol}&interval=1m&limit=1000`;
              fetch(url)
                .then(res => res.json())
                .then(data => {
                  const cdata = data.map(d => {
                    return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
                  });
                  candleSeries.setData(cdata);
                })
                .catch(err => console.log(err));
            }
            
            
            console.log(newDataObject);
        
              // Update the candlestick series with the new data
              candleSeries.update(newDataObject);

              // Update LTP in position table if applicable
              updateLTPInPositionTable(newDataObject);
            };


        socket.onclose = function(event) {
          console.log('WebSocket closed');
        };

//subscribe to new chart data
        function subscribeToPair(pair) {
          const chartInfo = document.getElementById('chart-title');
          chartInfo.textContent = pair;
          const message = {
              trading_pair: pair
          };
          console.log('Subscribing to', pair);
          socket.send(JSON.stringify(message));
      }

//add new Instrument to the sidebar
document.addEventListener("DOMContentLoaded", function() {
  const addButton = document.getElementById("add_btn");
  const sidebar = document.getElementById("sidebar");
  const addCurrencyInput = document.getElementById("addcurrency_search");

  addButton.addEventListener("click", function() {
     const newCurrencyTitle = addCurrencyInput.value;
      const newCurrency = document.createElement("div");
      newCurrency.id = "currency";
      newCurrency.innerHTML = `
          <div id="cur_title">${newCurrencyTitle}</div>
          <div id="order_btn">
              <button id="btn" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#reg-modal">BUY</button>
              <button id="btn" type="button" class="btn btn-danger">SELL</button>
          </div>
      `;
      sidebar.appendChild(newCurrency);
  });
});




// Function to update LTP in the position table
function updateLTPInPositionTable(newDataObject) {
  const positions = document.querySelectorAll('.position');
  positions.forEach(position => {
    const pair = position.querySelector('#pos-title').innerText;
    const ltpSpan = position.querySelector(`#ltp-${pair}`);
    const profitLoss = (newDataObject.close - buy) * 10;
    if (ltpSpan) {
      ltpSpan.textContent = profitLoss.toFixed(2);

      // Set color based on profit/loss
      if (profitLoss > 0) {
        ltpSpan.style.color = 'green';
      } else if (profitLoss < 0) {
        ltpSpan.style.color = 'red';
      } else {
        ltpSpan.style.color = ''; // Reset to default if profitLoss is 0
      }
    }
  });
}

//add new position to the position table

function addPosition() {
  const positionTable = document.getElementById("position-box");
  var pair = document.getElementById("model-pair").innerText;
  var quantity = document.getElementById("qty").value;
  var type = document.getElementById("model-title").innerText;
  buy = curr_close;
  const newPosition = document.createElement("div");
  newPosition.classList.add("position");
  newPosition.id = "position";
  newPosition.innerHTML = `
      <div id="pos-title"><b>${pair}</b></div>
      <div id="pos-title">${quantity}</div>
      <div id="pos-title">${type}</div>
      <div id="pos-title" ><span id="ltp-${pair}" style="color: black; font-weight: bold;">-</span></div>
      <div id="pos-title">Open</div>
      <button id="btn-${pair}" type="button" class="btn btn-danger" style="font-size: 12px; height: 25px; width: 60px;">Close</button>
      </div>
  `;
  const firstPosition = positionTable.firstChild;
  positionTable.insertBefore(newPosition, firstPosition);
};


function openModal(type, pair) {
  var myModal = new bootstrap.Modal(document.getElementById('reg-modal'));
  var modalTitle = document.getElementById("model-title");
  var modalPair = document.getElementById("model-pair");
  modalTitle.innerHTML = type;
  modalPair.innerHTML = pair;
  myModal.show();
}

function timeStampChange(time){
  url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${time}&limit=1000`;
  fetch(url)
    .then(res => res.json())
      .then(data => {
        const cdata = data.map(d => {
          return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
        });
        candleSeries.setData(cdata);
      })
      .catch(err => console.log(err));
}