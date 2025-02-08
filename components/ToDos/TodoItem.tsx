import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TToDoItem } from "./types";

type TTodoItemProps = {
  todo: TToDoItem;
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
      <Text onPress={() => toggleTodo(index)} style={[styles.todoText]}>
        {/* <View style={{ paddingRight: 5, paddingLeft: 0 }}>
          <Text style={{ fontSize: 20 }}>{index + 1}. </Text>
        </View> */}
        <View style={styles.taskText}>
          <Text
            style={[
              { fontSize: 16, textTransform: "capitalize" },
              todo.completed && styles.completed,
            ]}
          >
            {todo.text}
          </Text>
          {todo.completed && todo.completedDate ? (
            <Text
              style={{ fontSize: 10 }}
            >{`Completed: ${todo.completedDate?.toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true, // Use 12-hour format
            })}`}</Text>
          ) : (
            todo.date && (
              <Text
                style={{ fontSize: 10 }}
              >{`Created: ${todo?.date?.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Use 12-hour format
              })}`}</Text>
            )
          )}
        </View>
      </Text>

      <Text onPress={() => toggleTodo(index)}>{todo.completed && "✅"}</Text>
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
    alignItems: "center",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  taskText: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
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
