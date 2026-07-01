import { useEffect } from "react";
import AppRouter from "./routes/AppRouter.jsx";
import { Toaster } from "sonner";
import useAuthStore from "./store/authStore.js";

const App = () => {
  console.log("APP RENDERED"); 
  useEffect(() => {
    useAuthStore.getState().fetchMe();
  }, []);

  return (
    <>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;