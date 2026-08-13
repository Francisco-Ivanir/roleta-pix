import { db } from "../config/firebase-config.js";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  pegarClienteAtual
} from "./cliente.js";

import {
  liberarGiro
} from "./roleta.js";

carregarConfiguracoes();

let pagamentoAtual = null;

let pararMonitoramentoPagamento = null;

export function pegarPagamentoAtual(){

  return pagamentoAtual;

}

let pixConfig = {

valor: 1,

chave: "",

recebedor: "",

instituicao: "",

cnpj: "",

identificador: ""

};

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

const dados =
config.data();

pixConfig.valor =
dados.valorGiro;

pixConfig.chave =
dados.chavePix;

  pixConfig.recebedor =
dados.recebedor || "";

pixConfig.instituicao =
dados.instituicao || "";

pixConfig.cnpj =
dados.cnpjRecebedor || "";

pixConfig.identificador =
dados.identificador || "";
  
}

}

catch(erro){

console.error(
"Erro ao carregar configurações PIX:",
erro
);

}

}

export async function abrirModalPix(){


document
.getElementById("modalPix")
.style.display = "flex";

const cliente = pegarClienteAtual();

  cliente.nome
cliente.whatsapp
  
document
.getElementById("chavePix")
.innerText =
pixConfig.chave;


document
.getElementById("valorPix")
.innerText =
"R$ " +
pixConfig.valor.toFixed(2)
.replace(".",",");



try {


const pagamento =
await addDoc(
collection(db,"pagamentos"),
{

valor: pixConfig.valor,

nomeCliente: cliente.nome,

whatsappCliente: cliente.whatsapp,

status:"pendente",

criadoEm:
serverTimestamp()

});


pagamentoAtual = pagamento.id;


console.log(
"Pagamento criado:",
pagamento.id
);

pararMonitoramentoPagamento =
onSnapshot(

doc(
db,
"pagamentos",
pagamentoAtual
),

(snapshot)=>{

if(!snapshot.exists()){

return;

}

const dados =
snapshot.data();

console.log(
"Status do pagamento:",
dados.status
);

if(dados.status === "confirmado"){

console.log(
"Pagamento confirmado pelo Admin!"
);

}

}

);

}
catch(erro){

console.error(
"Erro pagamento:",
erro
);


}

  document
.getElementById("pixRecebedor")
.innerText =
pixConfig.recebedor;

document
.getElementById("pixInstituicao")
.innerText =
pixConfig.instituicao;

document
.getElementById("pixCnpj")
.innerText =
pixConfig.cnpj;

document
.getElementById("pixIdentificador")
.innerText =
pixConfig.identificador;

}

document
.getElementById("btnFecharPix")
.addEventListener("click",()=>{


document
.getElementById("modalPix")
.style.display="none";


});

document
.getElementById("btnJaPaguei")
.addEventListener("click",async ()=>{


if(pagamentoAtual){


await updateDoc(

doc(
db,
"pagamentos",
pagamentoAtual
),

{

status:"pendente",

confirmadoEm:
serverTimestamp()

}

);


console.log(
"Pagamento confirmado:",
pagamentoAtual
);


}


document
.getElementById("modalPix")
.style.display="none";


alert("Solicitação enviada! Aguarde a confirmação do pagamento.");


});

document
.getElementById("btnCopiarPix")
.addEventListener("click",()=>{


navigator.clipboard.writeText(
pixConfig.chave
);


alert("Chave PIX copiada!");

});

async function finalizarPagamento(premioSorteado){


if(!pagamentoAtual){

console.log("Nenhum pagamento encontrado.");

return;

}


try{


await updateDoc(

doc(
db,
"pagamentos",
pagamentoAtual
),

{

status:"finalizado",

premio:
premioSorteado.nome,

peso:
premioSorteado.peso,

finalizadoEm:
serverTimestamp()

}

);


console.log(
"Pagamento finalizado:",
pagamentoAtual
);


}


catch(erro){

console.error(
"Erro ao finalizar:",
erro
);


}


}
