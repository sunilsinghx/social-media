import {Box,VStack} from "@chakra-ui/react"


const Layout = ({children})=>{
    return (
        <VStack w={'100vw'} minH={'100vh'} bg={'#fcfcfc'}>
            <Box w={'100%'}>
                {children}
            </Box>
        </VStack>
    )
}
export default Layout