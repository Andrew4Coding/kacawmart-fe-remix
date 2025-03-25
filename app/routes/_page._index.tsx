import HomeModule from "~/modules/HomeModule";
import homeLoader from "~/modules/HomeModule/loader";

export { homeLoader as loader };

export default function HomePage() {
  return <HomeModule />
}