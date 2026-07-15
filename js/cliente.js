import {
  abrirModalPix
} from "./pix.js";

let clienteAtual = {

  nome:"",
  whatsapp:""

};

export function abrirModalCliente(){

  document
  .getElementById("modalCliente")
  .style.display = "flex";

}

export function pegarClienteAtual(){

  return clienteAtual;

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

