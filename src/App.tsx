import {
  Button,
  Flex,
  FormLabel,
  IconButton,
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
import { MdDelete, MdOutlineEdit } from "react-icons/md";
import {
  getData,
  insertData,
  deleteData,
  updateData
} from "./utils/Supabase-function";
import { useEffect, useState } from "react";
import { Record } from "./domain/record";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

function App() {
  const [todos, setTodos] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalAdd, setIsModalAdd] = useState(true);
  const [editID, setEditID] = useState<number | string>(0);
  const [editContent, setEditContent] = useState("");
  const [editTime, setEditTime] = useState(0);

  // 押した部分のインデックス番号を取得するための関数
  const [pushIndex, setPushIndex] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<Record>();

  useEffect(() => {
    const getTodo = async () => {
      const newTodoData = await getData();
      setTodos(newTodoData);
      setLoading(false);
    };

    getTodo();
  }, []);

  // 追加ボタンを押した時の処理
  const onSubmit: SubmitHandler<Record> = async data => {
    await insertData(data.title, data.time);
    const newTodos = await getData();
    setTodos(newTodos);

    onClose();

    reset();
  };

  // 更新ボタンを押した時の処理
  const onEdit: SubmitHandler<Record> = async data => {
    await updateData(data.title, data.time, editID);

    const newUpdatedData = { id: editID, title: data.title, time: data.time };

    todos.splice(pushIndex, 1, newUpdatedData);

    onClose();

    reset();
  };

  // 新規追加ボタンを押下した時の挙動
  const openAddModal = () => {
    setIsModalAdd(true);
    reset();
    onOpen();
  };

  const modalClose = () => {
    onClose();
  };

  // 編集ボタンを押下した時の挙動
  const openEditModal = (index: number) => {
    reset();
    setIsModalAdd(false);
    setPushIndex(index);

    console.log(todos);

    const todoID = todos[index].id;

    setEditID(todoID);
    setEditContent(todos[index].title);
    setEditTime(todos[index].time);
    onOpen();
  };

  // 削除ボタンを押下した時の挙動
  const dataDelete = (index: number) => {
    const deleteItemTitle = todos[index].title;
    const deleteItemTime = todos[index].time;

    deleteData(deleteItemTitle, deleteItemTime);

    todos.splice(index, 1);
    const newTodos = [...todos];
    setTodos(newTodos);
  };

  return (
    <>
      {loading && <p>now loading...</p>}
      {loading || (
        <>
          <h1 data-testid="title">学習記録アプリ</h1>
          <Button colorScheme="blue" onClick={openAddModal} mt={4}>
            新規追加
          </Button>

          <Modal isOpen={isOpen} onClose={modalClose} data-testid="modal">
            <ModalOverlay />
            <ModalContent>
              {isModalAdd ? (
                <ModalHeader>新規登録</ModalHeader>
              ) : (
                <ModalHeader>記録編集</ModalHeader>
              )}
              <ModalCloseButton />
              <ModalBody>
                {}
                <form
                  onSubmit={
                    isModalAdd ? handleSubmit(onSubmit) : handleSubmit(onEdit)
                  }
                >
                  <FormLabel>学習内容</FormLabel>

                  {isModalAdd ? (
                    <Input
                      data-testid="study-content"
                      {...register("title", {
                        required: "内容の入力は必須です"
                      })}
                    />
                  ) : (
                    <Input
                      data-testid="study-content"
                      defaultValue={editContent}
                      {...register("title", {
                        required: "内容の入力は必須です"
                      })}
                    />
                  )}

                  {errors.title && (
                    <Text mt={1} color={"red.600"}>
                      {errors.title?.message}
                    </Text>
                  )}
                  <FormLabel mt={4}>学習時間</FormLabel>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: true, min: 0 }}
                    render={({ field }) => (
                      <NumberInput
                        defaultValue={isModalAdd ? 0 : editTime}
                        value={field.value}
                        onChange={valueString => {
                          field.onChange(parseInt(valueString));
                        }}
                      >
                        <NumberInputField />
                        {errors.time?.type === "required" && (
                          <Text mt={1} color={"red.600"}>
                            時間の入力は必須です
                          </Text>
                        )}
                        {errors.time?.type === "min" && (
                          <Text mt={1} color={"red.600"}>
                            時間は0以上である必要があります
                          </Text>
                        )}
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <Flex mt={8} justify={"right"}>
                    <Button variant="subtle" mr={3} onClick={modalClose}>
                      閉じる
                    </Button>
                    <Button colorScheme="blue" type="submit">
                      {isModalAdd ? "追加" : "更新"}
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
                  <Th></Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {todos.map((todo, index) => (
                  <Tr key={todo.id} data-testid="data">
                    <Td>{todo.title}</Td>
                    <Td>{todo.time}時間</Td>
                    <Td>
                      <IconButton
                        icon={<MdDelete />}
                        aria-label="delete"
                        as="button"
                        onClick={() => dataDelete(index)}
                      />
                    </Td>
                    <Td>
                      <IconButton
                        icon={<MdOutlineEdit />}
                        colorScheme="teal"
                        aria-label="edit"
                        as="button"
                        onClick={() => openEditModal(index)}
                      />
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
