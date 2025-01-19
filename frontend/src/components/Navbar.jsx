import { Text, Flex, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaHouse } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  const nav = useNavigate();  

  // Function to handle navigation to the user's profile
  const handleNavigateUser = () => {
    const username = JSON.parse(localStorage.getItem("userData"))["username"];  // Get the username from localStorage
    nav(`/${username}`);  // Navigate to the profile page
    window.location.reload();  // Reload the page to reflect changes
  };


  return (
    <Flex
      w={"100vw"}  // Full width of the viewport
      h={"90px"}  // Fixed height for the navbar
      bg={"blue.600"}  // Background color of the navbar
      justifyContent={"center"}  // Center content horizontally
      alignItems={"center"}  // Center content vertically
    >
      <HStack w={"90%"} justifyContent={"space-between"} color={"white"}>
        {/* Navbar Title */}
        <Text fontSize={"24px"} fontWeight={"bold"}>
          SocialHub
        </Text>
        
        <HStack gap={"20px"}>  {/* Stack for the navigation links */}
          
          {/* Profile Navigation */}
          <Text
            cursor={"pointer"}  // Change cursor to pointer to indicate it's clickable
            onClick={handleNavigateUser}  // Navigate to the user's profile
            _hover={{
              transform: "scale(1.1)",  // Scale the icon and text by 10% on hover
              borderRadius: "5px",  // Add rounded corners to the background
              transition: "transform 0.2s, background-color 0.2s",  // Smooth transition for scaling and background color
            }}
            px={2}  // Add padding around the text and icon for the hover effect
          >
            <IoPersonOutline size={"20px"} />  {/* Profile icon */}
            Profile
          </Text>
          
          {/* Create Post Navigation */}
          <Text
            cursor={"pointer"}  // Change cursor to pointer
            onClick={() => nav("create/post")}  // Navigate to the 'create post' page
            _hover={{
              transform: "scale(1.1)",
              borderRadius: "5px",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            px={2}
          >
            <IoMdAddCircleOutline size={"22px"} />  {/* Create post icon */}
            Create
          </Text>
          
          {/* Home Navigation */}
          <Text
            cursor={"pointer"}  // Change cursor to pointer
            onClick={() => nav("/")}  // Navigate to the home page
            _hover={{
              transform: "scale(1.1)",
              borderRadius: "5px",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            px={2}
          >
            <FaHouse size={"22px"} />  {/* Home icon */}
            Home
          </Text>
          
          {/* Search Navigation */}
          <Text
            cursor={"pointer"}  // Change cursor to pointer
            onClick={() => nav("/search")}  // Navigate to the search page
            _hover={{
              transform: "scale(1.1)",
              borderRadius: "5px",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            px={2}
          >
            <IoSearch size={"20px"} />  {/* Search icon */}
            Search
          </Text>
          
          {/* Settings Navigation */}
          <Text
            cursor={"pointer"}  // Change cursor to pointer
            onClick={() => nav("/settings")}  // Navigate to the settings page
            _hover={{
              transform: "scale(1.1)",
              borderRadius: "5px",
              transition: "transform 0.2s, background-color 0.2s",
            }}
            px={2}
          >
            <IoMdSettings size={"20px"} />  {/* Settings icon */}
            Settings
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Navbar;


