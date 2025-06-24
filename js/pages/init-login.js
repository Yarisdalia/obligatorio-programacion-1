function initLogin() {
    // Limpiar usuario logueado por si acaso
    sistema.userLogged = null;
    
    document.querySelector("#btnLogin").addEventListener("click", onHandleLogin);
    
    document.querySelector("#goToRegister").addEventListener("click", onGoToRegister);
}

function onHandleLogin() {
    const username = document.querySelector("#inputUser").value;
    const password = document.querySelector("#password").value;
    const errorP = document.querySelector("#loginError");

    if (username === "" || password === "") {
        errorP.innerHTML = "Por favor complete todos los campos";
        return;
    }

    const resultado = sistema.login(username, password);
    
    if (resultado === "ok") {
        if (sistema.userLogged.rol === "paseador") {
            navigateTo("dashboard-paseador", initDashboardPaseador);
        } else {
            navigateTo("dashboard-cliente", initDashboardCliente);
        }
    } else {
        errorP.innerHTML = resultado;
    }
}

function onGoToRegister() {
    navigateTo("register", initRegister);
}