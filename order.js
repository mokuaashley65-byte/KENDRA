console.log("ORDER.JS IS RUNNING");

const buttons = document.querySelectorAll(
    ".menu-item button, .menu1-item button, .menu2-item button, .menu3-item button, .menu4-item button"
);

console.log("Buttons found:", buttons.length);

buttons.forEach(function(button) {

    button.addEventListener("click", function() {

        const foodCard = button.parentElement;

        const name = foodCard.querySelector("h3").textContent.trim();

        const priceText = foodCard.querySelector("span").textContent;

        const price = parseFloat(priceText.replace("$", "").trim());

        const image = foodCard.querySelector("img").getAttribute("src");


        // Get existing orders
        let orders = JSON.parse(localStorage.getItem("orders") || "[]");


        // Check whether the food already exists
        const existingOrder = orders.find(function(order) {
            return order.name === name;
        });


        if (existingOrder) {

            existingOrder.quantity++;

        } else {

            orders.push({
                name: name,
                price: price,
                quantity: 1,
                image: image
            });

        }


        // Save orders
        localStorage.setItem("orders", JSON.stringify(orders));


        console.log("ORDER SAVED:", orders);

        console.log(
            "LOCAL STORAGE:",
            localStorage.getItem("orders")
        );


        alert(name + " added to your order!");

    });

});