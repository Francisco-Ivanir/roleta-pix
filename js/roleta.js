import { db } from "../config/firebase-config.js";

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


carregarPremiosFirebase();

async function carregarPremiosFirebase() {

  try {

    const snapshot =
      await getDocs(collection(db, "premios"));

    const premiosFirebase = [];

    snapshot.forEach(doc => {

      const dados = doc.data();

      if (dados.ativo === true) {
       console.log("Documento:", doc.id, dados);

premiosFirebase.push({
  nome: dados.nome,
  peso: dados.peso
});
      }

    });

    console.log("Prêmios com peso:", premiosFirebase);

    premios = premiosFirebase;

desenharRoleta();
    
  } catch (erro) {

    console.error(erro);

  }

}

const canvas = document.getElementById("roleta");
const ctx = canvas.getContext("2d");

let premios = [];

const cores = [
  "#ff1744",
  "#ff9100",
  "#00e676",
  "#2979ff",
  "#ffea00",
  "#aa00ff",
  "#00bcd4",
  "#ff5722"
];

let anguloAtual = 0;
let girando = false;

let giroLiberado = false;
let pagamentoAtual = null;

let clienteAtual = {

  nome:"",
  whatsapp:""

};

const pixConfig = {

  chave:
  "00020126580014br.gov.bcb.pix01364414c932-5e48-4188-a572-7291c6cbb83a5204000053039865802BR5901N6001C62090505648266304230B",

  valor:
  1.00

};

function desenharRoleta() {

  const total = premios.length;
  const angulo = (2 * Math.PI) / total;

  ctx.clearRect(0, 0, 320, 320);

  for (let i = 0; i < total; i++) {

    ctx.beginPath();

    ctx.moveTo(160,160);

    ctx.arc(
      160,
      160,
      150,
      i * angulo + anguloAtual,
      (i + 1) * angulo + anguloAtual
    );

    ctx.fillStyle = cores[i];
    ctx.fill();

    ctx.save();

    ctx.translate(160,160);

    ctx.rotate(i * angulo + angulo/2 + anguloAtual);

    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Arial";

    ctx.fillText(
    premios[i].nome,
    70,
    5
);

    ctx.restore();
  }
}

desenharRoleta();

function sortearPorPeso() {

  const totalPeso = premios.reduce((total, premio) => total + premio.peso, 0);

  let sorteio = Math.random() * totalPeso;

  for (const premio of premios) {

    sorteio -= premio.peso;

    if (sorteio <= 0) {
      return premio;
    }

  }

  return premios[0];

}

function encontrarIndicePremio(premio) {

  return premios.findIndex(
    item => item.nome === premio.nome
  );

}

function girarAtePremio(indicePremio, premioSorteado) {


  let voltas = 5;


  let anguloPorSetor =
  (2 * Math.PI) / premios.length;


  // centro do prêmio escolhido
  let anguloPremio =
  (indicePremio * anguloPorSetor)
  + (anguloPorSetor / 2);


  // ajusta para o ponteiro (topo)
  let destino =
(voltas * 2 * Math.PI)
- anguloPremio
- (Math.PI / 2);



  let inicio = anguloAtual;


  let tempo = 0;

  let duracao = 3000;



  const animacao = setInterval(() => {


    tempo += 20;


    let progresso =
    tempo / duracao;



    if(progresso >= 1){


      clearInterval(animacao);


      girando = false;


      anguloAtual = destino;


      desenharRoleta();



      document
      .getElementById("resultado")
      .innerText =
      "Resultado: " + premioSorteado.nome;

      finalizarPagamento(premioSorteado);

      return;

    }



    let suavizado =
    1 - Math.pow(1 - progresso, 3);



    anguloAtual =
    inicio +
    (destino - inicio)
    * suavizado;



    desenharRoleta();



  },20);


}

document
.getElementById("btnGirar")
.addEventListener("click", () => {


 if (girando) return;

if (!giroLiberado) {

  abrirModalCliente();

  return;

}


  girando = true;
  
giroLiberado = false;

  const premioSorteado =
  sortearPorPeso();


  console.log(
    "Prêmio sorteado:",
    premioSorteado
  );


  const indicePremio =
  encontrarIndicePremio(premioSorteado);


  console.log(
    "Índice do prêmio:",
    indicePremio
  );


  girarAtePremio(
    indicePremio,
    premioSorteado
  );


});

document
.getElementById("btnLiberar")
.addEventListener("click", () => {

  giroLiberado = true;

  alert("1 giro liberado!");

});

async function abrirModalPix(){


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


giroLiberado = true;


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

document
.getElementById("btnContinuarCliente")
.addEventListener("click",()=>{


let nome =
document
.getElementById("nomeCliente")
.value;


let whatsapp =
document
.getElementById("whatsappCliente")
.value;


whatsapp =
whatsapp.replace(/\D/g,"");


if(whatsapp.length < 10){

alert("Digite um WhatsApp válido.");

return;

}


clienteAtual.nome = nome;

clienteAtual.whatsapp = whatsapp;


document
.getElementById("modalCliente")
.style.display="none";


abrirModalPix();


});

document
.getElementById("btnFecharCliente")
.addEventListener("click",()=>{


document
.getElementById("modalCliente")
.style.display="none";


});

function abrirModalCliente(){

  document
  .getElementById("modalCliente")
  .style.display = "flex";

}
