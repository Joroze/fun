import { Box, Text } from '@chakra-ui/react'
import moment from 'moment'

function Comment({
    id,
    name,
    message,
    created
}){
    return (
        <Box w="100%" borderWidth="1px" borderRadius="lg" p="10px">
            <Box minH="150px">
                <Text fontStyle='italic' color='gray.600'>{message}</Text>
            </Box>
            <Box pt="5px" pb="5px" borderTopWidth='1px'>
                <Text fontWeight='500'>{name} on {moment.utc(created).local().format('MMMM Do [at] ha')}</Text>
            </Box>
        </Box>
    )
}

export default Comment