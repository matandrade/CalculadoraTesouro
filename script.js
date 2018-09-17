function result() {
    debugger;
    //           2024  2035  2045
    const ipca = [document.getElementById("ipca2024").value, document.getElementById("ipca2035").value, document.getElementById("ipca2045").value];
    //           2021   2025
    const pre = [document.getElementById("prefixado2021").value, document.getElementById("prefixado2025").value];
    //           2023
    const sel = [document.getElementById("selic2023").value];

    const valorFuturo = document.getElementById("valorPre").textContent;
    const aporteMensal = document.getElementById("aporte_mensal").value;
    const selic = (document.getElementById("selic").value) / 100;
    const inflacao = (document.getElementById("inflacao").value) / 100;
    const poupanca = selic > 8.5 ? 0.5 : 0.7 * selic;

    const tipo = document.getElementById("tipoTesouro").value;

    document.getElementById("tituloInvestimento").innerHTML  = tipo;

    switch (tipo) {
        case "pre2021":
            var valPrefix = [1, 2021];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, pre[0] / 100);
            break;
        case "pre2025":
            var valPrefix = [1, 2025];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, pre[1] / 100);
            break;
        case "ipca2024":
            var valPrefix = [7, 2024];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, inflacao + ipca[0] / 100);
            break;
        case "ipca2035":
            var valPrefix = [4, 2035];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, inflacao + ipca[1] / 100);
            break;
        case "ipca2045":
            var valPrefix = [4, 2045];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, inflacao + ipca[2] / 100);
            break;
        case "selic2023":
            var valPrefix = [2, 2023];       //data fim tesouro2025
            var totalMeses = calcMeses(valPrefix);
            var Data = calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, (selic + sel[0] / 100));
            break;
        default:
    }



    document.getElementById("parcNominal").innerHTML = "R$ " + (Data[(Data.length) - 1].cru).toString();
    document.getElementById("valorPre").innerHTML = "R$ " + (Data[(Data.length) - 1].tes).toString();

    var tabelaData = Data.map((num) => [num.mes, num.cru, num.infl, num.poup, num.tes]);
    console.log(tabelaData);

    if (valorFuturo == " --") {
        document.getElementById("tabela").appendChild(criarTabela(tabelaData));
    }
    else {
        var childNodes = document.getElementById("tabela").childNodes;
        document.getElementById("tabela").replaceChild(criarTabela(tabelaData), childNodes[1]);
    }
}

function calculaRendimentos(totalMeses, aporteMensal, inflacao, poupanca, pre2025) {
    var MontanteDaB3 = 0;
    var montanteCru = 0;
    var montantePre2025 = 0;
    var montanteInflacao = 0;
    var montantePoupanca = 0;
    var TaxaPoupanca = Math.pow(1 + poupanca, 1 / 12);
    var TaxaInflacao = Math.pow(1 + inflacao, 1 / 12);
    var TaxaTesouro2025 = Math.pow(1 + pre2025, 1 / 12);
    var graphData = [{ mes: "Rendimento Anual", cru: "Guardar no Colchão", infl: "Inflação ", poup: "Rendimento da Poupança", tes: "Rendimento Líquido Aprox." }];
    var DateTime = new Date();

    for (var mes = 0; mes < totalMeses; mes++) {
        montanteCru = (montanteCru + parseFloat(aporteMensal));
        montantePoupanca = (parseFloat(aporteMensal) + parseFloat(montantePoupanca) * parseFloat(TaxaPoupanca)).toFixed(0);
        montanteInflacao = (parseFloat(aporteMensal) + parseFloat(montanteInflacao) * parseFloat(TaxaInflacao)).toFixed(0);
        montantePre2025 = ((parseFloat(aporteMensal) + parseFloat(montantePre2025) * parseFloat(TaxaTesouro2025))).toFixed(0);
        montanteComIR = (montantePre2025 - (montantePre2025 - montanteCru) * .15).toFixed(0);

        if (DateTime.getMonth() == 0 || DateTime.getMonth() == 6) {
            MontanteDaB3 += montantePre2025 * 0.0015;
        }

        DateTime.setMonth(1 + DateTime.getMonth());

        if (mes == 0 || mes % 12 == 0 || mes == (totalMeses - 1)) {
            graphData.push({ mes: ((DateTime.getMonth() + 1).toString() + "/" + (DateTime.getFullYear())), cru: Fcur(montanteCru), infl: Fcur(montanteInflacao), poup: Fcur(montantePoupanca), tes: Fcur((montanteComIR - MontanteDaB3).toFixed(0)) });
        }
    }
    return graphData;
}

function Fcur(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1.$2");
    return ('R$ ' + x);
}

function calcMeses(val) {
    var DateTime = new Date();
    var today = [DateTime.getMonth(), DateTime.getFullYear()];
    var meses_quebrados = (12 - (today[0] + 1)) + val[0] - 1;
    var meses_cheios = ((val[1]) - (today[1] + 1)) * 12;
    var totalMeses = meses_cheios + meses_quebrados;
    return totalMeses;
}

function criarTabela(conteudo) {
    var tabela = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var thd = function (i) { return (i == 0) ? "th" : "td"; };
    for (var i = 0; i < conteudo.length; i++) {
        var tr = document.createElement("tr");
        for (var o = 0; o < conteudo[i].length; o++) {
            var t = document.createElement(thd(i));
            var texto = document.createTextNode(conteudo[i][o]);
            t.appendChild(texto);
            tr.appendChild(t);
        }
        (i == 0) ? thead.appendChild(tr) : tbody.appendChild(tr);
    }
    tabela.appendChild(thead);
    tabela.appendChild(tbody);
    return tabela;
}

