gsap.registerPlugin(ScrollTrigger, SplitText);

addHeaderEvent();
createMainSwiper();
animateIntroPage();
animateBusinessPage();
scrollEsg();
animateGlobalTop();
animateGlobalBottom();
scrollHistory();
animateNews();

//downStart, downEnd, upStart, upEnd
let esgState = "upEnd";
let historyState = "upEnd";

//헤더 숨기기
function addHeaderEvent() {
  const header = document.querySelector(".header");
  const gnb = header.querySelector(".gnb");
  const menus = gnb.querySelectorAll(".menu");
  const menuBg = header.querySelector(".menu-bg");

  let height = Array.from(menus).map(menu => menu.scrollHeight);
  let maxHeight = Math.max(...height);

  window.addEventListener("wheel", (e) => {
    if (e.deltaY >= 0) {
      header.classList.add("hidden");
    }
    else if (esgState === "upStart" || historyState === "upStart") {
      header.classList.add("hidden");
    }
    else {
      header.classList.remove("hidden");
    }
  });
  
  window.addEventListener("scroll", () => {  
    if (window.scrollY === 0) {
      header.classList.add("top");
    }
    else {
      header.classList.remove("top");
    }
  });

  gnb.addEventListener("mouseenter", () => {
    header.classList.remove("top");

    menus.forEach(menu => menu.style.height = maxHeight + "px");
    menuBg.style.height = (maxHeight + 40) + "px";
  });

  header.addEventListener("mouseleave", () => {
    if (window.scrollY === 0) {
      header.classList.add("top");
    }

    menus.forEach(menu => menu.style.height = 0);
    menuBg.style.height = 0;
  });
}

//비주얼 메인 스와이퍼 및 비디오 설정
function createMainSwiper() {
  const visualMain = document.querySelector(".visual-main");
  const videoControlBtn = document.querySelector(".visual-main .video-control-btn");
  
  let mainSwiper = new Swiper(visualMain, {
    loop: true,
    allowTouchMove: false,
    updateOnWindowResize: false,
    autoplay: {
    },
    pagination: {
      el: ".swiper-pagination",
      type: "custom",
      renderCustom: (s, current, total) => {
        let bullet = "";
        for (let i=1; i<=total; i++) {
          if (i === current) {
            bullet += `
              <svg class="active-circle" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="15"></circle>
              </svg>
            `;
          }
          else {
            bullet += "<span class='bullet'></span>";
          }
        }
  
        return bullet;
      },
    },
    on: {
      init: (s) => {
        animateVideoTxt();
      },
      autoplayTimeLeft: (s, time, percentage) => {
        if (!s.autoplay.paused) {
          let video = document.querySelector(".visual-main .swiper-slide-active video");
          let activeCircle = document.querySelector(".visual-main .swiper-pagination .active-circle");
    
          activeCircle.style.setProperty("--percentage", time / (video.duration*1000));
        }
      },
      autoplay: (s) => {
        let txts = document.querySelectorAll(".visual-main .swiper-slide-active p");

        txts.forEach(txt => {
          txt.style.opacity = 0;
          txt.style.bottom = "-30px";
        });

        restartVideo();
      },
      slideChangeTransitionEnd: (s) => {
        animateVideoTxt();
      },
      resize: (s) => {
        s.update();
      },
      update: (s) => {
        restartVideo();
  
        s.autoplay.stop();
        s.autoplay.start();
        s.autoplay.resume();
      }
    }
  });
  
  videoControlBtn.addEventListener("click", () => {
    let video = document.querySelector(".visual-main .swiper-slide-active video");

    if (!video.paused) {
      stopSwiper();
    }
    else {
      playSwiper();
    }
  });

  window.addEventListener("scroll", () => {
    //parallax
    let scrolled = window.scrollY;
    visualMain.style.transform = `translateY(${scrolled * -0.3}px)`;

    //안보이면 자동 정지 보이면 다시 재생
    let video = document.querySelector(".visual-main .swiper-slide-active video");
    if (window.scrollY > visualMain.clientHeight && !video.paused) {
      stopSwiper();
    }
    else if (window.scrollY === 0 && video.paused) {
      playSwiper();
    }

    if (window.scrollY > visualMain.clientHeight) {
      visualMain.style.visibility = "hidden";
    }
    else {
      visualMain.style.visibility = "visible";
    }
  });

  //글자 애니메이션
  function animateVideoTxt() {
    let txts = document.querySelectorAll(".visual-main .swiper-slide-active p");

    txts.forEach(txt => {
      txt.style.opacity = 1;
      txt.style.bottom = 0;
    });
  }

  //비디오와 스와이퍼 정지
  function stopSwiper() {
    let icon = videoControlBtn.querySelector("i");
    let video = document.querySelector(".visual-main .swiper-slide-active video");

    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");

    video.pause();
    mainSwiper.autoplay.pause();
  }

  //비디오와 스와이퍼 재생
  function playSwiper() {
    let icon = videoControlBtn.querySelector("i");
    let video = document.querySelector(".visual-main .swiper-slide-active video");

    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");

    video.play();
    mainSwiper.autoplay.resume();
  }

  //비디오 0초부터 재생
  function restartVideo() {
    let video = document.querySelector(".visual-main .swiper-slide-active video");
    video.currentTime = 0;
    if (video.paused)
      video.play();
    
    let icon = videoControlBtn.querySelector("i");
    icon.classList.remove("fa-play");
    icon.classList.add("fa-pause");
  }
}

