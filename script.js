/* =====================================================
   ALERT / PROMPT / CONFIRM
   ===================================================== */

function startInternalScripts() {

    alert("Вітаємо на сайті туристичних екскурсій Україною!");

    let name = prompt("Введіть ваше ім'я");

    if(name){
        alert("Раді вас бачити, " + name);
    }

    let answer = confirm("Бажаєте переглянути список міст?");

    if(answer){
        alert("Скористайтесь меню навігації.");
    } else {
        alert("Добре, можете продовжити перегляд сайту.");
    }

}


/* =====================================================
   ДІАЛОГ З КОРИСТУВАЧЕМ
   змінні + умови + цикл
   ===================================================== */

function dialogWithUser(){

    let age = prompt("Скільки вам років?");

    if(age >= 18){
        alert("Вам доступні всі туристичні маршрути.");
    }
    else{
        alert("Вам доступні оглядові екскурсії.");
    }

    for(let i=1;i<=3;i++){
        console.log("Крок перевірки №"+i);
    }

}


/* =====================================================
   ФУНКЦІЯ З ПАРАМЕТРАМИ
   ===================================================== */

function developerInfo(lastName, firstName, position="Веб-розробник"){

    alert(
        "Інформація про розробника\n\n"+
        "Прізвище: "+lastName+"\n"+
        "Ім'я: "+firstName+"\n"+
        "Посада: "+position
    );

}

function showDeveloper(){
    developerInfo("Єлізарова","Софія");
}


/* =====================================================
   ПОРІВНЯННЯ РЯДКІВ
   ===================================================== */

function compareStrings(){

    let str1 = prompt("Введіть перший рядок");
    let str2 = prompt("Введіть другий рядок");

    let bigger = str1.length > str2.length ? str1 : str2;

    alert(
        "Порівнюються рядки:\n\n"+
        "1) "+str1+"\n"+
        "2) "+str2+"\n\n"+
        "Більший рядок: "+bigger
    );

}


/* =====================================================
   ЗМІНА ФОНУ ЧЕРЕЗ DOCUMENT
   ===================================================== */

function changeBackground(){

    document.body.style.backgroundColor="#fff3cd";

    setTimeout(function(){

        document.body.style.backgroundColor="#e6f2ff";

    },30000);

}


/* =====================================================
   LOCATION
   ===================================================== */

function redirectToLviv(){

    location.href="lviv.html";

}


/* =====================================================
   DOCUMENT.WRITE
   ===================================================== */

function writeExample(){

    document.write("<h1>Сторінка створена методом document.write()</h1>");
    document.write("<p>Цей метод перезаписує весь документ.</p>");

}


/* =====================================================
   ДЕМОНСТРАЦІЯ DOM МЕТОДІВ
   ===================================================== */

function domDemo(){

    /* отримуємо елемент */
    let area = document.getElementById("dom-area");

    let text = document.getElementById("demo-text");

    /* innerHTML */
    text.innerHTML = "<b>Текст змінено через innerHTML</b>";

    /* textContent */
    console.log("textContent:", text.textContent);

    /* nodeValue */
    if(text.firstChild){
        console.log("nodeValue:", text.firstChild.nodeValue);
    }

    /* data (властивість текстового вузла) */
    if(text.firstChild){
        console.log("data:", text.firstChild.data);
    }

    /* створення нового елемента */
    let block = document.createElement("div");

    /* createTextNode */
    let textNode = document.createTextNode("Блок створений методом createElement");

    block.append(textNode);

    block.style.background="#dbeafe";
    block.style.padding="10px";
    block.style.marginTop="10px";

    /* append */
    area.append(block);

    /* prepend */
    let title=document.createElement("h3");
    title.textContent="Демонстрація DOM";
    area.prepend(title);

    /* after */
    let afterText=document.createElement("p");
    afterText.textContent="Цей елемент додано через after()";
    block.after(afterText);

    /* replaceWith */
    let replace=document.createElement("p");
    replace.textContent="Цей текст замінив попередній";
    afterText.replaceWith(replace);

    /* remove */
    setTimeout(function(){
        replace.remove();
    },5000);

    /* querySelectorAll */
    let paragraphs=document.querySelectorAll("p");

    paragraphs.forEach(function(p){
        p.style.color="#1e4f73";
    });

    /* outerHTML */
    console.log("outerHTML:", block.outerHTML);

}