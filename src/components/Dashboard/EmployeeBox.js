import styles from './EmployeeBox.module.css';

const EmployeeBox = (props) => {
  return (
    <div key={props.uid} className={`${styles['employeebox__empbox']}`}>
      <div className={`${styles['employeebox__emp']}`}>
        Employee Id
      </div>
      <div key={props.uid} className={`${styles['employeebox__empid']}`}>
        {props.empid}
      </div>
    </div>
  )
};

export default EmployeeBox;