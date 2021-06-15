console.log("index.js");
// collectData class
class collectData {
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }
}
// UI Class
let counter = 0
class UI {
    static displayForm() {
        document.querySelector(".question-card").classList.add("showItem");
    }
    static removeForm() {
        document.querySelector(".question-card").classList.remove("showItem");
    }
    static displayAlert(message, alertStatus) {
        document.querySelector(".feedback").classList.add(`showItem`, `alert-${alertStatus}`);
        document.querySelector(".feedback").innerHTML = message;
        setTimeout(() => {
            document.querySelector(".feedback").classList.remove(`showItem`, `alert-${alertStatus}`);
        }, 3000);
    }
    static displayCards() {
        let cards = Store.getItem();
        cards.forEach((card) => {
            UI.insertCards(card);
        })
    }
    static insertCards(card) {
        const questionList = document.querySelector("#questions-list");

        const innerDiv = document.createElement("div")
        innerDiv.className = `col-md-4`;
        innerDiv.innerHTML = `<!--Template for card data-->
         <div class="card card-body flashcard my-3">
         <h4 class="text-capitalize">${card.question}</h4>
         <a href="#" class="text-capitalize my-3 show-answer">show/hide answer</a>
         <h5 class="answer mb-3">${card.answer}</h5>
         <div class="flashcard-btn d-flex justify-content-between">
          <a href="#" id="edit-flashcard" class=" btn my-1 edit-flashcard text-uppercase" data-id="">edit</a>
          <a href="#" id="delete-flashcard" class=" ${counter} btn my-1 delete-flashcard text-uppercase">delete</a>
         </div>
         </div> `
        counter++;
        //  console.log(innerDiv);
        questionList.appendChild(innerDiv);

    }
    static deleteCard(el) {
        el.parentElement.parentElement.remove();
    }
    static showHide(el) {
        if (el.nextElementSibling.classList.contains("showItem")) {
            el.nextElementSibling.classList.remove("showItem")
        } else {
            el.nextElementSibling.classList.add("showItem")
        }
    }
    static edit(el) {
        // display none of card
       el.parentElement.parentElement.style.display="none";
        // Capture question answer
        const question=el.parentElement.parentElement.children[0].textContent
        const answer=el.parentElement.parentElement.children[2].textContent
         const form = document.querySelector(".question-card");
         const questionInput = form.children[2].children[1].children[0];
         const answerInput = form.children[2].children[3].children[0]
         console.log(questionInput);
         questionInput.innerHTML=question;
         answerInput.innerHTML = answer;
         UI.displayForm();
        
    }
    static clearFields() {
        document.querySelector("#question-input").value = "";
        document.querySelector("#answer-input").value = "";
    }
}
// store Class
class Store {
    // getItem
    static getItem() {
        let cards
        let getItemData = localStorage.getItem("cards");
        if (getItemData === null) {
            cards = [];
        } else {
            cards = JSON.parse(getItemData);
        }
        return cards;
    }
    // addItem
    static addItem(submitData) {
        let storedData = Store.getItem();
        storedData.push(submitData);
        localStorage.setItem("cards", JSON.stringify(storedData))
    }
    // removeItem
    static removeItem(classIndex) {
        const storedData = Store.getItem();
        storedData.splice(classIndex, 1);
        localStorage.setItem("cards", JSON.stringify(storedData))
    }
}
// Dom display event listener
document.addEventListener("DOMContentLoaded", UI.displayCards())

// Add Form event Listener
document.querySelector("#show-btn").addEventListener("click", (e) => {
    // console.log("question clicked");
    UI.displayForm();
})

// Remove form event Listener
document.querySelector(".close-btn").addEventListener("click", () => {
    UI.removeForm();
})

// submit form event Listener
document.querySelector("#question-form").addEventListener("submit", (e) => {
    e.preventDefault();
    // collect userInput in Variable
    let question = document.querySelector("#question-input").value;
    let answer = document.querySelector("#answer-input").value;
    // validation
    if (question === "" || answer === "") {
        UI.displayAlert("can't keep the box empty", "danger");
    } else {
        // instantiate the collect data class
        let submittedForm = new collectData(question, answer);
        // display Cards
        UI.insertCards(submittedForm);
        // store the form in localStorage
        Store.addItem(submittedForm);
        UI.displayAlert("Card Added", "success");
        // clearFields
        UI.clearFields();
    }
})

// Card Action
document.querySelector("#questions-list").addEventListener("click", (e) => {
    // delete action

    if (e.target.classList.contains("delete-flashcard")) {
        UI.deleteCard(e.target);
        // delete card from local store
        let classIndex = parseInt(e.target.className);
        Store.removeItem(classIndex);
        UI.displayAlert("card removed", "success");
    }
    //    show hide action
    if (e.target.classList.contains("show-answer")) {
        UI.showHide(e.target);
    }
    // edit action    
    if (e.target.classList.contains("edit-flashcard")) {
        UI.edit(e.target)
    }


})
// hide and show event listener



































































