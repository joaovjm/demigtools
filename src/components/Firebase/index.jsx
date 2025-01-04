import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBC3Zq-czB7Uq8-7nSxZTyXRgSz7vsCivw",
  authDomain: "demig-tool.firebaseapp.com",
  projectId: "demig-tool",
  storageBucket: "demig-tool.firebasestorage.app",
  messagingSenderId: "665790355015",
  appId: "1:665790355015:web:431658edc343171e858362",
  measurementId: "G-Y1HMDVN5D2",
});

export const app = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUSers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
  }, []);

  return (
    <div>
      <p>
        {users.map((user) => {
          return (
            <div>
              <p>{user.nome}</p>
              <p>{user.email}</p>
            </div>
          );
        })}
      </p>
    </div>
  );
};
