import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CompletedTasksScreen from "./CompletedTasksScreen";
import { useTheme, ThemeProvider } from "./ThemeContext";

const Stack = createStackNavigator();

function MainScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const slideAnim = useRef(new Animated.Value(-300)).current;

  const toggleSettings = () => {
    setIsSettingsVisible((prevState) => {
      const newState = !prevState;
      Animated.timing(slideAnim, {
        toValue: newState ? 0 : -300,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return newState;
    });
  };

  const handleEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isEditing: true } : task
      )
    );
  };

  const handleSave = (id, updatedTitle) => {
    if (updatedTitle.trim() === "") return;
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: updatedTitle, isEditing: false }
          : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle,
        isEditing: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  const setDarkMode = () => {
    if (!isDarkMode) toggleTheme();
  };

  const setLightMode = () => {
    if (isDarkMode) toggleTheme();
  };

  const handleDone = (id) => {
    const completedTask = tasks.find((task) => task.id === id);
    if (completedTask) {
      setTasks(tasks.filter((task) => task.id !== id));
      setCompletedTasks([...completedTasks, completedTask]);
    }
  };

  const handleDeleteFromCompleted = (id) => {
    setCompletedTasks(completedTasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Screen focused, updating...");
    });

    return unsubscribe;
  }, [navigation]);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.box, { backgroundColor: colors.box }]} />
      <View style={[styles.box2, { backgroundColor: colors.box2 }]} />

      <View style={styles.addTaskContainer}>
        <TextInput
          style={[
            styles.newTaskInput,
            {
              color: colors.text,
              borderColor: colors.box,
              backgroundColor: colors.inputBackground,
            },
          ]}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          placeholder="Enter new task"
          placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.box }]}
          onPress={handleAddTask}
        >
          <Text style={[styles.addButtonText, { color: colors.text }]}>
            Add Task
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              color: colors.text,
              borderColor: colors.box,
              backgroundColor: colors.inputBackground,
            },
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks"
          placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
        />
      </View>

      <View style={styles.taskListContainer}>
        <FlatList
          data={filteredTasks} // Use filtered tasks
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.roundedBox, { backgroundColor: colors.box2 }]}>
              <View style={styles.innerTextBox}>
                {item.isEditing ? (
                  <TextInput
                    style={[styles.taskTitleTextInput, { color: colors.text }]}
                    value={item.title}
                    onChangeText={(text) =>
                      setTasks(
                        tasks.map((task) =>
                          task.id === item.id ? { ...task, title: text } : task
                        )
                      )
                    }
                    onSubmitEditing={() => handleSave(item.id, item.title)}
                    onBlur={() => handleSave(item.id, item.title)}
                    autoFocus={true}
                  />
                ) : (
                  
                  <Text
                    style={[styles.taskTitleText, { color: colors.text }]}
                    numberOfLines={2}
                    adjustsFontSizeToFit
                  >
                    {item.title}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.pencilIconContainer}
                onPress={() => handleEdit(item.id)}
              >
                <Image
                  source={require("./assets/pencil.png")}
                  style={styles.pencilIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.trashIconContainer}
                onPress={() => handleDelete(item.id)}
              >
                <Image
                  source={require("./assets/trash.png")}
                  style={styles.trashIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doneIconContainer}
                onPress={() => handleDone(item.id)}
              >
                <Image
                  source={require("./assets/done.png")}
                  style={styles.doneIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.taskList}
        />
      </View>

      <View style={styles.notepadContainer}>
        <Image
          source={require("./assets/notepad.png")}
          style={styles.notepadIcon}
        />
      </View>

      <TouchableOpacity
        style={styles.burgerIconContainer}
        onPress={toggleSettings}
      >
        <Image
          source={require("./assets/burger-bar.png")}
          style={styles.burgerIcon}
        />
      </TouchableOpacity>

      <Animated.View style={[styles.settingsContainer, { left: slideAnim }]}>
        <Text style={[styles.settingsTitle, { color: colors.text }]}>
          Settings
        </Text>

        <TouchableOpacity onPress={setLightMode}>
          <Text style={[styles.settingsOption, { color: colors.text }]}>
            Light Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={setDarkMode}>
          <Text style={[styles.settingsOption, { color: colors.text }]}>
            Dark Mode
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.completedIconContainer}
        onPress={() =>
          navigation.navigate("CompletedTasks", {
            completedTasks,
            onDelete: handleDeleteFromCompleted,
          })
        }
      >
        <Image
          source={require("./assets/checked.png")}
          style={styles.completedIcon}
        />
      </TouchableOpacity>

      <Text style={[styles.titleText, { color: colors.text }]}>
        JarrenNotes
      </Text>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{ title: "Task Manager", headerShown: false }}
          />
          <Stack.Screen
            name="CompletedTasks"
            component={CompletedTasksScreen}
            options={{ title: "Completed Tasks" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#B3B7EE",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: 40,
    paddingBottom: 40,
  },
  taskListContainer: {
    flex: 1,
    width: "100%",
  },
  taskList: {
    paddingTop: 20,
  },
  box: {
    width: "100%",
    height: 100,
    backgroundColor: "#9395D3",
    position: "absolute",
    top: 0,
    left: 0,
    margin: 0,
  },
  box2: {
    width: "100%",
    height: 90,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    bottom: 0,
    left: 0,
    margin: 0,
  },
  addTaskContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 25,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "95%",
    marginLeft: 0,
    top: 40,
  },
  newTaskInput: {
    flex: 1,
    height: 40,
    borderColor: "#B3B7EE",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#9395D3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    width: "95%",
    marginVertical: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#B3B7EE",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  roundedBox: {
    width: 378,
    height: 80,
    backgroundColor: "#000000",
    borderRadius: 15,
    margin: 5,
    justifyContent: "space-evenly",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 8,
  },
  innerTextBox: {
    width: 220,
    height: 50,
    right: 60,
    backgroundColor: "#B3B7EE",
    borderRadius: 10,
    justifyContent: "center",
    padding: 10,
  },
  taskTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    flexWrap: "wrap",
  },
  taskTitleTextInput: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    width: "100%",
    padding: 5,
  },
  pencilIconContainer: {
    position: "absolute",
    right: 90,
    top: 28,
  },
  pencilIcon: {
    width: 30,
    height: 30,
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
  doneIconContainer: {
    position: "absolute",
    right: 10,
    top: 29,
  },
  doneIcon: {
    width: 25,
    height: 25,
  },
  notepadContainer: {
    position: "absolute",
    top: 50,
    right: 25,
  },
  notepadIcon: {
    width: 43,
    height: 35,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    position: "absolute",
    top: 50,
    left: 20,
  },
  burgerIconContainer: {
    position: "absolute",
    bottom: 20,
    left: 60,
  },
  burgerIcon: {
    width: 70,
    height: 50,
  },
  completedIconContainer: {
    position: "absolute",
    bottom: 30,
    right: 90,
  },
  completedIcon: {
    width: 30,
    height: 30,
  },
  settingsContainer: {
    position: "absolute",
    top: 0,
    bottom: 91,
    width: 250,
    backgroundColor: "#B3B7EE",
    padding: 40,
    zIndex: 1000,
    elevation: 5,
    left: -300,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingsOption: {
    fontSize: 18,
    marginVertical: 10,
  },
});
