import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

function App() {
  return (
    <Box>
      <Flex justifyContent={"space-between"}>
        <Text fontWeight="bold">Sign</Text>
      </Flex>
      <Box as="form">
        <FormControl>
          <FormLabel>Unique username</FormLabel>
          <Input type="text" />
        </FormControl>

        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input type="email" />
        </FormControl>

        <Button type="submit">Get started</Button>
      </Box>
    </Box>
  );
}

export default App;
