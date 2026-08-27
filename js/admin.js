import { db } from "../config/firebase-config.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let senhaAdmin = "";

async function carregarConfiguracoes(){

try{

const config =
await getDoc(

doc(
db,
"configuracoes",
"geral"
)

);

if(config.exists()){

senhaAdmin =
config.data().senhaAdmin;

}

}

catch(erro){

console.error(
"Erro ao carregar configurações:",
erro
);

}

}

if(
sessionStorage.getItem("adminLogado")
==="true"
){

document
.addEventListener("DOMContentLoaded",()=>{

document
.getElementById("loginAdmin")
.style.display="none";

document
.getElementById("painelAdmin")
.style.display="block";

});

}

let historicoDados = [];

let filtroAtualHistorico = "todos";

carregarPainel();

carregarHistoricoPagamentos();

carregarPremios();

carregarConfiguracoes();

carregarConfiguracoesPainel();

let premioEditando = null;

let premioExcluir = null;

async function carregarConfiguracoesPainel(){

try{

const config =
await getDoc(

doc(
db,
"configuracoes",
"geral"
)

);

if(config.exists()){

const dados =
config.data();

document
.getElementById("configValorGiro")
.value =
dados.valorGiro;

  document
.getElementById("configNomeCampanha")
.value =
dados.nomeCampanha || "";

  document
.getElementById("configStatusCampanha")
.value =
dados.statusCampanha || "ativa";
  
document
.getElementById("configChavePix")
.value =
dados.chavePix || "";

document
.getElementById("configRecebedor")
.value =
dados.recebedor || "";

document
.getElementById("configInstituicao")
.value =
dados.instituicao || "";

document
.getElementById("configCnpj")
.value =
dados.cnpjRecebedor || "";

document
.getElementById("configIdentificador")
.value =
dados.identificador || "";

  document
.getElementById("resumoCampanha")
.innerText =
dados.nomeCampanha || "-";

document
.getElementById("resumoValor")
.innerText =
Number(dados.valorGiro || 0)
.toFixed(2)
.replace(".",",");

document
.getElementById("resumoRecebedor")
.innerText =
dados.recebedor || "-";

  document
.getElementById("resumoStatusCampanha")
.innerText =
dados.statusCampanha === "pausada"
? "🔴 Pausada"
: "🟢 Ativa";
  
}

}

catch(erro){

console.error(
"Erro ao carregar configurações:",
erro
);

}

}
  
 function carregarPainel(){

onSnapshot(

query(

collection(db,"pagamentos"),

orderBy("criadoEm","desc")

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
  
const listaPendentes =
document.getElementById("listaPendentes");

listaPendentes.innerHTML = "";


snapshot.forEach((doc)=>{


const pagamento = doc.data();
  
total++;


if(pagamento.status === "pendente"){

pendentes++;

const linhaPendente =
document.createElement("tr");

let dataPendente = "-";

if (pagamento.criadoEm) {

dataPendente =
pagamento.criadoEm
.toDate()
.toLocaleString("pt-BR");

}

linhaPendente.innerHTML = `

<td>${dataPendente}</td>

<td>${pagamento.nomeCliente || "-"}</td>

<td>${pagamento.whatsappCliente || "-"}</td>

<td>R$ ${Number(pagamento.valor || 0)
.toFixed(2)
.replace(".",",")}</td>

<td>

⏳ Pendente

<br><br>

<button
class="btnConfirmarPagamento"
data-id="${doc.id}"
>

✅ Confirmar

</button>

<button
class="btnVerPagamento"
data-id="${doc.id}"
>

👁 Ver

</button>

</td>

`;

listaPendentes.appendChild(linhaPendente);

}


if(pagamento.status === "finalizado"){

finalizados++;

arrecadado += pagamento.valor;

const premio = pagamento.premio || "Sem prêmio";

estatisticas[premio] =
(estatisticas[premio] || 0) + 1;

}


if (pagamento.status === "finalizado") {

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

<td>✅ Finalizado</td>

`;

lista.appendChild(linha);

}

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

<button
class="btnExcluir"
data-id="${id}"
data-nome="${premio.nome}"
>

🗑️

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
.getElementById("btnBuscarWhatsApp")
.addEventListener("click",()=>{

const numero =
document
.getElementById("buscarWhatsApp")
.value
.trim();
  
const busca =
query(

collection(db,"pagamentos"),

where(
"whatsappCliente",
"==",
numero
)

);


onSnapshot(

busca,

(snapshot)=>{


let resultados = [];


snapshot.forEach((doc)=>{

resultados.push({

id: doc.id,

...doc.data()

});

});

resultados.sort((a,b)=>{

return b.criadoEm.toMillis() - a.criadoEm.toMillis();

});

  console.log(
"Busca ordenada:",
resultados
);

  const resultadoBusca =
document.getElementById(
"resultadoBuscaWhatsApp"
);

const contadorBusca =
document.getElementById(
"contadorBuscaWhatsApp"
);


if(contadorBusca){

contadorBusca.innerText =
resultados.length +
" pagamentos encontrados.";

}

const tabela =
document.getElementById(
"tabelaBuscaWhatsApp"
);


if(tabela){

tabela.innerHTML = "";

}

  resultados.forEach((pagamento)=>{


let data = "-";


if(pagamento.criadoEm){

data =
pagamento.criadoEm
.toDate()
.toLocaleString("pt-BR");

}


const linha =
document.createElement("tr");


linha.innerHTML = `

<td>${data}</td>

<td>${pagamento.nomeCliente || "-"}</td>

<td>${pagamento.whatsappCliente || "-"}</td>

<td>
R$ ${
Number(pagamento.valor || 0)
.toFixed(2)
.replace(".",",")
}
</td>

<td>

${
pagamento.status === "pendente"
? "🟠 Pendente"

: pagamento.status === "confirmado"
? "🔵 Confirmado"

: pagamento.status === "finalizado"
? "🟢 Finalizado"

: pagamento.status || "-"

}

</td>

<td>${pagamento.premio || "-"}</td>

`;


if(tabela){

tabela.appendChild(linha);

}

});
  
});

});

document
.getElementById("btnSalvarConfiguracoes")
.addEventListener("click", async()=>{

try{

await updateDoc(

doc(
db,
"configuracoes",
"geral"
),

{

nomeCampanha:
document
.getElementById("configNomeCampanha")
.value,

valorGiro:
Number(
document
.getElementById("configValorGiro")
.value
),

chavePix:
document
.getElementById("configChavePix")
.value,

recebedor:
document
.getElementById("configRecebedor")
.value,

instituicao:
document
.getElementById("configInstituicao")
.value,

cnpjRecebedor:
document
.getElementById("configCnpj")
.value,

identificador:
document
.getElementById("configIdentificador")
.value,

  statusCampanha:
document
.getElementById("configStatusCampanha")
.value

}

);

alert(
"Configurações salvas!"
);

}

catch(erro){

console.error(erro);

alert(
"Erro ao salvar configurações."
);

}

});

document
.getElementById("modalDetalhesPagamento")
.addEventListener("click",(e)=>{

if(
e.target.id === "modalDetalhesPagamento"
){

document
.getElementById("modalDetalhesPagamento")
.style.display =
"none";

}

});

document
.getElementById("btnFecharDetalhes")
.addEventListener("click",()=>{

document
.getElementById("modalDetalhesPagamento")
.style.display =
"none";

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

try{

if(premioEditando){

await updateDoc(

doc(
db,
"premios",
premioEditando
),

{

nome:
document.getElementById("editNomePremio").value,

peso:
Number(
document.getElementById("editPesoPremio").value
),

ativo:
document.getElementById("editAtivoPremio").checked

}

);

}
else{

await addDoc(

collection(db,"premios"),

{

nome:
document.getElementById("editNomePremio").value,

peso:
Number(
document.getElementById("editPesoPremio").value
),

ativo:
document.getElementById("editAtivoPremio").checked

}

);

}
  
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

document.addEventListener("click",async(e)=>{

if(e.target.classList.contains("btnExcluir")){

premioExcluir = e.target.dataset.id;

document
.getElementById("textoExcluirPremio")
.innerText =
`Tem certeza que deseja excluir "${e.target.dataset.nome}"?`;

document
.getElementById("modalExcluirPremio")
.style.display="flex";

}

 if(e.target.classList.contains("btnConfirmarPagamento")){

   e.target.disabled = true;

e.target.innerText = "Confirmando...";
   
const pagamentoId =
e.target.dataset.id;
   
   const pagamentoRef =
doc(
db,
"pagamentos",
pagamentoId
);

const pagamentoSnap =
await getDoc(pagamentoRef);

if(!pagamentoSnap.exists()){

alert("❌ Pagamento não encontrado.");

return;

}

const pagamento =
pagamentoSnap.data();

   if(pagamento.status !== "pendente"){

alert(
"⚠️ Este pagamento já foi confirmado."
);

return;

}
   
try{

await updateDoc(

doc(
db,
"pagamentos",
pagamentoId
),

{

status:"confirmado",

confirmadoEm:
serverTimestamp()

}

);

console.log(
"Pagamento confirmado:",
pagamentoId
);

 alert(
"✅ Pagamento confirmado!\n\n" +
"Cliente: " +
(pagamento.nomeCliente || "-") +
"\n" +
"Valor: R$ " +
Number(pagamento.valor || 0)
.toFixed(2)
.replace(".",",")
);
  
}catch(erro){

console.error(
"Erro ao confirmar pagamento:",
erro
);

}

}
 
  if(e.target.classList.contains("btnVerPagamento")){

const pagamentoId =
e.target.dataset.id;


const pagamentoSnap =
await getDoc(

doc(
db,
"pagamentos",
pagamentoId
)

);


if(!pagamentoSnap.exists()){

alert(
"Pagamento não encontrado."
);

return;

}


const pagamento =
pagamentoSnap.data();


console.log(
"Detalhes pagamento:",
pagamento
);

  document
.getElementById("detalheCliente")
.innerText =
"👤 Cliente: " +
(pagamento.nomeCliente || "-");


document
.getElementById("detalheWhatsapp")
.innerText =
"📱 WhatsApp: " +
(pagamento.whatsappCliente || "-");


document
.getElementById("detalheValor")
.innerText =
"💰 Valor: R$ " +
Number(pagamento.valor || 0)
.toFixed(2)
.replace(".",",");


document
.getElementById("detalheStatus")
.innerText =
"📌 Status: " +
(pagamento.status || "-");


document
.getElementById("modalDetalhesPagamento")
.style.display =
"flex";
    
}
  
});

document
.getElementById("btnCancelarExcluir")
.addEventListener("click",()=>{

document
.getElementById("modalExcluirPremio")
.style.display="none";

});

document
.getElementById("btnConfirmarExcluir")
.addEventListener("click", async()=>{

if(!premioExcluir){

return;

}

try{

await updateDoc(

doc(
db,
"premios",
premioExcluir
),

{

ativo:false

}

);

document
.getElementById("modalExcluirPremio")
.style.display="none";

alert("Prêmio desativado.");

premioExcluir = null;

}

catch(erro){

console.error(erro);

alert("Erro ao desativar prêmio.");

}

});

document
.getElementById("btnEntrar")
.addEventListener("click",()=>{

const senha =
document
.getElementById("senhaAdmin")
.value;

if(senha !== senhaAdmin){

alert("Senha incorreta.");

return;

}

  sessionStorage.setItem(
"adminLogado",
"true"
);
  
document
.getElementById("loginAdmin")
.style.display = "none";

document
.getElementById("painelAdmin")
.style.display = "block";

});

document
.getElementById("btnSair")
.addEventListener("click",()=>{

sessionStorage.removeItem(
"adminLogado"
);

location.reload();

});

function carregarHistoricoPagamentos(){

 historicoDados = [];
  
onSnapshot(

query(

collection(db,"pagamentos"),

orderBy("criadoEm","desc")

),

(snapshot)=>{

  const historico =
document.getElementById("historicoPagamentos");

historico.innerHTML = "";

  historicoDados = [];

snapshot.forEach((doc)=>{

historicoDados.push({
id: doc.id,
...doc.data()
});

});
  
if(filtroAtualHistorico === "todos"){

mostrarHistorico(historicoDados);

}else{

const filtrados =
historicoDados.filter(
pagamento =>
pagamento.status === filtroAtualHistorico
);

mostrarHistorico(filtrados);

}
  
}

);

}

document
.getElementById("filtroHistorico")
.addEventListener("change",(e)=>{

const filtro =
e.target.value;

  filtroAtualHistorico = filtro;
  
if(filtro === "todos"){

mostrarHistorico(historicoDados);

return;

}

const filtrados =
historicoDados.filter(
pagamento =>
pagamento.status === filtro
);

mostrarHistorico(filtrados);

});

function mostrarHistorico(dados){

  const historico =
    document.getElementById("historicoPagamentos");

  const contador =
document.getElementById("contadorHistorico");

if(contador){

contador.innerText =
"Exibindo: " +
dados.length +
" pagamentos";

}
  
  historico.innerHTML = "";

  dados.forEach((pagamento)=>{

    let dataHora = "-";

    if(pagamento.criadoEm){

      dataHora =
        pagamento.criadoEm
        .toDate()
        .toLocaleString("pt-BR");

    }

    const linha =
      document.createElement("tr");

    linha.innerHTML = `

      <td>${dataHora}</td>

      <td>${pagamento.nomeCliente || "-"}</td>

      <td>${pagamento.whatsappCliente || "-"}</td>

      <td>
        R$ ${(pagamento.valor || 0)
        .toFixed(2)
        .replace(".",",")}
      </td>

      <td>

        ${
          pagamento.status === "pendente"
          ? "🟠 Pendente"
          : pagamento.status === "confirmado"
          ? "🔵 Confirmado"
          : pagamento.status === "finalizado"
          ? "🟢 Finalizado"
          : pagamento.status || "-"
        }

      </td>

      <td>${pagamento.premio || "-"}</td>

    `;

    historico.appendChild(linha);

  });

}
