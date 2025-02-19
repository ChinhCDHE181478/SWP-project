// pages/index.tsx
import Practice from "@/components/duclm/Practice";

export default function Home() {
  return (
    <div>
      <Practice
        currentLevel="currentlevel"
        maxLevel="maxlevel"
        userId="userid"
        userClass="khioUser"
      />
    </div>
  );
}
