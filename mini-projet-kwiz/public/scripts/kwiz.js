
var kwiz;

kwiz = {
    socket: 'undefined',
    content: 'undefined'
};

function Reponse(questionId,option,radioId){
    this.questionId=questionId;
    this.reponseChoisie=option;
    this.radioId = radioId;
}

var totalUsers=0;

//retrieve UI elements and start communication with the server
kwiz.start = function () {
    //retrieve the content
    //init communication
    kwiz.socket = io('http://localhost:8080');
    kwiz.socket.on('quiz', kwiz.createQuestionsUiFromData);

    kwiz.content = document.getElementById('content');
    var pseudo = prompt('Votre pseudo ?') || 'Utilisateur';

    //---demander et  afficher le pseudo
    kwiz.socket.on('demandePseudo', function () {
        document.getElementById('pseudo').innerHTML = 'pseudo : ' + pseudo;
    });

    //---afficher le nombre de clients connectés
    kwiz.socket.on('totalUsers', function (data) {
        let html='';
        html += 'Nombre de joueurs : ' + data.count;
        document.getElementById('users').innerHTML =html;
        totalUsers = data.count;
    });


    kwiz.socket.on('listeclients', function(clients) {     //--------------------------------------afficher le tableau de clients connectés
        let tableclients = document.getElementById('tableclients');
        //---pour eviter que les pseudos soient en double ou reste(lors de la deconnexion par exemple)
        while (tableclients.firstChild){
            tableclients.removeChild(tableclients.firstChild);
        }

        clients.liste.forEach(function(pseudo){
            let line = document.createElement('tr');
            tableclients.appendChild(line);
            let colPseudo = document.createElement('td');
            colPseudo.innerHTML = pseudo;
            let colScore = document.createElement('td');
            colScore.innerHTML = '0';
            line.appendChild(colPseudo);
            line.appendChild(colScore);
            document.getElementById('radio_0_0').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_0_1').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_0_2').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_1_0').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_1_1').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_1_2').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_2_0').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_2_1').innerHTML= '0 / ' +totalUsers ;
            document.getElementById('radio_2_2').innerHTML= '0 / ' +totalUsers ;
        });
    });

    kwiz.socket.emit('nouveauClient',pseudo);

    //----------------------------------------------------counters for question 1
    kwiz.socket.on('handlingQuestion_1', function (counter) {

       document.getElementById('radio_0_0').innerHTML = counter.compteurQ1.counterRadio1+' / ' +totalUsers ;
       document.getElementById('radio_0_1').innerHTML = counter.compteurQ1.counterRadio2+' / ' +totalUsers ;
       document.getElementById('radio_0_2').innerHTML = counter.compteurQ1.counterRadio3+' / ' +totalUsers ;

        let somme = counter.compteurQ1.counterRadio1+ counter.compteurQ1.counterRadio2+counter.compteurQ1.counterRadio3;

        if(totalUsers=== (somme)){
            //---set colors to radio buttons
            document.getElementById('label_q1_0').style.color ="red";
            document.getElementById('label_q1_1').style.color ="green";
            document.getElementById('label_q1_2').style.color ="red";
            //disable radio buttons
            document.getElementById('radio_q1_0').disabled=true;
            document.getElementById('radio_q1_1').disabled=true;
            document.getElementById('radio_q1_2').disabled=true;

        }
    });

    //----------------------------------------------------counters for question 2
    kwiz.socket.on('handlingQuestion_2', function (counter) {

        document.getElementById('radio_1_0').innerHTML=counter.compteurQ2.counterRadio1+' / ' +totalUsers ;
        document.getElementById('radio_1_1').innerHTML = counter.compteurQ2.counterRadio2+' / ' +totalUsers ;
        document.getElementById('radio_1_2').innerHTML = counter.compteurQ2.counterRadio3+' / ' +totalUsers ;

        let somme = counter.compteurQ2.counterRadio1+ counter.compteurQ2.counterRadio2+counter.compteurQ2.counterRadio3;

        if(totalUsers=== (somme)){
            //---set colors to radio buttons
            document.getElementById('label_q2_0').style.color ="green";
            document.getElementById('label_q2_1').style.color ="red";
            document.getElementById('label_q2_2').style.color ="red";
            //disable radio buttons
            document.getElementById('radio_q2_0').disabled=true;
            document.getElementById('radio_q2_1').disabled=true;
            document.getElementById('radio_q2_2').disabled=true;

        }
    });


    //----------------------------------------------------counters for question 3
    kwiz.socket.on('handlingQuestion_3', function (counter) {

        document.getElementById('radio_2_0').innerHTML= counter.compteurQ3.counterRadio1+' / ' +totalUsers ;
        document.getElementById('radio_2_1').innerHTML = counter.compteurQ3.counterRadio2+' / ' +totalUsers ;
        document.getElementById('radio_2_2').innerHTML = counter.compteurQ3.counterRadio3+' / ' +totalUsers ;

        let somme = counter.compteurQ3.counterRadio1+ counter.compteurQ3.counterRadio2+counter.compteurQ3.counterRadio3;

        if(totalUsers=== (somme)){
            //---set colors to radio buttons
            document.getElementById('label_q3_0').style.color ="red";
            document.getElementById('label_q3_1').style.color ="green";
            document.getElementById('label_q3_2').style.color ="red";
            //disable radio buttons
            document.getElementById('radio_q3_0').disabled=true;
            document.getElementById('radio_q3_1').disabled=true;
            document.getElementById('radio_q3_2').disabled=true;

        }
    });
} //---start


