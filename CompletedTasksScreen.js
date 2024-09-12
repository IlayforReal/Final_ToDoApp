import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from './ThemeContext'; // Import the useTheme hook

function CompletedTasksScreen({ route, navigation }) {
  const { completedTasks: initialCompletedTasks = [], onDelete } = route.params || {};
  
  const { isDarkMode } = useTheme(); // Get dark mode state
  const [completedTasks, setCompletedTasks] = useState(initialCompletedTasks); // Local state for completed tasks

  // Ensure onDelete is defined and is a function
  const handleDelete = (id) => {
    if (typeof onDelete === 'function') {
      onDelete(id); // Call the passed delete function
    }
    // Update the local state to reflect the deleted task
    setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const renderCompletedTask = ({ item }) => (
    <View style={[styles.roundedBox, { backgroundColor: isDarkMode ? "#444" : "#FFFFFF" }]}>
      <View style={[styles.innerTextBox, { backgroundColor: isDarkMode ? "#555" : "#B3B7EE" }]}>
        <Text
          style={[styles.taskTitleText, { color: isDarkMode ? "#DDD" : "#FFFFFF" }]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {item.title}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.trashIconContainer}
        onPress={() => handleDelete(item.id)}
      >
        <Image
          source={require("./assets/trash.png")}
          style={styles.trashIcon}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#222" : "#B3B7EE" }]}>
      {completedTasks.length === 0 ? (
        <Text style={[styles.noTasksText, { color: isDarkMode ? "#AAA" : "#888" }]}>No completed tasks yet!</Text>
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCompletedTask}
          contentContainerStyle={styles.completedTaskList}
        />
      )}
    </View>
  );
}

export default CompletedTasksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noTasksText: {
    fontSize: 18,
  },
  completedTaskList: {
    padding: 20,
  },
  roundedBox: {
    width: 365,
    height: 80,
    borderRadius: 15,
    margin: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 1,
  },
  innerTextBox: {
    width: 220,
    height: 50,
    right: 60,
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
  taskTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flexWrap: "wrap",
  },
  trashIconContainer: {
    position: "absolute",
    right: 51,
    top: 29,
  },
  trashIcon: {
    width: 25,
    height: 26,
  },
});
