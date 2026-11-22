import { useNavigate } from "react-router";

export function useNavigator() {
  const nav = useNavigate();

  const navigate = (params: {}) => {
    nav(params);
  };

  return {
    navigate,
  };
}
