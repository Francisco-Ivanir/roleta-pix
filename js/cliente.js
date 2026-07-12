let clienteAtual = {

  nome:"",
  whatsapp:""

};

function abrirModalCliente(){

  document
  .getElementById("modalCliente")
  .style.display = "flex";

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

