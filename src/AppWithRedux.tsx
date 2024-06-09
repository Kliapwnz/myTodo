import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {
   AppBar,
   Button,
   Container,
   createTheme,
   CssBaseline,
   Grid,
   Paper,
   Switch,
   ThemeProvider,
   Toolbar
} from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import {Menu} from "@mui/icons-material";
import {
   addTodolistAC,
   changeTodolistFilterAC,
   changeTodolistTitleAC,
   removeTodolistAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";


export type FilterValuesType = "all" | "active" | "completed";

type ThemeMode = 'dark' | 'light'

export type TodolistType = {
   id: string
   title: string
   filter: FilterValuesType
}

export type TasksStateType = {
   [key: string]: Array<TaskType>
}

function AppWithRedux() {

   let todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)

   let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

   const dispatch = useDispatch()

   function removeTask(id: string, todolistId: string) {
      dispatch(removeTaskAC(id, todolistId))
   }

   function addTask(title: string, todolistId: string) {
      dispatch(addTaskAC(title, todolistId))
   }

   function changeStatus(id: string, isDone: boolean, todolistId: string) {
      dispatch(changeTaskStatusAC(id, isDone, todolistId))
   }

   function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
      dispatch(changeTaskTitleAC(id, newTitle, todolistId))
   }


   function changeFilter(value: FilterValuesType, todolistId: string) {
      dispatch(changeTodolistFilterAC(todolistId, value))
   }

   function removeTodolist(id: string) {
      dispatch(removeTodolistAC(id));

   }

   function changeTodolistTitle(id: string, title: string) {
      dispatch(changeTodolistTitleAC(id, title));
   }

   function addTodolist(title: string) {
      dispatch(addTodolistAC(title));

   }

   const [themeMode, setThemeMode] = useState<ThemeMode>('light')

   const theme = createTheme({
      palette: {
         mode: themeMode === 'light' ? 'light' : 'dark',
         primary: {
            main: '#087EA4',
         },
      },
   });

   const changeModeHandler = () => {
      setThemeMode(themeMode === "light" ? "dark" : 'light')
   }

   return (
      <ThemeProvider theme={theme}>
         <CssBaseline/>
         <div className="App">
            <AppBar position="static">
               <Toolbar>
                  <IconButton edge="start" color="inherit" aria-label="menu">
                     <Menu/>
                  </IconButton>
                  <div>
                     <Switch color={'default'} onChange={changeModeHandler}/>
                  </div>
                  <Button color="inherit">Login</Button>
               </Toolbar>
            </AppBar>
            <Container fixed>
               <Grid container style={{padding: "20px"}}>
                  <AddItemForm addItem={addTodolist}/>
               </Grid>
               <Grid container spacing={3}>
                  {
                     todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];
                        let tasksForTodolist = allTodolistTasks;

                        if (tl.filter === "active") {
                           tasksForTodolist = allTodolistTasks.filter(t => !t.isDone);
                        }
                        if (tl.filter === "completed") {
                           tasksForTodolist = allTodolistTasks.filter(t => t.isDone);
                        }

                        return <Grid key={tl.id} item>
                           <Paper style={{padding: "10px"}}>
                              <Todolist
                                 key={tl.id}
                                 id={tl.id}
                                 title={tl.title}
                                 tasks={tasksForTodolist}
                                 removeTask={removeTask}
                                 changeFilter={changeFilter}
                                 addTask={addTask}
                                 changeTaskStatus={changeStatus}
                                 filter={tl.filter}
                                 removeTodolist={removeTodolist}
                                 changeTaskTitle={changeTaskTitle}
                                 changeTodolistTitle={changeTodolistTitle}
                              />
                           </Paper>
                        </Grid>
                     })
                  }
               </Grid>
            </Container>
         </div>
      </ThemeProvider>
   );
}

export default AppWithRedux;
