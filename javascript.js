class Elevator {
  constructor (currentFloor, state, name) {
    this.currentFloor = currentFloor;
    this.state = state; 
    this.name = name;
  }
  
  get floor() {
    return this.currentFloor;
  }

  get elevatorState() {
    return this.state;
  }
  get elevatorName() {
    return this.name;
  }
  
  set floor(updatedFloor) {
    this.currentFloor = updatedFloor;
  }
  set elevatorState(updatedState) {
    this.state = updatedState;
  }
  
}


const elevatorA = new Elevator(0, "stationary", "elevatorA");
const elevatorB = new Elevator(6, "stationary", "elevatorB");

// display the initial state for both elevators
updateElevatorState(elevatorA,"stationary");
updateElevatorState(elevatorB,"stationary");

disableButtons(".elevatorAfloor");
disableButtons(".elevatorBfloor");

const initialColorA = document.querySelectorAll(".elevatorABox");
initialColorA[elevatorA.floor].style.backgroundColor = "yellow";
const initialColorB = document.querySelectorAll(".elevatorBBox");
initialColorB[elevatorB.floor].style.backgroundColor = "yellow";

console.log("elevatorA: ", elevatorA);
console.log("elevatorB: ", elevatorB);

// calculates, based on the distance between the elevators and where the elevator was called from,
// which elevator is closer
function chooseElevator(userFloor) {
           
  let distanceLiftA = Math.abs(userFloor - elevatorA.floor);
  let distanceLiftB = Math.abs(userFloor - elevatorB.floor);
  var currentElevator = elevatorA;
 
  console.log("distanceLiftA: ", distanceLiftA, "distanceLiftB: ", distanceLiftB);

  if (distanceLiftA === distanceLiftB) {
      if (elevatorA.floor > elevatorB.floor) {
            currentElevator = elevatorB;
          }
      }
  else if(distanceLiftA > distanceLiftB) {
       currentElevator = elevatorB;
     }

     //  in the case the elevator is already at the same floor as the user's floor
     // the destination has been reached and the elevator won't move
     if ( (distanceLiftA === 0) || (distanceLiftB === 0) ) {
      console.log(currentElevator.elevatorName, " is already here");

      updateElevatorState(currentElevator, "destination reached");
      //enables the elevator's buttons, so that the user can select a destination/ a floor
      let enable= "."+currentElevator.elevatorName+"floor";
      enableButtons(enable);      
     }
     else {

       updateElevatorState(currentElevator, "called");
       console.log("elevatorA: ", elevatorA, "elevatorB: ", elevatorB);
       moveElevator(currentElevator, userFloor);
       console.log("elevatorA: ", elevatorA, "elevatorB: ", elevatorB);
     }

      disableButtons(".callbtn");
}

// activates the elevator by clicking on elevatorA or elevatorB buttons
function selectDestination(elevator, requestedFloor){
  updateElevatorState(elevator, "destination selected");
  moveElevator(elevator, requestedFloor);
}

// it activates the animation depending if the elevator is going up, down or stays at the same floor
function moveElevator(elevator, requestedFloor) {

  if (elevator.floor < requestedFloor) {

    console.log(elevator.elevatorName +" is going up"); 
    moveAnimation(elevator.floor, requestedFloor, elevator);  

    }

    else if (elevator.floor > requestedFloor) {

      console.log(elevator.elevatorName +" is going down"); 
      moveAnimation(elevator.floor, requestedFloor, elevator); 

    } 
    else {
      console.log(elevator.elevatorName + " is already at this floor");
      enableButtons(".callbtn");
      updateElevatorState(elevator, "destination reached");

    }

  console.log(elevator.elevatorName, elevator.elevatorState);

  elevator.floor = requestedFloor;
  
  console.log("floor ", elevator.floor, " reached");

  let disable= "." + elevator.elevatorName + "floor";
  disableButtons(disable);
}

// disables all the buttons with the class name passed
function disableButtons(byClass) {
  let x = document.querySelectorAll(byClass);

  for (let i=0; i<x.length; i++) {
    x[i].disabled = true;
    x[i].style.backgroundColor = "lightgrey";
  }
}

// enables all the buttons with the class name passed
function enableButtons(byClass) {
  let x = document.querySelectorAll(byClass);

  for(let i=0; i<x.length; i++) {
    x[i].disabled = false;
    x[i].style.backgroundColor = "#00e68a";
  }
}

//activates the animation between the floors passed as arguments
//by switching colors, from yellow to grey, at a set interval
function moveAnimation(from, to, elevator){

  const elevatorClass = "." + elevator.elevatorName + "Box";
  const x = document.querySelectorAll(elevatorClass);
  var wait=500;

  if (from < to){
    for (let i = from+1; i<=to; i++){
      setTimeout(paint,wait,x,i-1,"lightgrey",0);
      if (i === to) {
        setTimeout(paint,wait,x,i,"yellow",0);
      } else {
      setTimeout(paint,wait,x,i,"yellow",1);
    }
      wait=wait+500;
    }
  }
  else{
    for (let i=from-1;i>=to;i--){
      setTimeout(paint,wait,x,i+1,"lightgrey",0);
      if ( i === to ) {
        setTimeout(paint,wait,x,i,"yellow",0);
      } else {
        setTimeout(paint,wait,x,i,"yellow",-1);
      }
      
      wait=wait+500;
    }
  }

  //enables the buttons only after the animation ends, so they will be disabled during the animation
  wait = wait-400;
  if (elevator.elevatorState === "called") {
  let enable= "."+elevator.elevatorName+"floor";
  setTimeout(enableButtons, wait ,enable);
  setTimeout(updateElevatorState, wait, elevator, "destination reached");
  }

  if(elevator.elevatorState === "destination selected") {
    setTimeout(enableButtons, wait, ".callbtn");
    setTimeout(updateElevatorState, wait, elevator, "destination reached");
  }

}

// changes the elevator's window color and displays arrows 
function paint(x,position,color, arrow){
// arrow = 0 keep elevator floor number, -1 is down arrow and 1 is up arrow
  x[position].style.backgroundColor = color;
  if (arrow === 0) {
    x[position].innerHTML = position;
  }
  if (arrow === -1) {
    x[position].innerHTML = "&#11206;";
  }
  if(arrow === 1) {
    x[position].innerHTML = " &#11205;";
  }
}

// updates the elvators state and displays them on screen
function updateElevatorState (elevator, newState) {
  elevator.elevatorState = newState;
  let className = "." + elevator.elevatorName + "State";
  document.querySelector(className).innerHTML = elevator.elevatorName + ": " + newState;
}


