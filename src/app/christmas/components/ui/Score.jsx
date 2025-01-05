import { BsFillHouseFill, BsFillHouseHeartFill } from "react-icons/bs";
import { useSleighStore } from "../store";

export const colorClasses = {
  red: "text-red-500",
  green: "text-green-500",
  blue: "text-blue-500",
  yellow: "text-yellow-500"
};

export const bgColorClasses = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500"
};

const HouseIcon = ({ color, isHit }) => {
  return (
    isHit ? (
      <BsFillHouseHeartFill className={`h-8 w-8 ${colorClasses[color]}`} />
    ) : (
      <BsFillHouseFill className={`h-8 w-8 ${colorClasses[color]} opacity-30`} />
    )
  );
};

export function Score() {
  const { housesHit } = useSleighStore();

  return (
    <div className="absolute top-4 right-4 w-1/4 bg-white text-black rounded-lg p-4 z-10">
      <div className="flex justify-between">
        <HouseIcon color="red" isHit={housesHit.red} />
        <HouseIcon color="green" isHit={housesHit.green} />
        <HouseIcon color="blue" isHit={housesHit.blue} />
        <HouseIcon color="yellow" isHit={housesHit.yellow} />
      </div>
    </div>
  );
} 