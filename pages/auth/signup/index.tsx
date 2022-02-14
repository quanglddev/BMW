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
import Facebook from "../../../public/icons/facebook.svg";
import Google from "../../../public/icons/google.svg";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";
import { useRouter } from "next/router";

const SignUp: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [censorPassword, setCensorPassword] = useState<boolean>(true);

  const onFirebaseError = (errorCode: string) => {
    const errorAlert = withReactContent(Swal);

    let message = "Internal Error.";

    switch (errorCode) {
      case "auth/email-already-in-use":
        message = "Email already been used. Please log in!";
        break;
    }

    errorAlert
      .fire({
        title: "Error",
        text: message,
        icon: "error",
      })
      .then(() => {
        if (errorCode === "auth/email-already-in-use") {
          router.push("/auth/login");
        }
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
        onFirebaseError(errorCode);
        const errorMessage = error.message;
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
              disabled={!formValid}
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
                <Facebook className="fill-current w-6 h-6"></Facebook>
                <div className="ml-2 text-facebook text-sm font-bold">
                  Facebook
                </div>
              </div>

              <div className="flex flex-row items-center ml-8">
                <Google className="fill-current w-6 h-6"></Google>
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
