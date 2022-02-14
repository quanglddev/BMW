/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useState } from "react";

const ResponsiveAppBar = () => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-row items-center fixed top-0 left-0 right-0 bg-navigation-bar h-12">
      {/* Navigation Bar */}
      <svg
        className="fill-current text-icon w-8 h-8 ml-3"
        viewBox="0 0 50 50"
        onClick={() => setSideBarOpen(true)}
      >
        <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z" />
      </svg>

      <div className="flex flex-row items-center">
        <svg
          className="fill-current w-16 h-16 -ml-1"
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

      {/* Side Bar */}
      <div
        className={`${
          sideBarOpen ? "flex" : "hidden"
        } flex fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-50 flex-row`}
      >
        {/* Quick Options */}
        <div className="flex flex-col bg-side-bar-1 h-full w-6/12">
          <svg
            className="fill-current text-icon h-6 w-6 ml-3 mt-2"
            viewBox="0 0 30 30"
            onClick={() => setSideBarOpen(false)}
          >
            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z" />
          </svg>

          {/* Bluetooth */}
          <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-3">
            <svg className="fill-current w-8 h-8" viewBox="0 0 48 48">
              <path
                fill="#3F51B5"
                d="M24.501,45C33.084,45,39,40.743,39,24.5C39,8.249,33.084,4,24.501,4C15.918,4,10,8.249,10,24.5C10,40.743,15.918,45,24.501,45L24.501,45z"
              />
              <path
                fill="#FFF"
                d="M33.279,17.616L23,7.267V21l-5.651-5.781l-2.055,2.072l7.094,7.166l-7.094,7.168l2.054,2.072L23,28v13.647l10.277-10.35l-6.785-6.841L33.279,17.616z M26,13.969l3.172,3.295L26,20.581V13.969z M29.172,31.264L26,34.581v-6.612L29.172,31.264z"
              />
            </svg>

            <div className="text-white ml-2">Local match</div>
          </div>

          {/* Wifi */}
          <div className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3">
            <svg className="fill-current w-8 h-8" viewBox="0 0 48 48">
              <path
                fill="#2196F3"
                d="M24 37A3 3 0 1 0 24 43 3 3 0 1 0 24 37zM2 18.898l3.55 3.551c10.28-9.908 26.62-9.908 36.9 0L46 18.898C33.762 7.033 14.238 7.033 2 18.898z"
              />
              <path
                fill="#2196F3"
                d="M8.39,25.291l3.559,3.561c6.753-6.384,17.351-6.384,24.104,0l3.559-3.561C30.896,16.948,17.104,16.948,8.39,25.291z"
              />
              <path
                fill="#2196F3"
                d="M14.788,31.691l3.55,3.552c3.222-2.867,8.102-2.866,11.325,0l3.549-3.55C28.025,26.873,19.973,26.874,14.788,31.691z"
              />
            </svg>
            <div className="text-white ml-2">Rank match</div>
          </div>

          {/* Friends */}
          <div className="flex flex-row items-center w-10/12 h-12 -mt-1 ml-3">
            <svg className="fill-current w-8 h-8" viewBox="0 0 48 48">
              <path
                fill="#3F51B5"
                d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
              />
              <path
                fill="#FFF"
                d="M16 14A2 2 0 1 0 16 18 2 2 0 1 0 16 14zM22.5 13A2.5 2.5 0 1 0 22.5 18 2.5 2.5 0 1 0 22.5 13zM30 12A3 3 0 1 0 30 18 3 3 0 1 0 30 12zM35 36v-8.5c0-3.037-2.463-5.5-5.5-5.5S24 24.463 24 27.5V36H35z"
              />
              <path
                fill="#FFF"
                d="M27,32v-7.16c0-2.12-1.79-3.84-4-3.84c-2.208,0-4,1.72-4,3.84V32H27z"
              />
              <path
                fill="#FFF"
                d="M20,29v-5.25c0-2.072-1.568-3.75-3.5-3.75c-1.934,0-3.5,1.678-3.5,3.75V29H20z"
              />
            </svg>

            <div className="text-white ml-2">Friendly match</div>
          </div>

          {/* Add friend button */}
          <div className="flex items-center justify-center bg-button-1 w-10/12 h-10 rounded ml-3 mt-2">
            <svg
              className="fill-current text-icon w-4 h-4"
              viewBox="0 0 45.902 45.902"
            >
              <g>
                <path
                  d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912
			c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299
			c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067
			l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"
                />
                <path
                  d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309
			c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714
			c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"
                />
                <path
                  d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454
			c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595
			c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"
                />
              </g>
            </svg>
          </div>

          {/* Login/logout button */}
          <div className="flex items-center justify-center bg-button-2 w-10/12 h-10 rounded ml-3 mt-3">
            <svg
              className="fill-current text-white w-4 h-4"
              viewBox="0 0 499.1 499.1"
            >
              <g>
                <path
                  d="M0,249.6c0,9.5,7.7,17.2,17.2,17.2h327.6l-63.9,63.8c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5
				l93.1-93.1c6.7-6.7,6.7-17.6,0-24.3l-93.1-93.1c-6.7-6.7-17.6-6.7-24.3,0c-6.7,6.7-6.7,17.6,0,24.3l63.8,63.8H17.2
				C7.7,232.5,0,240.1,0,249.6z"
                />
                <path
                  d="M396.4,494.2c56.7,0,102.7-46.1,102.7-102.8V107.7C499.1,51,453,4.9,396.4,4.9H112.7C56,4.9,10,51,10,107.7V166
				c0,9.5,7.7,17.1,17.1,17.1c9.5,0,17.2-7.7,17.2-17.1v-58.3c0-37.7,30.7-68.5,68.4-68.5h283.7c37.7,0,68.4,30.7,68.4,68.5v283.7
				c0,37.7-30.7,68.5-68.4,68.5H112.7c-37.7,0-68.4-30.7-68.4-68.5v-57.6c0-9.5-7.7-17.2-17.2-17.2S10,324.3,10,333.8v57.6
				c0,56.7,46.1,102.8,102.7,102.8H396.4L396.4,494.2z"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Friends */}
        <div className="flex flex-col bg-side-bar-2 h-full w-6/12">
          {/* Online */}
          <div className="font-bold text-xs text-icon ml-2 mt-3">
            ONLINE - 2
          </div>
          <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2">
            <div className="flex flex-row w-auto relative">
              <img
                className="w-8 h-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/42598512?v=4"
                alt="Quang's avatar"
              />
              <div className="bg-green-500 w-4 h-4 rounded-full -bottom-1 absolute -right-1 border-2 border-custom-1"></div>
            </div>

            <div className="ml-3 text-white text-md">Quang Luong</div>
          </div>

          {/* Offline */}
          <div className="font-bold text-xs text-icon ml-2 mt-8">
            OFFLINE - 5
          </div>
          <div className="flex flex-row items-center w-10/12 h-12 mt-3 ml-2 opacity-50">
            <div className="flex flex-row w-auto relative">
              <img
                className="w-8 h-8 rounded-full"
                src="https://avatars.githubusercontent.com/u/42598512?v=4"
                alt="Quang's avatar"
              />
            </div>

            <div className="ml-3 text-gray-300 text-md">Quang Luong</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResponsiveAppBar;
