import { db } from "../config/firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

carregarPainel();

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


},

(erro)=>{

console.error(
"Erro ao carregar painel:",
erro
);

}

);

}
