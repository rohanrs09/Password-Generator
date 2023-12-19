const inputSlider = document.querySelector("[data-lengthSlider]"); //Use custom attribute
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyMsg = document.querySelector("[data-copyMsg]");
const indicator = document.querySelector("[data-indicator]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const copyBtn = document.querySelector("[data-copy]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initialize
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle to color grey
setIndicator("#ccc");

//set password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow color
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//Most Important function
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //floor use round off value & min add beacuse you have value min to max
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRandomInteger(97, 123)); //97-a & 123-b ,String.fromCharCode used convert number to string
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value); //promise text copy complet e then show copied text
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  //to make copy span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active"); //2 sec next remove coped text
  }, 2000);
}

// Eventlistener for checkBoxes
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkBox) => {
    if (checkBox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) passwordLength = checkCount;
  handleSlider();
}

//checkBox check or not and their count
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// eventlistener for slider to change ui values
inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

//password visible then call copycontent method
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});




//Shuffle password function

function shufflePassword(array){
    //Fisher Yates Method 

    for(let i=array.length-1;i>0;i--){
        //random j find out using random function 
        const j=Math.floor(Math.random()*(i+1)); 
        //swap number index of i & j   
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;

    }

    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


generateBtn.addEventListener("click", () => {
  //none of checkbox are checked
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //let start to find new password

  //remove old password

  password = "";

  //let put mentioned chackboxes items

  //   if (uppercaseCheck.checked) {
  //     password += generateUpperCase();
  //   }

  //   if (lowercaseCheck.checked) {
  //     password += generateLowerCase();
  //   }

  //   if (numbersCheck.checked) {
  //     password += generateRandomNumber();
  //   }

  //   if (symbolsCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funArr = [];

  if (uppercaseCheck.checked) funArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funArr.push(generateLowercase);

  if (numbersCheck.checked) funArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funArr.push(generateSymbol);

  //compulsory addition

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  //remaining additions

  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRandomInteger(0, funArr.length);
    password += funArr[randIndex]();
  }

  //Password shuffle for security 

    password = shufflePassword(Array.from(password));
    //show in UI 

    passwordDisplay.value=password;
    //calculate strength of the password
    calcStrength();


});



