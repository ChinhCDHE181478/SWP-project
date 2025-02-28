import HomeInformation from '@/components/duclm/HomeInformation';
import News from '@/components/duclm/News';
import Course from '@/components/duclm/Course';

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

const Main = () => {

  return (
    <div>
      <HomeInformation />
      <News />
      <Course />
    </div>
  );
}

export default Main;
