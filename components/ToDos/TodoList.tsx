import { FlatList, StyleSheet } from "react-native";
import TodoItem from "./TodoItem";

type TTodoListProps = {
  todos: { text: string; completed: boolean }[];
  toggleTodo: (index: number) => void;
  deleteTodo: (index: number) => void;
};

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
}: TTodoListProps) {
  return (
    <FlatList
      style={styles.todoList}
      data={todos}
      renderItem={({ item, index }) => (
        <TodoItem
          todo={item}
          index={index}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  todoList: {
    width: "100%",
  },
});