function animateIntroPage() {
  let downToIntro = false;
  let animating = false;

  const introPage = document.querySelector(".intro-page");
  const introTxt = introPage.querySelector(".intro-txt");

  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0 && Math.ceil(window.scrollY + window.innerHeight) > introPage.offsetTop && !downToIntro) {
      SplitText.create(introTxt, {
        autoSplit: true,
        type: "words",
        onSplit: (self) => {
          return gsap.from(self.words, {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            scrollTrigger: {
              trigger: ".intro-page",
              start: "top top",
            },
            onStart: () => {
              animating = true;
              introPage.style.position = "sticky";
              introTxt.opacity = 1;
            },
            onComplete: () => {
              animating = false;              
              introPage.style.position = "relative";
              self.revert();
            },
          });
        }
      });

      downToIntro = true;
    }
    else if (e.deltaY < 0 && Math.floor(window.scrollY + window.innerHeight) < introTxt.offsetTop + introPage.offsetTop && !animating) {
      downToIntro = false;
    }

    if (animating) {
      window.scrollTo(0, document.querySelector(".business-section").offsetTop - window.innerHeight);
    }

    //투명도 조절
    if (e.deltaY > 0 && Math.ceil(window.scrollY) >= introPage.offsetTop + window.innerHeight * 0.5) {
      introPage.style.opacity = 0;
    }
    else if (e.deltaY < 0 && Math.floor(window.scrollY) <= introPage.offsetTop + window.innerHeight * 0.8) {
      introPage.style.opacity = 1;
    }
  });

  introPage.addEventListener("wheel", (e) => {
    if (animating) {
      e.preventDefault();
    }
  });
}

