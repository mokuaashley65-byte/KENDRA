console.log("ADMIN.JS IS RUNNING");


// ========================================
// GET DASHBOARD ELEMENTS
// ========================================

const totalOrdersElement =
    document.getElementById("totalOrders");

const totalRevenueElement =
    document.getElementById("totalRevenue");

const totalProfitElement =
    document.getElementById("totalProfit");

const newCustomersElement =
    document.getElementById("newCustomers");

const ordersTable =
    document.getElementById("ordersTable");

const chartPeriod =
    document.getElementById("chartperiod");

const activityList =
    document.getElementById("activityList");


// ========================================
// GET PLACED ORDERS
// ========================================

function getPlacedOrders() {

    return JSON.parse(
        localStorage.getItem("placedOrders") || "[]"
    );

}


// ========================================
// FORMAT CURRENCY
// ========================================

function formatKSh(amount) {

    return "KSh " +
        Number(amount).toLocaleString(
            "en-KE",
            {
                maximumFractionDigits: 0
            }
        );

}


// ========================================
// TIME AGO
// ========================================

function getTimeAgo(dateString) {

    const date =
        new Date(dateString);

    const now =
        new Date();

    const difference =
        Math.floor(
            (now - date) / 1000
        );


    if (difference < 10) {

        return "Just now";

    }


    if (difference < 60) {

        return difference + " sec ago";

    }


    const minutes =
        Math.floor(
            difference / 60
        );


    if (minutes < 60) {

        return minutes +
            (minutes === 1
                ? " min ago"
                : " mins ago");

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return hours +
            (hours === 1
                ? " hour ago"
                : " hours ago");

    }


    const days =
        Math.floor(
            hours / 24
        );


    return days +
        (days === 1
            ? " day ago"
            : " days ago");

}


// ========================================
// UPDATE DASHBOARD STATISTICS
// ========================================

function updateStatistics() {

    const placedOrders =
        getPlacedOrders();


    let revenue = 0;


    placedOrders.forEach(function(order) {

        revenue +=
            Number(order.total) || 0;

    });


    const profit =
        revenue * 0.5;


    if (totalOrdersElement) {

        totalOrdersElement.textContent =
            placedOrders.length;

    }


    if (totalRevenueElement) {

        totalRevenueElement.textContent =
            formatKSh(revenue);

    }


    if (totalProfitElement) {

        totalProfitElement.textContent =
            formatKSh(profit);

    }


    if (newCustomersElement) {

        const customers =
            new Set(
                placedOrders.map(
                    order => order.customer
                )
            );

        newCustomersElement.textContent =
            customers.size;

    }

}


// ========================================
// UPDATE RECENT ORDERS
// ========================================

function updateRecentOrders() {

    if (!ordersTable) {
        return;
    }


    const placedOrders =
        getPlacedOrders();


    const heading = `

        <div class="order-row order-heading">

            <span>Order ID</span>

            <span>Customer</span>

            <span>Items</span>

            <span>Total</span>

            <span>Status</span>

            <span>Time</span>

        </div>

    `;


    if (placedOrders.length === 0) {

        ordersTable.innerHTML =
            heading +
            `

                <div class="order-row">

                    <span>
                        No orders have been placed yet.
                    </span>

                </div>

            `;

        return;

    }


    const recentOrders =
        placedOrders.slice(0, 10);


    let html =
        heading;


    recentOrders.forEach(function(order) {


        const items =
            order.items
                .map(function(item) {

                    return item.name +
                        " × " +
                        item.quantity;

                })
                .join(", ");


        const date =
            new Date(order.date);


        const time =
            date.toLocaleTimeString(
                [],
                {
                    hour: "numeric",
                    minute: "2-digit"
                }
            );


        let statusClass =
            "pending";


        if (
            order.status &&
            order.status.toLowerCase() ===
            "completed"
        ) {

            statusClass =
                "completed";

        }


        if (
            order.status &&
            order.status.toLowerCase() ===
            "preparing"
        ) {

            statusClass =
                "preparing";

        }


        html += `

            <div class="order-row">

                <span>
                    ${order.id}
                </span>


                <div class="customer">

                    <div class="customer-icon">

                        <i class="fa-solid fa-user"></i>

                    </div>

                    <span>
                        ${order.customer}
                    </span>

                </div>


                <span>
                    ${items}
                </span>


                <span class="order-total">
                    ${formatKSh(order.total)}
                </span>


                <span class="order-status ${statusClass}">
                    ${order.status}
                </span>


                <span>
                    ${time}
                </span>

            </div>

        `;

    });


    ordersTable.innerHTML =
        html;

}


