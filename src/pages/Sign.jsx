import React, { useState } from "react";
import "../App.css";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";
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
  Image,
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
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { editor, onReady } = useFabricJSEditor();
  const onAddCircle = () => {
    editor?.addCircle();
    editor?.addText();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  const [newTextPosition, setNewTextPosition] = useState({ x: 20, y: 50 });

  const toast = useToast();

  const addText = async (event) => {
    event.preventDefault();

    try {
      const canvas = new fabric.Canvas("tshirt-canvas");

      const newMessages = [
        ...messages,
        { message, x: newTextPosition.x, y: newTextPosition.y },
      ];

      setMessages(newMessages);

      canvas.add(
        new fabric.Text(message, {
          left: newTextPosition.x,
          top: newTextPosition.y,
          fontSize: 10,
        })
      );

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

      toast({
        title: `You have signed on ${username}'s shirt!`,
        status: "success",
        duration: 3000,
        isClosable: true,
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
      <Text fontSize={"xs"}>You can only add one message</Text>

      <div id="tshirt-div">
        <Box as="form" onSubmit={addText}>
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={"flex-end"}
            columnGap={4}
          >
            <FormControl>
              <FormLabel>{username}'s goodwill message</FormLabel>
              <Input
                width={{ base: "100%" }}
                type="text"
                value={message}
                onChange={({ target }) => setMessage(target.value)}
              />
            </FormControl>

            <Button
              marginTop={{ base: "10px", md: 0 }}
              display={"inline-block"}
              type="submit"
            >
              Add
            </Button>
          </Flex>
        </Box>

        <Image margin={"20px 0"} src={tshirtBG} alt="t-shirt" />

        <div id="drawingArea" className="drawing-area">
          <div className="canvas-container">
            {/* <FabricJSCanvas
              id={"canvas"}
              className="sample-canvas"
              onReady={onReady}
            /> */}

            <canvas id="tshirt-canvas" width="200" height="400"></canvas>
          </div>
        </div>

        {/* <Box>
          <Heading as="h3" size="md" mb="4">
            All Messages
          </Heading>

          <OrderedList>{}</OrderedList>
        </Box> */}
      </div>
    </MainLayout>
  );
}
