import { useAuth } from '../context/AuthContext';

const useAuthContext = () => {
  return useAuth();
};

export default useAuthContext;
