export default function Chat()
{
    return (
        <>
            <div id="body"> 
                <div className="chat-box">
                    <div className="chat-box-header">
                        <span>ChatWave</span>
                        <div className="logout-btn-container">
                            <a href="/logout">
                                <button>Logout</button>
                            </a>
                        </div>
                    </div>
                    <div className="chat-box-body">
                        <div className="chat-box-overlay">   
                        </div>
                        <div className="chat-logs">
                        
                        </div>
                    </div>

                    <div className="chat-input">      
                        <form>
                            <input type="text" id="chat-input" placeholder="Send a message..."/>
                            <button type="button">
                                <i className="bi bi-paperclip"></i>
                            </button>
                            <button type="submit" className="chat-submit" id="chat-submit">
                                <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="" version="1.1" x="0px" y="0px" enableBackground="new 0 0 24 24"><title>send</title><path fill="currentColor" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
                            </button>
                        </form>      
                    </div>
                </div>
            </div>

        </>
    );
}