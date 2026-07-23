import { db } from "../config/firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

carregarPainel();

carregarPremios();

let premioEditando = null;

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

  const id = doc.id;
  
const linha =
document.createElement("tr");

linha.innerHTML = `

<td>${premio.nome}</td>

<td>${premio.peso}</td>

<td>${premio.ativo ? "✅" : "❌"}</td>

<td>

<button

class="btnEditar"

data-id="${id}"

data-nome="${premio.nome}"

data-peso="${premio.peso}"

data-ativo="${premio.ativo}"

>

✏️

</button>

</td>

`;

lista.appendChild(linha);

});

}

);

}

document

.addEventListener("click",(e)=>{

if(

e.target.classList.contains("btnEditar")

){

premioEditando =
e.target.dataset.id;

document
.getElementById("editNomePremio")
.value =
e.target.dataset.nome;

document
.getElementById("editPesoPremio")
.value =
e.target.dataset.peso;

document
.getElementById("editAtivoPremio")
.checked =
e.target.dataset.ativo === "true";

document
.getElementById("modalPremio")
.style.display="flex";

}

});

document

.getElementById("btnFecharPremio")

.addEventListener("click",()=>{

document
.getElementById("modalPremio")
.style.display="none";

});

document

.getElementById("btnNovoPremio")

.addEventListener("click",()=>{

premioEditando = null;

document
.getElementById("editNomePremio")
.value = "";

document
.getElementById("editPesoPremio")
.value = "";

document
.getElementById("editAtivoPremio")
.checked = true;

document
.getElementById("modalPremio")
.style.display = "flex";

});

document

.getElementById("btnSalvarPremio")

.addEventListener("click", async()=>{

if(!premioEditando){

return;

}

try{

await updateDoc(

doc(
db,
"premios",
premioEditando
),

{

nome:

document
.getElementById("editNomePremio")
.value,

peso:

Number(

document
.getElementById("editPesoPremio")
.value

),

ativo:

document
.getElementById("editAtivoPremio")
.checked

}

);

document
.getElementById("modalPremio")
.style.display="none";

alert("Prêmio atualizado!");

}

catch(erro){

console.error(erro);

alert("Erro ao atualizar prêmio.");

}

});
