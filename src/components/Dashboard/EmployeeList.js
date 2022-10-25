import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './EmployeeList.module.css'

import Card from '../UI/Card';
import EmployeeBox from './EmployeeBox';

const EmployeeList = (props) => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('authenticated'));
  const [token, setToken] = useState(localStorage.getItem('authorization'));
  const [dataList, setDataList] = useState([]);
  // const [leavePopup, setLeavePopup] = useState(false)
  // const [isSubmit, setIsSubmit] = useState(false)
  const [role, setRole] = useState()

  
  const navigate = useNavigate()

  useEffect(() => {
    setAuthenticated(localStorage.getItem('authenticated'))
    setToken(localStorage.getItem('authorization'))
    setRole(localStorage.getItem('role'))
    setDataList([])

    async function empList() {
      const requestOptions = {
        'method': 'GET',
        'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token }
      }
      const response = await fetch('http://127.0.0.1:8000/tracker/employee/', requestOptions)
      const data = await response.json()
      console.log(data);
      setDataList(data);
    }
    empList()
  },[token]);

  const leavesHandler = () => {
    navigate('/leave')
  }

  const filterhandler = async(event) => {
    const requestOptions = {
      'method': 'GET',
      'headers': { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token }
    }
    const searchParam = event.target.value;
    const response = await fetch('http://127.0.0.1:8000/tracker/employee/?search=' + searchParam, requestOptions)
    const data = await response.json();
    setDataList(data);
    
  }

  if (!authenticated===true & role !== 'Admin') {
    // console.log('here', token);
    return navigate('/login')
  } else {
    return (
      <Card>
        <div className={`${styles['leave-list']}`}>
          <div className={`${styles['leave-list__button']}`}>
            <div className={`${styles['leave-list__input']}`}>
              <input type='text' placeholder='search here...' onChange={filterhandler} />
            </div>
            {role==='Admin' ? <button type='button' onClick={leavesHandler}>Leaves</button>: ''}
            {/* <button type='button' onClick={applyLeaveHanlder}>Apply Leave</button>
            <button type='button'>Penfing Requests</button> */}
          </div>
          {dataList.map((emp)=>
            (<div key={emp.id} className={`${styles['leave-list__list']}`}>
              <EmployeeBox empid={emp.id} uid = {emp.id} />
              <div className={`${styles['leave-list__description']}`}>
                <h2>{emp.first_name + ' ' + emp.last_name}</h2>
              </div>
              <div className={`${styles['leave-list__description']}`}>
                <h4>{emp.designation}</h4>
              </div>
              <div className={`${styles['leave-list__description']}`}>
                {emp.jod}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }
};

export default EmployeeList;