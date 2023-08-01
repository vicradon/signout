import { Box, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
  return (
    <Box padding={8}>
      <Flex justifyContent={"space-between"}>
        <Link to="/">
          <Heading fontWeight="medium">SignOutApp</Heading>
        </Link>
      </Flex>
      <Box>{children}</Box>
    </Box>
  );
}
