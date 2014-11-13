var log4js=require("log4js");


log4js.configure({
  appenders: [
    { type: 'console' },
    {
      type: 'dateFile', 
      filename: './logs/info/log', 
      pattern:"-yyyy-MM-dd.log",
      alwaysIncludePattern:true,
      maxLogSize: 1024,
      backups:4,
      category: 'info' 
    },
     {
      type: 'dateFile', 
      filename: './logs/err/log', 
      pattern:"-yyyy-MM-dd.log",
      alwaysIncludePattern:true,
      maxLogSize: 1024,
      backups:4,
      category: 'err' 
    }
  ],
  replaceConsole: true
});

module.exports=log4js;