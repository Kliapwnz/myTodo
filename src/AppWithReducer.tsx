import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, Paper, Toolbar} from "@mui/material";
import IconButton from "@mui/material/IconButton/IconButton";
import {Menu} from "@mui/icons-material";
import {
   addTodolistAC,
   changeTodolistFilterAC,
   changeTodolistTitleAC,
   removeTodolistAC,
   todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";


export type FilterValuesType = "all" | "active" | "completed";



function AppWithReducer() {
   let todolistId1 = v1();
   let todolistId2 = v1();

   let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
      {id: todolistId1, title: "What to learn", filter: "all"},
      {id: todolistId2, title: "What to buy", filter: "all"}
   ])

   let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
      [todolistId1]: [
         {id: v1(), title: "HTML&CSS", isDone: true},
         {id: v1(), title: "JS", isDone: true}
      ],
      [todolistId2]: [
         {id: v1(), title: "Milk", isDone: true},
         {id: v1(), title: "React Book", isDone: true}
      ]
   });


   function removeTask(id: string, todolistId: string) {
      let action = removeTaskAC(id, todolistId)
      dispatchToTasks(action)
   }

   function addTask(title: string, todolistId: string) {
      let action = addTaskAC(title, todolistId)
      dispatchToTasks(action)
   }

   function changeStatus(id: string, isDone: boolean, todolistId: string) {
      //достанем нужный массив по todolistId:
      let action = changeTaskStatusAC(id, isDone, todolistId)
      dispatchToTasks(action)
   }

   function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
      let action = changeTaskTitleAC(id, newTitle, todolistId)
      dispatchToTasks(action)
   }


   function changeFilter(value: FilterValuesType, todolistId: string) {
      let action = changeTodolistFilterAC(todolistId, value)
      dispatchToTodolists(action)
   }

   function removeTodolist(id: string) {
      const action = removeTodolistAC(id);
      dispatchToTasks(action);
      dispatchToTodolists(action);
   }

   function changeTodolistTitle(id: string, title: string) {
      const action = changeTodolistTitleAC(id, title);
      dispatchToTodolists(action);
   }

   function addTodolist(title: string) {
      const action = addTodolistAC(title);
      dispatchToTasks(action);
      dispatchToTodolists(action);
   }


   return (


      <div className="App">
         <AppBar position="static">
            <Toolbar>
               <IconButton edge="start" color="inherit" aria-label="menu">
                  <Menu/>
               </IconButton>
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
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                     }
                     if (tl.filter === "completed") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
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

   );
}

export default AppWithReducer;
