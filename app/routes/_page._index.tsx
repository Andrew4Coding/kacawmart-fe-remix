import LandingModule from "~/modules/LandingModule";
import landingLoader from "~/modules/LandingModule/loader";

export { landingLoader as loader };

export default function HomePage() {
  return <LandingModule />;
}
