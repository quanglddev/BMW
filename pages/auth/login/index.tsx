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

const Login: NextPage = () => {
  return (
    <div className="relative flex w-screen h-screen flex-col items-center bg-navigation-bar">
      <div className="flex flex-row items-center -mt-1">
        <svg
          className="fill-current w-16 h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#000"
            d="M34.476,24c0-5.787-4.69-10.476-10.476-10.476S13.524,18.213,13.524,24S18.213,34.476,24,34.476S34.476,29.787,34.476,24L34.476,24z"
          />
          <path
            fill="#679343"
            d="M24 14c-5.459.141-9.859 4.542-10 10h10V14L24 14zM24 34.002c5.459-.143 9.859-4.544 10-10.002H24V34.002L24 34.002z"
          />
          <path
            fill="#000"
            d="M24,35c-6.066,0-11-4.934-11-11s4.934-11,11-11s11,4.934,11,11S30.066,35,24,35z M24,15c-4.963,0-9,4.037-9,9s4.037,9,9,9c4.962,0,9-4.037,9-9S28.962,15,24,15z"
          />
        </svg>
        <div className="-ml-3 text-lg text-white">BMWordle</div>
      </div>

      {/* Form */}
      <div className="flex w-full h-full flex-col items-center z-10">
        <form className="flex flex-col items-center bg-form-1 w-10/12 p-2 py-5 rounded-xl">
          <input
            type="text"
            className="bg-text-field-1 text-icon rounded-sm p-2 text-sm w-11/12 border-2 border-btn-1"
            placeholder="Username or Email"
          />

          <div className="flex flex-row w-11/12 items-center mt-3 relative">
            <input
              type="text"
              className="bg-text-field-1 text-icon rounded-sm p-2 text-sm w-full border-2 border-btn-1"
              placeholder="Password"
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

          <div className="flex flex-row w-11/12 items-center justify-between mt-2">
            <div className="text-icon text-xs">Forgot Password?</div>
            <div className="flex flex-row items-center">
              <input className="text-icon text-xs" type="checkbox" />
              <div className="text-icon text-xs ml-2">Remember</div>
            </div>
          </div>

          <button
            type="submit"
            className="flex flex-row w-11/12 h-16 bg-button-2 rounded-xl mt-5 items-center border-b-4 border-btn justify-center"
          >
            <div className="font-bold text-white text-2xl">Log In</div>
          </button>

          <div
            className="flex items-center justify-center w-11/12 bg-text-field-1 mt-6 relative"
            style={{ height: "1px" }}
          >
            <div className="absolute text-xs text-icon bg-form-1 px-3">
              or connect with
            </div>
          </div>

          <div className="flex flex-row items-center mt-5">
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
            <div className="ml-2 text-facebook text-sm font-bold">Facebook</div>
          </div>

          <div className="flex flex-row items-center mt-3">
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

          <div className="flex flex-row items-center mt-3">
            <div className="text-sm text-gray-400">New?</div>
            <div className="text-sm ml-2 text-blue-400">
              Sign up - it&apos;s FREE!
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