function animateBusinessPage() {
  const businessSection = document.querySelector(".business-section");
  const frame = businessSection.querySelector(".business-frame");
  const businesses = businessSection.querySelectorAll(".business");

  const fisheries = businessSection.querySelector(".fisheries");
  const trade = businessSection.querySelector(".trade");
  const chain = businessSection.querySelector(".chain");

  const businesseTxt = businessSection.querySelector(".section-txt");

  let downToBusiness = false;
  let sticky = false;
  let animating = false;
  let allEnd = false;
  let viewIdx = null;
  
  window.addEventListener("wheel", (e) => {
    const bound = frame.getBoundingClientRect();
  
    if (Math.ceil(bound.top) > 0 && Math.floor(bound.top) <= window.innerHeight*0.5 && !downToBusiness && e.deltaY > 0) {
      downToBusiness = true;
      allEnd = false;
      businessSection.style.position = "sticky";
  
      gsap.timeline({
        onStart: () => {
          animating = true;
        },
        onComplete: () => {
          setTimeout(() => {         
            animating = false;
          }, 500);
        }
      })
        .fromTo(businesseTxt.querySelectorAll("p"), {
          x: -200,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.5,
          onStart: () => businesseTxt.classList.remove("ani"),
          onComplete: () => businesseTxt.classList.add("ani"),
        })
        .fromTo(fisheries, {
          x: "100%"
        }, {
          x: 0
        })
        .fromTo(trade, {
          x: "-100%"
        }, {
          x: 0
        })
        .fromTo(chain, {
          x: "100%"
        }, {
          x: 0
        });
    }
    else if (Math.floor(bound.bottom) <= 0 && downToBusiness && e.deltaY < 0) {
      downToBusiness = false;
    }

    if (Math.floor(bound.bottom) <= window.innerHeight + 1 && downToBusiness && !sticky && e.deltaY > 0 && !allEnd) {
      sticky = true;
    }
    else if (sticky && e.deltaY < 0) {
    }

    if (sticky) {
      window.scrollTo(0, document.querySelector(".intro-page").offsetTop + window.innerHeight + 265);
    }
  });

  businessSection.addEventListener("wheel", (e) => {
    if (!sticky) {
      return;
    }

    e.preventDefault();

    if (!animating && viewIdx === null) {
      viewIdx = 0;
      viewBusinessInfo();
    }
    else if (!animating && viewIdx !== null && e.deltaY > 0) {
      viewNextInfo();
    }
  });

  function viewBusinessInfo() {
    const business = businesses[viewIdx];
    const businessInfos = business.querySelectorAll(".business-info p");

    gsap.timeline({
      id: "business",
      onStart: () => animating = true,
      onComplete: () => animating = false,
    })
      .addLabel("start")
      .to(business, {
        width: "100%",
        height: "100vh",
        onComplete: () => {
          businesses.forEach(business => business.classList.add("detail"));
          business.style.right = 0;
        }
      }, "start")
      .addLabel("content")
      .fromTo(businessInfos, {
        y: 50,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.2
      }, "content");
  }

  function viewNextInfo() {
    if (viewIdx + 1 >= businesses.length) {
      endView();
      return;
    }

    let businessInfos = businesses[viewIdx+1].querySelectorAll(".business-info p");

    gsap.timeline({
      id: "next",
      onStart: () => animating = true,
      onComplete: () => {
        animating = false;
        viewIdx++;
      },
    }).addLabel("start")
      .fromTo(businesses[viewIdx+1], {
        right: "-100%",
      }, {
        right: 0,
      }, "start")
      .fromTo(businesses[viewIdx], {
        right: 0,
      }, {
        right: "100%",
      }, "start")
      .fromTo(businessInfos, {
        y: 50,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.2
      });
  }

  function endView() {
    const lastBusiness = businesses[viewIdx];

    gsap.fromTo(lastBusiness, {
      top: -1 * window.innerHeight,
      right: 0
    }, {
      width: "100%",
      height: window.innerHeight / businesses.length,
      top: 0,
      right: 0,
      onStart: () => {
        businesses.forEach((business, idx) => {
          business.classList.remove("detail");
          business.style.zIndex = 0;
          business.style = "";
        });
        lastBusiness.style.zIndex = 20;
        
        animating = true;
      },
      onComplete: () => {
        lastBusiness.style = "";
        businessSection.style.position = "static";
        animating = false;
        sticky = false;
        allEnd = true;
        viewIdx = null;
      },
    });
  }
}

