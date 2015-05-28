﻿#pragma strict
import System.IO;
import System.Xml;
var pos: Vector3;
var isReplayed : boolean = false;
var rot : Quaternion;
var canvasScript : initCanvas;
var userName : String;
var interFaceScript : DeleteInterface;
var noOfAttempts : int=0;
var prefabButton : GameObject;
var interFace: GameObject;
var newInterFace : GameObject;
var newButtonText : UI.Text;
var newButton : UI.Button;
var questions : Array;
var questionBox : UI.Text;
var textComponents : Component[];
var buttons : Component[];
var checkBoxes : Component[];
var clickedButton:int;
var noOfCorrectAns:int;
var result: UI.Text;
var isSubmitted : boolean;
var trueBox : UI.Toggle;
var falseBox : UI.Toggle;
var lastButton: UI.Button;
var submitButton : UI.Button;
var offsetButton : int;
var falseAnswers : Array;
var trueAnswers : Array;
var correctAnswers : Array;
var names : Array;
var scores : Array;
var changedAuto : boolean;
function readXML(filepath : String, result : Array, tagName : String){
    var xmlDoc : XmlDocument = new XmlDocument();
    if(File.Exists (filepath))
    { 	
    	var x : XmlNodeList;
        xmlDoc.Load( filepath );
        x = xmlDoc.GetElementsByTagName(tagName);
		for (var i=0;i<x.Count;i++)
  		{ 
  			result.push(x.Item(i).InnerText);
  		}
	}
}
function Start () {
	var sr : StreamReader;
	var line : String;
	var i : int;
	clickedButton=1;
	questions = new Array();
	correctAnswers = new Array();
	readXML("Assets/questions.xml", questions, "Question");
	readXML("Assets/questions.xml", correctAnswers, "Answer");
	for(i=0;i<correctAnswers.length;i++){
		if(correctAnswers[i]=="1"){
			correctAnswers[i] = true;
		}
		else{
			correctAnswers[i] = false;
		}
	}
	var xMin = -515;
	var xMax = 207;
	var y = 300;
	offsetButton = 1;
	noOfCorrectAns=0;
	changedAuto = false;
	
	falseAnswers=new Array();
	trueAnswers=new Array();
	for(i=0;i<questions.length;i++){
		falseAnswers.push(false);
		trueAnswers.push(false);
	}
	//correctAnswers = [true, true, false, false];
	//clickedButton = 1;
	changedAuto=true;
	if(!isReplayed){
	//questions = ["1", "2", "3", "Is Unity a game engine?", "Is Java a secure language?", "C is an object oriented language?", "MySQL is hierarchial based query language?"];
		canvasScript = GetComponentInParent(initCanvas);
		userName = canvasScript.userName;
		var buttonWidth = (xMax-xMin)/questions.length;
		for(i=0;i<questions.length;i++){
			pos = Vector3((buttonWidth/2)+i*buttonWidth,y,0);
			rot =  Quaternion.identity;
			newButton = Instantiate(prefabButton, pos, rot).GetComponent(UI.Button);
			newButton.transform.parent = gameObject.transform;
			var newRect = newButton.GetComponent(RectTransform);
			newRect.sizeDelta = new Vector2(buttonWidth, 30);
			newButton.name = ""+(i+1);
			newButtonText=newButton.GetComponentInChildren(UI.Text);
			newButtonText.text=""+(i+1);
		}
	}
	if(isSubmitted==true || noOfAttempts==0){
		pos = Vector3(525, 136, 0);
		rot = Quaternion.identity;
		newInterFace = Instantiate(interFace, pos, rot);
		newInterFace.transform.parent = gameObject.transform;
	}
	textComponents = GetComponentsInChildren(UI.Text);
	questionBox=textComponents[3+questions.length];
	questionBox.text="Q"+clickedButton+" : "+questions[clickedButton-1];
	result=textComponents[0];
	checkBoxes = GetComponentsInChildren(UI.Toggle);
	trueBox = checkBoxes[0].GetComponent(UI.Toggle);
	falseBox = checkBoxes[1].GetComponent(UI.Toggle);
	trueBox.isOn=false;
	falseBox.isOn=false;
	changedAuto=false;
	isSubmitted = false;
	buttons = GetComponentsInChildren(UI.Button);
	buttons[1+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;	
	submitButton = buttons[0].GetComponent(UI.Button);
	interFaceScript = newInterFace.GetComponent(DeleteInterface);
	if(!isReplayed){
		submitButton.onClick.AddListener(
			function(){
				interFaceScript.deleteObject();
			}
		);
	}
}
function setQuestion(questionNo : int){
	questionBox.text="Q"+questionNo+" : "+questions[questionNo-1];
	clickedButton=questionNo;
}
function changeQuestion(changeAmount : int){
	if(clickedButton+changeAmount>questions.length || clickedButton+changeAmount<=0){
		return;
	}
	clickedButton+=changeAmount;
	questionBox.text="Q"+clickedButton+" : "+questions[clickedButton-1];
}
function submit(){
	noOfAttempts++;
	isSubmitted=true;
	for(var buttonComponent:Component in buttons){
		lastButton=buttonComponent.GetComponent(UI.Button);
		lastButton.colors.normalColor=Color.grey;
		lastButton.colors.highlightedColor=Color.grey;
	}
	var replayButton = buttons[1].GetComponent(UI.Button);
	replayButton.colors.normalColor=Color.white;
	replayButton.colors.pressedColor=Color.cyan;
	for(var i=0;i<questions.length;i++){
		if((correctAnswers[i] && trueAnswers[i]) || (!correctAnswers[i] && falseAnswers[i])){
			noOfCorrectAns+=1;
		}
	}
	names = new Array();
	scores = new Array();
	readXML("Assets/scores.xml", names, "Name");
	readXML("Assets/scores.xml", scores, "Score");
	if(names.length<=2){
		i=0;
	}
	else{
		i = names.length-3;
	}
	result.text = "Recent Scores\n\n";
	for(;i<names.length;i++){
			result.text = result.text + names[i] + " : " + scores[i] + "\n";
	}
	var xmlDoc : XmlDocument = new XmlDocument();
	xmlDoc.Load("Assets/scores.xml");
	var elemRoot : XmlElement = xmlDoc.DocumentElement;
	var itemAttempt : XmlElement = xmlDoc.CreateElement("Attempt");
	elemRoot.AppendChild(itemAttempt);
	var itemName : XmlElement = xmlDoc.CreateElement("Name");
	itemAttempt.AppendChild(itemName);
	var itemScore : XmlElement = xmlDoc.CreateElement("Score");
	itemAttempt.AppendChild(itemScore);
	itemName.InnerText = userName;
	itemScore.InnerText = ""+noOfCorrectAns;
	xmlDoc.Save("Assets/scores.xml");
	result.text = result.text + "\nHi! "+userName+", Your score is "+noOfCorrectAns;
	submitButton.colors.normalColor=Color.magenta;
	submitButton.colors.highlightedColor=Color.magenta;
}
function replay(){
	isReplayed = true;
	if(!isSubmitted)
		noOfAttempts++;
	buttons=GetComponentsInChildren(UI.Button);
	for(var buttonComponent:Component in buttons){
		lastButton=buttonComponent.GetComponent(UI.Button);
		lastButton.colors.normalColor=Color.white;
		lastButton.colors.highlightedColor=Color.white;
	}
	noOfCorrectAns=0;
	result.text="";
	submitButton.colors.normalColor=Color.white;
	submitButton.colors.highlightedColor=Color.white;
	Start();
}
function changeUI(questionNumber : int){
	if(isSubmitted){
		return;
	}
	changedAuto=true;
	lastButton=buttons[offsetButton + clickedButton].GetComponent(UI.Button);
	lastButton.colors.normalColor=Color.grey;
	if(questionNumber>=1){
		setQuestion(questionNumber);
	}
	else{
		var changeAmount;
		if(questionNumber==0){
			changeAmount=1;
		}
		else{
			changeAmount=-1;
		}
		changeQuestion(changeAmount);
	}
	buttons[clickedButton+offsetButton].GetComponent(UI.Button).colors.normalColor=Color.cyan;
	buttons[clickedButton+offsetButton].GetComponent(UI.Button).colors.highlightedColor=Color.cyan;
	if(trueAnswers[clickedButton-1]){
		trueBox.isOn=true;
		falseBox.isOn=false;
	}
	else if(falseAnswers[clickedButton-1]){
		falseBox.isOn=true;
		trueBox.isOn=false;
	}
	else{
		trueBox.isOn=false;
		falseBox.isOn=false;
	}
	changedAuto=false;
	
}
function toggleTrue(){
	if(changedAuto){
		return;
	}
	trueAnswers[clickedButton-1]=(!trueAnswers[clickedButton-1]);
	changedAuto=true;
	if(falseBox.isOn){
		falseBox.isOn=false;
		falseAnswers[clickedButton-1]=false;
	}
	changedAuto=false;
}
function toggleFalse(){
	if(changedAuto){
		return;
	}
	changedAuto=true;
	falseAnswers[clickedButton-1]=(!falseAnswers[clickedButton-1]);
	if(trueBox.isOn){
		trueBox.isOn=false;
		trueAnswers[clickedButton-1]=false;
	}
	changedAuto=false;
}
function Update () {

}