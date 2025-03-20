import { FaWordpress } from "react-icons/fa";
import { DiJqueryLogo } from "react-icons/di";
import { BiLogoTypescript } from "react-icons/bi";
import { FaAngular } from "react-icons/fa";
import { SiAlpinedotjs } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaLaravel } from "react-icons/fa";
import { FaWix } from "react-icons/fa";
import { FaSquarespace } from "react-icons/fa";
import { FaVuejs } from "react-icons/fa";
import { SiNuxtdotjs } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";

export const iconMapping: {
  key: string;
  icon: React.ReactNode;
  label: string;
}[] = [
  { key: "wordPress", icon: <FaWordpress />, label: "Word Press" },
  { key: "jQuery", icon: <DiJqueryLogo />, label: "jQuery" },
  { key: "typeScript", icon: <BiLogoTypescript />, label: "TypeScript" },
  { key: "angular", icon: <FaAngular />, label: "Angular" },
  { key: "alpinejs", icon: <SiAlpinedotjs />, label: "Alpine.js" },
  { key: "tailwindcss", icon: <RiTailwindCssFill />, label: "Tailwind CSS" },
  { key: "laravel", icon: <FaLaravel />, label: "Laravel" },
  { key: "wix", icon: <FaWix />, label: "Wix" },
  { key: "squarespace", icon: <FaSquarespace />, label: "Squarespace" },
  { key: "vue", icon: <FaVuejs />, label: "Vue" },
  { key: "nuxt", icon: <SiNuxtdotjs />, label: "Nuxt" },
  { key: "firebase", icon: <IoLogoFirebase />, label: "Firebase" },
  { key: "react", icon: <FaReact />, label: "React" },
  { key: "nextjs", icon: <RiNextjsFill />, label: "Next.js" },
];
