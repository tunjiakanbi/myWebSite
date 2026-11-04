gsap.registerPlugin(GSDevTools, SplitText, TextPlugin, ScrollTrigger);
//text plugin
gsap.to("p#one", {
    // text: {
    //     value: "typewriter effect with GSAP 3",
    //     delimiter: " "
    // },
    text: "typewriter effect with GSAP 3",

    ease: "power1.in",
    duration: 2,
    repeat: 10,
    yoyo: true,
    repeatDelay: 0.4
})

//split text letters
let split1
let animation1 = gsap.timeline({
    id: "animation1",
    repeat: -1,
    // repeat: 10,
    yoyo: true,
    repeatDelay: 0.3
})

function init1() {
    gsap.set(".wrapper2", {
        autoAlpha: 1
    })
    split1 = new SplitText("h1.heading1", {
        type: "chars"
    })
    animation1.from(split1.chars, {
        opacity: 0,
        y: 50,
        ease: "back(4)",
        stagger: 0.05
    })
    GSDevTools.create({
        animation1: "animation1"
    })
}

 window.addEventListener("load", init1)

//split text words
let split2
let animation2 = gsap.timeline({
    id: "animation2"
})


function init2() {
    split2 = new SplitText("h1.heading2", {
        type: "words"
    })
    gsap.set(".wrapper3", {
        autoAlpha: 1
    })
    animation2.from(split2.words, {
        duration: 3,
        opacity: 0,
        rotation: -40,
        scale: 0.4,
        stagger: 0.1,
        ease: "back",
        repeat: -1 //
    })
    GSDevTools.create({
        animation2: "animation2"
    })
}

window.addEventListener("load",init2);
// window.addEventListener("load", function (event) {
//     init2() //do stuff
// })

//split text line

let split3;
let animation3 = gsap.timeline({
    id: "animation3",
    repeat: -1,
    // repeat: 10,
    repeatDelay: 1
})


function init3() {
    split3 = new SplitText("p#two", {
        type: "lines"
    })
    gsap.set(".wrapper4", {
        autoAlpha: 1
    })
    animation3.from(split3.lines, {
        opacity: 0,
        rotationX: -90,
        rotationY: -80,
        stagger: 0.2,
        transformOrigin: "50% 50% -200"
    })
    GSDevTools.create({
        animation3: "animation3"
    })
}
window.addEventListener("load",init3);

// window.addEventListener("load", init1, init3);
// window.addEventListener("load", init1, init2, init3);
// window.addEventListener("load", init2, init3);
//window.addEventListener("load",init3);

//Scroll Trigger

// gsap.to("#bbb", {
//     y: 100,
//     duration: 3,
//     scale: 1.5,
//     backgroundColor: "#fff",
//     scrollTrigger: {
//         trigger: "#bbb",
//         markers: true
//     }
// });