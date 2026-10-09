const bookingForm = document.querySelector(".booking-form");
const successNotification = document.getElementById("successNotification");
const closeNotification = document.getElementById("closeNotification");

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    successNotification.classList.add("show");

    setTimeout(function() {
        successNotification.classList.remove("show");
    }, 5000);
});

closeNotification.addEventListener("click", function() {
    successNotification.classList.remove("show");
});