import Card from '../UI/Card';
import classes from './AddLeave.module.css';
import FileBase from 'react-file-base64';

import { useRef, useState } from 'react';

const AddLeave = (props) => {

  const leaveRef = useRef()
  const startDateRef = useRef()
  const endDateRef = useRef()
  const reasonRef = useRef()

  const [base, setBase] = useState();

  const submitHandler = async(e) => {
    e.preventDefault()
    const leaveData = {
      'leave_type': leaveRef.current.value,
      'start_date': startDateRef.current.value,
      'end_date': endDateRef.current.value,
      'reason': reasonRef.current.value,
      'base_code': base.base64,
      'image_name': base.file.name
    }
    console.log(leaveData);
    const requestOptions = {
      'method': 'POST',
      'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + props.token },
      'body': JSON.stringify(leaveData)
    }
    const response = await fetch('http://127.0.0.1:8000/tracker/leave/', requestOptions)
    const data = await response.json()
    console.log(data);
    if (response.status === 201) {
			leaveRef.current.value = 'CL'
      startDateRef.current.value = ''
			endDateRef.current.value = ''
			reasonRef.current.value = ''
      setBase(null)
    }
    props.onConfirm()
    props.leaveConfirm()

  };

  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>Add Leave</h2>
        </header>
        <form className={`${classes['form']}`} onSubmit={submitHandler}>
          <div className={`${classes['user-form']}`}>
            <div className={`${classes['user-form__label']}`}>
              <label htmlFor='leave_type'>Leave Type</label>
            </div>
            <div className={`${classes['user-form__input']}`}>
              <select name="leave_type" id="leave_type" ref={leaveRef}>
                <option value="CL">Casual Leave</option>
                <option value="PL">Privilege Leave</option>
                <option value="SL">Sick Leave</option>
                <option value="ML">Maternity Leave</option>
                <option value="PTL">Paternity Leave</option>
              </select>
            </div>
            <div className={`${classes['user-form__label']}`}>
              <label htmlFor='start_date'>Start Date</label>
            </div>
            <div className={`${classes['user-form__input']}`}>
              <input name='start_date' type="date" ref={startDateRef}/>
            </div>
            <div className={`${classes['user-form__label']}`}>
              <label htmlFor='end_date'>End Date</label>
            </div>
            <div className={`${classes['user-form__input']}`}>
              <input name='end_date' type="date" ref={endDateRef}/>
            </div>
            <div className={`${classes['user-form__label']}`}>
              <label htmlFor='reason'>Reason</label>
            </div>
            <div className={`${classes['user-form__input']}`}>
              <input name='reason' type="text" ref={reasonRef}/>
            </div>
            <div className={`${classes['user-form__label']}`}>
              <label htmlFor='attachment'>Attachment</label>
            </div>
            <div className={`${classes['user-form__input']}`}>
              {/* <input name='attachment' type="file" ref={attachmentRef}/> */}
              <FileBase type='file' multiple={false} onDone={(base64)=>setBase(base64)} />
            </div>
            <div className={`${classes['user-form__button']}`}>
              <button type='button' className={`${classes['user-form__cancel']}`} onClick={props.onConfirm}>Cancel</button>
              <button type='submit'>Add</button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddLeave;