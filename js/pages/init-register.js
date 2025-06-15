function initRegister() {
    const btnRegister = document.querySelector("#btnRegister");
    btnRegister.addEventListener("click", onHandleRegister);

    const goToLogin = document.querySelector("#goToLogin");
    goToLogin.addEventListener("click", onGoToLogin);
}

function onHandleRegister() {
    const nombre = document.querySelector("#inputNombre").value;
    const username = document.querySelector("#inputUserName").value;
    const password = document.querySelector("#inputPassword").value;
    const dogName = document.querySelector("#inputPerro").value;
    const dogSize = document.querySelector("#dogSize").value;
    const registerError = document.querySelector("#registerErrors");
    
    // Limpiar error anterior por si acaso
    registerError.innerHTML = "";
    
    const resultado = sistema.registrarCliente(nombre, username, password, dogName, dogSize);
    
    if (resultado === "ok") {
        onGoToLogin();
    } else {
        registerError.innerHTML = resultado;
    }
}

function onGoToLogin() {
    // navegar a login y llamar a initLogin luego de navegar para agregar las funcionalidades de login
    navigateTo("login", initLogin);
}