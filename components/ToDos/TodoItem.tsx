import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type TTodoItemProps = {
  todo: { text: string; completed: boolean };
  index: number;
  toggleTodo: (index: number) => void;
  deleteTodo: (index: number) => void;
};

export default function TodoItem({
  todo,
  index,
  toggleTodo,
  deleteTodo,
}: TTodoItemProps) {
  return (
    <TouchableOpacity style={styles.todoItem}>
      <Text
        onPress={() => toggleTodo(index)}
        style={[styles.todoText, todo.completed && styles.completed]}
      >
        {index + 1}. {todo.text}
      </Text>
      <Text>{todo.completed && "✅"}</Text>
      <TouchableOpacity
        onPress={() => deleteTodo(index)}
        style={styles.deleteButton}
      >
        <MaterialIcons name="delete" size={24} color="grey" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  todoText: {
    fontSize: 18,
    paddingRight: 20,
    flex: 1,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  deleteButton: {
    marginLeft: 10,
  },
});
