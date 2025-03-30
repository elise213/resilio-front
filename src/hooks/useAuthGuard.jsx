import { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const useAuthGuard = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (store.user_id === undefined) return; // still loading
    setIsLoading(false);

    if (!store.user_id || store.user_id === 0) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You must be logged in to access this page.",
      }).then(() => navigate("/"));
    }
  }, [store.user_id, navigate]);

  return { user_id: store.user_id, isLoading };
};
