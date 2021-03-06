import React, {useState, useEffect} from "react";
import './App.scss';
import $ from 'jquery'; 

function App() {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const onAddButtonClick = function(event) {
    var noteInput = document.getElementById("noteTitle");
    if (noteInput.getAttribute("value") === '') {
      noteInput.classList.add('error');
      setTimeout(function() {
        noteInput.classList.remove('error');
      }, 300);
      return;
    }
    saveNote({title, status});
    setNotes([...notes, {title, status}]);
    setTitle('');
    setStatus('');
  };

  useEffect(() => {
    const triggerButtonClick = function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submitButton").click();
      }
    }
    const input = document.getElementById("noteTitle");
    const select = document.getElementById("note-status");
    input.addEventListener("keyup", triggerButtonClick);
    select.addEventListener("keyup", triggerButtonClick);
  }, [])

  const setNoteToCompleted = function (e) {
    notes.forEach(function(ele, i) {
      if (e.title === ele.title && e.status === ele.status) {
        ele.status = "completed";
      }
    });
    setNotes([...notes]);
    localStorage.setItem('savedValues', JSON.stringify(notes));
  };

  const setNoteToInProgress = function (e) {
    notes.forEach(function(ele, i) {
      if (e.title === ele.title && e.status === ele.status) {
        ele.status = "active";
      }
    });
    setNotes([...notes]);
    localStorage.setItem('savedValues', JSON.stringify(notes));
  };
  
  const onDeleteButtonClick = function(e) {
    var index;
    notes.forEach(function(ele, i) {
      if (ele.title === e.title && ele.status === e.status) {
        index = i;
      }
    });
    notes.splice(index, 1);
    setNotes([...notes]);
    localStorage.setItem('savedValues', JSON.stringify(notes));
  };

  const saveNote = function(item) {
    var storedItems = localStorage.getItem('savedValues');
    storedItems = storedItems ? JSON.parse(storedItems) : [];
    storedItems && storedItems.push(item);
    localStorage.setItem('savedValues', JSON.stringify(storedItems))
  }

  $(window).on('load', function(){
    localStorage.getItem('savedValues');
    var aNotes = JSON.parse(localStorage.getItem('savedValues')) || [];
    setNotes([...aNotes]);
  });

  return (
    <div className="App">
      <section className="form">
        <div className="note">
          <input type="text" id="noteTitle" className="note__input" placeholder=" " value={title} onChange={(e) => setTitle(e.target.value)}/>
          <label for="noteTitle" className="note__label">What do you plan to do today?</label>
        </div>
        <div className="status">
          <select name="status" id="note-status" className="status__select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="toStart">Yet to Start</option>
            <option value="active">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="submit">
          <button id="submitButton" className="submit__button" onClick={() => onAddButtonClick()}>+</button>
        </div>
      </section>
      <div className="container">
        <div className="container__tabs">
          <ul className="container__tabs__ul">
            <li className="container__tabs__ul__item tab__item__active" onClick={(e) => {
                $(e.target).addClass('tab__item__active');
                $(e.target).siblings().removeClass('tab__item__active');
                setActiveTab('ALL');
              }}>All Notes</li>
            <li className="container__tabs__ul__item" onClick={(e) => {
                $(e.target).addClass('tab__item__active');
                $(e.target).siblings().removeClass('tab__item__active');
                setActiveTab('TOSTART');
              }}>Yet to Start</li>
            <li className="container__tabs__ul__item" onClick={(e) => {
                $(e.target).addClass('tab__item__active');
                $(e.target).siblings().removeClass('tab__item__active');
                setActiveTab('ACTIVE');
              }}>In Progress</li>
            <li className="container__tabs__ul__item" onClick={(e) => {
                $(e.target).addClass('tab__item__active');
                $(e.target).siblings().removeClass('tab__item__active');
                setActiveTab('COMPLETED');
              }}>Completed</li>
          </ul>
        </div>
        <div className="container__content">
        <table className="container__content__table">
          <thead>
            <tr className="table__head__row">
                <th align="left" className="table__head__row__title">Title</th>
                <th align="left" className="table__head__row__status">Status</th>
                <th align="left" className="table__head__row__action">Action</th>
            </tr>
          </thead>
          <tbody>
          {notes.filter(e => {
              if (activeTab === 'ALL') {
                return true;
              } else if (activeTab === 'TOSTART') {
                return (e.status.toUpperCase() === 'TOSTART' || e.status.toUpperCase() === '');
              } else if (activeTab === 'ACTIVE') {
                return e.status.toUpperCase() === 'ACTIVE';
              } else {
                return e.status.toUpperCase() === 'COMPLETED';
              }
            }).sort((a, b) => {
              if(a.title < b.title) { return -1; }
              if(a.title > b.title) { return 1; }
              return 0;
            }).map(e => {
              var obj = {
                "": "Yet to Start",
                "toStart": "Yet to Start",
                "active": "In Progress",
                "completed": "Completed"
              };
              return (
                <tr className="table__data__row">
                  <td className="table__data__row__title">{e.title}</td>
                  <td className="table__data__row__status">{obj[e.status]}</td>
                  <td className="table__data__row__action">
                    <div className="table__data__row__action__container">
                      { e.status !== "active" ? <button className="action" title="Set to In Progress" onClick={() => setNoteToInProgress(e)}><i className="fa fa-spinner"></i></button> : null }
                      { e.status !== "completed" ? <button className="action" title="Set to Completed" onClick={() => setNoteToCompleted(e)}><i className="fa fa-check"></i></button> : null }
                      <button className="action" title="Delete Note" onClick={() => onDeleteButtonClick(e)}><i className="	fa fa-trash-o"></i></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
