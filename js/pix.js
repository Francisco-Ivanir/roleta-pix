import { db } from "../config/firebase-config.js";

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


let pagamentoAtual = null;


const pixConfig = {

  chave:
  "00020126580014br.gov.bcb.pix01364414c932-5e48-4188-a572-7291c6cbb83a5204000053039865802BR5901N6001C62090505648266304230B",

  valor:
  1.00

};

