import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
	getDatabase,
	ref,
	push,
	onValue,
	remove
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
	databaseURL:
		'https://realtime-database-99dc2-default-rtdb.europe-west1.firebasedatabase.app/'
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

addButtonEl.addEventListener('click', function () {
	let inputValue = inputFieldEl.value;
	push(shoppingListInDB, inputValue);
	clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
	let shoppingListItems = Object.entries(snapshot.val());

	clearShoppingList();

	for (let item of shoppingListItems) {
		let shoppingListItem = item;
		let shoppingListItemID = shoppingListItem[0];
		let shoppingListItemValue = shoppingListItem[1];
		appendItemToShoppingListEl(shoppingListItem);
	}
});

const clearInputFieldEl = () => (inputFieldEl.value = '');

const clearShoppingList = () => (shoppingListEl.innerHTML = '');

const appendItemToShoppingListEl = (item) => {
	let itemID = item[0];
	let itemValue = item[1];

	let newEl = document.createElement('li');

	newEl.textContent = itemValue;

	newEl.addEventListener('click', function () {
		let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
		remove(exactLocationOfItemInDB);
	});

	shoppingListEl.append(newEl);
};
