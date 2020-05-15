var verifica = ((dados) => {
    var erros = [];

    if(!dados.nome || typeof dados.nome == undefined || dados.nome == null) {
        erros.push({
            texto: "Nome inválido"
        });
    } else if(dados.nome.length <= 2) {
        erros.push({
            texto: "Nome da categoria é muito pequeno"
        });
    }
    
    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        erros.push({
            texto: "Slug inválido"
        });
    }

    return erros;
});

module.exports = verifica;