﻿#pragma strict
var cancelButton : UI.Button;
var toggles : Component[];
function Start () {
	cancelButton.onClick.AddListener(
		function(){
			toggles = GameObject.Find("MainPanel").GetComponentsInChildren(UI.Toggle);
			if(toggles.Length>2){
				Destroy(gameObject);
			}
		}
	);
}

function Update () {

}