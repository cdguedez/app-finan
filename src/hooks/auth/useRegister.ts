import { useState } from "react";
import { authService, RegisterPayload } from "../../services/authService";

const useRegister = ({ setUser }: any) => {
  const [register, setRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const onChangeRegister = (field: string, value: string) => {
    setRegister({
      ...register,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, password } = register;
    if (firstName && lastName && email && password) {
      setIsLoadingRegister(true);
      try {
        const response = await authService.register({
          email,
          firstName,
          lastName,
          password,
        });
<<<<<<< Updated upstream
        console.log(response);
=======
        await saveSession(response.accessToken, response.userId, response.user);
>>>>>>> Stashed changes
      } catch (error) {
        alert("Error al registrar usuario");
      } finally {
        setIsLoadingRegister(false);
      }
    } else {
      alert("Por favor, completa todos los campos");
    }
  };

  return { register, isLoadingRegister, onChangeRegister, handleRegister };
};

export { useRegister };
