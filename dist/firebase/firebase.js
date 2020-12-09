"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerFB = exports.providerGG = exports.auth = void 0;
const firebase_1 = __importDefault(require("firebase"));
const firebaseConfig = {
    apiKey: "AIzaSyA8W1cI4fi67t05azlgfCj9i_zvmNkh_kU",
    authDomain: "dack-d233d.firebaseapp.com",
    projectId: "dack-d233d",
    storageBucket: "dack-d233d.appspot.com",
    messagingSenderId: "274785163134",
    appId: "1:274785163134:web:70e0c827dc4bd1f63d452f",
    measurementId: "G-EE3TS8L5HB",
};
firebase_1.default.initializeApp(firebaseConfig);
const auth = firebase_1.default.auth();
exports.auth = auth;
const providerGG = new firebase_1.default.auth.GoogleAuthProvider();
exports.providerGG = providerGG;
const providerFB = new firebase_1.default.auth.FacebookAuthProvider();
exports.providerFB = providerFB;
//# sourceMappingURL=firebase.js.map