import {
  Button,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import "./App.css";
import { getData, insertData } from "./utils/Supabase-function";
import { useEffect, useState } from "react";
import { Record } from "./domain/record";
import { useForm, SubmitHandler } from "react-hook-form";

function App() {
  const [todos, setTodos] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Record>();

  const onSubmit: SubmitHandler<Record> = async data => {
    const addTodoData = { title: data.title, time: data.time };
    const newTodos = [...todos, addTodoData];

    const dataTime: number = parseInt(data.time);

    await insertData(data.title, dataTime);
    setTodos(newTodos);

    onClose();

    reset({
      title: "",
      time: 0
    });
  };

  useEffect(() => {
    const getTodo = async () => {
      const newTodoData = await getData();
      setTodos(newTodoData);
      setLoading(false);
    };

    getTodo();
  }, []);

  const dataDelete = index => {
    console.log(index);
  };

  return (
    <>
      {loading && <p>now loading...</p>}
      {loading || (
        <>
          <h1>学習記録アプリ</h1>
          <Button colorScheme="blue" onClick={onOpen} mt={4}>
            新規追加
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader></ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormLabel>学習内容</FormLabel>
                  <Input
                    {...register("title", { required: "内容の入力は必須です" })}
                  />
                  {errors.title && (
                    <Text mt={1} color={"red.600"}>
                      {errors.title?.message}
                    </Text>
                  )}

                  <FormLabel mt={4}>学習時間</FormLabel>
                  <NumberInput
                    defaultValue={0}
                    {...register("time", {
                      required: "時間の入力は必須です",
                      min: {
                        value: 0,
                        message: "時間は0以上である必要があります"
                      }
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {/* errors will return when field validation fails  */}
                  {errors.time && (
                    <Text mt={1} color={"red.600"}>
                      {errors.time?.message}
                    </Text>
                  )}

                  <Flex mt={8} justify={"right"}>
                    <Button variant="subtle" mr={3} onClick={onClose}>
                      閉じる
                    </Button>
                    <Button colorScheme="blue" type="submit">
                      追加
                    </Button>
                  </Flex>
                </form>
              </ModalBody>

              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>

          <TableContainer mt={8}>
            <Table>
              <Thead>
                <Tr>
                  <Th>学習内容</Th>
                  <Th>時間</Th>
                  <Th>削除</Th>
                </Tr>
              </Thead>
              <Tbody>
                {todos.map((todo, index) => (
                  <Tr key={todo.id}>
                    <Td>{todo.title}</Td>
                    <Td>{todo.time}時間</Td>
                    <Td>
                      <Button onClick={() => dataDelete(index)}>削除</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
}

export default App;
