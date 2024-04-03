import { editor } from "$sb/syscalls.ts";

export async function getSelectedText() {
  const selectedRange = await syscall("editor.getSelection");
  console.log("selectedRange:", selectedRange);
  const pageText = await syscall("editor.getText");
  return pageText.slice(selectedRange.from, selectedRange.to);
}
export async function scriptureRef() {
  const popText = await getSelectedText();
  const npopText = await getScripture(popText);
  await editor.flashNotification(npopText);
}

export async function getScripture(thisScriptureRef) {
  if (!thisScriptureRef){ thisScriptureRef = 'John 3:16';}
  console.log('this scripture => '+thisScriptureRef);
   const fscripture=thisScriptureRef.split(' ');
   const book = fscripture[0];
   const chapter = fscripture[1].split(':')[0];
   const verses = fscripture[1].split(':')[1];
   const jsonString = '"book":"'+book+'","chapter":"'+chapter+'","verse":"'+verses+'","version":"nlt"';
   //const scriptureURL = 'https://jsonBible.com/search/verses.php?json={'+jsonString+'}';
   const scriptureURL = 'https://api.nlt.to/api/passages?ref=john.3.16&key=911881c1-2531-40bb-b382-1202ca9312f2';
   console.log('url=> '+scriptureURL);
   const response = await nativeFetch(scriptureURL, {
     headers: {
       "Content-type": "application/json",
       "Accept":"application/json",
     },
     mode: 'no-cors',
   });

  // if (response.status < 200 || response.status >= 300) {
    // Handle HTTP error here
  //  throw new Error(await response.text());
 // };
   const data = await response.json();
   //const retjson = JSON.parse(retvar);
   console.log('data = '+data);
   await editor.flashNotification(data.text);
   return data.text+' _'+data.book+' '+data.chapter+':'+data.verses+' ('+data.version+')_';

}

export async function randomUser() {
  const result = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (result.status < 200 || result.status >= 300) {
    // Handle HTTP error here
    throw new Error(await result.text());
  }
  const data = await result.json();

  await editor.flashNotification(data["name"]);
}
