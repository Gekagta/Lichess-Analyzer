chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "Analyze") {
      chrome.tabs.create({ url: "https://arslanovchess.com/game-analysis" }, function (tab) {
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === tab.id && changeInfo.status === 'complete') {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: function (PGN, Side, Lang) {
                const interval = setInterval(function () {
                    try {
                        const PGNTextarea = document.querySelector("#__nuxt > div.general-wrapper > div.fix > div > div.board > div.side > textarea");
                        if (PGNTextarea) {
                            PGNTextarea.value = PGN;
                            PGNTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                            document.querySelector("#__nuxt > div.general-wrapper > div.fix > div > div.board > div.side > button").click();
                            if (Side == 'white'){
                                document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.confirmButton.swal2-styled").click()
                            }else if (Side == 'black'){
                                document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-deny.denyButton.swal2-styled").click()
                            }else{
                                if (Lang == 'ru'){
                                    document.querySelector("#swal2-title").textContent += ' | Так как ваш ник не был найден в партии, вы должны выбрать сторону сами'
                                }else{
                                    document.querySelector("#swal2-title").textContent += ' | Since your nickname was not found in the game, you have to pick a side yourself'
                                }
                            }
                            clearInterval(interval)
                        } else {
                            console.error('Textarea for PGN not found!');
                        }
                    }catch{

                    }
                    PGNTextarea.value = '123'
                }, 800); 
                
              },
              args: [message.PGN, message.Side, message.Lang]
            });
            chrome.tabs.onUpdated.removeListener(listener); 
          }
        });
      });
    }
  });
  