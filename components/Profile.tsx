import { useEffect, useState, MouseEvent, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItem, MenuRadioGroup } from "@szhsin/react-menu";
import IUser, { EmptyUser } from "../interfaces/User";
import {
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, storage, usersCollection } from "../firebase/clientApp";
import Camera from "../public/icons/camera.svg";
import USA from "../public/icons/usa.svg";
import Vietnam from "../public/icons/vietnam.svg";
import Iron from "../public/icons/iron.svg";
import Bronze from "../public/icons/bronze.svg";
import Silver from "../public/icons/silver.svg";
import Gold from "../public/icons/gold.svg";
import Platinum from "../public/icons/platinum.svg";
import Emerald from "../public/icons/emerald.svg";
import Diamond from "../public/icons/diamond.svg";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAuthUser, withAuthUser } from "next-firebase-auth";
import { queryUser } from "../firebase/users";

const supportedImageExtensions = ["jpeg", "png", "jpg"];

const Profile = () => {
  const AuthUser = useAuthUser();
  const uploadRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<IUser>(EmptyUser);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>(
    "https://ui-avatars.com/api/?background=random"
  );
  const [country, setCountry] = useState<string>("United States");
  const [aboutMe, setAboutMe] = useState<string>("");
  const [ranking, setRanking] = useState<number>(0);
  const [tier, setTier] = useState<string>("Iron");
  const [madeChanges, setMadeChanges] = useState<boolean>(false);

  useEffect(() => {
    const allUsersQuery = query(
      usersCollection,
      orderBy("wonGames", "desc"),
      orderBy("fullName")
    );

    getDocs(allUsersQuery).then((querySnapshot) => {
      const userIdx = querySnapshot.docs.findIndex(
        (doc) => doc.data().id === user.id
      );

      if (!userIdx) {
        return;
      }

      setRanking(userIdx + 1);

      const descPercentile = ((userIdx + 1) / querySnapshot.docs.length) * 100;
      const percentile = 100 - descPercentile;

      if (percentile < 15) {
        setTier("Iron");
      } else if (percentile < 29) {
        setTier("Bronze");
      } else if (percentile < 43) {
        setTier("Silver");
      } else if (percentile < 58) {
        setTier("Gold");
      } else if (percentile < 72) {
        setTier("Platinum");
      } else if (percentile < 86) {
        setTier("Emerald");
      } else {
        setTier("Diamond");
      }
    });
  }, [user.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!AuthUser.id) {
        return;
      }

      const user = await queryUser(AuthUser.id);

      if (!user) {
        return;
      }

      setUser(user);
      setImageUrl(user.imageUrl);
      setFullName(user.fullName);
      setEmail(user.email);
      setCountry(user.country);
      setAboutMe(user.aboutMe);
      setMadeChanges(false);
    };

    fetchData();
  }, [AuthUser.id]);

  const onSaveUserInfo = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();

    if (!AuthUser.id) {
      return;
    }

    const userDocRef = doc(firestore, "users", AuthUser.id);
    await updateDoc(userDocRef, {
      fullName,
      country,
      aboutMe,
      imageUrl,
    });

    setMadeChanges(false);
    displaySuccess("Saved changes successfully!");
  };

  const displayError = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Error",
        text: message,
        icon: "error",
      })
      .then(() => {});
  };

  const displaySuccess = (message: string) => {
    const errorAlert = withReactContent(Swal);

    errorAlert
      .fire({
        title: "Success",
        text: message,
        icon: "success",
      })
      .then(() => {});
  };

  const uploadImageToDB = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const selectedFile = e.target.files[0];
    const parts = selectedFile.name.split(".");
    const extension = parts[parts.length - 1];
    const fileName = `${uuidv4()}.${extension}`;

    if (supportedImageExtensions.indexOf(extension) < 0) {
      displayError(
        "Image file not supported. Please use .jpeg, .png, or .jpg only."
      );
      return;
    }

    const avatarRef = ref(storage, `avatars/${fileName}`);

    uploadBytes(avatarRef, selectedFile).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setImageUrl(downloadURL);
        setMadeChanges(true);
      });
    });
  };

  const openPhotos = () => {
    if (!uploadRef.current) {
      return;
    }

    uploadRef.current.click();
  };

  const onTypeFullName = (input: string) => {
    setMadeChanges(true);

    setFullName(input);
  };

  const onTypeEmail = (input: string) => {
    setMadeChanges(true);

    setEmail(input);
  };

  const onSetCountry = (input: string) => {
    setMadeChanges(true);

    setCountry(input);
  };

  const onTypeAboutMe = (input: string) => {
    setMadeChanges(true);
    setAboutMe(input);
  };

  const nameValid = fullName.length >= 1;

  return (
    <div className="flex flex-col w-10/12 absolute top-24 right-0 drop-shadow-md">
      <div className="flex flex-row items-center w-full rounded-l-md h-28 bg-white">
        {/* Image */}
        <div className="flex w-20 h-20 ml-3 relative">
          <Image
            src={imageUrl}
            alt={`${fullName}'s profile picture`}
            width={1000}
            height={1000}
            className="rounded-md"
            objectFit="cover"
            loading="eager"
          ></Image>

          {/* Edit */}
          <div className="flex flex-row items-center justify-center w-full h-6 absolute right-0 bottom-0 p-1 bg-gray-100 opacity-75">
            <Camera className="w-full h-full text-black"></Camera>
            <input
              ref={uploadRef}
              className="hidden"
              type="file"
              onChange={(e) => uploadImageToDB(e)}
            />
            <div className="text-xs" onClick={() => openPhotos()}>
              Change
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center ml-3">
          <div className="text-xl font-semibold">{fullName}</div>
          <div className="text-sm text-gray-800">#{ranking}</div>
          <div className="flex flex-row items-center mt-1">
            {country === "United States" && (
              <USA className="w-8 h-8 mr-1"></USA>
            )}
            {country === "Vietnam" && (
              <Vietnam className="w-8 h-8 mr-1"></Vietnam>
            )}
            {tier === "Iron" && <Iron className="w-8 h-8 mr-1"></Iron>}
            {tier === "Bronze" && <Bronze className="w-8 h-8 mr-1"></Bronze>}
            {tier === "Silver" && <Silver className="w-8 h-8 mr-1"></Silver>}
            {tier === "Gold" && <Gold className="w-8 h-8 mr-1"></Gold>}
            {tier === "Platinum" && (
              <Platinum className="w-8 h-8 mr-1"></Platinum>
            )}
            {tier === "Emerald" && <Emerald className="w-8 h-8 mr-1"></Emerald>}
            {tier === "Diamond" && <Diamond className="w-8 h-8 mr-1"></Diamond>}
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
          onChange={(e) => onTypeFullName(e.target.value)}
        />

        <div className="ml-3 text-sm mt-3">Email Address</div>
        <input
          type="text"
          className="text-gray-500 rounded-sm p-2 w-11/12 drop-shadow-md bg-pink-light-1 ml-3 mt-1"
          required
          value={email}
          onChange={(e) => onTypeEmail(e.target.value)}
          readOnly
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
            onRadioChange={(e) => onSetCountry(e.value)}
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
          onChange={(e) => onTypeAboutMe(e.target.value)}
        />

        <div className="flex flex-row items-center">
          <button
            type="submit"
            className={`flex flex-row w-28 h-12 bg-red-dark-99 rounded-xl mt-5 ml-3 items-center justify-center border-b-2 border-red-800 drop-shadow-2xl mb-5 ${
              nameValid && madeChanges ? "opacity-100" : "opacity-50"
            }`}
            onClick={(e) => onSaveUserInfo(e)}
            disabled={!nameValid || !madeChanges}
          >
            <div className="font-bold text-white">Save</div>
          </button>
          {madeChanges && (
            <div className="text-sm text-red-dark-99 ml-5">
              *changes unsaved
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default withAuthUser()(Profile);
