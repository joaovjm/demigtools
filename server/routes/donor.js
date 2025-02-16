const express = require("express");
const router = express.Router();
const { Donor } = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const { query, tipo, telefone1} = req.query;
    const whereClause= {};

    if(query) {
      if (/^\d{11}$/.test(query)) {
        whereClause.cpf = query;
      } else if (/^9\d{6,}$/.test(query)) {
        whereClause.telefone1 = query;
      } else {
        whereClause.nome = {[Op.like]: `%${query}%`};
      }
    }

    if(tipo && tipo !== "todos") {
      whereClause.tipo = tipo;
    }

    if(telefone1 && telefone1 !== null){
      whereClause.telefone1 = telefone1;
    }

    const listOfUsers = await Donor.findAll({where:whereClause});
    res.json(listOfUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar os dados." });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const User = await Donor.create(user);
    res.json(User);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o post." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Donor.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.destroy(); //Remove o usuário do banco de dados
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar usuário: ", error);
    res.status(500).json({ error: "Erro ao delerar usuário." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo, cpf, endereco, cidade, bairro, telefone1, telefone2, telefone3, dia, mensalidade, media, observacao } = req.body;

    const user = await Donor.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    await user.update({ nome, tipo, cpf, endereco, cidade, bairro, telefone1, telefone2, telefone3, dia, mensalidade, media, observacao });

    res.json({ message: "usuário atualizado com sucesso.", user });
  } catch (error) {
    console.error("Erro ao atualizar usuário: ", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

module.exports = router;
