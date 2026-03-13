import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD5aakkUMk77EMKPwHvjXTqzPKBvejhjEo",
    authDomain: "metricasalebrijes.firebaseapp.com",
    projectId: "metricasalebrijes",
    storageBucket: "metricasalebrijes.firebasestorage.app",
    messagingSenderId: "822819596837",
    appId: "1:822819596837:web:62f3f4139332830ee96dcc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PROFESORES = [
    { nombre: 'Emilio', email: 'emilio@alebrijes.com', password: 'Emilio123', rol: 'admin', equipoRestringido: 'Soles' },
    { nombre: 'Ramiro', email: 'ramiro@alebrijes.com', password: 'Ramiro123', rol: 'profesor', evaluadorGlobal: true }
];

async function run() {
    for (const prof of PROFESORES) {
        try {
            console.log(`Creating user: ${prof.nombre} (${prof.email})...`);
            try {
                const cred = await createUserWithEmailAndPassword(auth, prof.email, prof.password);
                const uid = cred.user.uid;
                await updateProfile(cred.user, { displayName: prof.nombre });
                
                const docData = {
                    nombre: prof.nombre,
                    email: prof.email,
                    rol: prof.rol,
                    creadoEn: new Date()
                };
                if (prof.equipoRestringido) {
                    docData.equipoRestringido = prof.equipoRestringido;
                }
                if (prof.evaluadorGlobal) {
                    docData.evaluadorGlobal = prof.evaluadorGlobal;
                }
    
                await setDoc(doc(db, 'profesores', uid), docData);
                console.log(`${prof.nombre} created successfully (UID: ${uid})`);
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    console.log(`User ${prof.email} already exists. Skipping.`);
                } else {
                    console.error("Error creating user", err);
                }
            }
        } catch (e) {
            console.error("Unexpected error", e);
        }
    }
    console.log("Done");
    process.exit(0);
}

run();
