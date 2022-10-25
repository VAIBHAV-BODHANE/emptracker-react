import styles from './LeaveList.module.css'

import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import Card from '../UI/Card';
import EmployeeBox from './EmployeeBox';
import AddLeave from '../Form/AddLeave';
import ErrorModal from '../UI/ErrorModal';

const LeaveList = () => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated'));
  const [token, setToken] = useState(localStorage.getItem('authorization'));
  const [dataList, setDataList] = useState([]);
  const [leavePopup, setLeavePopup] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [role, setRole] = useState();
  const [totalLeave, setTotalLeave] = useState();
  // const [isError, setIsError] = useState(false);
  const [error, setError] = useState();

  const navigate = useNavigate()

  useEffect(()=>{
    setAuthenticated(localStorage.getItem('authenticated'))
    setToken(localStorage.getItem('authorization'))
    setRole(localStorage.getItem('role'))
    setDataList([])
    async function leaveList() {
      const requestOptions = {
        'method': 'GET',
        'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token }
      }
      const response = await fetch('http://127.0.0.1:8000/tracker/leave/', requestOptions)
      const data = await response.json()
      console.log(data.length);
      setTotalLeave(data.length)
      setDataList(data);
    }
    leaveList()
  }, [token, authenticated, isSubmit]);

  const leaveHandler = async(key, status) => {
    const requestOptions = {
      'method': 'PATCH',
      'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token },
      'body': JSON.stringify({'is_approve': status})
    }
    const response = await fetch('http://127.0.0.1:8000/tracker/leave/'+key+'/', requestOptions)
    const data = await response.json()
    setAuthenticated(true)
    console.log(data);
  };

  const applyLeaveHanlder = () => {
    console.log(totalLeave);
    if (role==='Employee' & totalLeave >= 4 ) {
      setError({
        title: 'Reached Maximum Limit',
        message: 'Your can not apply for more than 4 leaves!'
      })
    } else {
      setLeavePopup(true)
    }
  }

  const confirmHandler = () => {
    setLeavePopup(false)
    setError(null)
  }

  const leaveSubmitHandler = () => {
    setIsSubmit(true)
  }

  const empHandler = () => {
    navigate('/employee')
  }

  const filterhandler = async(event) => {
    const requestOptions = {
      'method': 'GET',
      'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token }
    }
    const searchParam = event.target.value;
    const response = await fetch('http://127.0.0.1:8000/tracker/leave/?search=' + searchParam, requestOptions)
    const data = await response.json();
    setDataList(data);
    
  }

  if (!authenticated===true) {
    // console.log('here', token);
    return <Navigate replace to='/login'/>
  } else {
    // console.log('dataList', dataList);
    return (
      <div>
        {error && <ErrorModal title={error.title} message={error.message} onConfirm={confirmHandler}/>}
        {leavePopup && <AddLeave onConfirm={confirmHandler} token={token} leaveConfirm={leaveSubmitHandler}/>}
        <Card>
          <div className={`${styles['leave-list']}`}>
            <div className={`${styles['leave-list__button']}`}>
              <div className={`${styles['leave-list__input']}`}>
                <input type='text' placeholder='search here...' onChange={filterhandler} />
              </div>
              {role==='Admin' ? <button type='button' onClick={empHandler}>Employee</button>: ''}
              <button type='button' onClick={applyLeaveHanlder}>Apply Leave</button>
              {/* <button type='button'>Penfing Requests</button> */}
            </div>
            {dataList.map((leaves)=>
              (<div key={leaves.id} className={`${styles['leave-list__list']}`}>
                <EmployeeBox empid={leaves.user} uid = {leaves.id} />
                <div className={`${styles['leave-list__description']}`}>
                  <h2>{leaves.full_name}</h2>
                </div>
                <div className={`${styles['leave-list__description']}`}>
                  <h4>{leaves.leave_type}</h4>
                </div>
                <div className={`${styles['leave-list__description']}`}>
                  {(leaves.is_approve !== 'P') ? ((leaves.is_approve === 'A') ? <h4 className={`${styles['leave-list__approve']}`}>{leaves.is_approve}</h4>:
                    <h4 className={`${styles['leave-list__reject']}`}>{leaves.is_approve}</h4>)                
                  : <h4 className={`${styles['leave-list__pending']}`}>{leaves.is_approve}</h4>
                  }
                </div>
                {role==='Admin' ? <div className={`${styles['leave-list__leavebutton']}`}>
                  <button className={`${styles['leave-list__approvebutton']}`} onClick={()=>leaveHandler(leaves.id, 'A')}>Approve</button>
                  <button className={`${styles['leave-list__rejectbutton']}`} onClick={()=>leaveHandler(leaves.id, 'R')}>Reject &nbsp;&nbsp;</button>
                </div>: ''}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
};

export default LeaveList;