import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
export default function RequireAuth({ children }) {
  const { loading, isAuthed } = useAuth();
  if (loading) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
