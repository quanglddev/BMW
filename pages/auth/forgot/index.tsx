import { MouseEvent, useState } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import Logo from "../../../public/icons/logo.svg";
import Google from "../../../public/icons/google.svg";
import { displayError, displaySuccess } from "../../../utils/SweetAlertHelper";

const ForgotPassword: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const onResetPassword = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        displaySuccess("Password reset email sent!", () =>
          router.push("/auth/login")
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        displayError("Email not found. Please try again.", "Error");
      });
  };

  const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

  const onSignInWithGoogle = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/user.emails.read");
    provider.addScope("https://www.googleapis.com/auth/user.phonenumbers.read");
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (!credential) {
          return;
        }

        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const onSignInWithFacebook = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    const provider = new FacebookAuthProvider();
    provider.addScope("public_profile");
    provider.addScope("email");

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);

        if (!credential) {
          return;
        }

        const accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
      });
  };

  return (
    <div className="relative flex w-screen h-full flex-col items-center">
      <div
        className="flex flex-row items-center -mt-1 justify-center w-full drop-shadow-lg bg-red-dark-99 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Logo className="fill-current w-16 h-16 -ml-6"></Logo>
        <div className="-ml-3 text-lg font-bold text-white select-none">
          BMWordle
        </div>
      </div>

      {/* Form */}
      <div className="flex w-full h-full flex-col items-center py-8 bg-gradient-3 max-w-md">
        <form className="flex flex-col items-center bg-white w-10/12 p-2 py-5 rounded-xl drop-shadow-lg">
          <div className="w-full text-center text-xl select-none">
            Forgot Password?
          </div>
          <input
            type="text"
            className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 mt-5"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className={`flex flex-row w-11/12 h-16 rounded-xl mt-5 items-center border-b-4 justify-center border-red-800 bg-red-dark-99 ${
              emailValid ? "opacity-100 hover:bg-red-500" : "opacity-50"
            }`}
            onClick={(e) => onResetPassword(e)}
            disabled={!emailValid}
          >
            <div className="font-bold text-white text-2xl">Submit</div>
          </button>

          <div
            className="flex items-center justify-center w-11/12 bg-text-field-1 mt-6 relative"
            style={{ height: "1px" }}
          >
            <div className="absolute text-xs text-gray-700 bg-white px-3 select-none">
              or connect with
            </div>
          </div>

          {/* <button
            className="flex flex-row items-center mt-5"
            onClick={(e) => onSignInWithFacebook(e)}
          >
            <div className="flex flex-row items-center">
              <Facebook className="fill-current w-6 h-6"></Facebook>
              <div className="ml-2 text-facebook text-sm font-bold">
                Facebook
              </div>
            </div>
          </button> */}

          <button
            className="flex flex-row items-center mt-5"
            onClick={(e) => onSignInWithGoogle(e)}
          >
            <div className="flex flex-row items-center">
              <Google className="fill-current w-6 h-6"></Google>
              <div className="ml-2 text-google text-sm font-bold">Google</div>
            </div>
          </button>

          <div className="flex flex-row items-center mt-3">
            <div className="text-sm text-gray-700 select-none">New?</div>
            <div className="text-sm ml-2 font-semibold text-red-dark-99">
              <Link href="/auth/signup">
                <a>Sign up - it&apos;s FREE!</a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})(ForgotPassword);
