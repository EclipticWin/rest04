/**
 * Font Awesome 6 아이콘 래퍼
 * name prop으로 아이콘 키를 받아 렌더링.
 * size / className 으로 크기·색상 제어.
 */
import {
  FaRobot,
  FaBookOpen,
  FaWandMagicSparkles,
  FaScrewdriverWrench,
  FaRocket,
  FaPlay,
  FaMobileScreen,
  FaArrowsRotate,
  FaEarthAmericas,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaCircleCheck,
  FaGraduationCap,
  FaBullseye,
  FaLightbulb,
  FaUserTie,
  FaLaptopCode,
  FaClapperboard,
  FaChalkboardUser,
  FaBoxOpen,
  FaGears,
  FaFilm,
  FaYoutube,
  FaChevronRight,
} from 'react-icons/fa6'

const MAP = {
  robot:            FaRobot,
  'book-open':      FaBookOpen,
  'wand-sparkles':  FaWandMagicSparkles,
  wrench:           FaScrewdriverWrench,
  rocket:           FaRocket,
  play:             FaPlay,
  mobile:           FaMobileScreen,
  rotate:           FaArrowsRotate,
  globe:            FaEarthAmericas,
  location:         FaLocationDot,
  phone:            FaPhone,
  envelope:         FaEnvelope,
  'circle-check':   FaCircleCheck,
  graduation:       FaGraduationCap,
  bullseye:         FaBullseye,
  lightbulb:        FaLightbulb,
  'user-tie':       FaUserTie,
  'laptop-code':    FaLaptopCode,
  clapperboard:     FaClapperboard,
  'chalkboard-user':FaChalkboardUser,
  'box-open':       FaBoxOpen,
  gears:            FaGears,
  film:             FaFilm,
  youtube:          FaYoutube,
  'chevron-right':  FaChevronRight,
}

export default function Icon({ name, size = 20, className = '' }) {
  const Comp = MAP[name]
  if (!Comp) return null
  return <Comp size={size} className={className} />
}
