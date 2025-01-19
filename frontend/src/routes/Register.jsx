import {
  VStack,
  Flex,
  FormControl,
  Input,
  Button,
  FormLabel,
  Heading,
  Text,
  useToast
} from "@chakra-ui/react";
import { register } from "../api/endpoints";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [cmfPassword, setCmfPassword] = useState("");
  const nav = useNavigate();
  const toast = useToast()

  const handleRegister = async () => {
    if (password === cmfPassword){
      try {
        await register(username,email,firstName,lastName,password)
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        nav('/login')
      } catch (error) {
        toast({
          title: 'Error Creating Account.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
    }else{
      toast({
        title: 'Error.',
        description:'Password and Confirm Password are not same',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  };

  return (
    <Flex
      w={"100%"}
      mt={'20px'}
      h={"calc(100vh-90px)"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <VStack align={"start"} w={"95%"} maxW={"400px"} gap={"20px"}>
        <Heading>Register</Heading>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            bg={"white"}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            bg={"white"}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <Input
            onChange={(e) => setFirstName(e.target.value)}
            bg={"white"}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <Input
            onChange={(e) => setLastName(e.target.value)}
            bg={"white"}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            bg={"white"}
            type="password"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="cmfpassword">Confirm Password</FormLabel>
          <Input
            onChange={(e) => setCmfPassword(e.target.value)}
            bg={"white"}
            type="password"
          />
        </FormControl>
        <VStack w="100%" alignItems={"start"} gap={"10px"}>
          <Button
            onClick={handleRegister}
            w={"100%"}
            colorScheme={"green"}
            fontSize={"18px"}
          >
            Register
          </Button>
          <Text fontSize={"14px"} color={"gray.500"}>
            Already have an account?<Link to={'/login'}>Login </Link>
          </Text>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default Register;
