const { Router } = require("express");
const PermissoesController = require("../controllers/permissoesController");

const router = Router();

router
  .post("/permissao", PermissoesController.cadastrar)
  .get("/permissao", PermissoesController.buscarTodasPermissoes)
  .get("/permissao/id/:id", PermissoesController.buscarPermissaoPorId)
  .delete("/permissao/id/:id", PermissoesController.deletarPermissaoPorId)
  .put("/permissao/id/:id", PermissoesController.editarPermissao);

module.exports = router;
