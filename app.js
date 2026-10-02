// Importar los SDKs necesarios de Firebase desde el CDN oficial (o mediante npm/módulos)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuración de tu proyecto Firebase (Tus credenciales reales de Nexus-S)
const firebaseConfig = {
  apiKey: "AIzaSyD_22q5HAnd2tJo4xO6SBiyzl2iJ0JFuxQ",
  authDomain: "nexus-s-d4486.firebaseapp.com",
  projectId: "nexus-s-d4486",
  storageBucket: "nexus-s-d4486.firebasestorage.app",
  messagingSenderId: "410032778746",
  appId: "1:410032778746:web:7751bbc2b3105083a4c843",
  measurementId: "G-5HSD413PSJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias del DOM
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const authMessage = document.getElementById("auth-message");

// Control de Pestañas (UI)
tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    formLogin.classList.remove("hidden");
    formRegister.classList.add("hidden");
    authMessage.textContent = "";
});

tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    formRegister.classList.remove("hidden");
    formLogin.classList.add("hidden");
    authMessage.textContent = "";
});

// Lógica de Registro de Usuario
formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = document.getElementById("reg-username").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const birthYear = parseInt(document.getElementById("reg-birthyear").value);

    // Calcular si es menor de 17 años (Basado en el año actual 2026)
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    const esMenorDe17 = age < 17;

    try {
        // 1. Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Guardar perfil estructurado en la colección "usuarios" de Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            username: username,
            email: email,
            birthYear: birthYear,
            esMenorDe17: esMenorDe17, // Clave para la moderación de contenido adulto en el Paso 2
            createdAt: new Date().toISOString()
        });

        authMessage.textContent = "¡Cuenta creada con éxito! Bienvenido a la plataforma.";
        authMessage.className = "auth-message success";
    } catch (error) {
        console.error("Error en el registro:", error);
        authMessage.textContent = `Error: ${error.message}`;
        authMessage.className = "auth-message error";
    }
});

// Lógica de Inicio de Sesión
formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        authMessage.textContent = "¡Inicio de sesión exitoso!";
        authMessage.className = "auth-message success";
    } catch (error) {
        console.error("Error en el login:", error);
        authMessage.textContent = `Error: Credenciales inválidas o usuario no encontrado.`;
        authMessage.className = "auth-message error";
    }
});
