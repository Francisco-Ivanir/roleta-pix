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
  "SUA_CHAVE_AQUI",

  valor:
  1.00

};

