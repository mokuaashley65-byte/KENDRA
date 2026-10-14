console.log("ADMIN LOGIN JS IS RUNNING");


// ========================================
// ADMIN LOGIN DETAILS
// ========================================

const ADMIN_EMAIL = "admin@kendysbites.com";
const ADMIN_PASSWORD = "admin123";


// ========================================
// GET ELEMENTS
// ========================================

const loginForm =
    document.getElementById("adminLoginForm");

const emailInput =
    document.getElementById("adminEmail");

const passwordInput =
    document.getElementById("adminPassword");

const togglePassword =
    document.getElementById("togglePassword");

const loginError =
    document.getElementById("loginError");

const rememberMe =
    document.getElementById("rememberMe");

const forgotPassword =
    document.getElementById("forgotPassword");


// ========================================
// CHECK EXISTING LOGIN
// ========================================

if (
    localStorage.getItem("adminLoggedIn") === "true"
) {

    window.location.href = "admin.html";

}


// ========================================
// SHOW / HIDE PASSWORD
// ========================================

togglePassword.addEventListener(
    "click",
    function() {

        if (
            passwordInput.type === "password"
        ) {

            passwordInput.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

        else {

            passwordInput.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }
);


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        loginError.textContent = "";


        if (
            email === ADMIN_EMAIL &&
            password === ADMIN_PASSWORD
        ) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            localStorage.setItem(
                "adminEmail",
                email
            );


            if (rememberMe.checked) {

                localStorage.setItem(
                    "rememberAdmin",
                    "true"
                );

            }


            window.location.href =
                "admin.html";

        }

        else {

            loginError.textContent =
                "Incorrect email or password.";

            passwordInput.value = "ashadmin06";

            passwordInput.focus();

        }

    }
);


// ========================================
// FORGOT PASSWORD
// ========================================

forgotPassword.addEventListener(
    "click",
    function(event) {

        event.preventDefault();

        alert(
            "Please contact the restaurant system administrator to reset the admin password."
        );

    }
);