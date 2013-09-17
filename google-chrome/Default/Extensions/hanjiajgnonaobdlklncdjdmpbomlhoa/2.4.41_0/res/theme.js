function saveTheme()
{
  localStorage['themed']=style.value;
  //chrome.tabs.executeScript(null,{code:"if(window.MS&&window.updateTheme)updateTheme()"});
  alert('Настройки сохранены.')
}
function clearTheme()
{
  style.value='';
  saveTheme();
}

function onload()
{
	if(!document.body)return setTimeout(onload,100);

	style.value=(localStorage['themed']?localStorage['themed']:'');
	if(location.hash=='#update'){
	  update.style.display='block';
	  uplink.innerText=localStorage['theme'];
	  uplink.href=localStorage['theme'];
	  localStorage['theme']='';
	}

	btSaveTheme.onclick=saveTheme;
	btClearTheme.onclick=ClearTheme;
}
onload();
