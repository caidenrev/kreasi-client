import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, query, limit, orderBy } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, "wallet_transactions"), orderBy("createdAt", "desc"), limit(1));
  const snap = await getDocs(q);
  if(snap.empty) {
    console.log("No transactions.");
    process.exit(0);
  }
  const tx = snap.docs[0].data();
  console.log("Transaction:", tx);

  const sellerRef = doc(db, "sellers", tx.sellerId);
  const sellerSnap = await getDoc(sellerRef);
  if(sellerSnap.exists()){
    console.log("Seller Data:", sellerSnap.data());
  } else {
    console.log("Seller not found:", tx.sellerId);
  }
  process.exit(0);
}

check();
