"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ================================================================
       1. ПОДІЯ ЧЕРЕЗ АТРИБУТ — onclick=""
       showTourInfo(el) викликається прямо з HTML: onclick="showTourInfo(this)"
    ================================================================ */

    window.showTourInfo = function (el) {
        var result = document.getElementById("attr-result");
        result.textContent = "📍 Ви обрали екскурсію по Києву! Тривалість: 3 год. Вартість: 350 грн.";
        result.classList.remove("hidden");

        // Невелика анімація картки
        el.style.backgroundColor = "#cce5ff";
        setTimeout(function () {
            el.style.backgroundColor = "";
        }, 600);
    };


    /* ================================================================
       2. ПОДІЯ ЧЕРЕЗ ВЛАСТИВІСТЬ — onmouseenter / onmouseleave
       Три бейджі міст отримують обробники через властивість елемента.
    ================================================================ */

    var badgeInfo = {
        "badge-kyiv":  "🏛️ Київ — Столиця України. Тур: Золоті ворота, Лавра, Андріївський узвіз.",
        "badge-lviv":  "🦁 Львів — Культурна столиця. Тур: площа Ринок, кав'ярні, Личаківський цвинтар.",
        "badge-odesa": "⚓ Одеса — Морська перлина. Тур: Потьомкінські сходи, Дерибасівська, море."
    };

    var tooltip = document.getElementById("badge-tooltip");

    ["badge-kyiv", "badge-lviv", "badge-odesa"].forEach(function (id) {
        var badge = document.getElementById(id);
        if (!badge) return;

        // Обробники призначені через ВЛАСТИВІСТЬ елемента
        badge.onmouseenter = function () {
            tooltip.textContent = badgeInfo[id];
            tooltip.classList.remove("hidden");
            badge.classList.add("active");
        };

        badge.onmouseleave = function () {
            tooltip.classList.add("hidden");
            badge.classList.remove("active");
        };
    });


    /* ================================================================
       3. addEventListener — ДВА РІЗНИХ ОБРОБНИКИ НА ОДНУ ПОДІЮ click
       Перший: рахує кліки (лічильник).
       Другий: веде журнал подій у консольному стилі.
    ================================================================ */

    var addTourBtn = document.getElementById("addTourBtn");
    var multiLog   = document.getElementById("multi-log");
    var clickCount = 0;
    var tours      = ["Тур по Києву", "Тур по Львову", "Тур по Одесі", "Тур по Кам'янцю"];

    // Обробник 1: лічильник + повідомлення про доданий тур
    function handlerCounter() {
        clickCount++;
        var tour = tours[(clickCount - 1) % tours.length];
        appendLog("✅ Додано: " + tour + " (клік №" + clickCount + ")");
    }

    // Обробник 2: журнал у консольному стилі
    function handlerLogger() {
        var time = new Date().toLocaleTimeString("uk-UA");
        appendLog("📋 [" + time + "] Подія click зафіксована на #addTourBtn");
    }

    function appendLog(msg) {
        var line = document.createElement("div");
        line.textContent = msg;
        multiLog.appendChild(line);
        multiLog.scrollTop = multiLog.scrollHeight;
    }

    if (addTourBtn) {
        addTourBtn.addEventListener("click", handlerCounter);
        addTourBtn.addEventListener("click", handlerLogger);
    }


    /* ================================================================
       4. ОБРОБНИК-ОБ'ЄКТ через addEventListener + handleEvent
          event.currentTarget — показуємо елемент, на якому спрацював
          removeEventListener — видаляємо через 10 секунд
    ================================================================ */

    var guideBtn = document.getElementById("guideBtn");

    if (guideBtn) {
        var guideStatus = document.getElementById("guide-status");
        var guideResult = document.getElementById("guide-result");
        var guideClickN = 0;

        // Обробник-об'єкт: браузер автоматично викликає handleEvent
        // коли об'єкт передано замість функції у addEventListener
        var guideHandler = {
            handleEvent: function (event) {
                guideClickN++;
                var target = event.currentTarget; // елемент, де зареєстровано обробник
                guideResult.textContent =
                    "🧭 Гід відповів на запит №" + guideClickN;
                guideResult.classList.remove("hidden");
            }
        };

        guideBtn.addEventListener("click", guideHandler);

        // Зворотній відлік і видалення через 10 секунд
        var countdown = 10;
        guideStatus.textContent = "Гід на місці. Обробник активний. Автовидалення через " + countdown + " с.";

        var guideTimer = setInterval(function () {
            countdown--;
            if (countdown > 0) {
                guideStatus.textContent = "Гід на місці. Автовидалення через " + countdown + " с.";
            } else {
                clearInterval(guideTimer);
                guideBtn.removeEventListener("click", guideHandler);
                guideStatus.textContent = "Гід пішов. Обробник видалено";
                guideStatus.classList.add("inactive");
                guideBtn.disabled = true;
                guideBtn.textContent = "🚶 Гід пішов";
            }
        }, 1000);
    }


    /* ================================================================
       5. СПИСОК — підсвічування при кліку, event.target
          Один обробник onclick на <ul>, НЕ на кожному <li>.
          Використовуємо data-info і data-city з HTML.
    ================================================================ */

    var tourList = document.getElementById("tour-list");
    var listInfo = document.getElementById("list-info");

    if (tourList) {
        tourList.onclick = function (event) {
            var li = event.target; // елемент, на якому стався клік

            if (li.tagName !== "LI") return;

            // Знімаємо виділення з усіх
            tourList.querySelectorAll("li").forEach(function (item) {
                item.classList.remove("selected");
            });

            // Виділяємо обраний
            li.classList.add("selected");

            // Показуємо опис з data-info
            var info = li.dataset.info || li.textContent;
            listInfo.textContent = "📍 " + info;
            listInfo.classList.remove("hidden");
        };
    }


    /* ================================================================
       6. МЕНЮ — делегування подій, data-action
          Один обробник addEventListener для всього #menu.
          Кожна кнопка має data-action з назвою методу.
    ================================================================ */

    var menu       = document.getElementById("menu");
    var menuOutput = document.getElementById("menu-output");

    // Методи, які відповідають значенням data-action
    var menuActions = {
        kyiv: function () {
            showMenuOutput("🏙️ Київ — Столиця України. Доступні тури: пішохідний (09:00), автобусний (14:00).");
        },
        lviv: function () {
            showMenuOutput("🦁 Львів — Культурна столиця. Тур щоденно о 10:00.");
        },
        odesa: function () {
            showMenuOutput("⚓ Одеса — Морська перлина. Тур щоденно о 12:00.");
        },
        all: function () {
            showMenuOutput("📋 Всі тури: Київ (09:00, 14:00) · Львів (10:00) · Одеса (12:00) · Кам'янець (11:00).");
        }
    };

    function showMenuOutput(text) {
        menuOutput.textContent = text;
        menuOutput.classList.remove("hidden");
    }

    if (menu) {
        menu.addEventListener("click", function (event) {
            var action = event.target.dataset.action; // <------
            if (action && menuActions[action]) {
                menuActions[action]();
            }
        });
    }


    /* ================================================================
       7. ПОВЕДІНКА (Behavior pattern) — data-behavior
          Один глобальний обробник на document.
          Елементи самі «декларують» свою поведінку через data-behavior.
    ================================================================ */

    document.addEventListener("click", function (event) {
        var behavior = event.target.dataset.behavior;
        if (!behavior) return;

        switch (behavior) {

            // Показати/сховати блок «Про Україну»
            case "toggle-info": {
                var infoText = document.getElementById("info-text");
                if (infoText) {
                    infoText.classList.toggle("hidden");
                }
                break;
            }

            // Скинути підсвічування списку маршрутів
            case "reset-list": {
                if (tourList) {
                    tourList.querySelectorAll("li").forEach(function (li) {
                        li.classList.remove("selected");
                    });
                }
                if (listInfo) {
                    listInfo.classList.add("hidden");
                    listInfo.textContent = "";
                }
                if (menuOutput) {
                    menuOutput.classList.add("hidden");
                }
                break;
            }

            // Показати/сховати контакти
            case "show-contacts": {
                var contacts = document.getElementById("contacts-text");
                if (contacts) {
                    contacts.classList.toggle("hidden");
                }
                break;
            }
        }
    });

});