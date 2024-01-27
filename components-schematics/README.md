# Tricky Parts

On `projects/components/package.json` you'll find a tricky way to copy a folder structure using
windows powershell.

I strongly recommend that you set npm to use git for windows bash to run [the scripts](https://stackoverflow.com/a/46006249/6433166):

`npm config set script-shell "C:\\Program Files\\git\\bin\\bash.exe"`

But if you insist to use Powershell... good luck. Try the below alternative cmdlets and remember
checking Angular documentation as they may come up with better ways of doing it (ROBOCOPY?)

### `cp --parents schematics/*/schema.json ../../dist/components/"`

Basically, when in linux you'd do `cp --parents schematics/*/schema.json ../../dist/components/"`,
on Windows you need to do:

```
Get-ChildItem .\schematics\*\schema.json |  foreach {

  ## Remove the original  root folder

  $split = $_.Fullname  -split '\\'

  $DestFile =  $split[($split.Length - 2)..($split.Length - 1)] -join '\' 

  ## Build the new  destination file path

  $DestFile =  "..\..\dist\components\$DestFile"

  ## Copy-Item won't  create the folder structure so we have to 

  ## create a blank file  and then overwrite it

  $null = New-Item -Path  $DestFile -Type File -Force

  Copy-Item -Path  $_.FullName -Destination $DestFile -Force
}
```

But you can right it in a single line command separating the commands by semi-colons:

```
Get-ChildItem .\schematics\*\schema.json |  foreach { $split = $_.Fullname  -split '\\'; $DestFile =  $split[($split.Length - 2)..($split.Length - 1)] -join '\' ; $DestFile =  "..\..\dist\components\$DestFile";$null = New-Item -Path  $DestFile -Type File -Force;Copy-Item -Path  $_.FullName -Destination $DestFile -Force}
```

### `// "copy:files": "cp --parents -p schematics/*/files/** ../../dist/components/",`

In a similar way the equivalent command to copy some files keeping the folder structure _and the timestamps_
in windows is:

```
Get-ChildItem .\schematics\*\ -Recurse schema.json |  foreach {

  ## Remove the original  root folder

  $split = $_.Fullname  -split '\\'

  $DestFile =  $split[($split.Length - 3)..($split.Length - 1)] -join '\' 

  ## Build the new  destination file path

  $DestFile =  "..\..\dist\components\$DestFile"

  ## Copy-Item won't  create the folder structure so we have to 

  ## create a blank file  and then overwrite it

  $null = New-Item -Path  $DestFile -Type File -Force

  Copy-Item -Path  $_.FullName -Destination $DestFile -Force
  
  ## Keep the date and time of the original files
  
  $origLastWriteTime = (Get-ChildItem $_.Fullname).LastWriteTime
  (Get-ChildItem $DestFile).LastWriteTime = $origLastWriteTime
}
```

Which you can also write in a single line command by separating the commands with semi-colons:

```
Get-ChildItem .\schematics\*\files\* | foreach { $split = $_.Fullname  -split '\\'; $DestFile =  $split[($split.Length - 2)..($split.Length - 1)] -join '\' ; $DestFile =  "..\..\dist\components\$DestFile";$null = New-Item -Path  $DestFile -Type File -Force;Copy-Item -Path  $_.FullName -Destination $DestFile -Force;$origLastWriteTime = (Get-ChildItem $_.Fullname).LastWriteTime;(Get-ChildItem $DestFile).LastWriteTime = $origLastWriteTime}
```