function scrollEsg() {
  const esgSection = document.querySelector(".esg-section");
  const frame = esgSection.querySelector(".esg-frame");
  const esgs = frame.querySelectorAll(".esg");
  
  const esgTxt = esgSection.querySelector(".section-txt");

  const businessSection = document.querySelector(".business-section");
  const fixPoint = businessSection.offsetTop + businessSection.clientHeight;

  let animating = false;

  window.addEventListener("wheel", (e) => {
    const bound = esgSection.getBoundingClientRect();
    if (esgState === "downStart" || esgState === "upStart") {
      window.scrollTo(0, fixPoint);
    }

    if (Math.floor(bound.top) <= 0 && esgState !== "downStart" && esgState !== "downEnd" && e.deltaY > 0) { //스크롤 아래로 + top이 최상단에 도착 + 아직 dowm이 시작하거나 끝나지 않음
      if (esgState !== "upStart") { 
        animating = true;

        gsap.timeline()
          .fromTo(esgTxt.querySelectorAll("p"), {
            x: -200,
            opacity: 0,
          }, {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.5,
            onStart: () => esgTxt.classList.remove("ani"),
            onComplete: () => {
              esgTxt.classList.add("ani")
              animating = false;
            },
          })
          .fromTo(esgs, {
            y: 300,
            opacity: 0,
          }, {
            y: 0,
            opacity: 1,
            stagger: 0.5,
            duration: 0.5,
          });
      }

      esgState = "downStart";
    }
    else if (Math.ceil(bound.bottom) >= window.innerHeight && esgState !== "upStart" && esgState !== "upEnd" && e.deltaY < 0) { //위로 스크롤 + bottom이 최하단에 도달 + up이 시작하거나 끝나지 않음
      esgState = "upStart";
    }


    if (e.deltaY > 0 && Math.ceil(bound.bottom) >= window.innerHeight && esgState === "upEnd") { //아래로 스크롤 + bottom이 최하단에 도착 + up이 끝난 상태
      esgSection.classList.remove("up-scroll");
      esgSection.classList.add("down-scroll");
    }
    else if (e.deltaY < 0 && Math.floor(bound.top) <= 0 && esgState === "downEnd") {//위로 스크롤 + top이 최상단에 도착 + down이 끝난 상태
      esgSection.classList.remove("down-scroll");
      esgSection.classList.add("up-scroll");
    }

    //배경 변경
    for (let idx=0; idx<esgs.length; idx++) {
      let esg = esgs[idx];

      let top50 = esg.offsetTop - frame.scrollTop <= window.innerHeight * 0.5;
      let bottom50 = esg.offsetTop - frame.scrollTop + esg.clientHeight >= window.innerHeight * 0.5

      if (top50 && bottom50) {
        esgSection.style.backgroundImage = `url("./images/esg_0${idx+1}.jpg")`;
        break;
      }
    }
  });

  esgSection.addEventListener("wheel", (e) => {
    if (animating) {
      e.preventDefault();
    }
    else if (esgState === "downStart" || esgState === "upStart") { //시작 상태에서 스크롤 시 내부 콘텐츠를 스크롤
      e.preventDefault();
      frame.scrollBy(0, e.deltaY);
    }

    if (esgState === "downStart" && e.deltaY > 0 && Math.ceil(frame.scrollTop + frame.clientHeight) >= frame.scrollHeight) { //스크롤 아래로 + 내부 스크롤 완료 + down이 시작된 상태
      esgSection.classList.remove("down-scroll");
      esgState = "downEnd";
    }
    else if (esgState === "upStart" && e.deltaY < 0 && Math.floor(frame.scrollTop) <= 0) { //스크롤 위로 + 내부 스크롤 완료 + up이 시작된 상태
      esgSection.classList.remove("up-scroll");
      esgState = "upEnd";
    }
  });

  frame.addEventListener("wheel", (e) => {
    if (esgState === "downEnd" || esgState === "upEnd") {
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
    }

    if (esgState === "downStart" && e.deltaY > 0 && Math.ceil(frame.scrollTop + frame.clientHeight) >= frame.scrollHeight) { //스크롤 아래로 + 내부 스크롤 완료 + down이 시작된 상태
      esgSection.classList.remove("down-scroll");
      esgState = "downEnd";
    }
    else if (esgState === "upStart" && e.deltaY < 0 && Math.floor(frame.scrollTop) <= 0) { //스크롤 위로 + 내부 스크롤 완료 + up이 시작된 상태
      esgSection.classList.remove("up-scroll");
      esgState = "upEnd";
    }
  });
}