// ========================================
// LIVE ACTIVITY
// ONLY SHOWS THE CURRENT/LATEST ORDER
// ========================================

function updateLiveActivity() {

    if (!activityList) {
        return;
    }


    const placedOrders =
        getPlacedOrders();


    // ========================================
    // NO ORDERS
    // ========================================

    if (placedOrders.length === 0) {

        activityList.innerHTML = `

            <div class="activity-item">

                <div class="activity-icon order">

                    <i class="fa-solid fa-clock"></i>

                </div>


                <div class="activity-info">

                    <h3>No activity yet</h3>

                    <p>
                        New customer orders will appear here.
                    </p>

                    <span>
                        Waiting for orders...
                    </span>

                </div>

            </div>

        `;

        return;
    }


    // ========================================
    // GET ONLY THE LATEST ORDER
    // ========================================

    const currentOrder =
        placedOrders[0];


    // ========================================
    // GET CURRENT STATUS
    // ========================================

    const status =
        (
            currentOrder.status ||
            "Pending"
        ).toLowerCase();


    let activityType =
        "order";

    let activityIcon =
        "fa-solid fa-cart-shopping";

    let activityTitle =
        "New order received";


    // ========================================
    // PREPARING
    // ========================================

    if (status === "preparing") {

        activityType =
            "preparing";

        activityIcon =
            "fa-solid fa-utensils";

        activityTitle =
            "Order being prepared";

    }


    // ========================================
    // COMPLETED
    // ========================================

    else if (status === "completed") {

        activityType =
            "completed";

        activityIcon =
            "fa-solid fa-circle-check";

        activityTitle =
            "Order completed";

    }


    // ========================================
    // PAYMENT RECEIVED
    // ========================================

    else if (
        currentOrder.payment &&
        currentOrder.payment.toLowerCase() ===
        "paid"
    ) {

        activityType =
            "payment";

        activityIcon =
            "fa-solid fa-money-bill-wave";

        activityTitle =
            "Payment received";

    }


    // ========================================
    // DISPLAY ONLY CURRENT ORDER
    // ========================================

    activityList.innerHTML = `

        <div class="activity-item">

            <div class="activity-icon ${activityType}">

                <i class="${activityIcon}"></i>

            </div>


            <div class="activity-info">

                <h3>
                    ${activityTitle}
                </h3>


                <p>
                    Order
                    <strong>${currentOrder.id}</strong>
                    from
                    <strong>${currentOrder.customer}</strong>
                </p>


                <span>
                    ${getTimeAgo(currentOrder.date)}
                </span>

            </div>


            <strong class="activity-amount">

                ${formatKSh(currentOrder.total)}

            </strong>

        </div>

    `;

}


// ========================================
// CHART
// ========================================

const ctx =
    document.getElementById("salesChart");


const salesChart =
    new Chart(ctx, {

        type: "line",


        data: {

            labels: [

                "8 AM",
                "10 AM",
                "12 PM",
                "2 PM",
                "4 PM",
                "6 PM",
                "8 PM",
                "10 PM"

            ],


            datasets: [

                {

                    label: "Revenue",

                    data: [],

                    borderColor:
                        "#ff3b3b",

                    backgroundColor:
                        "rgba(255, 59, 59, 0.08)",

                    borderWidth: 2,

                    tension: 0.4,

                    pointRadius: 3,

                    pointBackgroundColor:
                        "#ff3b3b",

                    fill: true

                },


                {

                    label: "Profit",

                    data: [],

                    borderColor:
                        "#252b35",

                    backgroundColor:
                        "rgba(37, 43, 53, 0.05)",

                    borderWidth: 2,

                    tension: 0.4,

                    pointRadius: 1,

                    pointBackgroundColor:
                        "#252b35",

                    fill: true

                }

            ]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            interaction: {

                mode: "index",

                intersect: false

            },


            plugins: {

                legend: {

                    position: "top",

                    align: "end",


                    labels: {

                        usePointStyle: true,

                        pointStyle: "circle",

                        boxWidth: 6,

                        boxHeight: 6

                    }

                }

            },


            scales: {

                x: {

                    grid: {

                        color: "#eeeeee"

                    }

                },


                y: {

                    beginAtZero: true,


                    ticks: {

                        callback:
                            function(value) {

                                return "KSh " +
                                    value.toLocaleString();

                            }

                    },


                    grid: {

                        color: "#eeeeee"

                    }

                }

            }

        }

    });