//use a description object to create the UI
kwiz.createQuestionsUiFromData = function (data) {

    //remove existing components if any in the content
    while (kwiz.content.firstChild) {
        kwiz.content.removeChild(kwiz.content.firstChild);
    }

    //extract some content from the data
    var quiz = data.quiz; //quiz is an array of questions
    var nbQuestions = quiz.length;

    //variables declaration

    //variables in the loop
    var question, questionId, title, answer, options;
    var p_title, questionDiv, radioDiv;

    //variables in the nested loop
    var nbOptions;
    var option, label, labelID, radio, radioID, br, span, p_answersID;

    var counterSpan;

    function Reponse(){
        this.questionId="";
        this.option ="";
        this.radioId="";
    };
    for (let questionIdx = 0; questionIdx < nbQuestions; questionIdx++) {
        //extract content from the question
        question = quiz[questionIdx];
        questionId = question.id;
        title = question.question;
        answer = question.answer;
        options = question.options;
        nbOptions = options.length;

        //create the content div
        questionDiv = document.createElement('div');
        questionDiv.setAttribute('class', 'question-block row');
        questionDiv.setAttribute('id', questionId);

        //create a paragraph to display the question
        p_title = document.createElement('p');
        p_title.setAttribute('class', 'question');
        p_title.innerHTML = title;

        //create a div that will be a radio button (BootStrap) content
        radioDiv = document.createElement("div");
        radioDiv.setAttribute("class", "options radio");

        //iterate over each options to create the radio buttons and labels
        for (let optionID = 0; optionID < nbOptions; optionID++) {

            //get the option text
            option = options[optionID];

            //create a label and radio button for each option
            labelID = 'label_' + questionId + '_' + optionID;
            radioID = 'radio_' + questionId + '_' + optionID;
            p_answersID = 'p_' + questionId + '_' + optionID;

            //-----------------------------------------------------------------------to display counters
            counterSpan=document.createElement('span');
            counterSpan.setAttribute("class","right_header");
            counterSpan.setAttribute('id', 'radio_'+questionIdx+'_'+optionID );
            counterSpan.innerHTML= '0' +' / ' +totalUsers ;
            //
            label = document.createElement('label');
            label.setAttribute("value", option);
            label.setAttribute('for', radioID);
            label.setAttribute('id', labelID);
            label.setAttribute('name', questionId);
            label.setAttribute('class', 'option');
            label.answer = answer;
            label.innerHTML = option;

            radio = document.createElement('input');
            radio.setAttribute("type", "radio");
            radio.setAttribute("value", option);
            radio.setAttribute("id", radioID);
            radio.setAttribute("name", questionId);
            radio.answer = answer;
            kwiz.createClickListener(radio);

            //add a br to change line
            br = document.createElement('br');

            //add the elements to the radio div
            radioDiv.appendChild(radio);
            radioDiv.appendChild(label);
            radioDiv.appendChild(counterSpan);
            radioDiv.appendChild(br);
        }

        //add the elements to the quesiton div and content
        questionDiv.appendChild(p_title);
        questionDiv.appendChild(radioDiv);
        kwiz.content.appendChild(questionDiv);
    }
}

kwiz.createClickListener = function (radio) {
    var questionId = radio.getAttribute('name');
    var option = radio.getAttribute('value');
    var radioId = radio.getAttribute('id'); //---------------------------------identifiant  de la radioButton

    var  rep = new Reponse(questionId,option, radioId);
    radio.onclick = function () {
        kwiz.socket.emit('handlingQuestions',{'laReponse': rep});
        console.log(questionId + " " + option+" "+radioId);
    }
}