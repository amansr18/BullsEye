//add order to order page

document.addEventListener("DOMContentLoaded", function() {
    const createOrder = document.getElementById("create-order");
    const orderBox = document.getElementById("order-box");
    const orderTitle = document.getElementById("cur_title");
    const quantity = document.getElementById("ord-qnty");
  
    createOrder.addEventListener("click", function() {
        const newCurrency = document.createElement("div");
        newCurrency.id = "currency";
        newCurrency.innerHTML = `
            <div id="order">
                <div id="ord-title"><b>${orderTitle}</b></div>
                <div id="ord-qnty"><b>${quantity}</b></div>
                <div id="ord-type"><b>Type</b></div>
                <div id="ord-ltp"><b>LTP</b></div>
                <div id="ord-statuc"><b>Status</b></div>
            </div>
            `;
            orderBox.appendChild(newCurrency);
    });
  });