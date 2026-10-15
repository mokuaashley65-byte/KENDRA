console.log("PROFILE.JS IS RUNNING");

const orderList = document.getElementById("orderList");
const subtotalElement = document.getElementById("subtotal");
const grandTotalElement = document.getElementById("grandTotal");
const paymentAmount = document.getElementById("paymentAmount");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const receiptContainer = document.getElementById("receiptContainer");
const printReceiptBtn = document.getElementById("printReceiptBtn");

let orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
);

console.log("ORDERS RECEIVED:", orders);

// CHANGE THIS to your real delivery fee (in KSh)
const deliveryFee = 200;

let receiptGenerated = false;
let currentOrderNumber = null;


// ===============================
// FORMAT CURRENCY (KSh)
// ===============================

function formatKSh(amount) {

    return "KSh " +
        Number(amount).toLocaleString(
            "en-KE",
            {
                maximumFractionDigits: 0
            }
        );

}


// ===============================
// DISPLAY CURRENT ORDER
// ===============================

function displayOrders() {

    orderList.innerHTML = "";

    let subtotal = 0;

    if (orders.length === 0) {

        orderList.innerHTML = `
            <p class="empty-order">
                No items in your order yet.
            </p>
        `;

        subtotalElement.textContent = formatKSh(0);
        grandTotalElement.textContent = formatKSh(0);
        paymentAmount.textContent = formatKSh(0);

        placeOrderBtn.disabled = true;

        return;
    }

    placeOrderBtn.disabled = false;

    orders.forEach(function(order, index) {

        const itemTotal =
            order.price * order.quantity;

        subtotal += itemTotal;

        orderList.innerHTML += `
            <div class="food">

                <img
                    src="${order.image}"
                    alt="${order.name}"
                >

                <div class="food-info">

                    <h3>${order.name}</h3>

                    <p>
                        ${formatKSh(order.price)}
                        each
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="decreaseQuantity(${index})"
                        >
                            −
                        </button>

                        <span>
                            ${order.quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${index})"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div class="food-price">

                    <strong>
                        ${formatKSh(itemTotal)}
                    </strong>

                    <button
                        class="remove-order"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;

    });

    const total = subtotal + deliveryFee;

    subtotalElement.textContent =
        formatKSh(subtotal);

    grandTotalElement.textContent =
        formatKSh(total);

    paymentAmount.textContent =
        formatKSh(total);
}


// ===============================
// SAVE CURRENT CART
// ===============================

function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    displayOrders();
}


// ===============================
// QUANTITY CONTROLS
// ===============================

function increaseQuantity(index) {

    orders[index].quantity++;

    saveOrders();
}


function decreaseQuantity(index) {

    if (orders[index].quantity > 1) {

        orders[index].quantity--;

    } else {

        orders.splice(index, 1);

    }

    saveOrders();
}


function removeItem(index) {

    orders.splice(index, 1);

    saveOrders();
}


// ===============================
// PLACE ORDER
// ===============================

placeOrderBtn.addEventListener(
    "click",
    function() {

        if (orders.length === 0) {

            alert(
                "Your order is empty. Please add food first."
            );

            return;
        }

        savePlacedOrder();

        // build the receipt first (it needs the items)
        generateReceipt();

        // then clear the current order straight away
        orders = [];

        localStorage.removeItem("orders");

        displayOrders();

        console.log("CURRENT CART CLEARED");
    }
);


// ===============================
// SAVE COMPLETED ORDER
// ===============================

function savePlacedOrder() {

    let placedOrders = JSON.parse(
        localStorage.getItem("placedOrders") || "[]"
    );

    let subtotal = 0;

    orders.forEach(function(order) {

        subtotal +=
            order.price * order.quantity;

    });

    const total =
        subtotal + deliveryFee;

    const orderNumber =
        "#KB" +
        Date.now()
            .toString()
            .slice(-6);

    currentOrderNumber = orderNumber;

    const newOrder = {

        id: orderNumber,

        customer: "Customer",

        items: orders.map(function(order) {

            return {
                name: order.name,
                price: order.price,
                quantity: order.quantity,
                image: order.image
            };

        }),

        subtotal: subtotal,

        deliveryFee: deliveryFee,

        total: total,

        status: "Pending",

        payment: "Pending",

        date: new Date().toISOString(),

        time: new Date().toLocaleTimeString()

    };


    placedOrders.unshift(newOrder);


    localStorage.setItem(
        "placedOrders",
        JSON.stringify(placedOrders)
    );


    console.log(
        "ORDER SAVED FOR ADMIN:",
        newOrder
    );

    console.log(
        "ALL PLACED ORDERS:",
        placedOrders
    );
}


// ===============================
// GENERATE RECEIPT
// ===============================

function generateReceipt() {

    const receiptItems =
        document.getElementById("receiptItems");

    const receiptSubtotal =
        document.getElementById("receiptSubtotal");

    const receiptDelivery =
        document.getElementById("receiptDelivery");

    const receiptGrandTotal =
        document.getElementById("receiptGrandTotal");

    const receiptOrderNumber =
        document.getElementById("receiptOrderNumber");

    const receiptDate =
        document.getElementById("receiptDate");


    receiptItems.innerHTML = "";

    let subtotal = 0;


    orders.forEach(function(order) {

        const itemTotal =
            order.price * order.quantity;

        subtotal += itemTotal;


        receiptItems.innerHTML += `

            <div class="receipt-item">

                <span>
                    ${order.quantity}
                    ×
                    ${order.name}
                </span>

                <span>
                    ${formatKSh(itemTotal)}
                </span>

            </div>

        `;

    });


    const total =
        subtotal + deliveryFee;


    if (!currentOrderNumber) {

        currentOrderNumber =
            "#KB" +
            Date.now()
                .toString()
                .slice(-6);

    }


    receiptOrderNumber.textContent =
        currentOrderNumber;


    receiptDate.textContent =
        new Date().toLocaleString();


    receiptSubtotal.textContent =
        formatKSh(subtotal);


    receiptDelivery.textContent =
        formatKSh(deliveryFee);


    receiptGrandTotal.textContent =
        formatKSh(total);


    receiptContainer.style.display =
        "block";


    receiptGenerated = true;


    receiptContainer.scrollIntoView({
        behavior: "smooth"
    });


    console.log(
        "RECEIPT GENERATED:",
        currentOrderNumber
    );
}


// ===============================
// PRINT RECEIPT
// ===============================

printReceiptBtn.addEventListener(
    "click",
    function() {

        if (!receiptGenerated) {
            return;
        }

        window.print();

    }
);


// ===============================
// AFTER PRINT
// (the cart is already cleared when the order is placed,
//  so this only hides the receipt)
// ===============================

window.addEventListener(
    "afterprint",
    function() {

        if (!receiptGenerated) {
            return;
        }

        receiptContainer.style.display =
            "none";

        receiptGenerated = false;

        currentOrderNumber = null;

        console.log("RECEIPT CLOSED");

    }
);


// ===============================
// RELOAD CART WHEN PAGE IS SHOWN
// (fixes old cart showing after Back button or another tab)
// ===============================

function reloadOrders() {

    orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    displayOrders();
}

window.addEventListener("pageshow", function(event) {

    // only re-read when no receipt is on screen
    if (!receiptGenerated) {
        reloadOrders();
    }

});

window.addEventListener("storage", function(event) {

    if (event.key === "orders" && !receiptGenerated) {
        reloadOrders();
    }

});


// ===============================
// INITIAL LOAD
// ===============================

displayOrders();    