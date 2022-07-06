/**
 * breathe.js Version : 1.0.0
 * TODO for future :
 * Make a scroller
 * Add sounds
 * Add icons
 * Change this code to Object Oriented
 */

/**
 * global Variables
 */
const breathMode = document.getElementById("breath-mode");
const breathModeButton = document.querySelector(".startBreathing");
const breathsText = document.querySelector(".breaths-text");
const instructions = document.querySelector(".instructions");
const circleProgress = document.querySelector(".circle-progress");
let breathsLeft = 0;


/**
 * disable option select
 */
const toggleDisableSelectOptions = () => {
    for (let i = 0; i < breathMode.length; i++) {
        breathMode.options[i].disabled = true;
    }
}

/**
 *  when Breathing cycle ends this function will enable options to select.
 */
const toggleEnableSelectOptions = () => {
    for (let i = 0; i < breathMode.length; i++) {
        breathMode.options[i].disabled = false;
    }
}

/**
 * start button function. Checks breathing mode. 
 */

breathModeButton.onclick = function () {
    if (breathMode.value === "Resonant") {
        setCircleGrowthTime(5, 1, 5, 30, 1000);
    }
    else if (breathMode.value === "4-7-8") {
        setCircleGrowthTime(4, 7, 8, 4, 1000);
    }
    else if (breathMode.value === "Box") {
        setCircleGrowthTime(4, 4, 4, 10, 4000);
    }
    else if (breathMode.value === "BOF") {
        setCircleGrowthTime(1.4, 0, 1.4, 50, 500);
    }
    /**
     * removes select option after the button is pressed
     */
    toggleDisableSelectOptions();
}

/**
 MAIN FUNCTION :
 Example :  setCircleGrowthTime(2, 3, 1, 5, 1000);
 2 seconds circle increases (breathe in timer)
 3 seconds holding time (hold breath timer)
 1 second for shrinking time (breathe out timer)
 5 breaths left (number of breaths)
 1000 ms or 1s delay between breaths (0ms might glitch out the CSS circle)
 */
function setCircleGrowthTime(timeToExpand, holdTime, shrinkTime, breathsLeft, delayBetweenBreaths) {
    //declearing time it takes to expand using transitionDuration in css
    let growTime = `${timeToExpand}s`;
    circleProgress.style.transitionDuration = growTime;
    //to Test it : console.log(`TimeToExpand: ${TimeToExpand} `);
    //remove s letter, because I get result number of seconds + s example 3s
    let removeS = growTime.replace("s", "");
    //to test it : console.log(`Remove S : ${removeS}`);
    //converts holding time to ms. Expanded circle + holding time.
    //removeS is a string so I use * 1000 othervise I will get 32000 result in future I might convert it to integer but since it works I don't mind
    //to test the time :  console.log(`HoldTime : ${holdTime1}`);
    let holdTime1 = (removeS * 1000) + (holdTime * 1000);
    //sets a timeout of holding time then shrinks
    //actual css animation of circle growing
    //check how much ms cycle takes time without cycle delay
    var cycleTimer = (holdTime1 + (shrinkTime * 1000));
    //how many breaths left
    var numberOfTimes = breathsLeft;
    //hold breath text timer
    var holdTextUpdate = (removeS * 1000);
    //hold breath function
    function updateHoldText() {
        const holdTimeTextInterval = setTimeout(() => {
            instructions.innerText = "Hold";
            // console.log(`Hold Text: ${holdTextUpdate} `);
            clearInterval(holdTimeTextInterval);
        }, holdTextUpdate);

    }
    /**
     * function for each cycle
     */
    function cycle() {
        //declearing transition duration
        let growTime = `${timeToExpand}s`;
        circleProgress.style.transitionDuration = growTime;
        //disables start button
        breathModeButton.classList.add("button-inactive");
        //updates breath text
        breathsText.innerText = numberOfTimes - 1;
        //checks which breath mode is selected and changes breathe in text
        if (breathMode.value === "4-7-8" || breathMode.value === "BOF") {
            instructions.innerText = "Breathe In Trough Nose";
        } else {
            //default breathe in text
            instructions.innerText = "Breathe In";
        }
        //circle grow animation
        circleProgress.classList.add("circle-grow");
        //updates hold Text
        updateHoldText();
        //timer to shrink circle
        setTimeout(() => {
            setCircleShrinkTime(shrinkTime);
        }, holdTime1);
    }

    //cycle ending function. Updates text restores button and enables options from option menu
    function endCycle() {
        instructions.innerText = "Session completed!";
        breathModeButton.classList.remove("button-inactive");
        toggleEnableSelectOptions();
    }
    //declearing end of the cycle timer. On last breath it sets timer to update text (executing endCycle() function)
    let endCycleTimer = holdTime1 + (shrinkTime * 1000);

    //timer for each cycle and number of times cycle keeps going.
    function eachCycleDelayAndNumberOfCycles() {
        //main timer for each cycle
        var timesToCycle = setInterval(function () {
            cycle();
            //each cycle times reduces by 1
            numberOfTimes--;
            //last breath logic
            if (numberOfTimes === 0) {
                //ends whole timer (clears Interval)
                window.clearInterval(timesToCycle);
                //set timer for last text to be updated
                setTimeout(endCycle, endCycleTimer);

            }
        }, cycleTimer + delayBetweenBreaths
        );
    }
    //this function is to avoid delay for first cycle. Without this it waits whole cycle to do first breath in
    function removeDelayOnFirstAnimationOfCircle() {
        //if I want 1 breath I want to just cycle function
        if (numberOfTimes == 1) {
            //add cycle(); function first to avoid animation delay
            cycle();
            numberOfTimes = 0;
            //if I have more I want to have normal cycle function
        } else if (numberOfTimes > 1) {
            //add cycle(); function first to avoid animation delay
            cycle();
            numberOfTimes -= 1;
            eachCycleDelayAndNumberOfCycles();
        }
    }
    //execute function
    removeDelayOnFirstAnimationOfCircle();
}
/**
 * sets shrink timer. Shrinks the circle using css transitionDuration
 */
function setCircleShrinkTime(time) {
    //lets make a string of seconds for transitionDuration
    let shrinkTime = `${time}s`;
    circleProgress.style.transitionDuration = shrinkTime;
    // to test it : console.log(`Circle Shrink Time = ${circleProgress.style.transitionDuration} `);
    // checks logic to breath out. If specific mode is select change text lese use default
    if (breathMode.value === "BOF") {
        instructions.innerText = "Breathe Out Trough Nose";
    } else {
        instructions.innerText = "Breathe Out";
    }
    //shrinks circle
    circleProgress.classList.remove("circle-grow");
}