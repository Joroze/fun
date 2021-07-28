import { 
  Flex,
  Box,
  Container,
  Input,
  Button,
  Textarea,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Spinner
 } from "@chakra-ui/react"
 import { useForm } from "react-hook-form";
import {Api} from './api'
import {useEffect, useState} from 'react'
import Comment from './components/Comment'
import { useCommentFeed } from "./hooks";
import moment from "moment";

function App() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useForm();

  const {
    data: remoteComments, 
    initiallyLoading: commentsInitiallyLoading
  } = useCommentFeed(10000)

  const [comments, setComments] = useState(remoteComments)

  useEffect(() => setComments(remoteComments), [remoteComments])
  
  async function onSubmit(values) {
    const commentBody = {
      name: values.name,
      message: values.message
    }

    const commentId = await Api.post('createComment', commentBody)

    reset()
    setComments([{
      ...commentBody,
      id: commentId,
      created: moment()
    }, 
    ...remoteComments
  ])
  }
  
  return (
      <Flex 
        minH="100%" 
        h="100vh"
      >
        <Flex 
          flexDirection="column" 
          w="100%"
          alignItems="center"
         >
          <Box w="50%">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Container p='10'>
                  <Stack align='center'>
                    <FormControl isInvalid={errors.name}>
                      <Stack align='center'>
                        <FormLabel>Name</FormLabel>
                        <Input 
                          disabled={isSubmitting}
                          id="name"
                          placeholder="name"
                          {...register("name", {
                            required: "* Name is required",
                          })}
                        />
                        <FormErrorMessage>
                          {errors.name && errors.name.message}
                        </FormErrorMessage>
                      </Stack>
                    </FormControl>
                    <FormControl isInvalid={errors.message}>
                      <Stack align='center'>
                        <Textarea 
                          disabled={isSubmitting}
                          id="message"
                          placeholder="message"
                          {...register("message", {
                            required: "* Message is required",
                          })}
                          resize="none"
                        />
                        <FormErrorMessage>
                          {errors.message && errors.message.message}
                        </FormErrorMessage>
                      </Stack>
                    </FormControl>
                    <Button type='submit' isLoading={isSubmitting}>Comment</Button>
                  </Stack>
                </Container>
              </form>
          </Box>

          <Box w="50%">
            <Stack align='center'>
              { commentsInitiallyLoading && <Spinner size='lg'/>}
              {comments.map(function(comment){
                return <Comment key={comment.id} {...comment} />
              })}
            </Stack>
          </Box>
        </Flex>
      </Flex>
  );
}

export default App;
