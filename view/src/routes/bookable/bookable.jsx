import React, { useState, useContext } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';
import { AppContext } from '../../store/context';

import './bookable.css';
import './datepick.css';

const Bookable = withRouter(({ history }) => {
  const { actions } = useContext(AppContext);

  const [name, setName] = useState('');

  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);

  // eslint-disable-next-line
  const [fee, setFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  // eslint-disable-next-line
  const [nanoWalletPublicKey, setNanoWalletPublicKey] = useState('');

  // eslint-disable-next-line
  const [text, setText] = useState(true);
  // const [voice, setVoice] = useState(false);
  const [video, setVideo] = useState(false);

  const [theDuration, setTheDuration] = useState(10);
  // const [selDate, setSelDate] = useState(null);

  async function onCreateSubmit() {
    const date = `${day} ${time}`;

    const communication = (() => {
      if (video) {
        return 'Video';
      }
      // if (voice) {
      //   return 'Voice';
      // }
      if (text) {
        return 'Chat';
      }
    })();

    const duration = parseInt(theDuration, 10);

    const objId = await actions({
      type: 'BOOKING_CREATE',
      payload: {
        name,
        date,
        ...(feeAmount && { feeAmount }),
        ...(nanoWalletPublicKey && { nanoWalletPublicKey }),
        communication,
        duration,
      },
    });

    history.replace(`/booking/${objId}`);

    actions({
      type: 'USER_DATA',
    });
  }

  return (
    <>
      <div className="bookable-con">
        <div className="bookable-con-sub">
          <h1>Add bookable</h1>
          <label htmlFor="name" style={{ marginBottom: '4px' }}>
            Name:
          </label>
          <input
            style={{ textTransform: 'capitalize' }}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            name="name"
          />

          <BrowserView className="browserview">
            <br />

            <label>Select Date :</label>
            <DatePicker
              // selected={selDate}
              onChange={input => setDay(moment(input).format('YYYY-MM-DD'))}
              timeFormat="HH:mm"
              timeIntervals={1}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText={day}
              minDate={moment().toDate()}
            />

            <br />
            <br />

            <label>Select Time:</label>
            <DatePicker
              // selected={selDate}
              onChange={input => setTime(moment(input).format('hh:mm a'))}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              dateFormat="h:mm aa"
              timeCaption="Time"
              placeholderText={time}
            />
          </BrowserView>
          <MobileView>
            <br />

            <label>Select Date :</label>
            <input type="date" onChange={e => setDay(e.target.value)} />

            <br />
            <br />

            <label>Select Time:</label>
            <input
              type="time"
              step="600"
              onChange={e => setTime(e.target.value)}
            />
          </MobileView>

          <br />
          <label htmlFor="duration" style={{ marginBottom: '4px' }}>
            Duration:
          </label>
          <div className="form-input" name="duration">
            <select
              name="minutes"
              onChange={e => setTheDuration(e.target.value)}
            >
              <option value="" disabled defaultValue>
                Duration:
              </option>
              <option value="10">10 min</option>
              <option value="20">20 min</option>
              <option value="30">30 min</option>
              <option value="40">40 min</option>
              <option value="50">50 min</option>
              <option value="60">60 min</option>
            </select>
          </div>

          <br />
          
          <label
            htmlFor="fee"
            style={{
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <i>Fee:</i>
            {/* {fee === true && <i>Nano Wallet Public Key</i>} */}
          </label>

          
          <div
            className="form-input"
            name="fee"
            style={{ justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', flexDirection: 'row' }}>
              <input
                type="checkbox"
                value={fee}
                name="paid"
                onClick={() => setFee(!fee)}
                className="apple-switch"
              />
              <label
                htmlFor="paid"
                style={{ margin: 'auto 10px auto 0', minWidth: 40 }}
              >
                Paid
              </label>
            </span>
            
            <span>
              {fee === true && (
                <span
                  style={{ fontWeight: 'bold', maxWidth: '80px', fontSize: 12 }}
                >
                  
                  <input
                    type="text"
                    name="nano"
                    onChange={e => setNanoWalletPublicKey(e.target.value)}
                    maxLength="65"
                    placeholder="Nano Wallet Public Key"
                    style={{ height: '15px', margin: 'auto 0' }}
                  />

                  <input
                    placeholder="Nano Price (μ)"
                    type="number"
                    onChange={e => setFeeAmount(e.target.value)}
                    style={{ height: '15px', margin: 'auto 0' }}
                  />
                </span>
              )}
            </span>
          </div>

          <br />
          

          <label htmlFor="communication" style={{ fontWeight: 'bold' }}>
            Communication:
          </label>
          <div className="form-input" name="communication">
          <select onChange={e => {
            if (e.target.value === "Video") {
              setVideo(true)
            }
            if (e.target.value === "Chat") {
              setVideo(false)
            }
          }}>
            <option value="Chat">Text Chat</option>
            <option value="Video">Text + Video Chat</option>
          </select>
          
          {/*
            <input
              type="checkbox"
              value={chat}
              name="chat"
              // onClick={ () => setChat(!chat)}
              defaultChecked
              readOnly
            />
            <label htmlFor="text" style={{ margin: 'auto 10px auto 0' }}>
              Chat
            </label>

            <input
              type="checkbox"
              value={voice}
              name="voice"
              onClick={() => setVoice(!voice)}
            />
            <label htmlFor="voice" style={{ margin: 'auto 10px auto 0' }}>
              Voice
            </label>

            <input
              type="checkbox"
              value={video}
              name="Video"
              onClick={() => setVideo(!video)}
            />
            <label htmlFor="Video" style={{ margin: 'auto 10px auto 0' }}>
              Video
            </label>
          */}
          </div>

          <br />

          <div className="preview">
            <span className="prev-name">{name}</span>

            <span className="prev-day-time">
              {day}
              <br />
              <span>{time}</span>
              <br />
            </span>

            <div className="prev-details">
              <i>
                {theDuration}
                {' '}
                min
              </i>
              <i>
                {text === true && <i> Text</i>}
                {/* {voice === true && <i>, Voice</i>} */}
                {video === true && <i>, Video</i>}
              </i>
              {fee === true && <i> Paid </i>}
              {fee === false && <i>Free </i>}
            </div>

            {/* Checks if wallet key is vaild by checking that it has 65 chars atm */}
            {fee === true && nanoWalletPublicKey.length === 65 && (
              <i style={{ fontSize: '12px' }}>Valid address</i>
            )}
            {/* Checks if there is any input yet for the key */}
            {fee === true && nanoWalletPublicKey.length === 0 && (
              <i style={{ fontSize: '12px' }}>Please enter wallet address</i>
            )}
            {/* Checks if the key has an invaild count for the key */}
            {fee === true && nanoWalletPublicKey.length > 0 && nanoWalletPublicKey.length !== 65 && (
              <i style={{ fontSize: '12px' }}>Invalid address</i>
            )}
          </div>

            {/* add valiadation  */}
          <button type="submit" className="reg-btn" onClick={() => {
            if (fee === true && nanoWalletPublicKey.length !== 65) {
              return false
            }
            onCreateSubmit()
          }}>
            Create bookable
          </button>
        </div>
      </div>
    </>
  );
});
export default Bookable;
