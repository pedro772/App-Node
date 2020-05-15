const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validador = require('../control/validacao');
const validadorPosts = require('../control/validadorPosts');
require('../models/Categoria');
const Categoria = mongoose.model('categorias');
require('../models/Postagem');
const Postagem = mongoose.model('postagens');
const {isAdmin} = require("../helpers/isAdmin");

router.get('/', isAdmin, (req, res) => {
    res.render("admin/index");
});

router.get('/posts', isAdmin, (req, res) => {
    res.send("Página de posts");
});

router.get('/categorias', isAdmin, (req, res) => {
    Categoria.find().sort({date: 'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin");
    }); 
});

router.get('/categorias/add', isAdmin, (req, res) => {
    res.render("admin/addcategorias");
});

router.post('/categorias/nova', isAdmin, (req, res) => {
    // Validação
    var erros = validador(req.body);
    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros});
    } else {
        const novaCategoria = {
            // referentes à (addcategorias.handlebars) nos campos name = nome e slug
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!");
            res.redirect("/admin/categorias");
        });
    }
});

router.get("/categorias/edit/:id", isAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria});
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe");
        res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", isAdmin, (req, res) => {
    // Validação
    var erros = validador(req.body);
    if(erros.length > 0) {
        res.render("admin/editcategorias", {erros: erros})
    } else {
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;
    
            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso");
                res.redirect("/admin/categorias");
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria");
                res.redirect("/admin/categorias");
            });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro na edição da categoria");
            res.redirect("/admin/categorias");
        });
    }
});

router.post("/categorias/deletar", isAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).lean().then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria ");
        res.redirect("/admin/categorias");
    });
});

router.get("/postagens", isAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({data: 'desc'}).lean().then((postagens) => {
        res.render("admin/postagens", {postagens: postagens});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens");
        res.redirect("/admin");
    });
});

router.get("/postagens/add", isAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin");
    });
});

router.post("/postagens/nova", isAdmin, (req, res) => {
    // Validação CORRIGIR no arquivo validacao
    var erros = validadorPosts(req.body);

    if(erros.length > 0) {
        res.render("admin/addpostagem", {erros: erros})
    } else {
        const novaPostagem = {
            // referentes à (addpostagem.handlebars) nos campos name = nome, descricao, conteudo, categoria e slug
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso");
            res.redirect("/admin/postagens");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!");
            res.redirect("/admin/postagens");
        });
    }
});

router.get("/postagens/edit/:id", isAdmin, (req, res) => {
    // Buscando dados no mongo (buscas em seguida)
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {categorias: categorias, postagem: postagem});
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        });  
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
        res.redirect("/admin/postagens");
    });
});

router.post("/postagens/edit", isAdmin, (req, res) => {
    // Validação
    var erros = validadorPosts(req.body);
    if(erros.length > 0) {
        res.render("admin/editcategorias", {erros: erros})
    } else {
        Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.titulo = req.body.titulo;
            postagem.descricao = req.body.descricao;
            postagem.conteudo = req.body.conteudo;
            postagem.categoria = req.body.categoria;
            postagem.slug = req.body.slug;
    
            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso");
                res.redirect("/admin/postagens");
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edição da postagem");
                res.redirect("/admin/postagens");
            });
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar edição da postagem");
            res.redirect("/admin/postagens");
        });
    }
});

router.post("/postagens/deletar", isAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).lean().then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso");
        res.redirect("/admin/postagens");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a postagem " + err);
        res.redirect("/admin/postagens");
    });
});

module.exports = router;