function animateGlobalTop() {
  const globalSection = document.querySelector(".global-top-section");
  const globalLogo = globalSection.querySelector(".global-logo");
  const globals = globalSection.querySelectorAll(".global");
  const globalTxt = globalSection.querySelector(".section-txt");
  
  let downToGlobal = false;
  
  window.addEventListener("wheel", (e) => {
    const bound = globalSection.getBoundingClientRect();
  
    if (Math.ceil(bound.top) > 0 && Math.ceil(bound.top) <= window.innerHeight*0.5 && !downToGlobal && e.deltaY > 0) {
      downToGlobal = true;
  
      gsap.timeline()
        .fromTo(globalTxt.querySelectorAll("p"), {
          x: -200,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.5,
          onStart: () => globalTxt.classList.remove("ani"),
          onComplete: () => globalTxt.classList.add("ani"),
        })
        .fromTo(globalLogo, {
          opacity: 0
        }, {
          opacity: 1
        })
        .fromTo(globals, {
          y: 200,
          opacity: 0,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.3,
          duration: 0.3,
        });
    }
    else if (Math.floor(bound.bottom) < 0 && downToGlobal && e.deltaY < 0) {
      downToGlobal = false;
    }
  });
}

function animateGlobalBottom() {
  const globalSection = document.querySelector(".global-bottom-section");
  const flags = globalSection.querySelectorAll(".flag");
  const globalTxt = globalSection.querySelector(".section-txt");

  const globalInfo = globalSection.querySelector(".global-info");
  
  let downToGlobal = false;
  
  window.addEventListener("wheel", (e) => {
    const bound = globalSection.getBoundingClientRect();
  
    if (Math.ceil(bound.top) > 0 && Math.ceil(bound.top) <= window.innerHeight*0.5 && !downToGlobal && e.deltaY > 0) {
      downToGlobal = true;
  
      gsap.timeline()
        .fromTo(globalTxt.querySelectorAll("p"), {
          x: -200,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.5,
          onStart: () => globalTxt.classList.remove("ani"),
          onComplete: () => globalTxt.classList.add("ani"),
        })
        .fromTo(flags, {
          x: -100,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.2,
        })
        .fromTo(globalInfo, {
          y: 100,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
        });
    }
    else if (bound.bottom < 0 && downToGlobal && e.deltaY < 0) {
      downToGlobal = false;
    }
  });

  flags.forEach(flag => {
    flag.addEventListener("mouseenter", () => {
      flags.forEach(flag => flag.classList.remove("select-flag"));
      flag.classList.add("select-flag");

      globalInfo.textContent = flag.querySelector("p").textContent;
      gsap.fromTo(globalInfo, {
          y: 100,
          opacity: 0
        }, {
          y: 0,
          opacity: 1
        });
    });
  });
}

