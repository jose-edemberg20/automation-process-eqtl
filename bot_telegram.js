var urlApp = "https://script.google.com/macros/s/AKfycbzbxCxUluTcTsJQRlkcrEVJzl_nBZtbZKUr2kornJXR2Mkme7VW/exec";
var urlTelegram = "https://api.telegram.org/bot1006899109:AAGeaB1eBsAySFW7rpk0RPk6LqEIinFrs6Q";

function setWebhook(){
  let url = UrlFetchApp.fetch(urlTelegram + "/setWebhook?url=" + urlApp);
  console.log(url.getContentText());
}

function doGet(e){
  let arq = HtmlService.createHtmlOutput("Hello: " + JSON.stringify(e));
  return arq;  
}

function getSumExpense(resp){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const pn = ss.getSheetByName('dados');
  const rg = pn.getRange(2, 3, pn.getLastRow()-1, 2).getDisplayValues();
  const vl = rg.filter(arr => {
    return arr.includes(resp);
  })
  let sumExpense = 0;
  const expenses = vl.forEach(arr=>{
    sumExpense += Number(arr[1]);                        
  });

  return sumExpense;
}

function getContextMessage(msg,name){
  var response = '';
  let wordsContext = ['gasto','gastos','despesa','despesas','compra','compras','saldo'];
  let wordsMessage = msg.split(" ");
  let searchContext = wordsMessage.map(word => {
    return wordsContext.includes(word.toLowerCase());
  });
  let resultContext = searchContext.some(r => r);
  if(resultContext){
    let sumExpense = getSumExpense(name);
    response = "Seus gastos foram de R$ " + sumExpense;
  } else{
    response = 'Desculpe, não entendi o seu pedido';
  }
  return response;
}

function doPost(e){
  
  var response='';
  let contents = JSON.parse(e.postData.contents);
  let msg = contents.message.text;
  let name = contents.message.from.first_name;
  let cid = contents.message.chat.id;
  if(msg=='/start'){
    response = "Olá " + name + ", o que você quer saber?";
  } else{
    response = getContextMessage(msg,name);
  }
  
  UrlFetchApp.fetch(urlTelegram + "/sendMessage?chat_id=" + cid + "&text=" + response);
  //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Teste Notification', JSON.stringify(contents, null, 4));
  
}
