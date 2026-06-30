const Demanda = require('../models/DemandaModel');

// ➕ CRIAR nova demanda
exports.criarDemanda = async (req, res) => {
  try {
    const novaDemanda = new Demanda(req.body);
    await novaDemanda.save();

    res.status(201).json({
      mensagem: "✅ Demanda registrada com sucesso!",
      dados: novaDemanda
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "❌ Erro ao salvar a demanda",
      erro: erro.message
    });
  }
};

// 🔍 LISTAR demandas (com filtros, busca e paginação)
exports.listarDemandas = async (req, res) => {
  try {
    const {
      ativo = 'true',       // por padrão só mostra as ativas (não ocultas)
      nivelUrgencia,
      secretariaSetor,
      status,
      busca,                // texto livre: assunto, descrição, munícipe, endereço
      pagina = 1,
      limite = 20
    } = req.query;

    const filtro = {};

    // ativo aceita 'true', 'false' ou 'todas' (para listar tudo, incluindo ocultas)
    if (ativo !== 'todas') {
      filtro.ativo = ativo === 'true';
    }

    if (nivelUrgencia) filtro.nivelUrgencia = nivelUrgencia;
    if (secretariaSetor) filtro.secretariaSetor = secretariaSetor;
    if (status) filtro.status = status;

    if (busca) {
      filtro.$text = { $search: busca };
    }

    const paginaNum = Math.max(parseInt(pagina, 10) || 1, 1);
    const limiteNum = Math.min(parseInt(limite, 10) || 20, 100); // teto de 100 por página
    const skip = (paginaNum - 1) * limiteNum;

    const [demandas, total] = await Promise.all([
      Demanda.find(filtro)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limiteNum),
      Demanda.countDocuments(filtro)
    ]);

    res.status(200).json({
      dados: demandas,
      paginacao: {
        total,
        pagina: paginaNum,
        limite: limiteNum,
        totalPaginas: Math.ceil(total / limiteNum)
      }
    });
  } catch (erro) {
    res.status(500).json({
      mensagem: "❌ Erro ao buscar as demandas",
      erro: erro.message
    });
  }
};

// 🔍 BUSCAR uma única demanda por ID
exports.buscarDemandaPorId = async (req, res) => {
  try {
    const demanda = await Demanda.findById(req.params.id);

    if (!demanda) {
      return res.status(404).json({ mensagem: "❌ Demanda não encontrada" });
    }

    res.status(200).json(demanda);
  } catch (erro) {
    res.status(500).json({
      mensagem: "❌ Erro ao buscar a demanda",
      erro: erro.message
    });
  }
};

// ✏️ ATUALIZAR (editar) uma demanda
exports.atualizarDemanda = async (req, res) => {
  try {
    const demandaAtualizada = await Demanda.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // retorna o doc já atualizado e valida o schema
    );

    if (!demandaAtualizada) {
      return res.status(404).json({ mensagem: "❌ Demanda não encontrada" });
    }

    res.status(200).json({
      mensagem: "✅ Demanda atualizada com sucesso!",
      dados: demandaAtualizada
    });
  } catch (erro) {
    res.status(400).json({
      mensagem: "❌ Erro ao atualizar a demanda",
      erro: erro.message
    });
  }
};

// 🙈 OCULTAR demanda (soft delete - não apaga do banco)
exports.ocultarDemanda = async (req, res) => {
  try {
    const demanda = await Demanda.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );

    if (!demanda) {
      return res.status(404).json({ mensagem: "❌ Demanda não encontrada" });
    }

    res.status(200).json({
      mensagem: "✅ Demanda ocultada com sucesso!",
      dados: demanda
    });
  } catch (erro) {
    res.status(500).json({
      mensagem: "❌ Erro ao ocultar a demanda",
      erro: erro.message
    });
  }
};

// 👁️ DESOCULTAR (restaurar) demanda
exports.desocultarDemanda = async (req, res) => {
  try {
    const demanda = await Demanda.findByIdAndUpdate(
      req.params.id,
      { ativo: true },
      { new: true }
    );

    if (!demanda) {
      return res.status(404).json({ mensagem: "❌ Demanda não encontrada" });
    }

    res.status(200).json({
      mensagem: "✅ Demanda restaurada com sucesso!",
      dados: demanda
    });
  } catch (erro) {
    res.status(500).json({
      mensagem: "❌ Erro ao restaurar a demanda",
      erro: erro.message
    });
  }
};

// 🗑️ DELETAR demanda definitivamente (exclusão real do banco)
exports.deletarDemanda = async (req, res) => {
  try {
    const demanda = await Demanda.findByIdAndDelete(req.params.id);

    if (!demanda) {
      return res.status(404).json({ mensagem: "❌ Demanda não encontrada" });
    }

    res.status(200).json({
      mensagem: "✅ Demanda excluída permanentemente!"
    });
  } catch (erro) {
    res.status(500).json({
      mensagem: "❌ Erro ao excluir a demanda",
      erro: erro.message
    });
  }
};