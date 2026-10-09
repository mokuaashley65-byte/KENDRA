console.log("PROFILE.JS IS RUNNING");


// Get elements from HTML
const orderList = document.getElementById("orderList");
const subtotalElement = document.getElementById("subtotal");
const grandTotalElement = document.getElementById("grandTotal");


// Get orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders") || "[]");


console.log("ORDERS RECEIVED:", orders);


// Start subtotal
let subtotal = 0;


// Clear order list
orderList.innerHTML = "";


// If there are no orders
if (orders.length === 0) {

    orderList.innerHTML = `
        <p style="text-align:center; padding:20px; color:#777;">
            No items in your order yet.
        </p>
    `;

}


// Display orders
orders.forEach(function(order) {

    const itemTotal = order.price * order.quantity;

    subtotal += itemTotal;


    orderList.innerHTML += `

        <div class="food">

            <img src="${order.image}" alt="${order.name}">

            <div class="food-info">

                <h3>${order.name}</h3>

                <p>Quantity: ${order.quantity}</p>

            </div>
    
            <div class="food-price">

                $${itemTotal.toFixed(2)}

            </div>

        </div>

    `;

});


// Delivery fee
const deliveryFee = $2;


// Calculate total
const total = subtotal + deliveryFee;


// Display subtotal
subtotalElement.textContent =
    "KSh " + subtotal.toFixed(2);


// Display total
grandTotalElement.textContent =
    "KSh " + total.toFixed(2);