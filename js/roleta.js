import { db } from "../config/firebase-config.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const canvas = document.getElementById("roleta");
const ctx = canvas.getContext("2d");

const premios = [
  "Brinde",
  "R$ 5",
  "Brinde",
  "R$ 10",
  "Brinde",
  "Especial",
  "Tente",
  "Brinde"
];

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
      premios[i],
      70,
      5
    );

    ctx.restore();
  }
}

desenharRoleta();

document
.getElementById("btnGirar")
.addEventListener("click", () => {

  if(girando) return;

  girando = true;

  let velocidade = 0.35;

  const animacao = setInterval(() => {

    anguloAtual += velocidade;

    velocidade *= 0.985;

    desenharRoleta();

    if(velocidade < 0.002){

      clearInterval(animacao);

      girando = false;

      const setor =
      Math.floor(
        ((2*Math.PI - (anguloAtual % (2*Math.PI)))
        / (2*Math.PI))
        * premios.length
      ) % premios.length;

      document
      .getElementById("resultado")
      .innerText =
      "Resultado: " + premios[setor];
    }

  },20);

});
