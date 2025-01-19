import {
  VStack,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Button,
  Textarea,useToast
} from "@chakra-ui/react";
import { create_post } from "../api/endpoints.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {

    const [description,setDescription]=useState("")
    const nav= useNavigate()
    const toast = useToast()

    const handlePost=async()=>{
      try {
        await create_post(description)
        toast({
          title: 'Post Created',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        nav('/')
      } catch (error) {
        console.log('error creating post: ',error);
        toast({
          title: 'Error Creating Post.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
        
      }
    }


  return (
    <Flex w={'100%'} h={'100%'} justifyContent={'center'}pt={'50px'}>
        <VStack w={'95%'} maxW={'450px'} alignItems={'start'} gap={'40px'}>
            <Heading>Create Post</Heading>
            <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea cols={10} rows={5} onChange={e=>setDescription(e.target.value)}
                bg={'white'}
                />
            </FormControl>
            <Button onClick={handlePost} w={'100%'} colorScheme={'blue'}>Create Post</Button>
        </VStack>

    </Flex>
  )
};

export default CreatePost;
