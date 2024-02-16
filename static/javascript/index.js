
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
  width:1112,
  height:480,
  timeScale:{
    timeVisible:true,
    secondsVisible:false,
  }
}

const domElement = document.getElementById('tvchart');
const chart = LightweightCharts.createChart(domElement,chartProperties);
const candleSeries = chart.addCandlestickSeries();


fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000`)
  .then(res => res.json())
  .then(data => {
    const cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    candleSeries.setData(cdata);
  })
  .catch(err => log(err))

//Dynamic Chart
const socket = io.connect('http://127.0.0.1:4000/');

socket.on('KLINE',(pl)=>{
  //log(pl);
  candleSeries.update(pl);
});










