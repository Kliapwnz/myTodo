import React, {ChangeEvent, memo, useCallback} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {Button, Checkbox} from "@mui/material";


export type TaskType = {
   id: string
   title: string
   isDone: boolean
}

type PropsType = {
   id: string
   title: string
   tasks: Array<TaskType>
   removeTask: (taskId: string, todolistId: string) => void
   changeFilter: (value: FilterValuesType, todolistId: string) => void
   addTask: (title: string, todolistId: string) => void
   changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
   removeTodolist: (id: string) => void
   changeTodolistTitle: (id: string, newTitle: string) => void
   filter: FilterValuesType
   changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = memo((props: PropsType) => {
   console.log("todolist")
   const addTask = useCallback((title: string) => {
      props.addTask(title, props.id);
   }, [props.addTask, props.id])

   const removeTodolist = () => {
      props.removeTodolist(props.id);
   }
   const changeTodolistTitle = (title: string) => {
      props.changeTodolistTitle(props.id, title);
   }

   const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
   const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.changeFilter, props.id]);
   const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

   let tasks = props.tasks

   if (props.filter === "active") {
      tasks = tasks.filter(t => !t.isDone);
   }
   if (props.filter === "completed") {
      tasks = tasks.filter(t => t.isDone);
   }

   return <div>
      <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
         <IconButton onClick={removeTodolist}>
            <Delete/>
         </IconButton>
      </h3>
      <AddItemForm addItem={addTask}/>
      <div>
         {
            tasks.map(t => {
               const onClickHandler = () => props.removeTask(t.id, props.id)
               const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                  let newIsDoneValue = e.currentTarget.checked;
                  props.changeTaskStatus(t.id, newIsDoneValue, props.id);
               }
               const onTitleChangeHandler = (newValue: string) => {
                  props.changeTaskTitle(t.id, newValue, props.id);
               }


               return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                  <Checkbox
                     checked={t.isDone}
                     color="primary"
                     onChange={onChangeHandler}
                  />

                  <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                  <IconButton onClick={onClickHandler}>
                     <Delete/>
                  </IconButton>
               </div>
            })
         }
      </div>
      <div>
         <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                 onClick={onAllClickHandler}
                 color={'inherit'}
         >All
         </Button>
         <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                 onClick={onActiveClickHandler}
                 color={'primary'}>Active
         </Button>
         <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                 onClick={onCompletedClickHandler}
                 color={'secondary'}>Completed
         </Button>
      </div>
   </div>
})