// //event listeners - will be invoked after DOM Content is loaded
// function eventListeners(){
//     const showBtn = document.getElementById("show-btn");
//     const questionCard = document.querySelector(".question-card");
//     const closeBtn = document.querySelector(".close-btn");
//     const form = document.getElementById("question-form");
//     const feedback = document.querySelector(".feedback");
//     const questionInput = document.getElementById("question-input");
//     const answerInput = document.getElementById("answer-input");
//     const questionList = document.getElementById("questions-list");
//     //let data = [];
//     let id;

//     //new ui instance
//     const ui = new UI();
//     //retrieve questions from local storage
//     let data = ui.retrieveLocalStorgage();
//     if (data.length > 0){
//         id = (data[(data.length-1)].id)+1;
//     } else {
//         id = 1;
//     }
//     data.forEach(function(question){
//         ui.addQuestion(questionList, question);
//     })
//     //show question form
//     showBtn.addEventListener('click', function(){
//         ui.showQuestion(questionCard);
//     });
//     //hide question form
//     closeBtn.addEventListener('click', function(){
//         ui.hideQuestion(questionCard);
//     });
//     //add question
//     form.addEventListener('submit', function(event){
//         event.preventDefault();

//         const questionValue = questionInput.value;
//         const answerValue = answerInput.value;

//         if(questionValue === '' || answerValue === ''){
//             feedback.classList.add('showItem', 'alert-danger');
//             feedback.textContent = 'cannot add empty values';

//             setTimeout(function(){
//                 feedback.classList.remove('alert-danger', 'showItem');    
//             }, 3000)
//         } else {
//             const question =  new Question(id, questionValue, answerValue);
//             data.push(question);
//             ui.addToLocalStorage(data);
//             id++;
//             ui.addQuestion(questionList, question)
//             ui.clearFields(questionInput, answerInput);
//         }
//     });
//     //work with a question
//     questionList.addEventListener('click', function(event){
//         event.preventDefault();
//     if(event.target.classList.contains('delete-flashcard')){
//         let id = event.target.dataset.id;

//         questionList.removeChild(event.target.parentElement.parentElement.parentElement);
//         // rest of data
//         let tempData = data.filter(function(item){
//             return item.id !== parseInt(id);
//         });
//         data = tempData;
//         ui.addToLocalStorage(data);

//     } else if (event.target.classList.contains('show-answer')){
//             event.target.nextElementSibling.classList.toggle('showItem');
//     } else if (event.target.classList.contains('edit-flashcard')){
//         //delete question from DOM
//         let id = event.target.dataset.id;
//         questionList.removeChild(event.target.parentElement.parentElement.parentElement);

//         //show question in question card
//         ui.showQuestion(questionCard);
//         //find specific question clicked
//         const tempQuestion = data.filter(function(item){
//             return item.id === parseInt(id);
//         });
//         // rest of data
//         let tempData = data.filter(function(item){
//             return item.id !== parseInt(id);
//         });
//         data = tempData;
//         questionInput.value = tempQuestion[0].title;
//         questionInput.value = tempQuestion[0].answer;
//     }  
//     });
// }
// //Contructor function responsible for the display
// function UI(){
//     //show question card
//     UI.prototype.showQuestion = function(element){
//         element.classList.add('showItem');
//     }
//     //hide question card
//     UI.prototype.hideQuestion = function(element){
//         element.classList.remove('showItem');
//     }
//     //add question
//     UI.prototype.addQuestion = function(element, question){
//         const div = document.createElement('div');
//         div.classList.add('col-md-4');
//         div.innerHTML = `<div class="card card-body flashcard my-3">
//         <h4 class="text-capitalize">${question.title}</h4>
//         <a href="#" class="text-capitalize my-3 show-answer">Show/Hide Answer</a>
//         <h5 class="answer mb-3">${question.answer}</h5>
//         <div class="flashcard-btn d-flex justify-content-between">

//          <a href="#" id="edit-flashcard" class=" btn my-1 edit-flashcard text-uppercase" data-id="${question.id}">edit</a>
//          <a href="#" id="delete-flashcard" class=" btn my-1 delete-flashcard text-uppercase" data-id="${question.id}">delete</a>
//         </div>
//        </div>`;
//        element.appendChild(div);
//     }
//     //add to Local Storage
//     UI.prototype.addToLocalStorage = function(data){
//         localStorage.clear();
//         const dataJSON = JSON.stringify(data);
//         localStorage.setItem('flash-questions', dataJSON)
//     }
//     //retrieve from localStorage
//     UI.prototype.retrieveLocalStorgage = function(){

//         let savedQuestions = localStorage.getItem('flash-questions');
//         if (savedQuestions){
//             const savedQuestionsParsed = JSON.parse(savedQuestions);
//             return savedQuestionsParsed;
//         } else {
//             return savedQuestions = [];
//         }

//     }

//     //clear fields
//     UI.prototype.clearFields = function(question, answer){
//         question.value = '';
//         answer.value = '';
//     }
// }
// //Constructor function responsible for each question
// function Question(id, title, answer){
//     this.id = id;
//     this.title = title;
//     this.answer = answer;
// }
// // dom event listener to run when content is loaded
// document.addEventListener('DOMContentLoaded', function(){
//     eventListeners();
// })
