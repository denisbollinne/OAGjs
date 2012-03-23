start "window1" /min cmd.exe /c .\redis\redis-server.exe
start "window2" /min cmd.exe /c .\mongo\bin\mongod.exe --dbpath .\mongo\data\db --rest