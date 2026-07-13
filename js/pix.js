import { db } from "../config/firebase-config.js";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
  liberarGiro
} from "./roleta.js";

let pagamentoAtual = null;


const pixConfig = {

  chave:
  "00020126580014br.gov.bcb.pix01364414c932-5e48-4188-a572-7291c6cbb83a5204000053039865802BR5901N6001C62090505648266304230B",

  valor:
  1.00

};

export async function abrirModalPix(){


document
.getElementById("modalPix")
.style.display = "flex";


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

status:"pendente",

criadoEm:
serverTimestamp()

});


pagamentoAtual = pagamento.id;


console.log(
"Pagamento criado:",
pagamento.id
);



}
catch(erro){

console.error(
"Erro pagamento:",
erro
);


}


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

status:"confirmado",

confirmadoEm:
serverTimestamp()

}

);


console.log(
"Pagamento confirmado:",
pagamentoAtual
);


}


liberarGiro();


document
.getElementById("modalPix")
.style.display="none";


alert("Pagamento confirmado! Giro liberado.");


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
