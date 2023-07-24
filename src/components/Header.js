
//Para sacar el punto en la clase sub-text, podemos irnos a la web : https://symbl.cc/es/2022/  y buscamos bala y pillamos el codigo html 

const Header=({user, viewThreadsFeed, setViewThreadsFeed})=> {
  
    return (
      <header>
        <div className="info-container">
          <div className="user-info-container">
            <h1>{user.username}</h1>
            <p>{user.handle} <span className="threads-info">threads.net</span></p>
          </div>
          <div className="img-container">
            <img src={user.img} alt="profile avatar" />
          </div> 
        </div>

        <p>{user.bio}</p>
        <div className="sub-info-container">
          <p className="sub-text">{user.followers.length} Followers &#8226; <a href={user.link}>{user.link.replace("https://www.","")}</a></p>
        </div>

        <button className="primary" onClick={()=>navigator.clipboard.writeText('im a URL')}>Share profile</button>

        <div className="button-container">
          <button className={viewThreadsFeed ? "current" : null } onClick={()=>{setViewThreadsFeed(true)}}>Threads</button>
          <button className={!viewThreadsFeed ? "current" : null } onClick={()=>{setViewThreadsFeed(false)}}>Replies</button>
        </div>

          
      </header>
    
    );
  }
  
  export default Header;
  