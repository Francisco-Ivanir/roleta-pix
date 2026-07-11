function abrirModalPix(){

  document
  .getElementById("modalPix")
  .style.display = "flex";

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
.addEventListener("click",()=>{


giroLiberado = true;


document
.getElementById("modalPix")
.style.display="none";


alert("Pagamento confirmado! Giro liberado.");


});

