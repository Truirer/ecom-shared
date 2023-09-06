import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { doc,setDoc,getFirestore,getDoc,updateDoc } from "firebase/firestore"; 

import "firebase/firestore";
import firebaseConfig from "./config";
import { getAuth,signOut, createUserWithEmailAndPassword,signInWithEmailAndPassword,setPersistence, browserSessionPersistence  } from "firebase/auth";
import { getStorage  } from "firebase/storage";
import { getDatabase, ref, onValue } from "firebase/database";

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.storage = getStorage;
    this.db = getFirestore()
    this.auth = getAuth();
  }
  // AUTH ACTIONS ------------
  checkAuthOnLoad=()=>{
    return this.auth.currentUser
  }
  createAccount = async (email, password,userData) =>{
    const result = await createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        this.signIn(user.uid)
        const addUserData =  this.addUser(user.uid,userData)
        return this.getUser(user.uid)
        // ...
      })
      .catch((error) => {
        return false
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
    return result
  }

  signIn = async (email, password) =>{
    const result = await signInWithEmailAndPassword(this.auth,email, password)
    .then(async (userCredential) => {
      // Signed in 
      console.log(5)
      const user = userCredential.user;
      return this.getUser(user.uid).then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(userRecord)
        return userRecord;
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
      });

      // ...
    })
    .catch((error) => {
      console.log(error.code)
      return false
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
    return result
  }

  // signInWithGoogle = () =>
  //   this.auth.signInWithPopup(new app.auth.GoogleAuthProvider());

  // signInWithFacebook = () =>
  //   this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  // signInWithGithub = () =>
  //   this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOutFirebase = (uid) => {
    signOut(this.auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = async (id, user) => {const result = await setDoc(doc(this.db,`users/${id}`),user);return {uid:id}};

  getUser = async (id) => {
    
    const result = await getDoc(doc(this.db,`users/${ id}`));const returnObject = result.data(); return {...returnObject,uid:id}};

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  addProduct = async (id, product) => {const result = await setDoc(doc(this.db,`products/${id}`),product);return {uid:id}};

  getProducts = async (id) => {const result = await getDoc(doc(this.db,`products/${id}`));return result.data()};

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  // reauthenticate = (currentPassword) => {
  //   const user = this.auth.currentUser;
  //   const cred = app.auth.EmailAuthProvider.credential(
  //     user.email,
  //     currentPassword
  //   );

  //   return user.reauthenticateWithCredential(cred);
  // };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = async (id, updates) =>{
    const result = await updateDoc(doc(this.db,`users/${this.auth.currentUser.uid}`), updates );
    return true
  };

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
          localStorage.removeItem("userData")
          window.location.reload()
        }
      });
    });

  saveCartItems = async (items,product_id) =>{
    if(!this.auth.currentUser) {return null}
    const result = await updateDoc(doc(this.db,`users/${this.auth.currentUser.uid}`),{ cart:items });
    return result
  }
  

  setAuthPersistence = async (email,password) =>{
    const result = await setPersistence(this.auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return this.signIn(email, password);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
    return result
  }

  // PRODUCT ACTIONS --------------

  getSingleProduct = (id) => this.db.collection("products").doc(id).get();

  // getProducts = (lastRefKey) => {
  //   let didTimeout = false;

  //   return new Promise((resolve, reject) => {
  //     (async () => {
  //       if (lastRefKey) {
  //         try {
  //           const query = this.db
  //             .collection("products")
  //             .orderBy(app.firestore.FieldPath.documentId())
  //             .startAfter(lastRefKey)
  //             .limit(12);

  //           const snapshot = await query.get();
  //           const products = [];
  //           snapshot.forEach((doc) =>
  //             products.push({ id: doc.id, ...doc.data() })
  //           );
  //           const lastKey = snapshot.docs[snapshot.docs.length - 1];

  //           resolve({ products, lastKey });
  //         } catch (e) {
  //           reject(e?.message || ":( Failed to fetch products.");
  //         }
  //       } else {
  //         const timeout = setTimeout(() => {
  //           didTimeout = true;
  //           reject(new Error("Request timeout, please try again"));
  //         }, 15000);

  //         try {
  //           const totalQuery = await this.db.collection("products").get();
  //           const total = totalQuery.docs.length;
  //           const query = this.db
  //             .collection("products")
  //             .orderBy(app.firestore.FieldPath.documentId())
  //             .limit(12);
  //           const snapshot = await query.get();

  //           clearTimeout(timeout);
  //           if (!didTimeout) {
  //             const products = [];
  //             snapshot.forEach((doc) =>
  //               products.push({ id: doc.id, ...doc.data() })
  //             );
  //             const lastKey = snapshot.docs[snapshot.docs.length - 1];

  //             resolve({ products, lastKey, total });
  //           }
  //         } catch (e) {
  //           if (didTimeout) return;
  //           reject(e?.message || ":( Failed to fetch products.");
  //         }
  //       }
  //     })();
  //   });
  // };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const productsRef = this.db.collection("products");

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const searchedNameRef = productsRef
            .orderBy("name_lower")
            .where("name_lower", ">=", searchKey)
            .where("name_lower", "<=", `${searchKey}\uf8ff`)
            .limit(12);
          const searchedKeywordsRef = productsRef
            .orderBy("dateAdded", "desc")
            .where("keywords", "array-contains-any", searchKey.split(" "))
            .limit(12);

          // const totalResult = await totalQueryRef.get();
          const nameSnaps = await searchedNameRef.get();
          const keywordsSnaps = await searchedKeywordsRef.get();
          // const total = totalResult.docs.length;

          clearTimeout(timeout);
          if (!didTimeout) {
            const searchedNameProducts = [];
            const searchedKeywordsProducts = [];
            let lastKey = null;

            if (!nameSnaps.empty) {
              nameSnaps.forEach((doc) => {
                searchedNameProducts.push({ id: doc.id, ...doc.data() });
              });
              lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
            }

            if (!keywordsSnaps.empty) {
              keywordsSnaps.forEach((doc) => {
                searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
              });
            }

            // MERGE PRODUCTS
            const mergedProducts = [
              ...searchedNameProducts,
              ...searchedKeywordsProducts,
            ];
            const hash = {};

            mergedProducts.forEach((product) => {
              hash[product.id] = product;
            });

            resolve({ products: Object.values(hash), lastKey });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  getFeaturedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isFeatured", "==", true)
      .limit(itemsCount)
      .get();

  getRecommendedProducts = (itemsCount = 12) =>
    this.db
      .collection("products")
      .where("isRecommended", "==", true)
      .limit(itemsCount)
      .get();


  generateKey = () => this.db.collection("products").doc().id;

  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  deleteImage = (id) => this.storage.ref("products").child(id).delete();

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();
}

const firebaseSettings = new Firebase();

export default firebaseSettings;
