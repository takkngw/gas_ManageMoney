function doPost(e) {
   var params = JSON.parse(e.postData.getDataAsString()); // POSTされたデータを取得

  // テスト用
  // const json = '{"mydata": {"month":12, "day":25, "payments":"支出", "content":"お菓子", "balance":567, "place":"みんなの銀行"}}';
  // const params = JSON.parse(json);


  var Month = params.mydata.month;  // ショートカットで指定したPOSTデータを取得，ショートカットアプリでは"value"として設定
  var Day = params.mydata.day;
  var Payments = params.mydata.payments;
  var Content = params.mydata.content;
  var Balance = params.mydata.balance;
  var Place = params.mydata.place;
  var result = {};
     
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  addPlace( JSON.stringify(Place), JSON.stringify(Payments), JSON.stringify(Month), JSON.stringify(Day), JSON.stringify(Content), JSON.stringify(Balance));
}

function addPlace(bank, text, month, day, content, balance) {
  var spreadsheetId = "YOUR-SPREADSHEET-ID"; // スプレッドシートID
  var sheetName = "YOUR-SPREADSHEET-NAME"; // スプレッドシート名
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);


  //ここにどの口座から/へなのかを判断するプログラム
  var accountnum = 30; // スプレッドシートにある口座行
  for(i = 1; i <= accountnum; i++) {
    spbank = '"' + sheet.getRange(1, i).getValue() + '"';
    if (spbank == bank) {
      var account = sheet.getRange(1 ,i);
      break;
    }
  }

  //収入，支出のどちらか判断するプログラム
  for (j = i; j <= i + 1; j++) {
    sptext = '"' + sheet.getRange(2, j).getValue() + '"';
    console.log(j, sptext, text)
    if (sptext == text) {
      account = sheet.getRange(2, j);
      break;
    }
  }

  //月を確定する
  i = 1;
  while(sheet.getRange(i, 1).getValue() != String(month)) {
     i++;
  }
  //日を確定する
  for(k = i; k <= i + 31; k++){
    if (sheet.getRange(k, 2).getValue() == String(day)) {
      account = sheet.getRange(k, j);
      break;
    }
  }

  //項目を追加
  var nowcontent = sheet.getRange(k, 4).getValue() + content;
  sheet.getRange(k, 4).setValue(nowcontent);

  //金額を追加
  var nowbalance = "=" + sheet.getRange(k, j).getValue() + "+" + balance
  sheet.getRange(k, j).setValue(nowbalance);
}