// ========================================
// UPDATE CHART
// ========================================

function updateChart() {

    const placedOrders =
        getPlacedOrders();


    const revenueData =
        [
            0, 0, 0, 0,
            0, 0, 0, 0
        ];


    const profitData =
        [
            0, 0, 0, 0,
            0, 0, 0, 0
        ];


    placedOrders.forEach(function(order) {

        const orderDate =
            new Date(order.date);


        const hour =
            orderDate.getHours();


        let index;


        if (hour < 10) {

            index = 0;

        } else if (hour < 12) {

            index = 1;

        } else if (hour < 14) {

            index = 2;

        } else if (hour < 16) {

            index = 3;

        } else if (hour < 18) {

            index = 4;

        } else if (hour < 20) {

            index = 5;

        } else if (hour < 22) {

            index = 6;

        } else {

            index = 7;

        }


        const revenue =
            Number(order.total) || 0;


        const profit =
            revenue * 0.5;


        revenueData[index] +=
            revenue;


        profitData[index] +=
            profit;

    });


    salesChart.data.datasets[0].data =
        revenueData;


    salesChart.data.datasets[1].data =
        profitData;


    const maximum =
        Math.max(
            ...revenueData,
            ...profitData,
            100
        );


    salesChart.options.scales.y.max =
        Math.ceil(
            maximum / 1000
        ) * 1000;


    salesChart.update();

}


// ========================================
// UPDATE EVERYTHING
// ========================================

function updateDashboard() {

    updateStatistics();

    updateRecentOrders();

    updateLiveActivity();

    updateChart();

}


// ========================================
// CHART PERIOD SELECTOR
// ========================================

if (chartPeriod) {

    chartPeriod.addEventListener(
        "change",
        function() {

            updateChart();

        }
    );

}


// ========================================
// LISTEN FOR NEW ORDERS
// ========================================

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === "placedOrders"
        ) {

            console.log(
                "NEW ORDER RECEIVED BY ADMIN"
            );

            updateDashboard();

        }

    }
);


// ========================================
// AUTOMATIC REFRESH
// ========================================

setInterval(
    updateDashboard,
    3000
);


// ========================================
// INITIAL LOAD
// ========================================

updateDashboard();


// ========================================
// LOGOUT
// ========================================


const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        console.log("LOGOUT BUTTON CLICKED");

        // Remove admin login information
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminEmail");

        // Send admin back to login page
        window.location.replace("admin-login.html");

    });
// ========================================
// QUICK ACTIONS
// ========================================

const newOrderBtn =
    document.getElementById("newOrderBtn");

const viewOrdersBtn =
    document.getElementById("viewOrdersBtn");

const menuBtn =
    document.getElementById("menuBtn");

const reportsBtn =
    document.getElementById("reportsBtn");


// ========================================
// NEW ORDER
// ========================================

if (newOrderBtn) {

    newOrderBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "profile.html";

        }
    );

}


// ========================================
// VIEW ORDERS
// ========================================

if (viewOrdersBtn) {

    viewOrdersBtn.addEventListener(
        "click",
        function() {

            const ordersSection =
                document.querySelector(
                    ".recent-orders"
                );

            if (ordersSection) {

                ordersSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }
    );

}


// ========================================
// MENU
// ========================================

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        function() {

            window.location.href =
                "order.html";

        }
    );

}


// ========================================
// REPORTS
// ========================================

if (reportsBtn) {

    reportsBtn.addEventListener(
        "click",
        function() {

            const placedOrders =
                JSON.parse(
                    localStorage.getItem(
                        "placedOrders"
                    ) || "[]"
                );

            if (placedOrders.length === 0) {

                alert(
                    "There are no orders available for a report yet."
                );

                return;
            }

            let revenue = 0;

            placedOrders.forEach(
                function(order) {

                    revenue +=
                        Number(order.total) || 0;

                }
            );

            const profit =
                revenue * 0.5;

            const totalOrders =
                placedOrders.length;

            alert(
                "KENDY'S BITES REPORT\n\n" +
                "Total Orders: " +
                totalOrders +
                "\n" +
                "Total Revenue: KSh " +
                revenue.toLocaleString() +
                "\n" +
                "Estimated Profit: KSh " +
                profit.toLocaleString()
            );

        }
    );

}