const database = require("../models");

const permissoes = (listaDePermissoes) => {
  return async (req, res, next) => {
    const { usuarioId } = req;

    const usuario = await database.usuarios.findOne({
      include: [
        {
          model: database.permissoes,
          as: "usuarios_das_permissoes",
          attributes: ["id", "nome"],
        },
      ],
      where: {
        id: usuarioId,
      },
    });

    if (!usuario) {
      return res.status(401).send("Usuario não cadastrado");
    }

    const permissoesCadastradas = usuario.usuarios_das_permissoes
      .map((permissao) => permissao.nome)
      .some((permissao) => listaDePermissoes.includes(permissao));
    if (!permissoesCadastradas) {
      return res.status(401).send("Usuario não possui acesso a essa rota");
    }
    return next();
  };
};

module.exports = permissoes;
