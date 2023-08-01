import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import MainLayout from "./Layout/Main";
import { firebaseDb } from "./utils/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import errorCodesMap from "./utils/errorCodes";
import { redirect, useNavigate } from "react-router-dom";

function App() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const msgsRef = collection(firebaseDb, "goodwill-messages");
      const q = query(msgsRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast({
          title: "Username already exists!",
          description: "This username has already been taken by another user",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Setting things up",
          status: "info",
          duration: 3000,
          isClosable: true,
        });

        await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(firebaseDb, "goodwill-messages", email), {
          email,
          username,
        });

        toast({
          title: "Successfully created user",
          description:
            "You will be redirected in 5 seconds to your unique url. Copy it and share with friends.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setTimeout(() => {
          navigate(`/${username}`);
        }, 5000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: errorCodesMap[error.code],
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <MainLayout>
      <Flex height={"80vh"} alignItems="center">
        <Box width={{ base: "300px", md: "400px" }} margin={"auto"}>
          <Box as="form" onSubmit={login}>
            <FormControl>
              <FormLabel>Unique username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
                required
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Email address </FormLabel>
              <Input
                type="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                required
              />
              <FormHelperText>use real email please</FormHelperText>
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Password </FormLabel>
              <Input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </FormControl>

            <Button type="submit">Get started</Button>
          </Box>
        </Box>
      </Flex>
    </MainLayout>
  );
}

export default App;
