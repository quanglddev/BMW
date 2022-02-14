import { useEffect, useState, MouseEvent } from "react";
import type { NextPage } from "next";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withAuthUser, AuthAction } from "next-firebase-auth";

import Image from "next/image";
import { firestore, usersCollection } from "../../../firebase/clientApp";
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
  query,
  where,
  limit,
  getDocs,
  onSnapshot,
} from "@firebase/firestore";
import Censored from "../../../public/icons/censored.svg";
import Uncensored from "../../../public/icons/uncensored.svg";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";

const SignUp: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [censorPassword, setCensorPassword] = useState<boolean>(true);

  const onFirebaseError = () => {
    const errorAlert = withReactContent(Swal);

    errorAlert.fire({
      title: "Error",
      text: "Invalid Credential",
      icon: "error",
    });
  };

  const onSignUp = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("🚀 ~ file: index.tsx ~ line 61 ~ errorCode", errorCode);
        onFirebaseError();
        const errorMessage = error.message;
        console.log(
          "🚀 ~ file: index.tsx ~ line 63 ~ errorMessage",
          errorMessage
        );
      });
  };

  const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  return (
    <div className="relative flex w-screen h-screen flex-col items-center">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12">
        <div className="text-black font-semibold text-3xl mx-4 text-center -mt-4">
          <span>Join Now - It&apos;s Free &#38;</span> <span>Easy!</span>
        </div>

        {/* Form */}
        <div className="flex w-full h-full flex-col items-center z-10 mt-5">
          <form className="flex flex-col items-center w-11/12 rounded-xl">
            <div className="text-xs text-gray-700 w-11/12 font-bold mt-3">
              Email
            </div>
            <input
              type="text"
              className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="text-xs text-gray-700 w-11/12 font-bold mt-3">
              Password
            </div>
            <div className="flex flex-row w-11/12 items-center relative">
              <input
                type={`${censorPassword ? "password" : "text"}`}
                className="text-black rounded-sm p-2 w-full drop-shadow-md bg-pink-light-1"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!censorPassword ? (
                <Censored
                  className="fill-current h-5 w-5 absolute right-3"
                  onClick={() => setCensorPassword(!censorPassword)}
                ></Censored>
              ) : (
                <Uncensored
                  className="fill-current h-5 w-5 absolute right-3"
                  onClick={() => setCensorPassword(!censorPassword)}
                ></Uncensored>
              )}
            </div>

            <button
              type="submit"
              className={`flex flex-row w-11/12 h-12 bg-red-dark-99 rounded-md mt-5 items-center justify-center ${
                formValid ? "opacity-100" : "opacity-50"
              }`}
              onClick={(e) => onSignUp(e)}
            >
              <div className="font-bold text-white text-sm">
                Create Your FREE Account
              </div>
            </button>

            <div className="text-sm text-gray-500 x-3 my-5">
              or sign up using...
            </div>

            <div className="flex flex-row items-center">
              <div className="flex flex-row items-center">
                <svg className="fill-current w-6 h-6" viewBox="0 0 48 48">
                  <path
                    fill="#217CEF"
                    d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                  />
                  <path
                    fill="#fff"
                    d="M29.368,24H26v12h-5V24h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H30v4h-2.287 C26.104,16,26,16.6,26,17.723V20h4L29.368,24z"
                  />
                </svg>
                <div className="ml-2 text-facebook text-sm font-bold">
                  Facebook
                </div>
              </div>

              <div className="flex flex-row items-center ml-8">
                <svg className="fill-current w-6 h-6" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <div className="ml-2 text-google text-sm font-bold">Google</div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(SignUp);
