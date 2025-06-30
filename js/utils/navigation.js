function navigateTo(idTemplate, callback) {
  //selecciono el elemento app que tiene el main//
  const app = document.querySelector("#app");
  const templateHtml = document.querySelector("#" + idTemplate).innerHTML;
  app.innerHTML = templateHtml;
//iniciar funciones de la pagina
  if (callback) {
    callback();
  }
}
