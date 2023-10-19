const database = require("../models");
const Sequelize = require("sequelize");

class SegurancaService {
  async cadastrarAcl(dto) {
    const usuario = await database.usuarios.findOne({
      include: [
        {
          model: database.roles,
          as: "usuarios_das_roles",
          attributes: ["id", "nome", "descricao"],
        },
        {
          model: database.permissoes,
          as: "usuarios_das_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
      where: {
        id: dto.usuarioId,
      },
    });

    if (!usuario) {
      throw new Error("Usuario não cadastrado");
    }

    const rolesCadastradas = await database.roles.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: dto.roles,
        },
      },
    });
    const permissoesCadastradas = await database.permissoes.findAll({
      where: { id: { [Sequelize.Op.in]: dto.permissoes } },
    });
    await usuario.removeUsuarios_das_roles(usuario.usuarios_das_roles);
    await usuario.removeUsuarios_das_permissoes(
      usuario.usuarios_das_permissoes
    );

    await usuario.addUsuarios_das_roles(rolesCadastradas);
    await usuario.addUsuarios_das_permissoes(permissoesCadastradas);

    const novoUsuario = await database.usuarios.findOne({
      include: [
        {
          model: database.roles,
          as: "usuarios_das_roles",
          attributes: ["id", "nome", "descricao"],
        },
        {
          model: database.permissoes,
          as: "usuarios_das_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
    });
    return novoUsuario;
  }
  async cadastrarPermissoesRoles(dto) {
    const role = await database.roles.findOne({
      include: [
        {
          model: database.permissoes,
          as: "roles_das_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
    });
    if (!role) {
      throw new Error("Role não cadastradas.");
    }

    const permissoesCadastradas = await database.permissoes.findAll({
      where: {
        id: { [Sequelize.Op.in]: dto.permissoes },
      },
    });

    await role.removeRoles_das_permissoes(role.roles_das_permissoes);

    await role.addRoles_das_permissoes(permissoesCadastradas);

    const novaRole = await database.roles.findOne({
      include: [
        {
          model: database.permissoes,
          as: "roles_das_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
      where: { id: dto.roleId },
    });

    return novaRole;
  }
}

module.exports = SegurancaService;
