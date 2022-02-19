/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import Close from "../public/icons/close.svg";
import Camera from "../public/icons/camera.svg";
import USA from "../public/icons/usa.svg";
import Diamond from "../public/icons/diamond.svg";
import { Menu, MenuButton, MenuItem, MenuRadioGroup } from "@szhsin/react-menu";

const Profile = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [country, setCountry] = useState<string>("United States");
  const [aboutMe, setAboutMe] = useState<string>("");

  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-row items-center w-full rounded-l-md h-28 bg-white">
        {/* Image */}
        <div className="flex w-20 h-20 ml-3 relative">
          <Image
            src={"https://avatars.githubusercontent.com/u/42598512?v=4"}
            alt="Quang's profile picture"
            width={1000}
            height={1000}
            className="rounded-md"
          ></Image>

          {/* Close */}
          <div className="w-6 h-6 absolute right-0 top-0 p-1 bg-gray-100 opacity-50">
            <Close className="w-full h-full text-black"></Close>
          </div>

          {/* Edit */}
          <div className="flex flex-row items-center justify-center w-full h-6 absolute right-0 bottom-0 p-1 bg-gray-100 opacity-75">
            <Camera className="w-full h-full text-black"></Camera>
            <div className="text-xs">Change</div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center ml-3">
          <div className="text-xl font-semibold">Quang Luong</div>
          <div className="text-sm text-gray-800">#1</div>
          <div className="flex flex-row items-center mt-1">
            <USA className="w-8 h-8 mr-1"></USA>
            <Diamond className="w-8 h-8 mr-1"></Diamond>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center w-full rounded-l-md bg-white mt-3">
        <div className="ml-3 text-sm mt-3">Full Name</div>
        <input
          type="text"
          className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div className="ml-3 text-sm mt-3">Email Address</div>
        <input
          type="text"
          className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="ml-3 text-sm mt-3">Country</div>
        <Menu
          menuButton={
            <MenuButton className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1 text-left">
              {country}
            </MenuButton>
          }
          arrow
          viewScroll={"auto"}
          align="center"
        >
          <MenuRadioGroup
            value={country}
            onRadioChange={(e) => setCountry(e.value)}
          >
            <MenuItem value="United States">United States</MenuItem>
            <MenuItem value="Vietnam">Vietnam</MenuItem>
          </MenuRadioGroup>
        </Menu>

        <div className="ml-3 text-sm mt-3">About Me</div>
        <textarea
          className="text-black rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1 h-36"
          required
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />

        <div className="flex flex-row w-28 h-12 bg-red-dark-99 rounded-xl mt-5 ml-3 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5">
          <div className="font-bold text-white">Save</div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
