
import ProfilePage from "@/app/(main)/profile/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

const Profile = () => {

  return (
    <ProfilePage/>
  );
};

export default Profile;
