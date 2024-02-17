
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



//chart

const log = console.log;

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
            };


        socket.onclose = function(event) {
          console.log('WebSocket closed');
        };









