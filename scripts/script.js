// Глобальные переменные - DOM

const listActiveItems = document.querySelector('.list__items-to-do');
const listCompletedItems = document.querySelector('.list__items-completed');
const buttonAdd = document.querySelector('.btn-add');
const inputNewItem = document.querySelector('#newItem');

// Глобальные переменные - Local Storage

let newTasks = JSON.parse(localStorage.getItem('newTasks')) || [];
console.log(newTasks);
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

// Загрузка списка дел при открытии страницы

document.addEventListener('DOMContentLoaded', loadLists);
document.addEventListener('DOMContentLoaded', inputFocus);

function loadLists() {

    if (newTasks) {
        newTasks.forEach(item => addNewItem(item));
    }

    if (completedTasks) {
        completedTasks.forEach(item => moveToCompleted(item));
    }
}

function inputFocus() {
    inputNewItem.focus();
}

//Обработка ввода в поле добавления нового пункта

buttonAdd.addEventListener('click', itemInputController);
inputNewItem.addEventListener('keydown', itemInputController);

function itemInputController(event) {

    if (event.type === 'click' || event.key === 'Enter') {
        document.querySelector('.alert-message_EmptyInputField').classList.remove('visible');
        const newItem = inputNewItem.value.trim();

        if (newItem) {
            addNewItem(newItem);
            saveToStorage(newItem);
            inputNewItem.value = '';

        } else {
            document.querySelector('.alert-message_EmptyInputField').classList.add('visible');
        }
    }
}

//Добавление нового пункта в список новых дел

function addNewItem(text) {

    listActiveItems.prepend(createTask('new', text));
}

//Добавление нового пункта в список выполненных дел

function moveToCompleted(text) {

    listCompletedItems.prepend(createTask('completed', text));
}

//Перенос в список выполненных

function taskCompleted() {

    moveToCompleted(this.parentElement.innerText);

    saveToStorageCompl(this.parentElement.innerText);

    this.parentElement.remove();
}

// Создание элемента списка

function createTask(type, text) {

    const li = document.createElement('li');
    const span = document.createElement('span');
    span.innerText = text;
    const i = document.createElement('i');

    if (type === 'new') {
        li.className = 'list__item list__item-to-do';
        span.className = 'list__text';
        span.setAttribute('contenteditable', 'true');
        span.addEventListener('click', deletionIcon);
        span.addEventListener('keypress', noEnter);
        span.addEventListener('focusout', updateInStorage);
        i.className = 'fa-regular fa-square checkbox checkbox_empty';
        i.addEventListener('click', taskCompleted);

    } else if (type === 'completed') {
        li.className = 'list__item list__item-completed';
        i.className = 'fa-solid fa-square-check checkbox';
    }

    li.prepend(span);
    li.prepend(i);

    return li;
}

// Сохранение в LocalStorage

function saveToStorage(item) {

    newTasks.push(item);
    localStorage.setItem('newTasks', JSON.stringify(newTasks));
}

function saveToStorageCompl(item) {

    completedTasks.push(item);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    removeFromStorage(item);
}

// Удаление из Local Storage

function removeFromStorage(item) {
    newTasks = newTasks.filter(el => el !== item);
    localStorage.setItem('newTasks', JSON.stringify(newTasks));
}

// Возможность удаления по клику


function deletionIcon() {

    if (!document.querySelector('.trash-can')) {
        const i = document.createElement('i');
        i.className = 'fa-regular fa-trash-can trash-can';
        i.addEventListener('click', removeTask);
        this.parentElement.append(i);
    } else {
        document.querySelector('.trash-can').remove();
    }
}

function removeTask() {
    this.removeEventListener('click', removeTask);
    this.parentElement.remove();

    removeFromStorage(this.parentElement.innerText);
}

// запрет на перенос строки 

function noEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}

// Поиск

const inputSearch = document.querySelector('.search__input');
const buttonSearch = document.querySelector('.btn-search');

//buttonSearch.addEventListener('click', search);
inputSearch.addEventListener('input', search);

function search() {

    const searchQuery = inputSearch.value.trim();

    if (searchQuery) {
        clearList();
        searchStorage(searchQuery);
    } else {
        clearList();
        loadLists();
    }
}

function searchStorage(input) {
    const resultNew = newTasks.filter(el => el.includes(input));
    resultNew.forEach(item => addNewItem(item));

    const resultCompleted = completedTasks.filter(el => el.includes(input));
    resultCompleted.forEach(item => moveToCompleted(item));
}

// Очистка списка

function clearList() {

    let listNodes = document.querySelectorAll('li');

    listNodes.forEach(el => el.remove());
}

// Сохранение изменений в Local Storage после редактирования

function updateInStorage() {
    newTasks = [];
    document.querySelectorAll('.list__item-to-do').forEach(item => newTasks.unshift(item.innerText));
    localStorage.setItem('newTasks', JSON.stringify(newTasks));
} 
