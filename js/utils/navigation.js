function navigateTo(template, callback) {
  const app = document.querySelector("#app");
  const templateHtml = document.querySelector(`#${template}`).innerHTML;
  app.innerHTML = templateHtml;

  if (callback) {
    callback();
  }
}
