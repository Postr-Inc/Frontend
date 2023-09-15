import Pocketbase from "pocketbase";
import Login from "./Login";
import Home from "./Home";
export const api = new Pocketbase("https://postrapi.pockethost.io");
export default function App() {
  useEffect(() => {
    api.collection("users").authRefresh();
  }, []);
  if (
    api.authStore.isValid &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return <Home />;
  } else if (
    !api.authStore.isValid &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    return <Login />;
  } else {
    console.log(window.location.pathname);
    window.location.pathname = "/download";
  }
}
