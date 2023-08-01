import React, { useState } from "react";
import "../App.css";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import tshirtBG from "../assets/t-shirt1.webp";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  OrderedList,
  useToast,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import MainLayout from "../Layout/Main";
import errorCodesMap from "../utils/errorCodes";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { COLLECTION_PATH } from "../utils/constants";
import { firebaseDb } from "../utils/firebase.config";

export default function Sign() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const { editor, onReady } = useFabricJSEditor();
  const onAddCircle = () => {
    editor?.addCircle();
    editor?.addText();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const toast = useToast();

  const addText = async (event) => {
    event.preventDefault();

    try {
      editor?.addText(message);

      const collectionRef = collection(firebaseDb, COLLECTION_PATH);
      const q = query(collectionRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: "user does not exist!",
          description:
            "There's no such user with this username. Please check that you used the right link",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const email = querySnapshot?.docs[0]?.data()?.email;

      await addDoc(collection(firebaseDb, COLLECTION_PATH, email, "messages"), {
        message,
        created_at: new Date(),
      });

      setMessage("");
    } catch (error) {
      console.log(error.message);
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
      <Text margin={"1rem 0"} fontWeight={"regular"} fontSize={"xl"}>
        Sign for {username}
      </Text>

      <div id="tshirt-div">
        <Box as="form" onSubmit={addText}>
          <Flex alignItems={"flex-end"} columnGap={4}>
            <FormControl>
              <FormLabel>{username}'s goodwill message</FormLabel>
              <Input
                type="text"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
            </FormControl>

            <Button display={"inline-block"} type="submit">
              Add
            </Button>
          </Flex>
        </Box>

        <img src={tshirtBG} alt="t-shirt" />

        <div id="drawingArea" className="drawing-area">
          <div className="canvas-container">
            <FabricJSCanvas
              id={"canvas"}
              className="sample-canvas"
              onReady={onReady}
            />
          </div>
        </div>

        <Box>
          <Heading as="h3" size="md" mb="4">
            All Messages
          </Heading>

          <OrderedList>{}</OrderedList>
        </Box>
      </div>
    </MainLayout>
  );
}
