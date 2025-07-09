// 📁 components/common/ContentWarningIcons.js
import { FaSkullCrossbones, FaEye, FaMicrophoneSlash, FaCapsules, FaBan } from "react-icons/fa";
import { GiBloodySword } from "react-icons/gi";
import { MdNoAdultContent } from "react-icons/md";

const ContentWarningIcons = {
  Violence: {
    icon: <GiBloodySword className="text-red-500" />, label: "Violence"
  },
  Gore: {
    icon: <FaSkullCrossbones className="text-rose-600" />, label: "Gore"
  },
  "Sexual Content": {
    icon: <MdNoAdultContent className="text-pink-500" />, label: "Sexual Content"
  },
  Nudity: {
    icon: <FaBan className="text-orange-400" />, label: "Nudity"
  },
  "Strong Language": {
    icon: <FaMicrophoneSlash className="text-yellow-400" />, label: "Strong Language"
  },
  "Drug Use": {
    icon: <FaCapsules className="text-purple-500" />, label: "Drug Use"
  },
  "Horror / Jump Scares": {
    icon: <FaEye className="text-gray-300" />, label: "Horror / Jump Scares"
  },
};

export default ContentWarningIcons;