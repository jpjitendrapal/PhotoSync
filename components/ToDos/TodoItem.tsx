import { TouchableOpacity, Text, StyleSheet } from "react-native";

type TTodoItemProps = {
  todo: { text: string; completed: boolean };
  index: number;
  toggleTodo: (index: number) => void;
};
export default function TodoItem({ todo, index, toggleTodo }: TTodoItemProps) {
  return (
    <TouchableOpacity onPress={() => toggleTodo(index)} style={styles.todoItem}>
      <Text style={[styles.todoText, todo.completed && styles.completed]}>
        {index + 1}. {todo.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoText: {
    fontSize: 18,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
