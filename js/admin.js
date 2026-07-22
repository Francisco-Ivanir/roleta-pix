import { db } from "../config/firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

carregarPainel();

carregarPremios();

 function carregarPainel(){

onSnapshot(

query(

collection(db,"pagamentos"),

orderBy("finalizadoEm","desc")

),

(snapshot)=>{


let total = 0;

let pendentes = 0;

let finalizados = 0;

let arrecadado = 0;
  
const estatisticas = {};

const lista =
document.getElementById("listaPagamentos");


lista.innerHTML = "";


snapshot.forEach((doc)=>{


const pagamento = doc.data();


total++;


if(pagamento.status === "pendente"){

pendentes++;

}


if(pagamento.status === "finalizado"){

finalizados++;

arrecadado += pagamento.valor;

const premio = pagamento.premio || "Sem prêmio";

estatisticas[premio] =
(estatisticas[premio] || 0) + 1;

}


const linha =
document.createElement("tr");

  let dataHora = "-";

if (pagamento.finalizadoEm) {

  dataHora =
  pagamento.finalizadoEm
  .toDate()
  .toLocaleString("pt-BR");

}

linha.innerHTML = `

<td>${dataHora}</td>

<td>${pagamento.nomeCliente || "-"}</td>

<td>${pagamento.whatsappCliente || "-"}</td>

<td>${pagamento.premio || "-"}</td>

<td>${pagamento.status}</td>

`;


lista.appendChild(linha);


});


document
.getElementById("totalGiros")
.innerText = total;


document
.getElementById("pendentes")
.innerText = pendentes;


document
.getElementById("finalizados")
.innerText = finalizados;


document
.getElementById("arrecadado")
.innerText =
"R$ " +
arrecadado
.toFixed(2)
.replace(".",",");

const divEstatisticas =
document.getElementById("estatisticasPremios");

divEstatisticas.innerHTML = "";

for(const premio in estatisticas){

const linha =
document.createElement("p");

linha.innerHTML =
`🏆 ${premio}: <strong>${estatisticas[premio]}</strong>`;

divEstatisticas.appendChild(linha);

}
},

(erro)=>{

console.error(
"Erro ao carregar painel:",
erro
);

}

);

}

function carregarPremios(){

onSnapshot(

collection(db,"premios"),

(snapshot)=>{

const lista =
document.getElementById("listaPremios");

lista.innerHTML = "";

snapshot.forEach((doc)=>{

const premio = doc.data();

const linha =
document.createElement("tr");

linha.innerHTML = `

<td>${premio.nome}</td>

<td>${premio.peso}</td>

<td>${premio.ativo ? "✅" : "❌"}</td>

<td>

<button class="btnEditar">

✏️

</button>

</td>

`;

lista.appendChild(linha);

});

}

);

}
