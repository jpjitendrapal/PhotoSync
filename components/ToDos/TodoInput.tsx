import { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

type TTodoInputProps = {
  addTodo: (text: string) => void;
};
export default function TodoInput({ addTodo }: TTodoInputProps) {
  const [text, setText] = useState("");

  const handleAddTodo = () => {
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Add a new todo"
      />
      <Button title="Add" onPress={handleAddTodo} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
});
