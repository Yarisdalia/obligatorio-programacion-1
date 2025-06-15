function initLogin() {
    // Limpiar usuario logueado por si acaso
    sistema.userLogged = null;
    
    // Limpiar mensajes de errores anteriores por si acaso
    const errorDiv = document.querySelector("#loginError");
    if (errorDiv) {
        errorDiv.innerHTML = "";
    }
    
    const btnLogin = document.querySelector("#btnLogin");
    btnLogin.addEventListener("click", onHandleLogin);

    const goToRegister = document.querySelector("#goToRegister");
    goToRegister.addEventListener("click", onGoToRegister);
}

function onHandleLogin() {
    const username = document.querySelector("#inputUser").value;
    const password = document.querySelector("#password").value;
    const errorDiv = document.querySelector("#loginError");

    // Limpiar error anterior
    errorDiv.innerHTML = "";

    if (username === "" || password === "") {
        errorDiv.innerHTML = "Por favor complete todos los campos";
        return;
    }

    let resultado = sistema.login(username, password);
    
    if (resultado === "ok") {
        if (sistema.userLogged.rol === "paseador") {
            navigateTo("dashboard-paseador", initDashboardPaseador);
        } else {
            navigateTo("dashboard-cliente", initDashboardCliente);
        }
    } else {
        errorDiv.innerHTML = resultado;
    }
}

function onGoToRegister() {
    navigateTo("register", initRegister);
}