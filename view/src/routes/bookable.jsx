import React, { useState, useContext } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../store/context';
import { BrowserView, MobileView} from "react-device-detect";


const Bookable = withRouter(({ history }) => {

  const { actions } = useContext(AppContext);
 
  const [name, setName] = useState("");

  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
 
  const [fee, setFee] = useState(false);
  const [nano, setNano] = useState(false);

  const [chat, setChat] = useState(true);
  const [voice, setVoice] = useState(false);
  const [video, setVideo] = useState(false);

  const [theDuration, setTheDuration] = useState(10);
  // const [selDate, setSelDate] = useState(null);


  async function onCreateSubmit() {

    const date = (day + ' ' + time);

    const communication = (() => {
      if (video) {
        return "Video"
      }
      if (voice) {
        return "Voice"
      }
      if (chat) {
        return "Chat"
      }
    })();

    const duration = parseInt(theDuration, 10)
    
    let objId = await actions({
      type: 'BOOKING_CREATE',
      payload: 
      { 
        name, 
        date,
        ...fee && {fee},
        ...nano && {nano},
        communication,
        duration,
      }
    })

    history.replace(`/booking/${objId}`);

    actions({
      type: 'USER_DATA',
    })

  }

  return (
    <>
      <div className="bookable-con">
        <div className="bookable-con-sub">
          <h1>Add bookable</h1>
          <label htmlFor="name" style={{marginBottom:'4px'}}>
            Name:
          </label>
          <input
            style={{textTransform: 'capitalize'}} 
            type="text" 
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
          />

          <BrowserView className="browserview">
              <br/>

            <label>
              Select Date :
            </label>
            <DatePicker
              // selected={selDate}
              onChange={input =>  setDay(moment(input).format("YYYY-MM-DD"))}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText={day}
              minDate={moment().toDate()}
            />

              <br/>
              <br/>

            <label>
              Select Time:
            </label>
            <DatePicker
              // selected={selDate}
              onChange={input =>  setTime(moment(input).format("hh:mm a"))}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              placeholderText={time}
            />
          </BrowserView>
          <MobileView>
              <br/>

            <label>
              Select Date :
            </label>
            <input
              type="date"
              onChange={(e) =>  setDay(e.target.value)}
            />

              <br/>
              <br/>

            <label>
              Select Time:
            </label>
            <input
              type="time"
              step="600"
              onChange={(e) =>  setTime(e.target.value)}
            />
          </MobileView>

            <br/>
          <label htmlFor="duration" style={{marginBottom:'4px'}}>
            Duration:
          </label>
          <div className="form-input" name="duration">
            <select 
              name="minutes" 
              onChange={e => setTheDuration(e.target.value)}
            >
              <option value="" disabled defaultValue>Duration:</option>
              <option value="10">10 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="40">40 min</option>
              <option value="50">50 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

            <br/>
          <label htmlFor="fee" style={{fontWeight: 'bold', display: 'flex', flexDirection: 'row',justifyContent: 'space-between'}}>
            <i>Fee:</i>
            {fee === true &&
               <i>Nano Wallet Public Key</i>
               }
          </label>

          <div className="form-input" name="fee" style={{justifyContent:'space-between'}}>
            <span style={{display: 'flex', flexDirection:'row'}}>
              <input 
                type="checkbox" 
                value={fee} 
                name="paid"
                onClick={ () => setFee(!fee)}
                class="apple-switch" 
              />
              <label htmlFor="paid" style={{margin: 'auto 10px auto 0',minWidth: 40}}>
                Paid
              </label>
             </span>  
             <span>
            {fee === true &&
              <span style={{fontWeight: 'bold', maxWidth:'80px', fontSize:12}}>
                {/* Nano Wallet Public Key */}
                <input 
                type="text" 
                name="nano"
                onChange={e => setNano(e.target.value)}
                maxlength="8"
                style={{height:'15px', margin:'auto 0'}}
                />
              </span>
            }
            </span> 
          </div>

            <br/>

          <label htmlFor="communication" style={{fontWeight: 'bold'}}>
            Communication:
          </label>
          <div className="form-input" name="communication" >
            <input 
              type="checkbox" 
              value={chat} 
              name="chat"
              // onClick={ () => setChat(!chat)}
              defaultChecked
              readOnly
            />
            <label htmlFor="text" style={{margin: 'auto 10px auto 0'}}>
              Chat
            </label>

            <input
              type="checkbox" 
              value={voice} 
              name="voice"
              onClick={ () => setVoice(!voice)}
            />
            <label htmlFor="voice" style={{margin: 'auto 10px auto 0'}}>
              Voice
            </label>

            <input 
              type="checkbox"
              value={video}
              name="Video"
              onClick={ () => setVideo(!video)}
            />
            <label htmlFor="Video" style={{margin: 'auto 10px auto 0'}}>
              Video
            </label>
     
          </div>

          <div className="preview">
            <span className="prev-name">
              {name}
            </span>

            <span className="prev-day-time">
              {day}
              <br/>
              <span>
                {time}
              </span>
              <br/>
            </span>

            <div className="prev-details">
              <i>{theDuration} min</i>
              <i>
                {chat === true &&
                  <i> Chat</i>
                }
                {voice === true && 
                  <i>, Voice</i>
                }
                {video === true &&
                  <i>, Video</i>
                }
              </i>
              {fee === true &&
                <i> Paid </i>
              }
              { fee === false &&
                <i>Free </i>
              }
            </div> 

            {/* Checks if wallet key is vaild by checking that it has 8 digits atm */}
            {fee === true && nano.length === 8 &&
              <i style={{fontSize: '12px'}}>Payment Added</i>
            }
            {/* Checks if there is any input yet for the key*/}
            {fee === true && nano.length === 0 &&
              <i style={{fontSize: '12px'}}>Please add payment key</i>
            }
            {/* Checks if the key has an invaild count for the key*/}
            {fee === true &&  nano.length >= 1 && nano.length < 8 && 
              <i style={{fontSize: '12px'}}>Invaild key</i>
            }
          </div>
          
          <button className="reg-btn" onClick={onCreateSubmit}>
            Create bookable
          </button>
        </div>
      </div>
    </>
  );
})
export default Bookable;