// console.log('привет');

(function () {

   // пустой массив
   let listArray = [],
       listName = '';

   function creatAppTitle(title) {
      let appTitle = document.createElement('h2');
      appTitle.innerHTML = title;
      return appTitle;
   }

   function createTodoItemForm() {
      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');

      form.classList.add('input-group', 'mb-3');
      input.classList.add('form-control');
      input.placeholder = 'Введите название нового дела';
      buttonWrapper.classList.add('input-group-append');
      button.classList.add('btn', 'btn-primary', 'btn-disabled');
      button.textContent = 'Добавить дело';



      // проверяем поле ввода
      input.addEventListener('input', function () {
         if (input.value !== "") {
            button.classList.remove('btn-disabled');
         } else {
            button.classList.add('btn-disabled');
         }
      });
      // вкладываем элементы друг в друга
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper);

      return {
         form,
         input,
         button
      }

   }

   function createTodoList() {
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list;
   }

   function createTodoItem(obj) {
      let item = document.createElement('li');
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');

      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
      //   Т.к. в иннер хтмл могут вписать теги, а тут нет
      item.textContent = obj.name;

      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';

      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.textContent = 'Удалить';

      if (obj.done == true) {
         item.classList.add('list-group-item-success');
      }

      doneButton.addEventListener('click', function () {
         item.classList.toggle('list-group-item-success');
         // const currentName = item.firstChild.textContent;

         for (const listItem of listArray) {
            if(listItem.id == obj.id) listItem.done = !listItem.done;
         }

         saveList(listArray, listName);
      });

      deleteButton.addEventListener('click', function () {
         if (confirm(' Вы уверены?')) {
            item.remove();
         }

         // const currentName = item.firstChild.textContent;

         for(let i=0; i< listArray.length; i++){
            if(listArray[i].id == obj.id) listArray.splice(i,1);
         }
         console.log(listArray);
         saveList(listArray, listName);
      });



      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);

      return {
         item,
         doneButton,
         deleteButton,
      };

   }

   //  функция создания уникального номера
   function newId(arr){
      let max = 0;
      for (const item of arr) {
         if(item.id > max) max = item.id;
      }
      return max + 1;

   }

   function saveList(arr, keyName){
      localStorage.setItem(keyName, JSON.stringify(arr));
      // console.log(JSON.stringify(arr));   
   }

   function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {

      // let container = document.getElementById('todo-app');


      let todoAppTitle = creatAppTitle(title);
      let todoItemForm = createTodoItemForm();
      let todoList = createTodoList();

      listName = keyName;
      listArray = defArray;
      // let todoItems = [createTodoItem('Сходить за хлебом'), createTodoItem('Купить молоко')]

      container.append(todoAppTitle);
      container.append(todoItemForm.form);
      container.append(todoList);
      // todoList.append(todoItems[0].item);
      // todoList.append(todoItems[1].item);
      let localData = localStorage.getItem(listName);

      if(localData !== null && localData !== '') listArray = JSON.parse(localData);
      // console.log(listArray);
      for (const itemList of listArray) {
         let todoItem = createTodoItem(itemList);
         todoList.append(todoItem.item);
      }






      todoItemForm.form.addEventListener('submit', function (e) {
         // блокируем перезагрузку страницы при оптравке
         e.preventDefault();

         if (!todoItemForm.input.value) {
            return;
         }
         // todoList.append(createTodoItem(todoItemForm.input.value).item);
         let newItem = {
            id: newId(listArray),
            name: todoItemForm.input.value,
            done: false
         }


         let todoItem = createTodoItem(newItem);



         // todoList.item.remove();


         // добавляем запись в массив
         listArray.push(newItem);
         saveList(listArray, listName);
         // console.log(listArray);

         todoList.append(todoItem.item);

         // делаем кнопку неактивной
         todoItemForm.button.classList.add('btn-disabled');
         todoItemForm.input.value = '';

      });


   }

   // выводим все это дело на экран
   // document.addEventListener('DOMContentLoaded', function () {
   //    createTodoApp(document.getElementById('my-todos'), 'Мои дела');
   //    createTodoApp(document.getElementById('mom-todos'), 'Дела мамы');
   //    createTodoApp(document.getElementById('dad-todos'), 'Дела папы');
   // });

   window.createTodoApp = createTodoApp;

})();