function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Reserva de turnos');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getAppStatus() {
  return {
    ok: true,
    message: 'Comunicación con Apps Script OK',
    timestamp: new Date().toISOString()
  };
}
