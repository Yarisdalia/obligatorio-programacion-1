function initRegister() {
    document.querySelector("#btnRegister").addEventListener("click", onHandleRegister);
    
    document.querySelector("#goToLogin").addEventListener("click", onGoToLogin);
}

function onHandleRegister() {
    const nombre = document.querySelector("#inputNombre").value;
    const username = document.querySelector("#inputUserName").value;
    const password = document.querySelector("#inputPassword").value;
    const nombrePerro = document.querySelector("#inputPerro").value;
    const tamanoPerro = document.querySelector("#dogSize").value;
    const mensaje = document.querySelector("#registerErrors");
    
    const resultado = sistema.registrarCliente(nombre, username, password, nombrePerro, tamanoPerro);
    
    if (resultado === "ok") {
        navigateTo("login", initLogin);
    } else {
        mensaje.innerHTML = resultado;
    }
}

function onGoToLogin() {
    navigateTo("login", initLogin);
}