import { useEffect, useState } from "react";
import type { NextPage } from "next";
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
import backgroundPic from "../../../public/background_mobile.jpeg";
import ResponsiveAppBar from "../../../components/ResponsiveAppBar";

const SignUp: NextPage = () => {
  return (
    <div className="relative flex w-screen h-screen flex-col items-center bg-navigation-bar">
      <div className="z-50">
        <ResponsiveAppBar></ResponsiveAppBar>
      </div>

      <div className="flex w-full h-full flex-col items-center z-10 mt-12">
        <div className="text-white font-semibold text-3xl mx-4 text-center -mt-8">
          <span>Join Now - It&apos;s Free &#38;</span> <span>Easy!</span>
        </div>

        {/* Form */}
        <div className="flex w-full h-full flex-col items-center z-10 mt-5">
          <form className="flex flex-col items-center w-11/12 rounded-xl">
            <div className="text-xs text-icon w-11/12 font-bold">Username</div>
            <input
              type="text"
              className="bg-text-field-1 text-icon rounded-sm p-2 text-sm w-11/12 border-2 border-btn-1"
            />

            <div className="text-xs text-icon w-11/12 font-bold mt-3">
              Email
            </div>
            <input
              type="text"
              className="bg-text-field-1 text-icon rounded-sm p-2 text-sm w-11/12 border-2 border-btn-1"
            />

            <div className="text-xs text-icon w-11/12 font-bold mt-3">
              Password
            </div>
            <div className="flex flex-row w-11/12 items-center relative">
              <input
                type="text"
                className="bg-text-field-1 text-icon rounded-sm p-2 text-sm w-full border-2 border-btn-1"
              />
              <svg
                className="fill-current text-green-1 h-5 w-5 absolute right-3"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#3d3b39"
                  d="M5.93,25.041c0,0,8.06-11.041,18.004-11.041S41.93,25.041,41.93,25.041S33.879,36,23.934,36S5.93,25.041,5.93,25.041z"
                />
                <path d="M23.934,14c9.945,0,17.996,11.041,17.996,11.041S33.879,36,23.934,36S5.93,25.041,5.93,25.041S13.989,14,23.934,14 M23.934,12C13.098,12,4.668,23.377,4.314,23.862L3.45,25.046l0.868,1.18C4.672,26.707,13.102,38,23.934,38c10.833,0,19.254-11.294,19.607-11.774l0.867-1.18l-0.862-1.183C43.192,23.378,34.771,12,23.934,12L23.934,12z" />
                <path d="M14.935,24.994c0-4.971,4.034-8.994,9-8.994c4.968,0,9,4.023,9,8.994c0,4.977-4.032,9.006-9,9.006C18.968,34,14.935,29.971,14.935,24.994z" />
                <path d="M19.935,24.999c0-2.213,1.786-3.999,4-3.999c2.204,0,4,1.786,4,3.999c0,2.22-1.796,4.001-4,4.001C21.721,29,19.935,27.219,19.935,24.999z" />
                <path d="M5.959,25c0.524-0.7,8.369-10.96,17.975-10.96c9.605,0,17.442,10.259,17.966,10.959L46.857,25l-1.699-2.322c-0.379-0.517-9.387-12.638-21.224-12.638c-11.837,0-20.853,12.12-21.231,12.636L1,25H5.959z" />
              </svg>
            </div>

            <button
              type="submit"
              className="flex flex-row w-11/12 h-12 bg-button-2 rounded-md mt-5 items-center justify-center"
            >
              <div className="font-bold text-white text-sm">
                Create Your FREE Account
              </div>
            </button>

            <div className="text-sm text-icon x-3 my-5">
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

export default SignUp;
