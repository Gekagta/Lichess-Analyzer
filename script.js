function GetMainButtonTitle() {
    const menu_button = document.querySelector("#main-wrap > main > div.analyse__controls.analyse-controls > button");
    if (menu_button) {
      const title = menu_button.getAttribute("title");
      return title;
    } else {
      return null;
    }
}
  
function Localize() {
    return new Promise((resolve) => {
        let title = null;
        const interval = setInterval(function () {
            try {
                title = GetMainButtonTitle();
                if (title !== null) {
                    clearInterval(interval);
                    resolve(title === 'Меню' ? 'ru' : 'en');
                }
            } catch (error) {
                
            }
        }, 800);
    });
}
  
function AddAnalyzeButton(Lang) {
    const Features = document.querySelector("#main-wrap > main > div.analyse__controls.analyse-controls > div.features");
    if (Features) {
      const Text = Lang === 'ru' ? 'Анализировать' : 'Analyze';
      const AnalyzeButton = document.createElement("button");
      AnalyzeButton.classList.add("fbt", "active");
      AnalyzeButton.setAttribute("title", Text);
      AnalyzeButton.setAttribute("data-act", "none");
      AnalyzeButton.setAttribute("data-icon", "A");
      Features.insertBefore(AnalyzeButton, Features.firstChild);
      AnalyzeButton.addEventListener("click", function () {
        Analyze(Lang);
      });
      return true;
    } else {
      console.error('Cant find features div!');
      return false;
    }
}
function GetNickname(){
    const UserTag = document.querySelector("#user_tag");
    if (UserTag) {
        return UserTag.textContent;
    } else {
        return ''
    }
}
function GetSide(PGN){
    const Nickname = GetNickname()
    const WhitePlayer = PGN.match(/\[White\s+"([^"]+)"\]/)[1];
    const BlackPlayer = PGN.match(/\[Black\s+"([^"]+)"\]/)[1];
    if(Nickname === WhitePlayer){
        return 'white'
    }else if (Nickname == BlackPlayer){
        return 'black'
    }else{
        return 'none'
    }
}
function Analyze(Lang) {
    const PGN = document.querySelector("#main-wrap > main > div.analyse__underboard > div.analyse__underboard__panels > div.fen-pgn > div.pgn");
    if (PGN) {
      const PGNText = PGN.innerHTML;
      const Side = GetSide(PGNText);
      chrome.runtime.sendMessage({ action: 'Analyze', PGN: PGNText, Side: Side, Lang: Lang });
    } else {
      console.error('PGN not found!');
    }
}
async function ALocalize() {
    const Lang = await Localize();
    return Lang; 
}


async function Main() {  
    const Lang = await ALocalize();  
    if (!AddAnalyzeButton(Lang)) {
        return;
    }
}


window.onload = function () {
    Main();
}
  