function scrollHistory() {
  const historySection = document.querySelector(".history-section");
  const frame = historySection.querySelector(".history-frame");

  const historyTxt = historySection.querySelector(".section-txt");

  const historyLine = historySection.querySelector(".line");
  const historys = historySection.querySelectorAll(".history-title, .history");

  let idx = 0;

  const global = document.querySelector(".global-bottom-section");
  const fixPoint = global.offsetTop + global.clientHeight;

  window.addEventListener("wheel", (e) => {
    const bound = historySection.getBoundingClientRect();

    if (historyState === "downStart" || historyState === "upStart") {
      window.scrollTo(0, fixPoint);
    }

    if (Math.floor(bound.top) <= 0 && historyState !== "downStart" && historyState !== "downEnd" && e.deltaY > 0) {
      if (historyState !== "upStart") {
        gsap.timeline({
          onStart: () => {
            historyLine.style.height = 0;
            historys.forEach(history => {
              history.style.opacity = 0;
              history.style.transform = "translateY(100px)";
            });
            idx = 0;
          }
        }).addLabel("start")
          .fromTo(historyTxt.querySelector(".section-title"), {
            x: -200,
            opacity: 0,
          }, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            onStart: () => historyTxt.classList.remove("ani"),
            onComplete: () => historyTxt.classList.add("ani"),
          }, "start")
          .fromTo(historyLine, {
            height: 0,
          }, {
            height: 1340,
            duration: 6,
            ease: "none",
            onUpdate: () => {
              if (idx < historys.length && historyLine.clientHeight >= historys[idx].offsetTop - 200) {
                historys[idx].style.opacity = 1;
                historys[idx].style.transform = "translateY(0)";
                idx++;
              }
            },
          }, "start");
      }

      historyState = "downStart";
    }
    else if (Math.ceil(bound.bottom) >= window.innerHeight && historyState !== "upStart" && historyState !== "upEnd" && e.deltaY < 0) {
      historyState = "upStart";
    }

    if (e.deltaY > 0 && Math.ceil(bound.bottom) >= window.innerHeight && historyState === "upEnd") {
      historySection.classList.remove("up-scroll");
      historySection.classList.add("down-scroll");
    }
    else if (e.deltaY < 0 && Math.floor(bound.top) <= 0 && historyState === "downEnd") {
      historySection.classList.remove("down-scroll");
      historySection.classList.add("up-scroll");
    }
  });

  historySection.addEventListener("wheel", (e) => {
    if (historyState === "downStart" || historyState === "upStart") {
      e.preventDefault();
      frame.scrollBy(0, e.deltaY);
    }

    if (historyState === "downStart" && e.deltaY > 0 && Math.ceil(frame.scrollTop + frame.clientHeight) >= frame.scrollHeight) {
      historySection.classList.remove("down-scroll");
      historyState = "downEnd";
    }
    else if (historyState === "upStart" && e.deltaY < 0 && Math.floor(frame.scrollTop) <= 0) {
      historySection.classList.remove("up-scroll");
      historyState = "upEnd";
    }
  });

  frame.addEventListener("wheel", (e) => {
    if (historyState === "downEnd" || historyState === "upEnd") {
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
    }

    if (historyState === "downStart" && e.deltaY > 0 && Math.ceil(frame.scrollTop + frame.clientHeight) >= frame.scrollHeight) {
      historySection.classList.remove("down-scroll");
      historyState = "downEnd";
    }
    else if (historyState === "upStart" && e.deltaY < 0 && Math.floor(frame.scrollTop) <= 0) {
      historySection.classList.remove("up-scroll");
      historyState = "upEnd";
    }
  });
}

function animateNews() {
  const newsSection = document.querySelector(".news-section");
  const news = newsSection.querySelectorAll(".news");
  const newsTxt = newsSection.querySelector(".section-txt");
  const enterBtn = newsSection.querySelector(".enter-btn");
  
  let downToNews = false;
  
  window.addEventListener("wheel", (e) => {
    const bound = newsSection.getBoundingClientRect();
  
    if (Math.ceil(bound.top) > 0 && Math.ceil(bound.top) <= window.innerHeight*0.5 && !downToNews && e.deltaY > 0) {
      downToNews = true;
  
      gsap.timeline()
        .fromTo(newsTxt.querySelector("p"), {
          x: -200,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          onStart: () => newsTxt.classList.remove("ani"),
          onComplete: () => newsTxt.classList.add("ani"),
        })
        .fromTo(news, {
          x: -100,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: 0.3,
          duration: 0.3,
        })
        .fromTo(enterBtn, {
          y: 50,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 0.1
        });
    }
    else if (historyState === "upStart") {
      downToNews = false;
    }
  });
}