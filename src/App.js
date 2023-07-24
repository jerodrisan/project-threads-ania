
/*Para crear el json server , nos vamos a la web https://www.npmjs.com/package/json-server para ver las instrucciones :
  1. npm i json-server
  2. ver getting starter para saber como empezar a usarlo
  3. Start JSON Server : npx json-server --watch db.json
  4. para generar users ids (uuid) en el json : https://www.uuidgenerator.net/

*/
import { useState, useEffect } from 'react';
import Nav from  './components/Nav';
import Header from './components/Header';
import Feed from './components/Feed';
import PopUp from './components/PopUp';
import WriteIcon from './components/WriteIcon';

function App() {

  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState(null)
  const [viewThreadsFeed, setViewThreadsFeed] = useState(true)
  const [filteredThreads, setFilteredThreads] = useState(null)
  const [openPopUp, setOpenPopUp] = useState(false)
  const [interactingThread, setInteractingThread] = useState(null)
  const [popUpFeedThreads, setPopUpFeedThreads] = useState(null)
  const [text, setText] = useState("")
  const userId = "1d2f1a20-4f8f-4fc8-a2af-196371e3a0b9"
  
  const getUser = async () =>{     
    try{
      //devuelve array con el unico elemento de ese userId
      const response = await fetch(`http://localhost:3000/users?user_uuid=${userId}`) 
      const data = await response.json() 
      setUser(data[0])
    }catch(error){
      console.log(error)
    }
  }

  const getThreads = async () =>{
    try{
        const response = await fetch(`http://localhost:3000/threads?thread_from=${userId}`)
        const data = await response.json()
        setThreads(data)
    }catch(error){
      console.log(error)
    }
  }

  const getThreadsFeed = () =>{     
    if(viewThreadsFeed){  // if(threads))  - > threads?.filter  
      const standAloneThreads = threads?.filter(thread => thread.reply_to === null) 
      setFilteredThreads(standAloneThreads)
    }
    if(!viewThreadsFeed){
      const replyThreads = threads?.filter(thread => thread.reply_to !== null)
      setFilteredThreads(replyThreads)
    }
  }

  const getReplies = async () =>{
    try{
      const response = await fetch(`http://localhost:3000/threads?reply_to=${interactingThread?.id}`)
      const data = await response.json()
      setPopUpFeedThreads(data)

    }catch(error){
      console.error(error)
    }   
  }

  const postThread = async () =>{
    const thread ={      
      "timestamp": new Date(),
      "thread_from": user.user_uuid,
      "thread_to": user.user_uuid ||null,  //replicaremos como prueba a nosotros mismos (se puede cambiar mas adelante)
      "reply_to":  interactingThread?.id ||null,
      "text": text ,
      "likes": []
     } 
    try{

      const response = await fetch("http://localhost:3000/threads", {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(thread)
      })
      const result = await response.json()
      console.log("result", result)
      getThreads()
      getReplies()
      setText("")

    }catch(error){
      console.error(error)
    }    
  }


  useEffect(()=>{
    getReplies()

  },[interactingThread])

  useEffect(()=>{
    getUser()
    getThreads()
  },[])

  //ojo getThreadsFeed se ejecuta antes que getUser y getThreads ya que estas son funciones asincronas
  useEffect(()=>{
    getThreadsFeed()
  },[user, threads, viewThreadsFeed])

  //console.log('popUpFeedThreads',popUpFeedThreads)  


  const handleClick =() =>{
    setPopUpFeedThreads(null)
    setInteractingThread(null)
    setOpenPopUp(true)
  }


  
  return (
    <>
     {user && <div className="app">
        <Nav url = {user.instagram_url} />
        <Header user={user}  viewThreadsFeed = {viewThreadsFeed} setViewThreadsFeed={setViewThreadsFeed}/>      
        <Feed user={user} filteredThreads={filteredThreads} setOpenPopUp={setOpenPopUp} getThreads={getThreads} setInteractingThread={setInteractingThread}/>
        {openPopUp && <PopUp user={user} setOpenPopUp={setOpenPopUp} popUpFeedThreads={popUpFeedThreads}  text={text} setText={setText} postThread={postThread}/>}
        <div onClick={handleClick}>
          <WriteIcon />
        </div>
      </div>}
     

    </>   
  );
}

export default App;
