"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ================================================================
       8а. MOUSEOVER / MOUSEOUT — події миші на картках пам'яток
           Один обробник на контейнері #landmarks-grid (делегування).
           event.target  — елемент, над яким зараз курсор.
           event.relatedTarget — елемент, з якого прийшов/куди пішов курсор.
    ================================================================ */

    var landmarksGrid = document.getElementById("landmarks-grid");
    var mouseLog      = document.getElementById("mouse-log");

    if (landmarksGrid) {

        // Допоміжна функція: знаходимо найближчий .landmark-card серед предків
        function getLandmarkCard(el) {
            while (el && el !== landmarksGrid) {
                if (el.classList && el.classList.contains("landmark-card")) {
                    return el;
                }
                el = el.parentElement;
            }
            return null;
        }

        // MOUSEOVER — спрацьовує коли курсор входить в елемент або будь-який його нащадок
        landmarksGrid.addEventListener("mouseover", function (event) {
            var card = getLandmarkCard(event.target); // куди зайшов курсор
            if (!card) return;

            // Змінюємо стиль — додаємо клас .hovered
            card.classList.add("hovered");

            // Виводимо дані event.target і event.relatedTarget у лог
            var fromName = event.relatedTarget
                ? (getLandmarkCard(event.relatedTarget)
                    ? getLandmarkCard(event.relatedTarget).dataset.name
                    : event.relatedTarget.tagName.toLowerCase())
                : "поза сторінкою";

            mouseLog.innerHTML =
                "<strong>" + card.dataset.name + "</strong> (" + card.dataset.city + ")" +
                "<br>📖 " + card.dataset.desc;
        });

        // MOUSEOUT — спрацьовує коли курсор виходить з елемента або його нащадка
        landmarksGrid.addEventListener("mouseout", function (event) {
            var card = getLandmarkCard(event.target); // звідки вийшов курсор
            if (!card) return;

            // Перевірка: якщо курсор перейшов до дочірнього елемента тієї ж картки —
            // НЕ прибираємо клас (це внутрішній перехід між нащадками)
            if (card.contains(event.relatedTarget)) return;

            // Прибираємо стиль
            card.classList.remove("hovered");

            var toName = event.relatedTarget
                ? (getLandmarkCard(event.relatedTarget)
                    ? getLandmarkCard(event.relatedTarget).dataset.name
                    : event.relatedTarget.tagName.toLowerCase())
                : "поза сторінкою";

            mouseLog.innerHTML =
                "<strong>" + card.dataset.name + "</strong>";
        });
    }


    /* ================================================================
       8б. ПЕРЕТЯГУВАННЯ — mousedown → mousemove → mouseup
           Перетягуємо картки турів зі стовпця «Доступні» у «Мій маршрут».

           Алгоритм:
           1. mousedown на картці → запам'ятовуємо елемент, створюємо клон-привид
           2. mousemove на document → переміщуємо клон за курсором
           3. mouseup на document → визначаємо, чи відпустили над зоною скидання,
              якщо так — переміщуємо оригінальний елемент у маршрут
    ================================================================ */

    var availableCol = document.getElementById("available-tours");
    var myRouteCol   = document.getElementById("my-route");
    var dragLogEl    = document.getElementById("drag-log");

    // Стан перетягування
    var dragState = {
        active:    false,  // чи відбувається перетягування зараз
        original:  null,   // оригінальний DOM-елемент
        clone:     null,   // клон, що слідує за курсором
        offsetX:   0,      // зсув курсора відносно лівого краю елемента
        offsetY:   0       // зсув курсора відносно верхнього краю елемента
    };

    // Допоміжна функція: додати рядок у лог перетягування
    function dragLog(msg) {
        if (!dragLogEl) return;
        var line = document.createElement("div");
        line.textContent = msg;
        dragLogEl.appendChild(line);
        dragLogEl.scrollTop = dragLogEl.scrollHeight;
    }

    // ── MOUSEDOWN ──────────────────────────────────────────────────
    // Обробник на контейнері доступних турів (делегування)
    if (availableCol) {
        availableCol.addEventListener("mousedown", function (event) {

            // Знаходимо найближчий .draggable-tour серед предків
            var card = event.target.closest(".draggable-tour");
            if (!card) return;

            // Запобігаємо виділенню тексту під час перетягування
            event.preventDefault();

            // Обчислюємо зсув: де саме всередині картки натиснули
            var rect = card.getBoundingClientRect();
            dragState.offsetX  = event.clientX - rect.left;
            dragState.offsetY  = event.clientY - rect.top;
            dragState.original = card;
            dragState.active   = true;

            // Позначаємо оригінал напівпрозорим
            card.classList.add("dragging");

            // Створюємо клон-привид, що буде летіти за курсором
            var clone = document.createElement("div");
            clone.className    = "drag-clone";
            clone.innerHTML    = card.innerHTML;
            clone.style.width  = rect.width + "px";
            clone.style.left   = (event.clientX - dragState.offsetX) + "px";
            clone.style.top    = (event.clientY - dragState.offsetY) + "px";
            document.body.appendChild(clone);
            dragState.clone = clone;

            dragLog("🖱️ Захоплено: «" + card.dataset.tour + "»");
        });
    }

    // ── MOUSEMOVE ──────────────────────────────────────────────────
    // Обробник на document — щоб не втрачати курсор при швидкому русі
    document.addEventListener("mousemove", function (event) {
        if (!dragState.active || !dragState.clone) return;

        // Переміщуємо клон за курсором, враховуючи початковий зсув
        dragState.clone.style.left = (event.clientX - dragState.offsetX) + "px";
        dragState.clone.style.top  = (event.clientY - dragState.offsetY) + "px";

        // Підсвічуємо зону скидання якщо курсор над нею
        if (myRouteCol) {
            var dropRect = myRouteCol.getBoundingClientRect();
            var over = event.clientX >= dropRect.left && event.clientX <= dropRect.right &&
                event.clientY >= dropRect.top  && event.clientY <= dropRect.bottom;
            myRouteCol.classList.toggle("drop-active", over);
        }
    });

    // ── MOUSEUP ────────────────────────────────────────────────────
    // Обробник на document — спрацьовує де б не відпустили кнопку
    document.addEventListener("mouseup", function (event) {
        if (!dragState.active) return;

        // Прибираємо клон зі сторінки
        if (dragState.clone) {
            document.body.removeChild(dragState.clone);
            dragState.clone = null;
        }

        // Прибираємо підсвічування зони скидання
        if (myRouteCol) {
            myRouteCol.classList.remove("drop-active");
        }

        // Знімаємо клас напівпрозорості з оригіналу
        if (dragState.original) {
            dragState.original.classList.remove("dragging");
        }

        // Визначаємо, чи відпустили мишу над зоною #my-route
        if (myRouteCol && dragState.original) {
            var dropRect = myRouteCol.getBoundingClientRect();
            var droppedInZone =
                event.clientX >= dropRect.left && event.clientX <= dropRect.right &&
                event.clientY >= dropRect.top  && event.clientY <= dropRect.bottom;

            if (droppedInZone) {
                // Прибираємо підказку «Перетягніть тур сюди» якщо є
                var hint = myRouteCol.querySelector(".planner__drop-hint");
                if (hint) hint.remove();

                // Переміщуємо оригінальний елемент у маршрут
                dragState.original.classList.add("in-route");
                myRouteCol.appendChild(dragState.original);

                dragLog("✅ «" + dragState.original.dataset.tour + "» додано до маршруту!");
            } else {
                dragLog("↩️ mouseup — скасовано (відпущено поза зоною маршруту)");
            }
        }

        // Скидаємо стан
        dragState.active   = false;
        dragState.original = null;
    });


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
            var action = event.target.dataset.action;
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