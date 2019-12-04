# Документация anarchovk

Добро пожаловать! Это документация anarchovk.
Она поможет вам быстро разобраться с модулем.

  
## Для чего был создан anarchovk?
Я сам не знаю. Чтобы доказать что-нибудь всему миру.

  
## Установка anarchovk


Здесь все просто.

**На Python:**

    pip install anarchovk

**На Node.js:**

    npm install anarchovk

  
## Гайд по использованию


> I am Gunnery Sergeant Hartman, your Senior Drill Instructor. From now on, you will speak only when spoken to, and the first and last words out of your filthy sewers will be "Sir!" Do you maggots understand that?
> -- Сержант Хартман

**АЛЕРТ! Если вы никогда не работали с VK Api, мне вас искренне жаль. Покиньте эту страницу.**

По канону у нас есть три функции: 

 - method(токен, название_метода, параметры_метода)  
 - userLongPoll(токен, *колбэк*)
 - groupLongPoll(токен, id_группы, *колбэк*)

И сразу же маленькое FAQ:
[Что такое метод?](https://vk.com/dev/methods)
[Что такое  Bots Long Poll API?](https://vk.com/dev/bots_longpoll) 
[Что такое  User Long Poll API?](https://vk.com/dev/using_longpoll) 
[Почему функция называется groupLongPoll, а не botsLongPoll? ](http://lurkmore.to/%D0%98%D0%B1%D0%BE_%D0%BD%D0%B5%D1%85%D1%83%D0%B9)

Функция method(), как ни странно, вызывает метод.

С LongPoll все немного посложнее. В качестве аргумента *"колбэк"* вы должны использовать название функции, которая будет выполняться каждый раз, когда происходит новое событие.

У всех функций есть необязательные аргументы, если вам надо уточнить версию или какие-либо другие параметры.

Ну и самое главное, если у вас будет ошибка, **anarchovk на вас заорет**. 

  
## Примеры для дебилов


### Как использовать LongPoll

**Python:**

    import anarchovk as vk
    
    
    def WhatIWantToDoWithResponses(response):
        # Здесь можно делать все с полученным ответом
        print(response)
    
              
    vk.groupLongPoll("мой_токен", id_группы, WhatIWantToDoWithResponses)

**Node.js:**

    const vk = require("anarchovk");


    vk.groupLongPoll("мой_токен", id_группы, function (response){
      // Здесь можно делать все с полученным ответом
      console.log(response)
    });

В случае с userLongPoll то же самое, только без id группы в качестве аргумента. Смотрите **гайд по использованию**.

### Как написать [сообщение](https://vk.com/dev/messages.send)

**Python:**

    import anarchovk
    import random
    
    
    vk.method("мой_токен", "messages.send", {"peer_id": id_пользователя, "message": "Ваше сообщение", random_id: random.randint(0, 2147483647)})

**Node.js:** 


    const vk = require("anarchovk");


    vk.method("мой_токен", "messages.send", {"peer_id": id_пользователя, "message": "Ваше сообщение", "random_id": Math.floor(Math.random() * (9007199254740991 - 1) + 1)})

<br><br><br>
***To be continued.***
