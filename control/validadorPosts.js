var verificaPosts = ((dados) => {
    var erros = [];

    if(dados.categoria == "0") {
        erros.push({
            texto: "Categoria inválida, registre uma categoria"
        });
    }

    return erros;
});

module.exports = verificaPosts;