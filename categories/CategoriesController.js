//definindo as rotas relacionadas as categorias com o express.router
const express = require("express");
const router = express.Router();

//carregando o Model de Categoria
const Category = require("./Category");

//carregando a bliblioteca slugify
const slugify = require("slugify");

const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth, (req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", adminAuth, (req, res) => {
    var title = req.body.title;
    if (title != undefined) {
        Category.create({ //insert into
            title: title,
            slug: slugify(title) //Title -> "Programação de Scripts" com slug vai transformar em "programacao-de-scripts" para ser possível usar nas rotas
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }
    else {
        res.redirect("admin/categories/new");
    }
});

//criando a rota para listar as categorias
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories });
    });

});

//criando a rota para exclusão
router.post("/categories/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {   //se id != null
        if (!isNaN(id)) {       //se id não for número
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        } else {
            res.redirect("/admin/categories");
        }
    }
    else {
        res.redirect("/admin/categories");
    }
});

//criando a rota para edição
router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)) {
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render("admin/categories/edit", { category: category });
        }
        else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

//criando a rota para update
router.post("/categories/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

//exportando a variável router para poder ser linkado no arquivo principal (index.js)
module.exports = router;



