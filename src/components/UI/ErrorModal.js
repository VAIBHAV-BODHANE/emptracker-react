import Card from './Card';
import classes from './ErrorModal.module.css';

const ErrorModal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p>{props.message}</p>
        </div>
        <footer className={classes.actions}>
          <div className={`${classes['user-form__button']}`}>
            <button type='button' className={classes} onClick={props.onConfirm}>Okay</button>
          </div>
        </footer>
      </Card>
    </div>
  );
};

export default ErrorModal;