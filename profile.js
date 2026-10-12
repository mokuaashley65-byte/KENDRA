console.log("PROFILE.JS IS RUNNING");

const orderList =
    document.getElementById("orderList");

const subtotalElement =
    document.getElementById("subtotal");

const grandTotalElement =
    document.getElementById("grandTotal");

const paymentAmount =
    document.getElementById("paymentAmount");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const receiptContainer =
    document.getElementById("receiptContainer");

const printReceiptBtn =
    document.getElementById("printReceiptBtn");



let orders = JSON.parse(
    localStorage.getItem("orders") || "[]"
);


console.log("ORDERS RECEIVED:", orders);


// Delivery fee
const deliveryFee = 2;


let receiptGenerated = false;


function displayOrders() {

    orderList.innerHTML = "";

    let subtotal = 0;

    if (orders.length === 0) {

        orderList.innerHTML = `

            <p class="empty-order">

                No items in your order yet.

            </p>

        `;


        subtotalElement.textContent =
            "$0.00";


        grandTotalElement.textContent =
            "$0.00";


        paymentAmount.textContent =
            "$0.00";


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


                    <h3>
                        ${order.name}
                    </h3>


                    <p>
                        $${order.price.toFixed(2)}
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

                        $${itemTotal.toFixed(2)}

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


    const total =
        subtotal + deliveryFee;


    subtotalElement.textContent =
        "$" + subtotal.toFixed(2);


    grandTotalElement.textContent =
        "$" + total.toFixed(2);


    paymentAmount.textContent =
        "$" + total.toFixed(2);

}


function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );


    displayOrders();

}



function increaseQuantity(index) {

    orders[index].quantity++;


    saveOrders();

}



function decreaseQuantity(index) {


    if (orders[index].quantity > 1) {

        orders[index].quantity--;

    }

    else {

        orders.splice(index, 1);

    }


    saveOrders();

}



function removeItem(index) {


    orders.splice(index, 1);


    saveOrders();

}


placeOrderBtn.addEventListener(
    "click",
    function() {


        if (orders.length === 0) {

            alert(
                "Your order is empty. Please add food first."
            );

            return;

        }


        generateReceipt();

    }
);


function generateReceipt() {


    const receiptItems =
        document.getElementById(
            "receiptItems"
        );


    const receiptSubtotal =
        document.getElementById(
            "receiptSubtotal"
        );


    const receiptDelivery =
        document.getElementById(
            "receiptDelivery"
        );


    const receiptGrandTotal =
        document.getElementById(
            "receiptGrandTotal"
        );


    const receiptOrderNumber =
        document.getElementById(
            "receiptOrderNumber"
        );


    const receiptDate =
        document.getElementById(
            "receiptDate"
        );


    // Clear previous receipt
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

                    $${itemTotal.toFixed(2)}

                </span>


            </div>

        `;

    });


    const total =
        subtotal + deliveryFee;

    const orderNumber =
        "#KB" +
        Date.now()
            .toString()
            .slice(-6);


    receiptOrderNumber.textContent =
        orderNumber;

    receiptDate.textContent =
        new Date().toLocaleString();


    receiptSubtotal.textContent =
        "$" + subtotal.toFixed(2);


    receiptDelivery.textContent =
        "$" + deliveryFee.toFixed(2);


    receiptGrandTotal.textContent =
        "$" + total.toFixed(2);


    receiptContainer.style.display =
        "block";


    receiptGenerated = true;


    // Scroll down to receipt
    receiptContainer.scrollIntoView({

        behavior: "smooth"

    });


    console.log(
        "RECEIPT GENERATED:",
        orderNumber
    );

}



printReceiptBtn.addEventListener(
    "click",
    function() {


        if (!receiptGenerated) {

            return;

        }


        window.print();

    }
);


window.addEventListener(
    "afterprint",
    function() {

        if (!receiptGenerated) {

            return;

        }

        orders = [];


        // Remove saved current order
        localStorage.removeItem(
            "orders"
        );


        // Hide old receipt
        receiptContainer.style.display =
            "none";


        receiptGenerated = false;


        // Refresh current order
        displayOrders();


        console.log(
            "ORDER COMPLETED AND CLEARED"
        );


        alert(
            "Order completed! Your current order has been cleared."
        );

    }
);


displayOrders();