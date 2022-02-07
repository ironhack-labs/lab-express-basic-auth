module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).render("not-found");
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("---- ERROR QUE VIENE DEL ARCHIVO ERROR HANDLDER -----");
    console.error("---- Método por el que se ha producido: -----", req.method);
    console.error("---- URL bajo la que se ha producido: -----", req.path);
    console.error("---- Detalles del error -----", err);
    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("error");
    }
  });
};
