import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TodoList from "@/components/ToDos/TodoList";
import TodoInput from "@/components/ToDos/TodoInput";

const TODOS_STORAGE_KEY = "phoneSync-todos";

export default function Todos() {
  const [todos, setTodos] = useState<{ text: string; completed: boolean }[]>(
    []
  );

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos));
        }
      } catch (error) {
        console.error("Failed to load todos from storage", error);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    const saveTodos = async () => {
      try {
        // Save todos to storage
        await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to storage", error);
      }
    };

    saveTodos();
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos([...todos, { text, completed: false }]);
  };

  const toggleTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ paddingBottom: 16 }}>
          To Do List
        </ThemedText>
        <IconSymbol size={28} name="paperplane.fill" color="black" />
      </ThemedView>
      <TodoInput addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 50,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
