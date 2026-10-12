console.log("ORDER.JS IS RUNNING");

const buttons = document.querySelectorAll(
    ".menu-item button, .menu1-item button, .menu2-item button, .menu3-item button, .menu4-item button"
);

console.log("Buttons found:", buttons.length);

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Get ONLY the food card whose button was clicked
        const foodCard = button.closest(
            ".menu-item, .menu1-item, .menu2-item, .menu3-item, .menu4-item"
        );

        const name = foodCard.querySelector("h3").textContent.trim();

        const priceText = foodCard.querySelector("span").textContent;

        const price = parseFloat(
            priceText.replace("$", "").trim()
        );

        const image = foodCard.querySelector("img").getAttribute("src");

        // Get existing orders
        let orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
        );

        // Check if THIS food is already in the order
        const existingOrder = orders.find(function (order) {
            return order.name === name;
        });

        if (existingOrder) {

            // Increase quantity only for this food
            existingOrder.quantity++;

        } else {

            // Add only the clicked food
            orders.push({
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }

        // Save updated order
        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );

        // Calculate total
        let total = 0;

        orders.forEach(function (order) {
            total += order.price * order.quantity;
        });

        console.log("Orders:", orders);
        console.log("Total: $" + total.toFixed(2));

        alert(
            name +
            " added to your order!\nTotal: $" +
            total.toFixed(2)
        );

    });

});