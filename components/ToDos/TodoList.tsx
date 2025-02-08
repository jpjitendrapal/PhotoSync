import { FlatList } from "react-native";
import TodoItem from "./TodoItem";

type TTodoListProps = {
  todos: { text: string; completed: boolean }[];
  toggleTodo: (index: number) => void;
};
export default function TodoList({ todos, toggleTodo }: TTodoListProps) {
  return (
    <FlatList
      data={todos}
      renderItem={({ item, index }) => (
        <TodoItem todo={item} index={index} toggleTodo={toggleTodo} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
