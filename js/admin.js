import { db } from "../config/firebase-config.js";

import {
  collection,
 onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


carregarPainel();


async function carregarPainel(){


try{


const snapshot =
await getDocs(
collection(db,"pagamentos")
);



let total = 0;

let pendentes = 0;

let finalizados = 0;

let arrecadado = 0;



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

}




const linha = document.createElement("tr");


linha.innerHTML = `

<td>
${pagamento.nomeCliente || "-"}
</td>

<td>
${pagamento.whatsappCliente || "-"}
</td>

<td>
${pagamento.premio || "-"}
</td>

<td>
${pagamento.status}
</td>

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



}

catch(erro){

console.error(
"Erro ao carregar painel:",
erro
);

}


}
